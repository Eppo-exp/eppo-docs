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

For example, in the Java SDK, the call may look like:

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

Optional<String> banditAssignment = eppoClient.getStringAssignment(subjectKey, flagKey, defaultValue, subjectAttributes, actionsWithAttributes);
```

If the actions don't have attributes for the context, you can simply provide a set of actions without attributes:

```java
Set<String> actions = Set.of("dog", "cat", "bird", "goldfish");

Optional<String> banditAssignment = eppoClient.getStringAssignment(subjectKey, flagKey, defaultValue, subjectAttributes, actions);
```

## Logging bandit assignments

Additional information regarding a bandit assignment needs to be logged to the data warehouse to support training the 
bandit so that it can learn over time. Bandit assignments are logged separately from variation assignments, and require
an additional bandit assignment logger to be provided.

This logger should write to a table with the following columns (they can be in any order):
* `timestamp` - Timestamp of the bandit assignment
* `key` - The key (unique identifier) of the bandit
* `subject` - The unique identifier for the subject being assigned
* `subject_numeric_attributes` - Mapping of attribute names to numbers, in JSON format, for the numeric-valued attributes of the subject
* `subject_categorical_attributes` - Mapping of attribute names to strings, in JSON format, for the non-numeric-valued attributes of the subject
* `action` - The action assigned by the bandit
* `action_numeric_attributes` - Mapping of attribute names to numbers, in JSON format, for the numeric-valued attributes of the assigned action
* `action_categorical_attributes` - Mapping of attribute names to strings, in JSON format, for the non-numeric-valued attributes of the assigned action

Additional information that is provided to the logger that can optionally--but is recommended--be logged includes:
* `experiment` - The name of the experiment
* `action_probability` - The probability (weight) given to the assigned action at the time of assignment
* `model_verison` - The current version identifier of the model used to determine action weights 

Below is an example bandit assignment logger for the Java SDK, defined when building the SDK client, that writes to Snowflake:

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

### Logging non-bandit assignments 

If the control variation (i.e., not the bandit) was assigned, but the control variation still resulted in an action being
assigned via some other mechanism, the bandit can still learn from this non-bandit assignment.

To record this event, you can use the `logNonBanditAction()` method.

In Java, this would look like:

```java
logNonBanditAction(subjectKey, flagKey, subjectAttributes, action, actionAttributes);
```
