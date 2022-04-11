---
sidebar_position: 2
---

# Quickstart

Follow this quickstart to get your first experiment set up on Eppo.

## Overview

1. [Set up feature flagging](#1-set-up-feature-flagging)
2. [Create an Eppo account](#2-create-eppo-account)
3. [Connect your data warehouse](#3-connect-your-data-warehouse)
4. [Create an Assignment SQL](#4-create-an-assignment-sql)
5. [Create Fact SQLs](#5-create-a-fact-sql)
6. [Create metrics](#6-create-metrics)
7. [Create an experiment](#7-create-an-experiment)
8. [Add metrics to experiment](#8-add-metrics-to-experiment)

## 1. Set up feature flagging

Eppo assumes that you are already using a third party feature flagging tool like [LaunchDarkly](https://launchdarkly.com/) or [Optimizely](https://www.optimizely.com/) and are exporting experiment data into a data warehouse. In particular, Eppo requires that you have the following tables in your data warehouse:

- an assignment table that indicates which experiment subjects were assigned to which experiments and variants at which time. It should contain columns that roughly correspond to:

  - **timestamp**
  - **user_id**
  - **experiment**
  - **variation**
  - **device_id**

For example, the first few row of the table might look like this:

| timestamp | user_id | experiment | variation | device_id |
| --------- | ------- | ---------- | --------- | --------- |
| 2021-06-22T17:35:12.000Z | 165740867980881574 | adding_BNPL_experiment | affirm | 2k3l2k2 |


You can refer here for [more information](./connecting-data/feature-flagging/required-data.md) on what the column types should be.

- event table whose rows are logs of specific events that occurred at specific times. It should contain columns that roughly correspond to:

  - timestamp
  - user_id
  - event type
  - event value

For example, the first few rows of the table might look like this:

| timestamp | user_id | event_type | event_value |
| --------- | ------- | ------- | -------------- |
| 2021-07-17T18:57:13.000Z	 | 49980400511307080 | Revenue | 45.5695	|
| 2021-07-17T18:57:13.000Z	 | 2281323415877132491 | Subscription | 1 |



If you do not already have these tables set up, please refer to the [feature flagging](./connecting-data/feature-flagging/) section for more instructions.

## 2. Create Eppo account

Create a new account at https://eppo.cloud/. Eppo implements Auth0 and you should be able to sign in with any of the providers that Auth0 supports, including Google.

Once you log in, you will see the Eppo home page.

## 3. Connect your data warehouse

Eppo currently supports the following data warehouses:

- Snowflake
- BigQuery
- RedShift

## 4. Create an Assignment SQL

Now that Eppo is connected to your data warehouse, the first thing we are going to do is create an assignment SQL. Assignment SQLs define which experiment subjects will be assigned to which experiment and variation, and at what time. They're basically just pulling data from your assignment table.

1. Navigate to **Definitions** and click **Create Definition SQL**

![Create Definition SQL](../static/img/building-experiments/create-definition-sql.png)

3. Click **Assignment SQL**

![Create Assignment SQL](../static/img/building-experiments/create-assignment-sql.png)

4. Select the subject of the Assignment SQL

![Select user as entity](../static/img/building-experiments/select-user-as-entity.png)

Entities are the randomization units of your experiment. By default, entities in Eppo are **User**, but you can also [create your own customized entities](./building-experiments/entities.md) and attach Assignment SQL's to them.

4. Name your Assignment SQL

5. Write SQL in the SQL editor to pull assignments from data warehouse and click **Run**

Recall in the [Set up Feature Flagging](#1-set-up-feature-flagging) section that you should have an assignment table in your data warehouse with certain column types.

In this step, you're going to write SQL to pull that data.

![Write Assignment SQL Query](../static/img/building-experiments/add-assignment-sql-query.png)

Then click **Run**, and the rows from that assignment table should appear in the bottom left.

7. Annotate the columns that you've selected from the data warehouse

In case there's any ambiguity as to which properties the columns correspond to, we annotate them here.

![Annotate assignment SQL columns](../static/img/building-experiments/annotate-assignment-sql-columns.png)

8. Make note of your feature flag name and variant names

Note the value of the **FEATURE FLAG** column; in this example it's `new_user_onboarding` - this is your feature flag name.

Note the values of the **VARIANT** column; in this example it's `control` and `treatment` - these are the names of your variants.

You will need these names later.

9. Adding optional dimensions

![Add Assignment SQL Dimensions](../static/img/building-experiments/add-assignment-sql-dimensions.png)

Your feature flag tooling may have logged additional data about the user, like what country they're from or which browser they're using. You can annotate these additional dimensions here, and they will show up under the **Dimension SQL** tab.

<!-- <img src="https://firebasestorage.googleapis.com/v0/b/eppo-documentation-images.appspot.com/o/add-assignment-sql-dimensions.png?alt=media&token=dfd583db-4ea7-4013-b5fc-d90612118738" width="500" height="200"/> -->

9. Save & Close

You've now created your first Assignment SQL!

## 5. Create a Fact SQL

Next, we want to create Fact SQLs. Fact SQL's define events, like sign-ups, activations, or orders. Together, the Assignment SQL and Fact SQLs give us a picture of _what happened_ to different segments of users shown different variants of the experiment.

1. Navigate to **Definitions** and click **Create Definition SQL**

![Create Definition SQL](../static/img/building-experiments/create-definition-sql.png)

3. Click **Fact SQL**

![Create Fact SQL](../static/img/building-experiments/create-fact-sql.png)

4. Select **User**

**User** is the default entity in Eppo but you can also create your own custom entity and select that here.

5. Name your Fact SQL

![Name Fact SQL](../static/img/building-experiments/name-fact-sql.png)

6. Write SQL in the SQL editor to pull events data from the data warehouse

Recall in the [Set up Feature Flagging](#1-set-up-feature-flagging) section that you should have (potentially multiple) event tables in your data warehouse with certain column types.

In this step, you're going to write SQL to pull that data.

![Name Fact SQL](../static/img/building-experiments/name-fact-sql.png)

7. Annotate the columns that you've selected from the data warehouse

![Annotate Fact SQL](../static/img/building-experiments/annotate-fact-sql-columns.png)

In the example above, Eppo has already automatically determined that the `timestamp of creation` column is `TS` and the relevant `entity id` column is `USER_ID`.

8. Add Facts

For every event that you want to track, you should add its corresponding column in the data warehouse as a fact.

![Add Facts](../static/img/building-experiments/add-fact-sql-fact.png)

In the example above, we would like to measure the effect of the experiment on `revenue`.

In the data warehouse, every time there is a `revenue` event (that might be someone purchasing something,), that event is logged as a row in the data warehouse.

This event is translated into an integer value, which is the `revenue amount`, that can then be used as an Eppo fact and tracked in an experiment.

10. Save & Close

You've now created your first Fact SQL. If you have more events that you would like to track in your experiment, you can repeat the steps in this section to create additional Fact SQLs.

## 6. Create metrics

1. Navigate to **Metrics** and Click **+Metric**

![Add Facts](../static/img/building-experiments/add-metric.png)

2. Select the subject of the User SQL

![Select User as entity for metric](../static/img/building-experiments/select-user-as-entity-for-metric.png)

**User** is the default entity in Eppo, but you can also create a custom entity and select it here.

4. Select a fact

![Select Fact](../static/img/building-experiments/select-fact-and-aggregation-for-metric.png)

This should be one of the facts that you created in the step above, and should correspond to a metric that you want to track in an experiment.

5. Select an aggregation

![Select User as entity for metric](../static/img/building-experiments/select-user-as-entity-for-metric.png)

The aggregation will aggregate over whatever the fact is measuring on a per-entity basis. So for example, if you select the `Revenue` fact and the `SUM` aggregation, the metric will be the total revenue for each user;, if you select the `Upgrades` fact and the `SUM` aggregation, the metric will be the total number of upgrades for each user, which should only be 1 across the board.

Eppo supports the following aggregations:

- SUM
- COUNT DISTINCT
- COUNT
- RETENTION
- CONVERSION

6. (Optional) Select a Filter

When you created an assignment SQL above, you may have also created additional dimensions, i.e. country or browser. These dimensions are now available under the **Definitions** > **Dimensions SQL**.

![Select filter](../static/img/building-experiments/select-user-as-entity-for-metric.png)

Here, you can filter on any of those dimensions. In the example above, we just want to focus on upgrades from Canada.

7. Select a minimum detectable effect

The minimum detectable effect refers to the smallest effect you want to reliably detect in experiments. The higher the minimum detectable effect you set, the longer the experiment will take to reach conclusive results.

![Select minimum detectable effect](../static/img/building-experiments/select-user-as-entity-for-metric.png)

## 7. Create an experiment

### Configure the experiment

1. Navigate to **Experiments** in the left-hand menu and click **+Experiment**

![Create experiment](../static/img/building-experiments/create-experiment.png)

2. Fill out the **Create Experiment** Form

![Fill experiment form](../static/img/building-experiments/fill-create-experiment-form.png)

Give your experiment a name, start and end date.

3. Navigate to the **Set Up** tab and click the **Configure the Experiment** button

![Configure experiment](../static/img/building-experiments/set-up-and-configure-experiment.png)

6. Select an assignment SQL from the definitions you created

![Choose assignment SQL](../static/img/building-experiments/choose-assignment-sql-in-experiment.png)

7. Input feature flag name

When you created your assignment SQL, you should have made note of your feature flag name. In our case it's `new_user_onboarding`.

![Configure experiment](../static/img/building-experiments/choose-feature-flag-in-experiment.png)

8. Input what percentage of traffic you want randomized into the experiment.

If you input 100%, 100% of the relevant entities (users in this case) will be included in the experiment.

![Percent Traffic](../static/img/building-experiments/name-variants.png)

9. Add the variants

![Add variants](../static/img/building-experiments/name-variants.png)

When you created your assignment SQL, you should have made note of your variant names. In our case here it's `control` and `variant`.

You can go ahead and add each variant into the experiment here.

10. Select the traffic allocation you would like

The default is an even split between all the variants (including control), but you can also customize the allocation for unequal splits.

11. Click **Save Changes**

### 8. Add metrics to experiment

1. Navigate to **Experiments** and click the **Overview** tab

You should have already configured your feature flag above, if you haven't, go do that first.

Under **Decision metrics**, you will see that [guardmail metrics](./building-experiments/experiments/guardrail-metrics.md) have already been included automatically.

4. Click **+Add metric** button

![Configure experiment](../static/img/building-experiments/add-metric.png)

On the left hand of the modal, you will see a list of metrics that have been created that are attached to this set of experiment subjects.

You can select one of them to add to the experiment

5. Click **Save**

## Your experiment is now in progress!

Your experiment will likely take a few days to start outputing results.
