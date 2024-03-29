# iOS

iOS implementation of the Eppo Randomization and Feature Flagging SDK.

The repository is hosted at [https://github.com/Eppo-exp/eppo-ios-sdk](https://github.com/Eppo-exp/eppo-ios-sdk)

## 1. Install the SDK

While in XCode:

> 1. Choose `Package Dependencies`
> 2. Click `+` and enter package URL: `git@github.com:Eppo-exp/eppo-ios-sdk.git`
> 3. Set dependency rule to `Up to Next Minor Version` and select `Add Package`
> 4. Add to your project's target.

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be created in the Eppo web interface:

```swift
var eppoClient: EppoClient = EppoClient("YOUR_EPPO_API_KEY");
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

eppoClient = EppoClient("mock-api-key", assignmentLogger: segmentAssignmentLogger)
```

The SDK will invoke the `logAssignment` function with an `Assignment` object that contains the following fields:

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17" |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | "control"                           |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z            |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | "recommendation-algo"               |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | "allocation-17"                     |

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::


## 3. Assign Variations

Assigning users to flags or experiments with a single getStringAssignment function:

```swift
Task {
    do {
        try await eppoClient.load();
        self.assignment = try self.eppoClient.getStringAssignment(
            "test-user",
            "ios-test-app-treatment"
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
    @Published var assignment: String?;
    var eppoClient: EppoClient = EppoClient(EPPO_API_KEY);

    public init() {
        Task {
            do {
                try await eppoClient.load();
                self.assignment = try self.eppoClient.getStringAssignment(
                    "test-user", // identifier to randomize (typically a user id)
                    "ios-test-app-treatment" // the variation to select from
                );
            } catch {
                self.assignment = nil;
            }
        }
    }
}
```

The `getStringAssignment` function takes two required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagKey` - This key is available on the detail page for both flags and experiments. Can also be an experiment key.
- `subjectAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

### Typed assignments

Additional functions are available:

```swift
getBoolAssignment(...)
getNumericAssignment(...)
getJSONStringAssignment(...)
```

## 4. Handling `nil`

We recommend always handling the `nil` case in your code. Here are some examples illustrating when the SDK returns `nil`:

1. The Traffic Exposure setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `nil` for the remaining 75% (unless the subject is part of an allow list).

2. Assignments occur within the environments of feature flags. You must enable the environment corresponding to the feature flag's allocation in the user interface before `getStringAssignment` returns variations. It will return `nil` if the environment is not enabled.

![Toggle to enable environment](/img/feature-flagging/enable-environment.png)

3. If `getStringAssignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `nil` if no configurations have been downloaded.

<br />

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::
