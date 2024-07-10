# iOS

Swift implementation of the Eppo Randomization and Feature Flagging SDK.

The repository is hosted at [https://github.com/Eppo-exp/eppo-ios-sdk](https://github.com/Eppo-exp/eppo-ios-sdk)

## 1. Install the SDK

While in XCode:

> 1. Choose `Package Dependencies`
> 2. Click `+` and enter package URL: `git@github.com:Eppo-exp/eppo-ios-sdk.git`
> 3. Set dependency rule to `Up to Next Minor Version` and select `Add Package`
> 4. Add to your project's target.

## 2. Initialize the SDK

Initialize with a SDK key, which can be created in the Eppo web interface:

```swift
EppoClient.initialize(sdkKey: "YOUR_EPPO_API_KEY");
```

During initialization, the SDK sends an API request to Eppo to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. For more information, see the [architecture overview](/sdks/overview) page.

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in an `assignmentLogger` to the constructor on SDK initialization. The SDK will invoke this function to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function which sends data into a table in your warehouse which Eppo has read access to. Here we create an instance of an `AssignmentLogger` and configure the `EppoClient` to use this logger:

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
        name: "AssignmentLogged", 
        properties: TrackProperties(assignmentDictionary)
    )
}

EppoClient.initialize(sdkKey: "mock-api-key", assignmentLogger: segmentAssignmentLogger)
```

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


## 3. Assign Variations

Assigning users to flags or experiments with a single `getStringAssignment` function:

```swift
Task {
    do {
        try await EppoClient.initialize(sdkKey: "YOUR_EPPO_API_KEY");
        self.assignment = try EppoClient.shared().getStringAssignment(
            flagKey: "ios-test-app-treatment",
            subjectKey: "test-user",
            subjectAttributes: ["country": "US"],
            defaultVariation: "control"
        );
    } catch {
        self.assignment = nil;
    }
}
```

It is recommended to wrap initialization in a `Task` block in order to perform network request asynchronously.

For applications wrapping initialization and assignment in an `ObservableObject` is recommended. This will create an object that will update Swift UI when the assignment is received.

```swift
@MainActor
class AssignmentObserver : ObservableObject {
    @Published var assignment: String?

    public init() {
        do {
            let client = try EppoClient.shared()
            self.assignment = try client.getStringAssignment(
                flagKey: "ios-test-app-treatment",
                subjectKey: "test-user",
                subjectAttributes: ["country": "US"],
                defaultVariation: "control"
            );
        } catch {
            self.assignment = nil;
        }
    }
}
```

The `getStringAssignment` function takes four required parameters to assign a variation:

- `flagKey` - This key is available on the detail page for both flags and experiments. Can also be an experiment key.
- `subjectKey` - The entity ID that is being experimented on.
- `subjectAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.
- `defaultVariation` - The default variation to return if the SDK is unable to make an assignment.

### Typed assignments

Additional functions are available:

```swift
getBooleanAssignment(...)
getIntegerAssignment(...)
getNumericAssignment(...)
getJSONStringAssignment(...)
```
