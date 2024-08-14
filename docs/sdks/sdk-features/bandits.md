# Contextual multi-armed Bandits

The SDKs also provide functionality for getting an assignment from a contextual multi-armed bandit.

## Background

Contextual multi-armed bandits use reinforcement learning to adjust the frequency it serves an action from a set provided
to the SDK.
They use the attributes of the subject and assigned action to form a context for the assignment, and they also have a 
metric (set in the Eppo application) that it is optimizing for.

Every 24 hours, the bandit looks at the previous 30 days for changes in the optimization metric for subjects who were given
assignments. It uses the assignment context and metric data to build a model for using context to optimally balance 
"exploring" other actions or "exploiting" the action the data suggests performs the best for a given context.

Bandits are a special type of dynamic variation, whose value depends on the action the bandit selects. Note that for users
assigned the bandit variation, the action they receive may change as the bandit model parameters are updated. All actions
are strings, so bandits are used with string-typed flags. Actions and attributes are case-sensitive.

## Requesting a bandit assignment

When requesting an assignment from a flag with a bandit, the set of actions and their attributes are provided as an
additional argument to `getStringAssignment()`.

:::info
Depending on the SDK you are using, a `getBanditAction()` alternative method may be available. Refer to the [Node](/sdks/server-sdks/node/#usage-with-contextual-multi-armed-bandits) or [Python](https://docs.geteppo.com/sdks/server-sdks/python/#6-contextual-bandits) documentation for more details. 
:::

In the Java SDK, the call may look like:

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
))

Optional<String> banditAssignment = eppoClient.getStringAssignment(subjectKey, flagKey, subjectAttributes, actionsWithAttributes);
```

If the actions don't have attributes for the context, you can simply provide a set of actions without attributes:

```java
Set<String> actions = Set.of("dog", "cat", "bird", "goldfish");

Optional<String> banditAssignment = eppoClient.getStringAssignment(subjectKey, flagKey, subjectAttributes, actions);
```

## Logging bandit assignments

Additional information regarding a bandit assignment needs to be logged to the data warehouse to support training the 
bandit so that it can learn over time. Bandit assignments are logged separately from variation assignments, and require
an additional bandit assignment logger to be provided.

The name of the table can be chosen by you. When setting up the bandit, you will specify the name of the table to use to process its actions.
However, the columns must have specific names.

Therefore, the logger should write to the table with the following columns (they can be in any order):

| Column                                | Description                                                                                                       | Example Data                |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------|-----------------------------|
| timestamp (TIMESTAMP)                 | Timestamp of the bandit assignment in UTC                                                                         | 2024-08-14 12:19:25.959     |
| key (VARCHAR/STRING)                  | The key (unique identifier) of the bandit                                                                         | ad-bandit-1                 |
| subject (VARCHAR/STRING)              | The unique identifier for the subject being assigned                                                              | ed6f85019080                |
| subject_numeric_attributes (JSON)     | Metadata about numeric attributes of the subject. Map of the name of attributes their provided values             | {"age": 30}                 |
| subject_categorical_attributes (JSON) | Mapping of attribute names to strings, in JSON format, for the non-numeric-valued attributes of the subject       | {"loyalty_tier": "gold"}    |
| action (VARCHAR/STRING)               | The action assigned by the bandit                                                                                 | promo-20%-off               |
| action_numeric_attributes (JSON)      | Metadata about numeric attributes of the assigned action. Map of the name of attributes their provided values     | {"discount": 0.2}           |
| action_categorical_attributes (JSON)  | Metadata about non-numeric attributes of the assigned action. Map of the name of attributes their provided values | {"promoTextColor": "white"} |
 
We also recommend storing additional information that is provided to the bandit logger that is not directly used for training the bandit, but is useful for transparency and debugging:

| Column                              | Description                                                                                                     | Example Data                 |
|-------------------------------------|-----------------------------------------------------------------------------------------------------------------|------------------------------|
| feature_flag (VARCHAR/STRING)       | The key of the feature flag corresponding to the bandit                                                         | bandit-test-allocation-4     |
| model_version (VARCHAR/STRING)      | Unique identifier for the version (iteration) of the bandit parameters used to determine the action probability | v123                         |
| action_probability (NUMBER/NUMERIC) | The weight between 0 and 1 the bandit valued the assigned action                                                | 0.567                        |
| optimality_gap (NUMBER/NUMERIC)     | The difference between the score of the selected action and the highest-scored action                           | 78.9                         |
| metadata (JSON)                     | Any additional freeform meta data, such as the version of the SDK                                               | { "sdkLibVersion": "3.5.1" } |

Below is an example bandit assignment logger for the Java SDK, defined when building the SDK client. This example writes directly to Snowflake. This is illustrative and not recommended practice. Refer to our [event logging](/sdks/event-logging/) page for recommended options.

```java
.banditLogger(logData -> {
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
})
```
