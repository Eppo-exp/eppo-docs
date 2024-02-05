import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# .NET

Eppo's open source .NET SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/dot-net-server-sdk)
- [Package](https://www.nuget.org/packages/Eppo.Sdk)

## 1. Install the SDK

In your .NET application, add the Eppo.Sdk Package from Nuget.

```
dotnet add package Eppo.Sdk
```

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the Eppo interface. Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:

Then use that to create the EppoClient instance.

```csharp
var eppoClientConfig = new EppoClientConfig(apiToken, new AssignmentLogger());
var eppoClient = EppoClient.Init(eppoClientConfig);
```

After initialization, the SDK begins polling Eppo's API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in a callback logging function on SDK initialization. The SDK invokes the callback to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `LogAssignment` function. Here we define an implementation of the Eppo `IAssignmentLogger` interface containing a single function named `LogAssignment`:

```csharp
using eppo_sdk.dto;
using eppo_sdk.logger;

internal class AssignmentLogger : IAssignmentLogger
{
    public void LogAssignment(AssignmentLogData assignmentLogData)
    {
        Console.WriteLine(assignmentLogData);
    }
}
```

The SDK will invoke the `LogAssignment` function with an `event` object that contains the following fields:

| Field                                        | Description                                                                                                              | Example                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `experiment` (string)                        | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17"         |
| `subject` (string)                           | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                        |
| `variation` (string)                         | The experiment variation the subject was assigned to                                                                     | "control"                                   |
| `timestamp` (DateTime)                       | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z                    |
| `subjectAttributes` (Map<String, EppoValue>) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `Map.of("device", EppoValue.valueOf("iOS")` |
| `featureFlag` (string)                       | An Eppo feature flag key                                                                                                 | "recommendation-algo"                       |
| `allocation` (string)                        | An Eppo allocation key                                                                                                   | "allocation-17"                             |

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/guides/event-logging/) page.
:::

## 3. Assign variations

Assigning users to flags or experiments with a single `GetStringAssignment` function:

```csharp
var assignedVariation = eppoClient.GetStringAssignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>", {
  // Optional Dictionary of subject metadata for targeting.
});
```

The `GetStringAssignment` function takes two required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagOrExperimentKey` - This key is available on the detail page for both flags and experiments.
- `targetingAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

Starting in version `v2.0.0` typed functions are available:

```
eppoClient.GetBoolAssignment(string subjectKey, string flagKey, SubjectAttributes? subjectAttributes = null)
eppoClient.GetNumericAssignment(string subjectKey, string flagKey, SubjectAttributes? subjectAttributes = null)
```

### Handling the null assignment

We recommend always handling the empty assignment case in your code. Here are some examples illustrating when the SDK returns `null`:

1. The **Traffic Exposure** setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `null` for the remaining 75% (unless the subject is part of an allow list).

2. Assignments occur within the environments of feature flags. You must enable the environment corresponding to the feature flag's allocation in the user interface before `getStringAssignment` returns variations. It will return `null` if the environment is not enabled.

![Toggle to enable environment](/img/feature-flagging/enable-environment.png)

3.  If `GetAssignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `null` if no configurations have been downloaded.

<br />

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::
