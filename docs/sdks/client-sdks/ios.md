# iOS

Eppo's open source Swift SDK can be used for both feature flagging and experiment assignment.

The repository is hosted at [https://github.com/Eppo-exp/eppo-ios-sdk](https://github.com/Eppo-exp/eppo-ios-sdk)

## Getting Started

### Installation

While in XCode:

> 1. Choose `Package Dependencies`
> 2. Click `+` and enter package URL: `git@github.com:Eppo-exp/eppo-ios-sdk.git`
> 3. Set dependency rule to `Up to Next Minor Version` and select `Add Package`
> 4. Add to your project's target.

### Usage

Begin by initializing a singleton instance of Eppo's client with a key from the [Eppo interface](https://eppo.cloud/feature-flags/keys). The client will configure itself and perform a network request to fetch the latest flag configurations. Once initialized, the client can be used to make assignments anywhere in your app.

#### Initialize once

```swift
Task {
    try await EppoClient.initialize(sdkKey: "SDK-KEY-FROM-DASHBOARD");
}
```

(It is recommended to wrap initialization in a `Task` block in order to perform network request asynchronously)

#### Assign anywhere

```swift
let assignment = try eppoClient.getStringAssignment(
    flagKey: "new-user-onboarding",
    subjectKey: user.id,
    subjectAttributes: user.attributes,
    defaultValue: "control"
);
```

During initialization, the SDK sends an API request to Eppo to retrieve the most recent experiment configurations: variation values, traffic allocation, etc. The SDK stores these configurations in memory, meaning assignments are effectively instant (accordingly, assignment is a synchronous operation). For more information, see the [architecture overview](/sdks/architecture) page.

Eppo's SDK also supports providing the configuration directly at initialization. For more information, see the [initialization modes](#initialization-modes) section below.

### Connecting an event logger

Eppo is architected so that raw user data never leaves your system. As part of that, instead of pushing subject-level exposure events to Eppo's servers, Eppo's SDKs integrate with your existing logging system. This is done with a logging callback function defined at SDK initialization:

```swift
eppoClient = try await EppoClient.initialize(
    sdkKey: "mock-sdk-key", 
    assignmentLogger: segmentAssignmentLogger
)
```

This logger takes an [analytic event](#assignment-logger-schema) created by Eppo, `assignment`, and writes it to a table in the data warehouse (Snowflake, Databricks, BigQuery, or Redshift). You can read more on the [Event Logging](/sdks/event-logging) page.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a function that takes Eppo's `Assignment` object and writes it to your warehouse. For details on the object's schema, see the [Assignment Logger Schema](#assignment-logger-schema) section below.

```swift
// Example of a simple assignmentLogger function
func segmentAssignmentLogger(assignment: Assignment) {
    let assignmentDictionary: [String: Any] = [
        "allocation": assignment.allocation,
        "experiment": assignment.experiment,
        "featureFlag": assignment.featureFlag,
        "variation": assignment.variation,
        "subject": assignment.subject,
        "timestamp": assignment.timestamp
    ]

    analytics.track(
        name: "Eppo Assignment", 
        properties: TrackProperties(assignmentDictionary)
    )
}
```

### Getting variations

Now that the SDK is initialized and connected to your event logger, you can check what variant a specific subject (typically user) should see by calling the `get<Type>Assignment` functions.

For example, for a string-valued flag, use `getStringAssignment`:

```swift
let assignment = try eppoClient.getStringAssignment(
    flagKey: "new-user-onboarding",
    subjectKey: user.id,
    subjectAttributes: user.attributes,
    defaultValue: "control"
);
```

Note that Eppo uses a unified API for feature gates, experiments, and mutually exclusive layers. This makes it easy to turn a flag into an experiment or vice versa without having to do a code release.

The `getStringAssignment` function takes four inputs to assign a variation:

- `flagKey` - The key for the flag you are evaluating. This key is available on the feature flag detail page (see below).
- `subjectKey` - A unique identifier for the subject being experimented on (e.g., user), typically represented by a UUID. This key is used to deterministically assign subjects to variants.
- `subjectAttributes` - A map of metadata about the subject used for [targeting](/feature-flagging/concepts/targeting/). If targeting is not needed, pass in an empty object.
- `defaultValue` - The value that will be returned if no allocation matches the subject, if the flag is not enabled, if `getStringAssignment` is invoked before a configuration has been loaded, or if the SDK was not able to retrieve the flag configuration. Its type must match the `get<Type>Assignment` call.


#### Considerations

For applications, wrapping assignment in an `ObservableObject` is the best practice. This will create an object that will update Swift UI when the assignment is received.

```swift
@MainActor
public class AssignmentObserver: ObservableObject {
    @Published var assignment: String?

    public init() {
        do {
            // Use the shared instance after it has been configured.
            self.assignment = try EppoClient.shared().getStringAssignment(
                flagKey: "new-user-onboarding",
                subjectKey: user.id,
                subjectAttributes: user.attributes,
                defaultValue: "control"
            );
        } catch {
            self.assignment = nil
        }
    }
}
```

You can also choose to combinate instantiation and assignment within the same `ObservableObject`; the internal state will ensure only a single object and network request is created.

```swift
@MainActor
public class AssignmentObserver: ObservableObject {
    @Published var assignment: String?

    public init() {
        Task {
            do {
                // The initialization method has controls to maintain a single instance.
                try await EppoClient.initialize(sdkKey: "SDK-KEY-FROM-DASHBOARD");
                self.assignment = try EppoClient.shared().getStringAssignment(
                    flagKey: "new-user-onboarding",
                    subjectKey: user.id,
                    subjectAttributes: user.attributes,
                    defaultValue: "control"
                );
            } catch {
                self.assignment = nil
            }
        }
    }
}
```

Rendering the view:

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var observer = AssignmentObserver()

    var body: some View {
        VStack {
            if let assignment = observer.assignment {
                Text("Assignment: \(assignment)")
                    .font(.headline)
                    .padding()
            } else {
                Text("Loading assignment...")
                    .font(.subheadline)
                    .padding()
            }
        }
        .onAppear {
            // You can perform additional actions on appear if needed
        }
    }
}
```

### Typed assignments

Every Eppo flag has a return type that is set once on creation in the dashboard. Once a flag is created, assignments in code should be made using the corresponding typed function: 

```swift
getBooleanAssignment(...)
getNumericAssignment(...)
getIntegerAssignment(...)
getStringAssignment(...)
getJSONStringAssignment(...)
```

Each function has the same signature, but returns the type in the function name. The only exception is `defaultValue`, which should be the same type as the flag. For boolean flags for instance, you should use `getBooleanAssignment`, which has the following signature:

```swift
func getBooleanAssignment(
  flagKey: String, 
  subjectKey: String, 
  subjectAttributes: [String: Any], 
  defaultValue: Bool
) -> Bool 
  ```

## Initialization Modes

When initializing the SDK, you can pass in a pre-fetched flag configuration JSON string:

```swift
Task {
    try await EppoClient.initialize(
        sdkKey: "SDK-KEY-FROM-DASHBOARD",
        initialConfiguration: try Configuration(
            flagsConfigurationJson: Data(#"{ "pre-loaded-JSON": "passed in here" }"#.utf8),
            obfuscated: false
        )
    );
}
```

This will still perform a network request to fetch the latest flag configurations. The provided configuration will be used until the network request is successful.

If you'd instead like to initialize Eppo's client without performing a network request, you can pass in a pre-fetched configuration JSON string and use the `initializeOffline` method:

```swift
try EppoClient.initializeOffline(
    sdkKey: "SDK-KEY-FROM-DASHBOARD",
    initialConfiguration: try Configuration(
        flagsConfigurationJson: Data(#"{ "pre-loaded-JSON": "passed in here" }"#.utf8),
        obfuscated: false
    )
);
```

The `obfuscated` parameter is used to inform the SDK if the flag configuration is obfuscated.

This initialization method is synchronous and allows you to perform assignments immediately.

### Fetching the configuration from the remote source on-demand

After the client has been initialized, you can use `load()` to asynchronously fetch the latest flag configuration from the remote source.

```swift
try EppoClient.initializeOffline(
    sdkKey: "SDK-KEY-FROM-DASHBOARD",
    initialConfiguration: try Configuration(
        flagsConfigurationJson: Data(#"{ "pre-loaded-JSON": "passed in here" }"#.utf8),
        obfuscated: false
    )
);

...

Task {
    try await EppoClient.shared().load();
}
```

As modern iOS devices have substantial memory, applications are often kept in memory across sessions. This means that the flag configurations are not automatically reloaded on subsequent launches.

It is recommended to use the `load()` method to fetch the latest flag configurations when the application is launched.


## Assignment Logger Schema


The SDK will invoke the `logAssignment` function with an `Assignment` object that contains the following fields:

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | "allocation-17"                     |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17" |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | "recommendation-algo"               |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | "control"                           |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z            |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

