import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Java

Eppo's open source Java SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/java-server-sdk)
- [Package](https://s01.oss.sonatype.org/#nexus-search;quick~eppo-server-sdk)

## Getting Started 

### Install the SDK

In your `pom.xml`, add the SDK package as a dependency:

```xml
<dependency>
  <groupId>cloud.eppo</groupId>
  <artifactId>eppo-server-sdk</artifactId>
  <version>2.4.5</version>
</dependency>
```

### Define an assignment logger

If you're using Gradle instead, add it to your `build.gradle` file:

```groovy
implementation 'cloud.eppo:eppo-server-sdk:2.4.5'
```

## 2. Initialize the SDK

Eppo encourages centralizing application logging as much as possible. Accordingly, instead of implementing a new logging framework, Eppo's SDK integrates with your existing logging system via a logging callback function defined at SDK initialization. This logger takes an [analytic event](/sdks/server-sdks/java/#assignment-logger-schema) created by Eppo, `assignment`, and writes in to a table in the data warehouse (Snowflake, Databricks, BigQuery, or Redshift).

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function. Here we define an implementation of the Eppo `IAssignmentLogger` interface containing a single function named `logAssignment`:


```java
import com.eppo.sdk.dto.IAssignmentLogger;
import com.eppo.sdk.dto.AssignmentLogData;

public class AssignmentLoggerImpl implements IAssignmentLogger {
  public void logAssignment(AssignmentLogData event) {
    analytics.enqueue(TrackMessage.builder("Experiment viewed")
        .userId(event.subject)
        .properties(ImmutableMap.builder()
            .put("experiment", event.experiment)
            .put("variation", event.variation)
            .put("timestamp", event.timestamp)
            .build()
        )
    );
  }
}
```

#### Deduplicating assignment logs

Eppo's SDK uses an internal cache to ensure that duplicate assignment events are not logged to the data warehouse. While Eppo's analytic engine will automatically deduplicate assignment records, this internal cache prevents firing unnecessary events and can help minimize costs associated with event logging.


### Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the [in the Eppo interface](https://eppo.cloud/feature-flags/keys). Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:

```java
EppoClientConfig config = EppoClientConfig.builder()
        .apiKey("<sdk-key>")
        .assignmentLogger((data) -> System.out.println(data.toString()))
        .build();
EppoClient eppoClient = EppoClient.init(config);
```

After initialization, the SDK begins polling Eppo's API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/overview) page.

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see the Assignment Logger [section](#define-an-assignment-logger)).


### Assign variations

Assig users to flags or experiments using `get<Type>Assignment`, depending on the type of the flag. For example, for a string-valued flag, use `getStringAssignment`:

```java
Optional<String> assignedVariation = eppoClient.getStringAssignment("<SUBJECT-KEY>", "<FLAG-KEY>", {
  // Optional map of subject metadata for targeting.
});
```

The `getStringAssignment` function takes two required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagOrExperimentKey` - This key is available on the detail page for both flags and experiments.
- `targetingAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

![Example flag key](/img/feature-flagging/flag-key.png)

## Typed assignments

Additional functions are available:

```
getBoolAssignment(...)
getDoubleAssignment(...)
getJSONStringAssignment(...)
getParsedJSONAssignment(...)
```

## Handling the empty assignment

We recommend always handling the empty assignment case in your code. Here are some examples illustrating when the SDK returns `Optional.empty()`:

1. The **Traffic Exposure** setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `Optional.empty()` for the remaining 75% (unless the subject is part of an allow list).

2. Assignments occur within the environments of feature flags. You must enable the environment corresponding to the feature flag's allocation in the user interface before `getStringAssignment` returns variations. It will return `Optional.empty()` if the environment is not enabled.

![Toggle to enable environment](/img/feature-flagging/enable-environment.png)

3.  If `getStringAssignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `Optional.empty()` if no configurations have been downloaded.

<br />

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::

## Assignment Logger Schema

The SDK will invoke the `logAssignment` function with an `event` object that contains the following fields:

| Field                                        | Description                                                                                                              | Example                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `experiment` (string)                        | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17"         |
| `subject` (string)                           | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                        |
| `variation` (string)                         | The experiment variation the subject was assigned to                                                                     | "control"                                   |
| `timestamp` (Date)                           | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z                    |
| `subjectAttributes` (Map<String, EppoValue>) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `Map.of("device", EppoValue.valueOf("iOS")` |
| `featureFlag` (string)                       | An Eppo feature flag key                                                                                                 | "recommendation-algo"                       |
| `allocation` (string)                        | An Eppo allocation key                                                                                                   | "allocation-17"                             |

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

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
