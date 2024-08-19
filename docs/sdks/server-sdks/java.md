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
throughout the application lifecycle.

### Assign variations

After configuring the flag in the [Eppo Interface](https://eppo.cloud/feature-flags), you can assign subjects variations.

Assign using `get<Type>Assignment`, with `<Type>` depending on the type of the flag.
For example, for a string-valued flag, use `getStringAssignment`:

```java
String assignedVariation = eppoClient.getStringAssignment("subjectKey", "flagkey", "defaultValue");
```

The above will request an assignment for the flag identified by `flagkey` to give to the subject identified by `subjectKey`.
If that flag does not exist, is disabled, or an error is encountered evaluating the flag, `"defaultValue"` will be returned.

The flag key can be found within the [Eppo Interface](https://eppo.cloud/feature-flags), in the flag's configuration.
![Example flag key](/img/feature-flagging/flag-key.png)

You can also pass in an optional third parameter for subject attributes, which contains metadata about the subject. Passing 
this in will be required for any attribute-based targeting rules you that create to be applied.

```java
Attributes subjectAttributes = new Attributes(
  Map.of(
    "country", EppoValue.valueOf("FR"),
    "age", EppoValue.valueOf(60)
  )
);

String assignedVariation = eppoClient.getStringAssignment("subjectKey", "flagkey", subjectAttributes, "defaultValue");
```

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

If you request a type that differs from the flag's variations (for example, you called getIntegerAssignment() for a
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

| Field                                | Description                                                                                                           | Example                                |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `timestamp` (Date)                   | The time when the subject was assigned to the variation                                                               | Mon Aug 19 21:46:02 UTC 2024           |
| `experiment` (String)                | The globally unique identifier of the experiment                                                                      | "recommendation-algo-allocation-17"    |
| `featureFlag` (String)               | The globally unique identifier of the feature flag                                                                    | "recommendation-algo"                  |
| `allocation` (String)                | The globally unique identifier Eppo allocation key                                                                    | "allocation-17"                        |
| `variation` (String)                 | The identifier of experiment variation the subject was assigned to (typically the variation value, unless JSON-typed) | "control"                              |
| `subject` (String)                   | The identifier of the subject (e..g, user) assigned to the experiment variation                                       | "695e8121-96dc-4185-aedd-ef40225a2ef2" |
| `subjectAttributes` (Attributes)     | A free-form map of metadata about the subject.                                                                        | {country=FR, age=60}                   |
| `extraLogging` (Map<String, String>) | Any extra information relevant to the assignment                                                                      | {holdout=q1-holdout}                   |
| `metaData` (Map<String, String>)     | Any additional freeform meta data, such as the version of the SDK                                                     | {sdkLibVersion=3.0.1}                  |

Note that the `Attributes` type is an extension of `Map<String, EppoValue>`, with `EppoValue` being a container for values 
that have strings, numbers, booleans, or JSON.

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

The `getStringAssignment` function takes two required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagOrExperimentKey` - This key is available on the detail page for both flags and experiments.
- `targetingAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

## Usage with Contextual Multi-Armed Bandits

If using the SDK to train and request actions from a contextual multi-armed bandit, you will need to:
1. Define a bandit assignment logger
2. Pass bandit actions to request a bandit assignment

### Define a bandit assignment logger

When using the Eppo SDK for assignments from a contextual multi-armed bandit, you will need to pass in a callback 
bandit logging function on SDK initialization. The SDK invokes the callback to capture bandit assignment data whenever a 
bandit chooses an action and assigns it.

The SDK will invoke the `logBanditAction` function with an `logData` object that contains the following fields:

| Field                                                | Description                                                                                                     | Example                             |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|-------------------------------------|
| `timestamp` (Date)                                   | The time when the subject was assigned to the variation                                                         | 2024-03-22T14:26:55.000Z            |
| `experiment` (String)                                | An Eppo experiment key                                                                                          | "bandit-test-allocation-4"          |
| `key` (String)                                       | The key (unique identifier) of the bandit                                                                       | "ad-bandit-1"                       |
| `subject` (String)                                   | An identifier of the subject or user assigned to the experiment variation                                       | "ed6f85019080"                      |
| `subjectNumericAttributes` (Map<String, Double>)     | Metadata about numeric attributes of the subject. Map of the name of attributes their numeric values            | `Map.of("accountAgeDays", 43.0)`    |
| `subjectCategoricalAttributes` (Map<String, String>) | Metadata about non-numeric attributes of the subject. Map of the name of attributes their string values         | `Map.of("loyaltyTier", "gold")`     |
| `action` (String)                                    | The action assigned by the bandit                                                                               | "promo-20%-off"                     |
| `actionNumericAttributes` (Map<String, Double>)      | Metadata about numeric attributes of the assigned action. Map of the name of attributes their numeric values    | `Map.of("discountPercent", 20.0)`   |
| `actionCategoricalAttributes` (Map<String, String>)  | Metadata about non-numeric attributes of the assigned action. Map of the name of attributes their string values | `Map.of("promoTextColor", "white")` |
| `actionProbability` (Double)                         | The weight between 0 and 1 the bandit valued the assigned action                                                | 0.25                                |
| `modelVersion` (String)                              | Unique identifier for the version (iteration) of the bandit parameters used to determine the action probability | "falcon v123"                       |

The code below illustrates an example implementation of a bandit logging callback that writes to Snowflake.
Note that this is illustrative, as writing directly to Snowflake is not a best practice for scalability, and use of
a data pipeline is recommended.

```java
import com.eppo.sdk.dto.IBanditLogger;
import com.eppo.sdk.dto.BanditLogData;
import Java.sql.Connection;

public class BanditLoggerImpl implements IBanditLogger {

  private final Connection snowflakeConnection;

  public BanditLoggerImpl(Connection snowflakeConnection) {
    this.snowflakeConnection = snowflakeConnection;
  }
  public void logBanditAction(BanditLogData logData) {
    String sql = "INSERT INTO bandit_assignments " +
      "(timestamp, experiment, variation_value, subject," +
      " action, action_probability, model_version," +
      " subject_numeric_attributes, subject_categorical_attributes," +
      " action_numeric_attributes, action_categorical_attributes) " +
      "SELECT ?, ?, ?, ?," +
      " ?, ?, ?," +
      " parse_json(?), parse_json(?)," +
      " parse_json(?), parse_json(?)";

    try (PreparedStatement statement = snowflakeConnection.prepareStatement(sql)) {
      statement.setTimestamp(1, new Timestamp(logData.timestamp.getTime()));
      statement.setString(2, logData.experiment);
      statement.setString(3, logData.banditKey);
      statement.setString(4, logData.subject);
      statement.setString(5, logData.action);
      statement.setDouble(6, logData.actionProbability);
      statement.setString(7, logData.modelVersion);
      if (logData.subjectNumericAttributes == null) {
        statement.setNull(8, Types.NULL);
      } else {
        statement.setString(8, EppoAttributes.serializeNonNullAttributesToJSONString(logData.subjectNumericAttributes));
      }
      if (logData.subjectCategoricalAttributes == null) {
        statement.setNull(9, Types.NULL);
      } else {
        statement.setString(9, EppoAttributes.serializeNonNullAttributesToJSONString(logData.subjectCategoricalAttributes));
      }
      if (logData.actionNumericAttributes == null) {
        statement.setNull(10, Types.NULL);
      } else {
        statement.setString(10, EppoAttributes.serializeNonNullAttributesToJSONString(logData.actionNumericAttributes));
      }
      if (logData.actionNumericAttributes == null) {
        statement.setNull(11, Types.NULL);
      } else {
        statement.setString(11, EppoAttributes.serializeNonNullAttributesToJSONString(logData.actionCategoricalAttributes));
      }

      statement.executeUpdate();
    } catch (SQLException e) {
      throw new RuntimeException("Unable to log bandit assignment "+e.getMessage(), e);
    }
  }
}
```

Note that `experiment`, `actionProbability` and `modelVersion` are not used for bandit training and do not need to be
saved to the bandit assignments table. However, they can be useful for transparency around the bandit, so we recommend
saving them along with the other information.

### Pass bandit actions to request a bandit assignment

If the flag or experiment has a variation whose value is decided by a contextual multi-armed bandit, you can provide the
bandit the set of actions it should consider as a fourth optional argument to `getStringAssignment()`:
- `actions` - An optional `Set<String>` of action names (if no action attributes) or `Map<String, EppoAttributes>` of 
action names to their attributes

If the user is assigned the bandit variation, the bandit will then score and weight each action using the attributes of 
the action and subject, and then randomly assign an action. Note that the action assigned may change as the bandit's 
model evolves.

```java
// Flag that has a bandit variation
String banditTestFlagKey = "bandit-test";

// Subject information--same as for retrieving simple flag or experiment assignments
String subjectKey = username;
EppoAttributes subjectAttributes = userAttributes;

// Action set for bandits
Map<String, EppoAttributes> actionsWithAttributes = Map.of(
  "dog", new EppoAttributes(Map.of(
  "legs", EppoValue.valueOf(4),
  "size", EppoValue.valueOf("large")
)),
  "cat", new EppoAttributes(Map.of(
  "legs", EppoValue.valueOf(4),
  "size", EppoValue.valueOf("medium")
)),
  "bird", new EppoAttributes(Map.of(
  "legs", EppoValue.valueOf(2),
  "size", EppoValue.valueOf("medium")
)),
  "goldfish", new EppoAttributes(Map.of(
  "legs", EppoValue.valueOf(0),
  "size", EppoValue.valueOf("small")
)));

Optional<String> banditAssignment = eppoClient.getStringAssignment(subjectKey, flagKey, subjectAttributes, actionsWithAttributes);
```
