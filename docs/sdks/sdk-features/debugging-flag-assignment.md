# Debugging Flag Assignment

:::note

Currently, "Evaluation Details" are only available in the `js-client-sdk`, `node-server-sdk`, and `react-native-sdk` SDKs

:::

You may encounter a situation where a flag assignment produces a value that you did not expect. There are functions now available in `js-client-sdk`, `node-server-sdk`, and `react-native-sdk` to help you understand how flags are assigned, which will allow you to take corrective action on potential configuration issues.

## Evaluation Details

New "Details" functions (e.g. `getStringAssignmentDetails()`) now exist that will produce an object containing an `evaluationDetails` field as part of the returned value. The `evaluationDetails` will contain information that allows you to better understand how a variation was assigned.

The full list of these functions are as follows:

- `getBooleanAssignmentDetails()`
- `getIntegerAssignmentDetails()`
- `getNumericAssignmentDetails()`
- `getStringAssignmentDetails()`
- `getJSONAssignmentDetails()`
- `getBanditActionDetails()`

Additionally, `evaluationDetails` will be available in your `assignmentLogger` (and, if used, `banditLogger`), defined when initializing the Eppo client.

```typescript
init({
  apiKey: API_KEY,
  assignmentLogger: {
    logAssignment(assignment) {
      console.log(assignment.evaluationDetails);
    },
  },
});
```

## Scenarios

To better understand how the new "details" functions help us, let's take a look at specific examples. Assume that we have the following configuration for `my-flag`.

![Example Configuration](/img/guides/debugging-flag-assignment/example-configuration.png)

### Scenario: Without calling the "Details" functions

The original functions (e.g. `getStringAssignment`) will behave just as they did before. These functions will only return the assigned variation value, but the assignment logger can still log `evaluationDetails`.

```typescript
const flagKey = 'my-flag';
const subjectKey = 'subject-123';
const subectAttributes = {};
const defaultValue = 'default';

getStringAssignment(flagKey, subjectKey, subjectAttributes, defaultValue);
// => "control"
```

### Scenario: An allocation was matched

In the next example, we call `getStringAssignmentDetails()` to better understand how an allocation was matched. We can see that the `flagEvaluationCode` is `MATCH`, which tells us that there was a matched allocation. The `matchedAllocation` value contains `"orderPosition": 2`, which tells us that the 2nd allocation in our configuration was matched, which is our **A/B Experiment** allocation. We can also see that the **Alpha Testers** allocation with `"orderPosition": 1` was not matched, since it was specified in the `unmatchedAllocations` field. Finally, we can also see that our **Default allocation** with `"orderPosition": 3` was not evaluated at all, since we already had match in the 2nd allocation.

The `flagEvaluationDescription` field gives us more information about why the flag was matched. In this case, we have a 50% to 50% split on our traffic, and `subject-123` happens to fall in the group for variation `control`.

```typescript
const flagKey = 'my-flag';
const subjectKey = 'subject-123';
const subjectAttributes = {};
const defaultValue = 'default';

getStringAssignmentDetails(
  flagKey,
  subjectKey,
  subjectAttributes,
  defaultValue
);
// returns =>
{
  "variation": "control", // the assigned variation value
  "action": null, // the assigned bandit action only applies to `getBanditActionDetails()`
  "evaluationDetails": {
    "environmentName": "Production",
    "flagEvaluationCode": "MATCH",
    "flagEvaluationDescription": "tester-123 belongs to the range of traffic assigned to \"control\" defined in allocation \"allocation-5055\".",
    "variationKey": "control",
    "variationValue": "control",
    "banditKey": null,
    "banditAction": null,
    "configFetchedAt": "2024-07-09T13:45:06.569Z",
    "configPublishedAt": "2024-07-09T13:44:02.584Z",
    "matchedRule": null,
    "matchedAllocation": {
      "key": "allocation-5055",
      "allocationEvaluationCode": "MATCH",
      "orderPosition": 2
    },
    "unmatchedAllocations": [
      {
        "key": "allocation-6647",
        "allocationEvaluationCode": "FAILING_RULE",
        "orderPosition": 1
      }
    ],
    "unevaluatedAllocations": [
      {
        "key": "allocation-6648",
        "allocationEvaluationCode": "UNEVALUATED",
        "orderPosition": 3
      }
    ]
  }
}
```

### Scenario: An allocation was matched due to a matching rule

Let's see what happens when we specify `{ companyId: 11 }` as the `subjectAttributes`. This should match the **Alpha Testers** allocation, which ensures `test` is assigned for `companyId` values of `11` or `13`.

In this case, the `matchedAllocation` field contains `"orderPosition": 1`, which means that the **Alpha Testers** allocation was matched, since that's the first allocation defined in our configuration. The `matchedRule` field gives us information about which rule was matched, and `flagEvaluationDescription` tells us that the match happened due to matching rules. In this scenario, all remaining allocations that are defined in our configuration will be listed in `unevaluatedAllocations`, since the first allocation was matched.

```typescript
const flagKey = 'some-disabled-flag';
const subjectKey = 'subject-123'
const subjectAttributes = { companyId: 11 }; // companyId of 11 includes alpha testers
const defaultValue = 'default'

getStringAssignmentDetails(flagKey, subjectKey, subjectAttributes, defaultValue)
// returns =>
{
  "variation": "test", // the assigned variation value
  "action": null, // the assigned bandit action only applies to `getBanditActionDetails()`
  "evaluationDetails": {
    "environmentName": "Production",
    "flagEvaluationCode": "MATCH",
    "flagEvaluationDescription": "Supplied attributes match rules defined in allocation \"allocation-6647\".",
    "variationKey": "test",
    "variationValue": "test",
    "banditKey": null,
    "banditAction": null,
    "configFetchedAt": "2024-07-09T14:25:44.441Z",
    "configPublishedAt": "2024-07-09T13:44:02.584Z",
    "matchedRule": {
      "conditions": [
        {
          "attribute": "companyId",
          "operator": "ONE_OF",
          "value": ["11", "13"]
        }
      ]
    },
    "matchedAllocation": {
      "key": "allocation-6647",
      "allocationEvaluationCode": "MATCH",
      "orderPosition": 1
    },
    "unmatchedAllocations": [],
    "unevaluatedAllocations": [
      {
        "key": "allocation-5055",
        "allocationEvaluationCode": "UNEVALUATED",
        "orderPosition": 2
      },
      {
        "key": "allocation-6648",
        "allocationEvaluationCode": "UNEVALUATED",
        "orderPosition": 3
      }
    ]
  }
}

```

### Scenario: Your flag is disabled

When your flag is disabled, your `flagEvaluationCode` will be `FLAG_UNRECOGNIZED_OR_DISABLED`, and the supplied `defaultValue` argument will be assigned to `variation`. Pay attention to your `environmentName` in this scenario, since you may not be working in the environment you used to configure your flag.

```typescript
const flagKey = 'some-disabled-flag';
const subjectKey = 'subject-123'
const subjectAttributes = {};
const defaultValue = 'default';

getStringAssignmentDetails(flagKey, subjectKey, subjectAttributes, defaultValue)
// returns =>
{
  "variation": "default", // since there was no match, `variation` is set to the provided `defaultValue`
  "action": null,
  "evaluationDetails": {
    "environmentName": "Development",
    "flagEvaluationCode": "FLAG_UNRECOGNIZED_OR_DISABLED",
    "flagEvaluationDescription": "Unrecognized or disabled flag: my-flag",
    "variationKey": null,
    "variationValue": null,
    "banditKey": null,
    "banditAction": null,
    "configFetchedAt": "2024-07-09T13:18:09.192Z",
    "configPublishedAt": "2024-07-08T09:11:04.103Z",
    "matchedRule": null,
    "matchedAllocation": null,
    "unmatchedAllocations": [],
    "unevaluatedAllocations": [],
  }
}
```

### Other Scenarios

#### Allocation Evaluation Scenarios

| Scenario                                                                                           | allocationEvaluationCode |
| -------------------------------------------------------------------------------------------------- | ------------------------ |
| An allocation was matched for any reason                                                           | MATCH                    |
| An allocation had a failing rule condition                                                         | FAILING_RULE             |
| A subject didn’t fall within the traffic exposure range                                            | TRAFFIC_EXPOSURE_MISS    |
| An allocation hasn’t started yet                                                                   | BEFORE_START_TIME        |
| An allocation has already ended                                                                    | AFTER_END_TIME           |
| An allocation was not evaluated since there was a match for another allocation that came before it | UNEVALUATED              |

#### Flag Evaluation Scenarios

| Scenario                                                                                                      | flagEvaluationCode             |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| An allocation configured for this flag was matched for any reason                                             | MATCH                          |
| If your flag does not exist or is not enabled for the environment in use                                      | FLAG_UNRECOGNIZED_OR_DISABLED  |
| When the variation value does not match the specified type for the function called                            | TYPE_MISMATCH                  |
| An unknown error occurred with graceful error handling enabled                                                | ASSIGNMENT_ERROR               |
| If your default allocation is matched and is also serving NULL, resulting in the default value being assigned | DEFAULT_ALLOCATION_NULL        |
| If you called `getBanditActionDetails` without supplying actions                                              | NO_ACTIONS_SUPPLIED_FOR_BANDIT |
