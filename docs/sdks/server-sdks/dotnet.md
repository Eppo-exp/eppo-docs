import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# .NET

Eppo's open source .NET SDK can be used for feature flagging and experiment assignment and multi-armed contextual bandits:

- [GitHub repository](https://github.com/Eppo-exp/dot-net-server-sdk)
- [Package](https://www.nuget.org/packages/Eppo.Sdk)
- [Nuget Package](https://www.nuget.org/packages/Eppo.Sdk)


## Getting Started

### Installation

In your .NET application, add the Eppo.Sdk Package from Nuget.

```shell
dotnet add package Eppo.Sdk
```

### Usage

Begin by initializing a singleton instance of Eppo's client with an SDK key from the [Eppo interface](https://eppo.cloud/feature-flags/keys). Once initialized, the client can be used to make assignments anywhere in your app. Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:


#### Initialize Once

```csharp
var eppoClientConfig = new EppoClientConfig("<SDK_KEY>", null);
var eppoClient = EppoClient.Init(eppoClientConfig);
```

After initialization, the SDK begins polling Eppo's API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/architecture/overview) page.

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

#### Assign Anywhere

The `GetStringAssignment` method take the following parameters:

- `flagKey` (string): The key of the feature flag
- `subjectKey` (string): The key of the subject or user assigned to the experiment variation
- `subjectAttributes` (IDictionary): The subject's attributes
- `defaultValue` (string): The default *variation* to return if the flag is not successfully evaluated, or, as is more common, the flag is disabled


```cs
var assignedVariation = eppoClient.GetStringAssignment(
    'fresh-user-onboarding', 
    user.id, 
    user.attributes, 
    'control'
);
```

### Define an Assignment Logger

Eppo is architected so that raw user data never leaves your system. As part of that, instead of pushing subject-level exposure events to Eppo's servers, Eppo's SDKs integrate with your existing logging system. The SDK invokes the callback to capture assignment data whenever a variation is assigned. This is done with a logging callback method defined at SDK initialization.


```csharp
var eppoClientConfig = new EppoClientConfig(
  "<SDK_KEY>",
  new AssignmentLogger());
```

The code below illustrates an example implementation of a logging callback to the console and other event platforms such as Segment.  You could also use your own logging system, the only requirement is that the SDK receives a `LogAssignment(AssignmentLogData assignmentLogData)` method. The `AssignmentLogData` class implements `ISerializable` so most systems should be able to easily log the value.

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
}
```

</TabItem>

</Tabs>


:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

### Assignment Methods

Every Eppo flag has a return type that is set once on creation in the dashboard. Once a flag is created, assignments in code are made using the corresponding typed method:

```cs
GetBooleanAssignment(...)
GetNumericAssignment(...)
GetIntegerAssignment(...)
GetStringAssignment(...)
GetJSONAssignment(...)
```

Each method has the same signature (except for the type of `defaultValue`) and returns the type in the method name. For booleans use `getBooleanAssignment`, which has the following signature:

```cs
public bool GetBooleanAssignment(
    string flagKey, 
    string subjectKey, 
    Dictionary<string, object> subjectAttributes, 
    bool defaultValue
);
```

## Advanced Options
### Polling Interval

For additional control in server deployments, the `EppoClientConfig` class can be initialized with a custom interval to override the default of 30sec.

```cs

var config = new EppoClientConfig("YOUR-API-KEY", myAssignmentLogger)
    {
        PollingIntervalInMillis = 5000
    };
```

## Assignment Log Schema



The SDK will invoke the `LogAssignment` method with an `event` object that contains the following fields:

| Field                                     | Description                                                                                                            | Example                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `Experiment` (string)                     | An Eppo experiment key                                                                                                 | "recommendation-algo-allocation-17" |
| `Subject` (string)                        | An identifier of the subject or user assigned to the experiment variation                                              | "ed6f85019080"                      |
| `Variation` (string)                      | The experiment variation the subject was assigned to                                                                   | "control"                           |
| `Timestamp` (DateTime)                    | The time when the subject was assigned to the variation                                                                | 2021-06-22T17:35:12.000Z            |
| `SubjectAttributes` (Map<String, object>) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment method | `Map.of("device","iOS")`            |
| `FeatureFlag` (string)                    | An Eppo feature flag key                                                                                               | "recommendation-algo"               |
| `Allocation` (string)                     | An Eppo allocation key                                                                                                 | "allocation-17"                     |


## Usage with Contextual Multi-Armed Bandits

Eppo also supports contextual multi-armed bandits. You can read more about them in the [high-level documentation](../../../contextual-bandits).
Bandit flag configuration--including setting up the flag key, status quo variation, bandit variation, and targeting rules--are configured within
the Eppo application. However, available actions are supplied to the SDK in the code when querying the bandit.

To leverage bandits using the Node SDK, there are two additional steps over regular feature flags:
1. Add a bandit action logger to the SDK client instance
2. Query the bandit for an action


### Defining a Bandit Logger

In order for the bandit to learn an optimized policy, we need to capture and log the bandit's actions.
This requires defining a bandit logger in addition to an assignment logger.

```cs
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

The SDK will invoke the `LogBanditAction()` method with a `BanditLogEvent` object that contains the following fields:


| Field                                                | Description                                                                                                       | Example                          |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `Timestamp` (DateTime)                               | The time when the action is taken in UTC as an ISO string                                                         | "2024-03-22T14:26:55.000Z"       |
| `FlagKey` (string)                                   | The key of the feature flag corresponding to the bandit                                                           | "bandit-test-allocation-4"       |
| `BanditKey` (string)                                 | The key (unique identifier) of the bandit                                                                         | "ad-bandit-1"                    |
| `SubjectKey` (string)                                | An identifier of the subject or user assigned to the experiment variation                                         | "ed6f85019080"                   |
| `SubjectNumericAttributes` (IDict<String,double>)    | Metadata about numeric attributes of the subject. Map of the name of attributes their provided values             | `{"age": 30}`                    |
| `SubjectCategoricalAttributes` (IDict<String,string) | Metadata about non-numeric attributes of the subject. Map of the name of attributes their provided values         | `{"loyalty_tier": "gold"}`       |
| `Action` (string)                                    | The action assigned by the bandit                                                                                 | "promo-20%-off"                  |
| `ActionNumericAttributes` (IDict<String,double)      | Metadata about numeric attributes of the assigned action. Map of the name of attributes their provided values     | `{"brandAffinity": 0.2}`         |
| `ActionCategoricalAttributes` (IDict<String,string)  | Metadata about non-numeric attributes of the assigned action. Map of the name of attributes their provided values | `{"previouslyPurchased": false}` |
| `ActionProbability` (number)                         | The weight between 0 and 1 the bandit valued the assigned action                                                  | 0.25                             |
| `OptimalityGap` (number)                             | The difference between the score of the selected action and the highest-scored action                             | 456                              |
| `ModelVersion` (string)                              | Unique identifier for the version (iteration) of the bandit parameters used to determine the action probability   | "v123"                           |
| `MetaData` IDict<string, string>                     | Any additional freeform meta data, such as the version of the SDK                                                 | `{ "sdkLibVersion": "3.5.1" }`   |


### Querying for a Bandit Action
To query the bandit for an action, use the `GetBanditAction()` method. The most specific implementation of `GetBanditAction()` takes the following parameters:
- `flagKey` (string): The key of the feature flag corresponding to the bandit
- `subject` (ContextAttributes): The key of the subject or user assigned to the experiment variation along with the subject's categorical and numeric attributes
- `actions` (IDictionary<string, ContextAttributes>): Map of actions (by name) to their context (categorical and numeric) attributes
- `defaultValue` (string): The default *variation* to return if the flag is not successfully evaluated, or, as is more common, the flag is disabled

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
     "flag-with-shoe-bandit",
     "user123",
     subjectAttributes,
     actions,
     "default");

if (result.Action != null)
{
    // Follow the Bandit action
    RenderShoeAd(result.Action);
} else {
    // User was not selected for a Bandit.
    // A variation is still assigned.
    RenderDefaultShoeAd(result.Variation);
}
```

### `GetBanditAction` Overloads / Alternative Parameters

There are a couple of additional overloads of the `GetBanditAction()` method to call, depending on the shape of your input.

For a simple list of actions without attributes:
```cs
public BanditResult GetBanditAction(string flagKey,
                                    string subjectKey,
                                    IDictionary<String, object?> subjectAttributes,
                                    string[] actions,
                                    string defaultValue
```

For a simple list of actions without attributes, using a [`ContextAttributes`](#contextattributes) subject:

```cs
public BanditResult GetBanditAction(string flagKey,
                                    ContextAttributes subject,
                                    string[] actions,
                                    string defaultValue)
```

Unsorted attributes for both subject and actions. The `EppoClient` will automatically sort them into numeric (integer and float types), categorical (string, boolean) and emit a warning if other types are passed.

```cs
public BanditResult GetBanditAction(string flagKey,
                                    string subjectKey,
                                    IDictionary<string, object?> subjectAttributes,
                                    IDictionary<string, IDictionary<string, object?>> actions,
                                    string defaultValue)
```

#### `ContextAttributes`

The `ContextAttributes` class bundles a context identifier (ex: `SubjectKey` or `ActionName`) along with the categorical and numeric attributes associated with that context. It can be built from a dictionary of unsorted attributes or from specified categorical/numeric attributes. It also functions like a `Dictionary<string, object>`.

```cs
public static ContextAttributes FromDict(string key, IDictionary<string, object?> other);
public static ContextAttributes FromNullableAttributes(string key, IDictionary<string, string?>? categoricalAttributes, IDictionary<string, object?>? numericAttributes);

// Use like an `IDictionary`
var myUserAttributes = new ContextAttributes("user123")
{
    ["age"] = 30,
    ["country"] = "uk",
    ["pricingTier"] = "1"  // NOTE: Deliberately setting to string causes this to be treated as a categorical attribute
};

myUserAttributes["last30DaySpend"] = userService.GetRecentDaysSpend(30);
myUserAttributes.Add("profileCompletion", 0.50f);
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

        // Get assignments
        var showUpgradeAd = eppoClient.GetBooleanAssignment(
            "show-upgrade-ad",
            userID,
            subjectAttributes,
            false
        );
        // Get an assignment for the user
        var recentUserTip = eppoClient.GetStringAssignment(
            "recent-user-onboarding",
            userID,
            subjectAttributes,
            "control"
        );

        // Get a bandit action
        var actions = new List<String>(){"nike", "adidas"};
        var banditResult = eppoClient.GetBanditAction(
          "shoe-bandit",
          userID,
          subjectAttributes,
          actions,
          "default"
        );


        if (showUpgradeAd)
        {
          RenderUpgradeAd();
        }

        RenderRecentUserTip(recentUserTip);

        if (result.Action != null)
        {
            RenderShoeAd(result.Action);
        } else {
            RenderDefaultShoeAd(result.Variation);
        }
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
