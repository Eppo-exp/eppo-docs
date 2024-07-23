---
sidebar_position: 3
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Targeting rules

Targeting rules allow you to define which subjects should belong to your experiment population. For example, you might define a rule to target mobile device users.

## Add Targeting Rules to an Experiment

Targeting rules are supported for experiments that use Eppo's Feature Flagging SDK. Navigate to an allocation in a Feature Flag to configure targeting rules. You may target any attribute names that you use in your code, but the same attributes must be passed to the SDK during assignment.

![generating-api-token-1](/img/connecting-data/targeting-rules.png)

Each rule may have multiple conditions. The rule is only satisfied if all the conditions match. Eppo's randomization SDK will return an assignment if any rules are satisfied, and `null` if no rules are satisfied.

## Supported Rule Operators

| Operator                                                                                   | Attribute Type          | Meaning                                                                                                                                                                      |
| :----------------------------------------------------------------------------------------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| greater than (>), less than (<), greater than or equal to (>=), less than or equal to (<=) | number, SemVer          | Numeric comparison                                                                                                                                                           |
| matches regex                                                                              | string                  | Regular expression match                                                                                                                                                     |
| one of / not one of                                                                        | string, number, boolean | Is one of (or not one of) an array of strings. Non-string inputs (number and boolean) are cast to string before performing the comparison. Comparisons are case-sensitive. |

## Special case: Semantic Versioning

When rolling out new versions of your product or wishing to deploy custom behavior across a range of releases,
use Eppo's targeting rules to perform numeric comparisons against strings in the SemVer format.

1. Create an allocation with your desired mix of rules.

![generating-api-token-1](/img/feature-flagging/semver-targeting.png)

2. Use the assignment implementation with the current version.

```python
import eppo_client

client = eppo_client.get_instance()
variation = client.get_string_assignment(
  "<FLAG-KEY>",
  "<SUBJECT-KEY>",
  { "device": "iOS", "appVersion": "28.5.0" },
  "<DEFAULT-VALUE>",
)
```
