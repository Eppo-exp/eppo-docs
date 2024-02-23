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

```
var eppoClient: EppoClient = EppoClient(EPPO_API_KEY);
```

During initialization, the SDK sends an API request to Eppo to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. For more information, see the [architecture overview](/sdks/overview) page.

## 3. Assign Variations

Assigning users to flags or experiments with a single getStringAssignment function:

```
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

For applications wrapping initalization and assignment in an `ObservableObject` is recommended. This will create an object that will update Swift UI when the assignment is received.

```
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

```
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
