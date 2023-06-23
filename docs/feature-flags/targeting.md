---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Targeting rules

Targeting rules allow you to define which subjects should belong to your experiment population. For example, you might define a rule to target mobile device users.

## Add Targeting Rules to an Experiment

Targeting rules are supported for experiments that use Eppo's randomization SDK. Navigate to the Experiment Setup tab to configure targeting rules. You may target any attribute names that you use in your code, but the same attributes must be passed to the SDK during assignment.

![generating-api-token-1](/img/connecting-data/targeting-rules.png)

Each rule may have multiple conditions. The rule is only satisfied if all the conditions match. Eppo's randomization SDK will return an assignment if any rules are satisfied, and `null` if no rules are satisfied.

## Pass subject attributes to the Eppo SDK

The below code examples show how to pass a value for the "device" attribute described in the previous section. The subject attributes are a free-form map, so you may also pass any other attribute names.

<Tabs>
<TabItem value="javascript" label="JavaScript (Client)">

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const subjectAttributes = { device: "iOS" };
const variation = EppoSdk.getInstance().getAssignment(
  "<SUBJECT-KEY>",
  "<EXPERIMENT-KEY>",
  subjectAttributes
);
```

</TabItem>

<TabItem value="node" label="Node">

```javascript
import * as EppoSdk from "@eppo/node-server-sdk";

const subjectAttributes = { device: "iOS" };
const variation = EppoSdk.getInstance().getAssignment(
  "<SUBJECT-KEY>",
  "<EXPERIMENT-KEY>",
  subjectAttributes
);
```

</TabItem>

<TabItem value="python" label="Python">

```python
import eppo_client

client = eppo_client.get_instance()
variation = client.get_assignment("<SUBJECT-KEY>", "<EXPERIMENT-KEY>", { "device": "iOS" })
```

</TabItem>
</Tabs>

### Supported Rule Operators

| Operator                                                                                   | Attribute Type          | Meaning                                                                                                                                                                      |
| :----------------------------------------------------------------------------------------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| greater than (>), less than (<), greater than or equal to (>=), less than or equal to (<=) | number                  | Numeric comparison                                                                                                                                                           |
| matches regex                                                                              | string                  | Regular expression match                                                                                                                                                     |
| one of / not one of                                                                        | string, number, boolean | Is one of (or not one of) an array of strings. Non-string inputs (number and boolean) are cast to string before performing the comparison. Comparisons are case-insensitive. |
