---
sidebar_position: 1
---

# Creating experiments

Experiments are a set of metrics that correspond to users being shown different feature sets that you would like to track over time.

### 1. Navigate to **Analysis** in the left-hand menu, click **+Create**, and select **Experiment Analysis**

![Create experiment](/img/building-experiments/create-experiment.png)

### 2. Fill out the **Create Experiment** Form

![Fill experiment form](/img/building-experiments/fill-create-experiment-form.png)

Give your experiment a name, select or enter the Feature Flag Key, select an Entity, pick the Assignment Logging table, and enter a name and hypothesis for the experiment.

If you are pre-assigning subjects before they are actually exposed to a variant, you may want to take advantage of the [_Filter assignments by entry point_ checkbox](./filter-assignments-by-entry-point). This will include only those subjects that appear in an [entry point](/statistics/sample-size-calculator/setup#what-is-an-entry-point) with an entry time after their assignment time.

### 3. Click the **Configure the Experiment** button

![Configure experiment](/img/building-experiments/set-up-and-configure-experiment.png)

### 4. Select the date range for your experiment.

![Select dates](/img/building-experiments/select-dates.png)

You can also choose to set a metric event analysis period that is different from your assignment period. This is useful if you want to analyze the impact of an experiment on long-term metrics.

### Experiments with custom event dates

When creating an experiment, Eppo can analyze events which occur during or after randomization.

By default in Eppo, users are assigned (randomized) into an experiment and all events are tracked on the same timeline as assignment.

![Same timeline](/img/reference/same-timeline.png)

However, in certain cases, you may want events to be tracked well after randomization ends.

![Differing timelines](/img/reference/distinct-events-timeline.png)

While uncommon, event dates should be extended past the assignment period if you wish to detect an effect that will appear long after treatment exposure.

:::info Example 1: Short-lived marketing campaign

Let's test the following: if we run a marketing campaign on our landing page for one day, do our customers generate higher revenue for us over the next month?

Using distinct assignment and event periods, we should:

- Assign users for one day
- Track events for one month

If the assignment period matched the event period, then we'd be continually exposing the marketing campaign to users, which is not what we intended.

:::

:::info Example 2: New user onboarding flow

A service is interested in testing whether a new onboarding flow will increase 90-day retention. One possible design could be the following:

- Assign users for two weeks (14 days)
- Track events for 104 days (14 days + 90 days)

This will allow Eppo to calculate out the retention metric for the entire population. If the assignment period matched the event period (as is the default in Eppo), this could expose more users than necessary to a new onboarding flow without first understanding the long-term impact.

:::

### 5. Add variants

This section allows you to select which variants you would like to include in the experiment. The value reflects what is observed in the assignment SQL table, whereas the name specifies what will be displayed in the Eppo UI.

![Add variants](/img/building-experiments/name-variants.png)

### 6. Add traffic allocation (externally randomized experiments only)

If the experiment was randomized outside of Eppo, use this section to tell Eppo the expected traffic split across variants as well as the percent of eligible users that were enrolled. The expected traffic split is used when checking for [sample ratio mismatch (SRM)](/statistics/sample-ratio-mismatch/) and the traffic exposure is used in computing [global impact](/experiment-analysis/global-lift/).

![Percent Traffic](/img/building-experiments/define-traffic-allocation.png)

### 7. The Statistical Analysis Plan (optional) {#analysis-plan-settings} 

If you want to set custom statistical methodologies for this experiment, uncheck
the "use company default" checkbox next to the applicable fields. Otherwise, you
can stay opted in to using
the [defaults set by your company](/administration/setting-statistical-analysis-plan-defaults.md).
For information on the different analysis plan settings, see [Analysis plans](/experiment-analysis/analysis-plans.md).

![Experiment Analysis Plan Settings](/img/building-experiments/experiment-setup-statistical-analysis-plans.gif)

### 8. Click **Save Changes**

# Adding metrics

Once the scope of the experiment is defined, you can pick metrics to lead your decision.

![Adding metrics to a new experiment](/img/building-experiments/addind_metrics.png)

All metrics are defined by their Entity (User, Anonymous visitor, etc.), so only metrics based on the same entity as the assignment will be available here.

Note that if you can’t find the metric that you are looking for, anyone with the Data Owner role can Create a new one from this screen.

![Picking metrics to add](/img/building-experiments/picking_metrics.png)

You can also add [collections of metrics](/data-management/collections.md) to add a curated set of metrics in one go.

# Adding screenshots

In your experiments, you can add screenshots to your different variations. You can use these screenshots to highlight the changes made in the variation.

To do this, first navigate to the **Experiments** tab on the left and then click on your experiment. Then click on the icon next to the variant you want to add the screenshot to.

For example, let us say you are running an experiment to see how adding photos to the customer's menu affects the menu-to-cart conversion. In this case, you can add screenshots of the new updated menu to the corresponding variant in the experiment.

![Add screenshot](/img/measuring-experiments/add-screenshot.gif)

You can also add a screenshot for the original control variant to make the comparison between the changes easier.

![Add control screenshot](/img/measuring-experiments/add-control-screenshot.gif)
