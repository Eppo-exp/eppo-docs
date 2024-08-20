import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Java

Eppo's open source Java SDK can be used for feature flagging, experiment assignment, and contextual multi-armed bandits:

- [GitHub repository](https://github.com/Eppo-exp/java-server-sdk)
- [Package](https://s01.oss.sonatype.org/#nexus-search;quick~eppo-server-sdk)

## Getting Started 

### Install the SDK

You can install the SDK using Gradle or Maven

#### Gradle

If you're using Gradle, add it to your `build.gradle` file:

```groovy
implementation 'cloud.eppo:eppo-server-sdk:3.0.1'
```

#### Maven

If you're using Maven, in your `pom.xml`, add the SDK package as a dependency:

```xml
<dependency>
  <groupId>cloud.eppo</groupId>
  <artifactId>eppo-server-sdk</artifactId>
  <version>3.0.1</version>
</dependency>
```

### Initialize the SDK

The SDK is initialized using the builder pattern. 

Initialize the SDK with an SDK key, which can be generated within the [Eppo interface](https://eppo.cloud/feature-flags/keys):

```java
EppoClient.Builder()
  .apiKey(apiKey)
  .buildAndInit();
```

Initialization should happen when your application starts up, and generates a singleton client instance to be used 
throughout the application lifecycle. After initialization, you can access the client with `EppoClient.getInstance()`.

### Assign variations

After configuring the flag in the [Eppo interface](https://eppo.cloud/feature-flags), you can assign subjects variations.

Assign using `get<Type>Assignment`, with `<Type>` depending on the type of the flag.

These assignment functions take the following parameters:
- `flagKey` (String): The key of the feature flag corresponding to the bandit
- `subjectKey` (String): The identifier of the subject (e.g., user) to be assigned a variation
- `subjectAttributes` (Attributes): _Optional_ - Attributes of the subject, used by targeting rules
- `defaultValue` (String): The default variation to return if the flag is not successfully evaluated

For example, for a string-valued flag, you would use `getStringAssignment()`:

```java
String assignedVariation = eppoClient.getStringAssignment("subjectKey", "flagkey", "defaultValue");
```

The above will request an assignment for the flag identified by `flagkey` to give to the subject identified by `subjectKey`.
If that flag does not exist, is disabled, or an error is encountered evaluating the flag, `"defaultValue"` will be returned.

The flag key can be found within the [Eppo interface](https://eppo.cloud/feature-flags), in the flag's configuration.
![Example flag key](/img/feature-flagging/flag-key.png)

If you wanted to pass in metadata about the subject, you would include the optional `subjectAttributes` parameter. 
Passing this in is required for any attribute-based targeting rules you that create to be applied.

```java
Attributes subjectAttributes = new Attributes(
  Map.of(
    "country", EppoValue.valueOf("FR"),
    "age", EppoValue.valueOf(60)
  )
);

String assignedVariation = eppoClient.getStringAssignment("subjectKey", "flagkey", subjectAttributes, "defaultValue");
```

Note that `EppoValue` is a container used so that attribute values can have different types. It can contain a string, 
number, boolean, or JSON value.

### Typed assignments

We support getting assignments of five different types:

```
getBooleanAssignment()
getIntegerAssignment()
getDoubleAssignment()
getStringAssignment()
getJSONAssignment()
```

Note that `getJSONAssignment()` returns a `JsonNode` from `com.fasterxml.jackson.databind`. If you prefer to use a
different JSON library, you can use `getJSONStringAssignment()` to get the unparsed JSON string.

If you request a type that differs from the flag's variations (for example, you called `getIntegerAssignment()` for a
flag with string-valued variations), the default value will be returned.

## Define an assignment logger

If you are using the Eppo SDK for **experiment** assignments (i.e., randomization), Eppo will need to know which subject,
(e.g., which user), passed through an entry point and were exposed to the experiment. You will need to log that 
information to your data warehouse for analysis.

When initializing the SDK, define an assignment logger which can handle the `logAssignment()` callback:

```java
EppoClient.Builder()
  .apiKey(apiKey)
  .assignmentLogger(assignmentLogData -> {
    System.out.println("TODO: send assignment event data to data warehouse: " + assignmentLogData);
  })
  .buildAndInit();
```

The properties of the event object passed to the assignment logger, accessible via getters, are as follows:

| Field                                | Description                                                                                                                | Example                                |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `timestamp` (Date)                   | The time when the subject was assigned to the variation                                                                    | Mon Aug 19 21:46:02 UTC 2024           |
| `experiment` (String)                | The key (globally unique identifier) of the experiment                                                                     | "recommendation-algo-allocation-17"    |
| `featureFlag` (String)               | The key of the feature flag                                                                                                | "recommendation-algo"                  |
| `allocation` (String)                | The key of the allocation                                                                                                  | "allocation-17"                        |
| `variation` (String)                 | The identifier of experiment variation that the subject was assigned to (typically the variation value, unless JSON-typed) | "control"                              |
| `subject` (String)                   | The identifier of the subject (e..g, user) assigned to the experiment variation                                            | "695e8121-96dc-4185-aedd-ef40225a2ef2" |
| `subjectAttributes` (Attributes)     | A free-form map of metadata about the subject.                                                                             | {country=FR, age=60}                   |
| `extraLogging` (Map<String, String>) | Any extra information relevant to the assignment                                                                           | {holdout=q1-holdout}                   |
| `metaData` (Map<String, String>)     | Any additional freeform meta data, such as the version of the SDK                                                          | {sdkLibVersion=3.0.1}                  |

Note that the `Attributes` type is an extension of `Map<String, EppoValue>`.

:::info
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

## Usage with Contextual Multi-Armed Bandits

Eppo also supports contextual multi-armed bandits. You can read more about them in the [high-level documentation](../../../contextual-bandits).
Bandit flag configuration--including setting up the flag key, status quo variation, bandit variation, and targeting rules--are configured within
the [Eppo Interface](https://eppo.cloud/feature-flags/bandits). However, available actions are supplied to the SDK in the code when querying the bandit.

To leverage bandits using the Java SDK, there are two additional steps over regular feature flags:
1. Add a bandit action logger to the SDK client instance
2. Query the bandit for an action

### Define a bandit assignment logger

In order for the bandit to learn an optimized policy, we need to capture and log the bandit's actions.
This requires defining a bandit logger in addition to an assignment logger when initializing the SDK.

Unlike variation assignments, bandit assignments must be logged to a specific table format. You can see the details
of that format in our [bandit documentation](../../sdk-features/bandits/#logging-bandit-assignments).

```java
EppoClient.Builder()
  .apiKey(apiKey)
  .assignmentLogger(assignmentLogData -> {
    System.out.println("TODO: send assignment event data to data warehouse: " + assignmentLogData);
  })
  .banditLogger(banditLogData -> {
    System.out.println("TODO: also send bandit event data to data warehouse, ensuring the column names are as expected: " + banditLogData);
  })
  .buildAndInit();
```

The properties of the event object passed to the bandit logger, accessible via getters, are as follows:

| Field                                       | Description                                                                                                       | Example                      |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------|------------------------------|
| `timestamp` (Date)                          | The time when the action is taken                                                                                 | Mon Aug 19 21:46:03 UTC 2024 |
| `featureFlag` (String)                      | The key (globally unique identifier) of the feature flag corresponding to the bandit                              | "bandit-test-allocation-4"   |
| `bandit` (String)                           | The key of the bandit                                                                                             | "ad-bandit-1"                |
| `subject` (String)                          | The identifier of the subject (e.g., user) assigned to the bandit variation                                       | "ed6f85019080"               |
| `subjectNumericAttributes` (Attributes)     | Metadata about numeric attributes of the subject. Map of the name of attributes their provided values             | {age=60}                     |
| `subjectCategoricalAttributes` (Attributes) | Metadata about non-numeric attributes of the subject. Map of the name of attributes their provided values         | {country=FR}                 |
| `action` (String)                           | The action assigned by the bandit                                                                                 | "promo-20%-off"              |
| `actionNumericAttributes` (Attributes)      | Metadata about numeric attributes of the assigned action. Map of the name of attributes their provided values     | {discount=0.2}               |
| `actionCategoricalAttributes` (Attributes)  | Metadata about non-numeric attributes of the assigned action. Map of the name of attributes their provided values | {promoTextColor=white}       |
| `actionProbability` (Double)                | The weight between 0 and 1 the bandit valued the assigned action                                                  | 0.25                         |
| `optimalityGap` (Double)                    | The difference between the score of the selected action and the highest-scored action                             | 456                          |
| `modelVersion` (String)                     | The key for the version (iteration) of the bandit parameters used to determine the action probability             | "v123"                       |
| `metaData` Map<String, String>              | Any additional freeform meta data, such as the version of the SDK                                                 | {sdkLibVersion=3.0.1}        |

### Querying the bandit for an action

To query the bandit for an action, you can use the `getBanditAction()` function. This function takes the following parameters:
- `flagKey` (String): The key of the feature flag corresponding to the bandit
- `subjectKey` (String): The identifier of the subject (e.g., user) to be assigned a variation and possibly a bandit action
- `subjectAttributes` (DiscriminableAttributes): The context of the subject
- `actions` (Actions): Available actions, typically mapped to their respective contexts
- `defaultValue` (String): The default *variation* to return if the flag is not successfully evaluated

The `DiscriminableAttributes` interface represents attributes which can be bucketed into categorical and numeric attributes.
The concrete implementation `ContextAttributes` can be used for explicitly bucketing categorical and numeric attributes, 
useful if you want to force a number to be treated as categorical. The concrete implementation`Attributes` can be used for 
a single collection of attributes that will be implicitly bucketed based on whether the attribute value is numeric or not.

The `Actions` interface is an extension of `Map<String, DiscriminableAttributes>`. It's concrete implementation is 
`BanditActions`. You can instantiate `BanditActions` from a `Map` or, if your actions don't have context, simply a `Set`
of the action names.

The following code queries the bandit for an action:
```java
// Flag that has a bandit variation
String flagKey = "shoe-bandit";

// Subject information--same as for retrieving simple flag or experiment assignments; but context can be explicitly
// bucketed as numeric and cateogrical attributes if desired
String subjectKey = "user123";
DiscriminableAttributes subjectAttributes = new Attributes(
  Map.of(
    "age", EppoValue.valueOf(25),
    "country", EppoValue.valueOf("BG")
  )
);

// Action set for bandits
Actions actions = new BanditActions(
  Map.of(
    "nike",
    new Attributes(
      Map.of(
        "brandAffinity", EppoValue.valueOf(2.3),
        "imageAspectRatio", EppoValue.valueOf("16:9")
      )
    ),
    "adidas",
    new Attributes(
      Map.of(
        "brandAffinity", EppoValue.valueOf(0.2),
        "imageAspectRatio",  EppoValue.valueOf("16:9")
      )
    )
  )
);

// Default value to return if the flag has been disabled or an error is encountered
String defaultValue = "control";

// Query the bandit
BanditResult banditResult = EppoClient.getInstance().getBanditAction(
  flagKey,
  subjectKey,
  subjectAttributes,
  actions,
  defaultValue
);

// Act on the result
if (banditResult.getAction() != null) {
  // The bandit has selected an action
  renderShoeAd(banditResult.getAction());
} else {
  // Default variation is at play
  renderDefaultShoeAd();
}
```

#### Subject context

The subject context contains contextual information about the subject that is independent of bandit actions.
For example, the subject's age or country.

The subject context can be provided as `Attributes`, which will then assume anything that is number is a numeric
attribute, and everything else is a categorical attribute.

You can also explicitly bucket the attribute types by providing the context as `ContextAttributes`. For example, you may
have an attribute named `priority`, with possible values `0`, `1`, and `2` that you want to be treated categorically rather
than numeric. `ContextAttributes` have two nested sets of attributes:
- `numericAttributes` (Attributes): A mapping of attribute names to their numeric values (e.g., `age=30`)
- `categoricalAttributes` (Attributes): A mapping of attribute names to their categorical values (e.g., `country=GB`)

```java
Attributes subjectNumericAttributes = new Attributes(
  Map.of(
    "age", EppoValue.valueOf(30)
  )
);
Attributes subjectCategoricalAttributes = new Attributes(
  Map.of(
    "priority", EppoValue.valueOf(1),
    "country", EppoValue.valueOf("GB")
  )
);
ContextAttributes subjectAttributes = new ContextAttributes(
  subjectNumericAttributes, 
  subjectCategoricalAttributes
);
```

Any non-numeric values explicitly passed in as values for numeric attributes will be ignored.

Attribute names and values are case-sensitive.

:::note
The subject context is also still used for targeting rules for the feature flag, just like with non-bandit assignment 
methods.
:::

#### Action contexts

The action context contains contextual information about each action. They can be provided as a mapping of attribute names
to their contexts.

Similar to subject context, action contexts can be provided as `Attributes`--which will then assume anything that is number 
is a numeric attribute, and everything else is a categorical attribute--or as `ContextAttributes`, which have explicit 
bucketing into `numericAttributes` and `categoricalAttributes`.

Note that action contexts can contain two kinds of information:
- Action-specific context (e.g., the image aspect ratio of image corresponding to this action)
- Subject-action interaction context (e.g., there could be a "brand-affinity" model that computes brand affinities of users  
  to brands, and scores of that model can be added to the action context to provide additional context for the bandit)

If there is no action context, you can use a `Set<String>` of all the action names when constructing `BanditActions` to
pass in.

If the subject is assigned to the variation associated with the bandit, the bandit selects one of the supplied actions.
All actions supplied are considered to be valid. If an action should not be available to a subject, do not include it for
that call.

Like attributes, actions are case-sensitive.

#### Result

`getBanditAction()` returns a `BanditResult` which has two fields available via getters:
- `variation` (String): The variation that was assigned to the subject
- `action` (String): The action that was assigned to the subject by the bandit, or `null` if the bandit was not 
  assigned

The variation returns the feature flag variation. This can be the bandit itself, or the "status quo" variation if the 
subject is not assigned to the bandit.

If we are unable to generate a variation, for example when the flag is turned off, then the provided `defaultValue` 
variation is returned. In both of those cases, the returned `action` will be `null`, and you should use the status-quo 
algorithm to select an action (more on this below).

When `action` is not `null`, the bandit has selected an action for the subject.

:::note
If no actions are provided and the flag still has an active bandit, if the bandit variation is assigned the assigned 
action will be `null`.
:::

:::note
If the flag no longer has any allocations with bandits, this function will behave the same as `getStringAssignment()`, with
the provided actions being ignored and the assigned variation being returned along with a `null` action.
:::

#### Status quo algorithm

In order to accurately measure the performance of the bandit, we need to compare it to the status quo algorithm using an 
experiment. This status quo algorithm could be a complicated algorithm to that selects an action according to a different 
model, or a simple baseline such as selecting a fixed or random action. When you create an analysis allocation for the 
bandit and the returned `action` is `null`, implement the desired status quo algorithm based on the `variation` value.

## Advanced initialization options and methods

There are additional options you can use the builder to set when initializing the SDK. In most cases, the default values will be
what you want. However, in certain situations you may want more fine-tuning.

- `gracefulMode` (boolean) - When on (which is the default), flag evaluation  errors will be caught, and the default   
  value returned. When off, the errors will be rethrown.
- `forceReinitialize` (boolean) - If true, a new client will be initialized and a new fetch for configuration will be
  performed even if the SDK has already been initialized. If false (which is the default), all subsequent initializations
  will be ignored and the previously initialized client will continue to be used.
- `pollingIntervalMs` (long) - How often, in milliseconds, the client should check for updated configurations. The default
  is 30,000 (poll every 30 seconds).
 - `host` (String) - Where the SDK should fetch configurations. The default is the Eppo-backed Fastly Content Delivery
   Network (CDN).

Additional potentially useful methods include: 
- `setIsGracefulFailureMode()` - Method you can call on the client instance to toggle graceful mode (see above) on and off. 
- `EppoClient.stopPolling()` - Static method to cancel checking for updated configurations.
- `serializeNonNullAttributesToJSONString()` - Method you can call on an instance of `Attributes` to generate a String
  containing their representation in JSON. This is useful for transmitting and saving them as JSON. 
