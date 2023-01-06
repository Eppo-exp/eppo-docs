# IOS

iOS implementation of the Eppo Randomization and Feature Flagging SDK.

## 1. Install the SDK

While in XCode:

> 1. choose `File > Add Packages`
> 2. Click `Add Local`. Which will add two targets to your project:
>
>    * eppo-flagging
>    * eppo-flagging-tests
>
>     Then select the eppo-flagging-tests target in Xcode and run Product > Test.

## 2. Initialize the SDK

Initialize the SDK with an API key, which can be created in the Eppo web interface:

```
var eppoClient: EppoClient = EppoClient(EPPO_API_KEY);
```

During initialization, the SDK sends an API request to Eppo to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant.

<br />

:::note
API Keys used with Client SDKs should have only ‘Randomization READ’ permissions.
:::

<br />

## 3. Assign Variations

Assigning users to flags or experiments with a single getAssignment function:

```
Task {
    do {
        try await eppoClient.load();
        self.assignment = try self.eppoClient.getAssignment(
            "test-user",
            "ios-test-app-treatment"
        );
    } catch {
        self.assignment = nil;
    }
}
```

It is reccomended to wrap initialization in a `Task` block in order to perform network request asynchronously.

For applications wrapping initalization and assignment in an `ObservableObject` is reccomended. This will create an object that will update Swift UI when the assignment is received.

```
@MainActor
class AssignmentObserver : ObservableObject {
    @Published var assignment: String?;
    var eppoClient: EppoClient = EppoClient(EPPO_API_KEY);

    public init() {
        Task {
            do {
                try await eppoClient.load();
                self.assignment = try self.eppoClient.getAssignment(
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

The `getAssignment` function takes two required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagKey` - This key is available on the detail page for both flags and experiments. Can also be an experiment key.
- `subjectAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

## 4. Handling `nil`

We recommend always handling the `nil` case in your code. Here are some examples illustrating when the SDK returns `nil`:

1. The Traffic Exposure setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `nil` for the remaining 75% (unless the subject is part of an allow list).

2. If you are using Eppo for experiment assignments, you must start the experiment in the user interface before getAssignment returns variations. It will return `nil` if the experiment is not running, both before and after.

![Start experiment page](https://docs.geteppo.com/assets/images/StartExperiment-1d66da3798e70673bc23a3411f82bc45.png)


3. If `getAssignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `nil` if no configurations have been downloaded.

<br />

:::note It may take up to 5 minutes for changes to Eppo experiments to be reflected by the SDK assignments. :::