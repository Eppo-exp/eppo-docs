---
slug: /switchback-quickstart
sidebar_position: 8
---

# Running your first Switchback

This 10-minute guide will walk through configuring and running your first Switchback Experiment with Eppo. A Switchback Experiment is a special type of Experiment Allocation, so this guide will walk through setting up a Switchback Experiment within a Feature Flag, which shares some similarities with the [Experiment Allocation Quickstart](/experiment-allocation-quickstart).

## Prerequisites

To run a Switchback Experiment with Eppo, you'll need the following:

1. An existing feature flag capturing the variations you want to test. If you have not already created a flag, we recommend you start with the [feature flag quick start guide](/feature-flag-quickstart/).
2. A method for logging events to your data warehouse.
3. A data warehouse service account connected to your Eppo workspace. For details on setting this up, see the [connecting your warehouse section](/data-management/connecting-dwh/).

## Setting up a Switchback Experiment

### 1. Ensure that the randomization unit is included in the subject attributes

Connect an event logger with the same instructions as in the [Experiment Allocation Quickstart Guide](/experiment-allocation-quickstart#connecting-an-event-logger).

:::note
Ensure that the randomization unit for the switchback experiment is included in the subject attributes. For example, if your switchback experiment is randomizing on `city`, ensure that `city` is included in the `subject_attributes` object when getting an assignment and logged to a column in the assignments table in your data warehouse.

```js
const client = EppoSdk.getInstance();

const variant = client.getStringAssignment(
  "flag-key",
  "user-123",
  {
    "city": "nyc",
  },
  "default-assignment"
);
```
:::

### 2. Create a Switchback Experiment in a Feature Flag

In your Feature Flag, click **Add Assignment** and select **Switchback**.

![Create Switchback Assignment](/../static/img/switchback/quick-start-1.png)

And then fill in the same randomization unit as you provided in the subject attributes and the values for which to generate switchback assignment schedules.

![Create Switchback Assignment](/../static/img/switchback/quick-start-2.png)

In this example, a variation will be randomly assigned every hour, and each of the listed cities will randomize independently of the others and thus will have its own schedule of assignments. Moreover, an **Switchback Assignment Logging Table** will be written to your data warehouse. It will contain the assignment schedule for each of the values you provided in the **Randomization Unit** field. Create a definition for this schedule in the **Switchback Assignments** tab in the **Definitions** section.

:::note
The feature flag key in which the switchback assignment was created is the same feature flag key that you should use in the SDK function for getting assignments.
:::

### 3. Create a Switchback Experiment

To analyze the results of the switchback experiment, click the **Create Switchback Analysis** button.

![Create Switchback Analysis](/../static/img/switchback/quick-start-3.png)

And select the **Entity** of the randomization unit and the two SQL definitions: the **Assignment Logging Table**, and the **Switchback Assignment Logging Table**.

![Create Switchback Analysis](/../static/img/switchback/quick-start-4.png)

Then proceed with the remaining steps as shown in the UI. Further details for setting up a switchback analysis can be found in the [Experiment Analysis for Switchbacks](/experiment-analysis/switchbacks/) section.


