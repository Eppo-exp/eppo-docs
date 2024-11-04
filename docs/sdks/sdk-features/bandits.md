# Contextual multi-armed bandits

The SDKs also provide functionality for getting an assignment from a [contextual multi-armed bandit](/contextual-bandits/).

## Background

Contextual multi-armed bandits use reinforcement learning to adjust the frequency it serves an action from a set provided
to the SDK.
They use the attributes of the subject and assigned action to form a context for the assignment, and they also have a
metric (set in the Eppo application) that it is optimizing for.

At a specified frequency (e.g., every 24 hours), the bandit looks back at a specified number of days (e.g., 30) for changes in the optimization metric for subjects who were given
assignments. It uses the assignment context and metric data to build a model for using context to optimally balance
"exploring" other actions or "exploiting" the action the data suggests performs the best for a given context.

Bandits are a special type of dynamic variation, whose value depends on the action the bandit selects. Note that for users
assigned the bandit variation, the action they receive may change as the bandit model parameters are updated. All actions
are strings, so bandits are used with string-typed flags. Actions and attributes are case-sensitive.

## Requesting a bandit assignment

When requesting an assignment from a flag with a bandit, you can use a specialized method that returns the assigned variation and, if the bandit was invoked, the selected action.
This method is like getting other assignments, but you also provide the set of actions and their attributes that the bandit should consider.

In Python, the call may look like:

```python
# Flag that has a bandit variation
bandit_test_flag_key = "bandit-test";

# Subject information--same as for retrieving simple flag or experiment assignments
subject_key = user_id;
subject_attributes = eppo_client.bandit.ContextAttributes(
  numeric_attributes={"age": age}, categorical_attributes={"country": country}
)

# Action set for bandits
actions = {
  "nike": eppo_client.bandit.ContextAttributes(
    numeric_attributes={"brand_affinity": 2.3},
    categorical_attributes={"previously_purchased": true}
  ),
  "adidas": eppo_client.bandit.ContextAttributes(
    numeric_attributes={"brand_affinity": 0.2},
    categorical_attributes={"previously_purchased": false}
  )
}

# Default variation value to return if the flag is turned off or an error is encountered
default_value = "control"

# Query the flag and bandit for an assignment
bandit_result = client.get_bandit_action(
  bandit_test_flag_key,
  subject_key,
  subject_attributes,
  actions,
  default_value
)

# Handle the assignment
print(f"{name} was assigned the {bandit_result.variation} variation")

if bandit_result.action:
  print(f"The bandit recommends {bandit_result.action} to {name}")
```

See the [Python Contextual Bandit example](https://github.com/Eppo-exp/python-sdk/blob/main/example/03_bandit.py) for a simple FastAPI app example.

## Logging bandit assignments

Additional information regarding a bandit assignment needs to be logged to the data warehouse to support training the
bandit so that it can learn over time. Bandit assignments are logged separately from variation assignments, and require
an additional bandit assignment logger to be provided.

The name of the table to store bandit assignments can be chosen by you. When setting up the bandit, you will specify the name of the table to use to process its actions.
However, the columns must have specific names.

Therefore, the logger should write to a table with the following columns (they can be in any order):

| Column                                | Description                                                                                              | Example Data                |
|---------------------------------------|----------------------------------------------------------------------------------------------------------|-----------------------------|
| timestamp (TIMESTAMP)                 | Timestamp of the bandit assignment in UTC                                                                | 2024-08-14 12:19:25.959     |
| key (VARCHAR/STRING)                  | The key (unique identifier) of the bandit                                                                | ad-bandit-1                 |
| subject (VARCHAR/STRING)              | The unique identifier for the subject being assigned                                                     | ed6f85019080                |
| subject_numeric_attributes (JSON)     | Metadata about numeric attributes of the subject; Mapping of attribute names to their values             | {"age": 30}                 |
| subject_categorical_attributes (JSON) | Metadata about non-numeric attributes of the subject; Mapping of attribute names to their values         | {"loyalty_tier": "gold"}    |
| action (VARCHAR/STRING)               | The action assigned by the bandit                                                                        | promo-20%-off               |
| action_numeric_attributes (JSON)      | Metadata about numeric attributes of the assigned action; Mapping of attribute names to their values     | {"discount": 0.2}           |
| action_categorical_attributes (JSON)  | Metadata about non-numeric attributes of the assigned action; Mapping of attribute names to their values | {"promoTextColor": "white"} |

:::note
Assignment attributes must be single-level. Eppo's bandits do not support multiple levels of JSON attributes.
:::

We also recommend storing additional information that is provided to the bandit logger that is not directly used for training the bandit, but is useful for transparency and debugging:

| Column                              | Description                                                                                                            | Example Data                 |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------|
| feature_flag (VARCHAR/STRING)       | The key of the feature flag corresponding to the bandit                                                                | bandit-test-allocation-4     |
| model_version (VARCHAR/STRING)      | Unique identifier for the version (iteration) of the bandit parameters used to determine the action probability        | v123                         |
| action_probability (NUMBER/NUMERIC) | The weight between 0 and 1 the bandit valued the assigned action                                                       | 0.567                        |
| optimality_gap (NUMBER/NUMERIC)     | The difference between the score of the selected action and the highest-scored action                                  | 78.9                         |
| metadata (JSON)                     | Any additional freeform metadata, such as the version of the SDK; Mapping of the property names to their string values | { "sdkLibVersion": "3.5.1" } |

The bandit assignment logger should be provided along with the variation assignment logger.

In Python, this could look like:

```python
EPPO_API_KEY = os.environ.get("EPPO_API_KEY")

class LocalLogger(AssignmentLogger):
    def log_assignment(self, assignment_event):
        print("TODO: Send data to data warehouse:", assignment_event)

    def log_bandit_assignment(self, bandit_assignment):
        print("TODO: Send data to data warehouse:", bandit_assignment)
        
client_config = Config(api_key=EPPO_API_KEY, assignment_logger=LocalLogger())

eppo_client.init(client_config)
```
