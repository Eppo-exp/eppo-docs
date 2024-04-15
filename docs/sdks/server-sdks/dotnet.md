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

After initialization, the SDK begins polling Eppo's API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/overview) page.

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

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
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

## 3. Assign variations

Assign users to flags or experiments using `Get<Type>Assignment`, depending on the type of the flag.
For example, for a String-valued flag, use `GetStringAssignment`:

```csharp
var assignedVariation = eppoClient.GetStringAssignment(
  "<SUBJECT-KEY>",
  "<FLAG-KEY>",
  "<DEFAULT-VALUE>",
  {} // Optional Dictionary of subject metadata for targeting.
);
```

The `GetStringAssignment` function takes three required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagKey` - This key is available on the detail page for both flags and experiments. Can also be an experiment key.
- `defaultValue` - The value that will be returned if no allocation matches the subject, if the flag is not enabled, if `GetStringAssignment` is invoked before the SDK has finished initializing, or if the SDK was not able to retrieve the flag configuration. Its type must match the `Get<Type>Assignment` call.
- `subjectAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

The following typed functions are available:
```
GetBoolAssignment(...)
GetNumericAssignment(...)
GetIntegerAssignment(...)
GetStringAssignment(...)
GetJSONAssignment(...)
```

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::
