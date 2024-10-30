import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# .NET

Eppo's open source .NET SDK can be used for feature flagging and experiment assignment and Multi-Armed Contextual Bandits:

- [GitHub repository](https://github.com/Eppo-exp/dot-net-server-sdk)
- [Package](https://www.nuget.org/packages/Eppo.Sdk)
- [Nuget Packge](https://www.nuget.org/packages/Eppo.Sdk)


## Getting Started

### Installation

In your .NET application, add the Eppo.Sdk Package from Nuget.

```shell
dotnet add package Eppo.Sdk
```

### Usage

Begin by initializing a singleton instance of Eppo's client with an SDK key from the [Eppo interface](https://eppo.cloud/feature-flags/keys). Once initialized, the client can be used to make assignments anywhere in your app. Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:


#### Initialize once

```csharp
var eppoClientConfig = new EppoClientConfig("<SDK_KEY>", new AssignmentLogger()); // Don't worry about the `AssignmentLogger` just yet. More on it below.
var eppoClient = EppoClient.Init(eppoClientConfig);
```

After initialization, the SDK begins polling Eppo's API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/architecture) page.

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

#### Assign anywhere

```cs
var assignedVariation = eppoClient.GetStringAssignment(
    'new-user-onboarding', 
    user.id, 
    user.attributes, 
    'control'
);
```

#### Select a Bandit Action
This SDK supports [Multi-armed Contextual Bandits](https://docs.geteppo.com/contextual-bandits/).

```cs
var subjectAttributes = new Dictionary<string, object?>()
 {
     ["age"] = 30, // Gets interpreted as a Numeric Attribute
     ["country"] = "uk", // Categorical Attribute
     ["pricingTier"] = "1"  // NOTE: Deliberately setting to string causes this to be treated as a Categorical Attribute
 };
 var actions = new Dictionary<string, IDictionary<string, object?>>()
 {
     ["nike"] = new Dictionary<string, object?>()
     {
         ["brandLoyalty"] = 0.4,
         ["from"] = "usa"
     },
     ["adidas"] = new Dictionary<string, object?>()
     {
         ["brandLoyalty"] = 2,
         ["from"] = "germany"
     }
 };
 var result = client.GetBanditAction(
     "flagKey",
     "subjecKey",
     subjectAttributes,
     actions,
     "defaultValue");

if (result.Action != null)
{
    // Follow the Bandit action
    DoAction(result.Action);
} else {
    // User was not selected for a Bandit.
    // A variation is still assigned.
    DoSomething(result.Variation);
}
```

### Define an assignment logger (experiment assignment only)

Eppo is architected so that raw user data never leaves your system. As part of that, instead of pushing subject-level exposure events to Eppo's servers, Eppo's SDKs integrate with your existing logging system. The SDK invokes the callback to capture assignment data whenever a variation is assigned. This is done with a logging callback function defined at SDK initialization. 


```csharp
var eppoClientConfig = new EppoClientConfig(
  "<SDK_KEY>",
  new AssignmentLogger());
```

The code below illustrates an example implementation of a logging callback to the console and other event platforms such as Segment.  You could also use your own logging system, the only requirement is that the SDK receives a `LogAssignment(AssignmentLogData assignmentLogData)` function. The `AssignmentLogData` class implements `ISerializable` so most systems should be able to easily log the value.

<Tabs>
<TabItem value="console" label="Console">

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
</TabItem>

<TabItem value="segment" label="Segment">

```cs
using eppo_sdk.dto;
using eppo_sdk.logger;

class SegmentLogger : IAssignmentLogger
{
    private readonly Analytics analytics;

    public SegmentLogger(Analytics analytics)
    {
        this.analytics = analytics;
    }

    public void LogAssignment(AssignmentLogData assignmentLogData)
    {
        analytics.Track("Eppo Randomization Assignment", assignmentLogData);
    }

    public void LogBanditAction(BanditLogEvent banditLogEvent)
    {
        analytics.Track("Eppo Bandit Action", banditLogEvent);
    }
}
```

</TabItem>

</Tabs>


The SDK will invoke the `LogAssignment` function with an `event` object that contains the following fields:

| Field                                        | Description                                                                                                              | Example                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `Experiment` (string)                        | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17"         |
| `Subject` (string)                           | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                        |
| `Variation` (string)                         | The experiment variation the subject was assigned to                                                                     | "control"                                   |
| `Timestamp` (DateTime)                       | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z                    |
| `SubjectAttributes` (Map<String, object>)    | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `Map.of("device","iOS")`                    |
| `FeatureFlag` (string)                       | An Eppo feature flag key                                                                                                 | "recommendation-algo"                       |
| `Allocation` (string)                        | An Eppo allocation key                                                                                                   | "allocation-17"                             |

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

## Assignment functions

Every Eppo flag has a return type that is set once on creation in the dashboard. Once a flag is created, assignments in code should be made using the corresponding typed function: 

```cs
GetBooleanAssignment(...)
GetNumericAssignment(...)
GetIntegerAssignment(...)
GetStringAssignment(...)
GetJSONAssignment(...)
```

Each function has the same signature, but returns the type in the function name. For booleans use `getBooleanAssignment`, which has the following signature:

```cs
public bool GetBooleanAssignment(
    string flagKey, 
    string subjectKey, 
    Dictionary<string, object> subjectAttributes, 
    string defaultValue
)
```

## Advanced Usage
### Polling Interval

For additional control in server deployments, the `EppoClientConfig` class can be initialized with a custom interval to override the default of 30sec.

```cs

var config = new EppoClientConfig("YOUR-API-KEY", myAssignmentLogger)
    {
        PollingIntervalInMillis = 5000
    };
```

## Full Initialization and Assignment Example

```cs
class Program
{
    public void main()
    {

        // Initialize Segment and Eppo clients.
        var segmentConfig = new Configuration(
                    "<YOUR WRITE KEY>",
                    flushAt: 20,
                    flushInterval: 30);
        var analytics = new Analytics(segmentConfig);

        // Create a logger to send data back to the Segment data warehouse
        var logger = new SegmentLogger(analytics);

        // Initialize the Eppo Client
        var eppoClientConfig = new EppoClientConfig("EPPO-SDK-KEY-FROM-DASHBOARD", logger);
        var eppoClient = EppoClient.Init(eppoClientConfig);

        // Elsewhere in your code, typically just after the user logs in.
        var subjectTraits = new JsonObject()
        {
            ["email"] = "janedoe@liamg.com",
            ["age"] = 35,
            ["accountAge"] = 2,
            ["tier"] = "gold"
        }; // User properties will come from your database/login service etc.
        var userID = "user-123";

        // Identify the user in Segment Analytics.
        analytics.Identify(userID, subjectTraits);


        // Need to reformat user attributes a bit; EppoClient requires `IDictionary<string, object?>`
        var subjectAttributes = subjectTraits.Keys.ToDictionary(key => key, key => (object)subjectTraits[key]);
        // Get an assignment for the user
        var assignedVariation = eppoClient.GetStringAssignment(
            "new-user-onboarding",
            userID,
            subjectAttributes,
            "control"
        );
    }
}

class SegmentLogger : IAssignmentLogger
{
    private readonly Analytics analytics;

    public SegmentLogger(Analytics analytics)
    {
        this.analytics = analytics;
    }

    public void LogAssignment(AssignmentLogData assignmentLogData)
    {
        analytics.Track("Eppo Randomization Assignment", assignmentLogData);
    }

    public void LogBanditAction(BanditLogEvent banditLogEvent)
    {
        analytics.Track("Eppo Bandit Action", banditLogEvent);
    }
}
```
