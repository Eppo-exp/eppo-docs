---
sidebar_position: 1
---

# Creating an experiment [wip]

In Eppo, you can build your experiments using a few core building blocks:

- [Entities](/data-management/entities/)
- [Definitions](/data-management/definitions/)
  - [Assignments](/data-management/definitions/assignment-sql)
  - [Facts](/data-management/definitions/fact-sql)
- [Metrics](/data-management/metrics/creating-metrics)

These building blocks are combined in the [Eppo Data Pipeline](/data-management/pipeline)

# Prerequisites

To analyze experiments on Eppo you must first:

1. Set up a function to assign subjects to experiments in your application and log those assignments into your application's event stream.
2. Direct your application's event stream into your data warehouse, commonly achieved using a tool like Segment.
3. Connect Eppo to your data warehouse by setting up a dedicated service account.

![Data inputs](/img/feature-flagging/data-inputs.png)

In order to perform its analyses, Eppo needs access to an assignment table in your data warehouse that lists each user that comes through the system and which variant they saw at which time.

| timestamp                | user_id            | experiment             | variation |
| ------------------------ | ------------------ | ---------------------- | --------- |
| 2021-06-22T17:35:12.000Z | 165740867980881574 | adding_BNPL_experiment | affirm    |

If your infastructure lines up with this diagram and you already have data in this format, you can skip right to [connecting your data warehouse](/how-tos/connecting-dwh). If you are new to experimentation or are interested in hearing our recommended best practices, read further into our guides on [experiment assignment](/feature-flags/experiment-assignment/) and [event logging](/how-tos/event-logging/).

## Overview

Let's suppose that you're a food delivery app that wants to track the effect of a new push notification on customer ordering habits.

_Assignments_ refer to the assignment of customers into different experiment groups (some of the customers received the push notifications and some of them did not).

The food delivery app will have events that occur like "Customer X placed an order worth $23.44 from Restaurant Y at time T".

```sql
SELECT
  ts,
  customer_id,
  restaurant_id,
  order_value,
  promo_amount
FROM mydb.myschema.restaurant_orders
```

_Entities_ are who was involved in the event - in this case _Customer_ and _Restaurant_.

_Facts_ (one of kind of _Definition_) are the numeric quantities associated with the event - in this case `order_value` and `promo_amount`.

_Facts_ are aggregated to form _Metrics_ which you use to evaluate _Experiments_.

From the above `restaurant_orders` event, you can construct metrics such as:

- Total order volume -- the sum of order values across all customers
- Number of orders -- the number of orders placed by all customers
- Distinct ordering customers -- the number of customers who have placed an order
- Total revenue by customer (entity = customer, fact = `order_value`)
- Total revenue by restaurant (entity = restaurant, fact = `order_value`)
- Total promos received by restaurant (entity = customer, fact =
  `promo_amount`)

# Creating experiments

Experiments are a set of metrics that correspond to users being shown different feature sets that you would like to track over time.

## 1. Navigate to **Experiments** in the left-hand menu and click **+Experiment**

![Create experiment](/img/building-experiments/create-experiment.png)

## 2. Fill out the **Create Experiment** Form

![Fill experiment form](/img/building-experiments/fill-create-experiment-form.png)

Give your experiment a name and hypothesis.

## 3. Click the **Configure the Experiment** button

![Configure experiment](/img/building-experiments/set-up-and-configure-experiment.png)

## 4. Select the date range for your experiment.

![Select dates](/img/building-experiments/select-dates.png)

You can also choose to set a metric event analysis period that is different from your assignment period. This is useful if you want to analyze the impact of an experiment on long-term metrics.

### Experiments with custom event dates

When creating an experiment, Eppo can analyze events which occur during or after randomization.

By default in Eppo, users are assigned (randomized) into an experiment and all events are tracked on the same timeline as assignment.

![Same timeline](/img/reference/same-timeline.png)

However, in certain cases, you may want events to be tracked well after randomization ends.

![Differing timelines](/img/reference/distinct-events-timeline.png)

While uncommon, event dates should be extended past the assignment period if you wish to detect an effect that will appear long after treatment exposure.

**Example 1: Short-lived marketing campaign**

Let's test the following: if we run a marketing campaign on our landing page for one day, do our customers generate higher revenue for us over the next month?

Using distinct assignment and event periods, we should:

- Assign users for one day
- Track events for one month

If the assignment period matched the event period, then we'd be continually exposing the marketing campaign to users, which is not what we intended.

**Example 2: New user onboarding flow**

A service is interested in testing whether a new onboarding flow will increase 90-day retention. One possible design could be the following:

- Assign users for two weeks (14 days)
- Track events for 104 days (14 days + 90 days)

This will allow Eppo to calculate out the rentention metric for the entire population. If the assignment period matched the event period (as is the default in Eppo), this could expose more users than necessary to a new onboarding flow without first understanding the long-term impact.

### 5. Select an assignment SQL from the definitions you created

![Choose assignment SQL](/img/building-experiments/choose-assignment-sql-in-experiment.png)

If you are pre-assigning subjects before they are actually exposed to a variant, you may want to take advantage of the _Filter assignments by entry point_ checkbox. This will include only those subjects that appear in an [entry point](/statistics/sample-size-calculator/setup#what-is-an-entry-point) with an entry time after their assignment time.

### 6. Input feature flag name

When you created your assignment SQL, you should have made note of your feature flag name. In our case it's `new_user_onboarding`.

![Configure experiment](/img/building-experiments/choose-feature-flag-in-experiment.png)

### 7. Input what percentage of traffic you want randomized into the experiment.

If you input 100%, 100% of the relevant entities (users in this case) will be included in the experiment.

![Percent Traffic](/img/building-experiments/name-variants.png)

### 8. Add the variants

![Add variants](/img/building-experiments/name-variants.png)

When you created your assignment SQL, you should have made note of your variant names. In our case here it's `control` and `variant`.

You can go ahead and add each variant into the experiment here.

### 9. Select the traffic allocation you would like

The default is an even split between all the variants (including control), but you can also customize the allocation for unequal splits.

### 10. [Optional] The Statistical Analysis Plan {#analysis-plan-settings}

If you want to set custom statistical methodologies for this experiment, uncheck
the "use company default" checkbox next to the applicable fields. Otherwise, you
can stay opted in to using
the [defaults set by your company](/administration/setting-statistical-analysis-plan-defaults.md).
For information on the different analysis plan settings, see [Analysis plans](/experiments/analysis-plans.md).

![Experiment Analysis Plan Settings](/img/building-experiments/experiment-setup-statistical-analysis-plans.gif)

11. Click **Save Changes**

# Adding screenshots

In your experiments, you can add screenshots to your different variations. You can use these screenshots to highlight the changes made in the variation.

To do this, first navigate to the **Experiments** tab on the left and then click on your experiment. Then click on the icon next to the variant you want to add the screenshot to.

For example, let us say you are running an experiment to see how adding photos to the customer's menu affects the menu-to-cart conversion. In this case, you can add screenshots of the new updated menu to the corresponding variant in the experiment.

![Add screenshot](/img/measuring-experiments/add-screenshot.gif)

You can also add a screenshot for the original control variant to make the comparison between the changes easier.

![Add control screenshot](/img/measuring-experiments/add-control-screenshot.gif)
