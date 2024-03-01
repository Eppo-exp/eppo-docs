---
sidebar_position: 1
---
# Simple metrics

Metrics are essential for analyzing experiments in Eppo, as they provide quantitative measures to evaluate the performance of different variations in an A/B test. In this guide, we walk you through simple metrics: an aggregation over an entity. An example of a simple metric at the _User_ entity level would be _Revenue_: this is the sum of money spent by a user.

## Anatomy of a metric

Simple metrics turn an event stream (created from a [Fact SQL Definition](/data-management/definitions/fact-sql)) into a single number for a variation in two steps:

1. First, the events are aggregated at the entity level (such as a User) using an aggregation
2. Second, the values are averaged across entities

For example, to compute a revenue metric, first we sum the amount spent by each user.
Second, we take the average across all users to obtain the average revenue per user.
In SQL terms, a simplified version of this two step process looks like

```sql
WITH user_summaries AS (
    SELECT
        user,
        SUM(spent) AS user_spent
    FROM spent_events
    GROUP BY user
    WHERE spent_ts BETWEEN experiment_start AND experiment_end
)

SELECT
    variant,
    AVG(COALESCE(user_spent, 0)) as metric_estimate
FROM assignments
LEFT JOIN user_summaries ON user
GROUP BY variant
```

### Metric aggregation types

In Eppo, you are able to create a wide variety of metrics because Eppo supports many aggregation functions:
- [Sum](#sum)
- [Unique Entities](#unique-entities)
- [Count](#count)
- [Count Distinct](#count-distinct)
- [Retention](#retention)
- [Conversion](#conversion)
- [Threshold](#threshold)

#### Sum

Sum computes metrics that are typically interpreted as averages per entity. If the fact value is NULL, it is discarded.

$\frac{\text{SUM of fact value}}{\text{Number of unique entities assigned}}$

Examples: average revenue per user, sign-up rate, minutes streamed per user, average order value.

#### Unique Entities

`Unique Entities` computes the number of unique entities with a non-null event. If the fact value is NULL, it is discarded.

$\frac{\text{Number of unique entities with an event}}{\text{Number of unique entities assigned}}$

Examples: % of users with a video watch, % of visitors who viewed an article, % of users who entered checkout.

#### Count

Count leverages SQL's `COUNT` to compute a total count of events per entity. If the fact value is NULL, it is discarded.

$\frac{\text{COUNT of fact values}}{\text{Number of unique entities assigned}}$

Examples: videos watched per user, articles viewed per visitor, orders per user.

#### Count Distinct

`Count distinct` computes the number of unique non-numeric values in a fact. This allows for counting a number of unique values in a field other than the entity. If the fact value is NULL, it is discarded.

$\frac{\text{Number of unique fact values}}{\text{Number of unique entities assigned}}$

Examples: number of unique videos watched per user (if the same video is watched twice, it only counts once), number of unique articles viewed per visitor, number of unique items ordered (if an item is ordered multiple times, it only counts once).

#### Retention

Retention metrics measure the proportion of entities who have at least one fact value appear after a fixed number of days (X) from experiment assignment. For example, a 7-day retention metric on the website visits fact might measure the proportion of users who visit a website at least 7 days after being assigned to the experiment.

$\frac{\text{Sum of \{1 if a non-null fact value is present X days after the assignment time, else 0, for each unique entity assigned at least X days ago\}}}{\text{Number of unique entities assigned at least X days ago}}$

Only entities that were assigned at least $X$ days ago are included in both numerator and denominator. Those assigned within the last $X$ days cannot yet have retained, by construction. For those the numerator is always $0$, and including them would make retention appear artificially low.

For example, if $X = 7 \text{ days}$, Eppo records a retention event for an entity when

$(\text{timestamp of event}) - (\text{timestamp of assignment}) \geq 7 \text{ days}$

for all entities for which $\text{timestamp of assignment}$ is at least 7 days ago.

#### Conversion

Conversion metrics measure the proportion of entities who have at least one fact value appear within a fixed number of days (X) from experiment assignment. For example, a 7-day conversion metric might measure the proportion of users who sign up for a free trial within 7 days of being assigned to the experiment.

$\frac{\text{Sum of \{1 if fact value is non-null within X days of the assignment time, else 0, for each unique entity\}}}{\text{Number of unique entities assigned}}$

For example, if $X = 7 \text{ days}$, Eppo records a conversion event for an entity when

$(\text{timestamp of event}) - (\text{timestamp of assignment}) < 7 \text{ days}$.

#### Threshold

Threshold metrics measure the proportion of entities who meet a user-specified `SUM` OR `COUNT` of a fact within an optional time-period. For example, you might want to understand what share of users in your experiment spent more than $100 within 7 days of assignment into an experiment.

## Creating a metric

Now that we understand how metrics are defined within Eppo, we are ready to create a metric.
Note that in order to create a metric, you first need to have set up a [Fact SQL Definition](/data-management/definitions/fact-sql) to point to the underlying data for your metric in your data warehouse.
Let's walk through an example to create a User Revenue metric based on a fact table that lists purchase events at the user level.

1. **Navigate to `Metrics`, click `+Metric`, then select `User` as the subject of the metric**

**User** is the default entity in Eppo, but you can also create a [custom entity](/data-management/entities) and select it here.

![Create a metric flow](/img/data-management/metrics/create-metric.png)

2. **Select a fact**

This should be one of the facts that you created in the step above, and should correspond to a metric that you want to track in an experiment.

3. **Select an aggregation**

The aggregation will aggregate over whatever the fact is measuring on a per-entity basis. So for example, if you select a `Revenue` fact and the `SUM` aggregation, the metric will be "average revenue per user;" if you select a `Name of Article Viewed` fact and the `COUNT DISTINCT` aggregation, the metric will be "Unique articles viewed per user."

4. **Set outlier handling** <span id='#outlier-handling'></span>

Eppo handles outliers through a technique called winsorization. Lower and upper bounds by percentiles for winsorization can be defined by the user for every metric. For example, in the screenshot below, we are setting the upper bound for winsorization at the 99.9th percentile. This means that any user with a value above the 99.9th percentile will be rounded down to the 99.9th percentile value.

Note that winsorization is only utilized for `SUM` and `COUNT` aggregations. This is because conversion and retention metrics are binomial variables that are not prone to influence from outliers. As a result, winsorization is redundant for these metric types.

![Adding winsorization to a metric](/img/data-management/metrics/create-metric-outliers.png)

5. **Set a default precision target**

The [precision](/experiment-analysis/progress-bar#precision) refers to the uncertainty you want to be able to measure in an experiment, as measured by the width of confidence intervals. You can set a default at the metric level, which will be used to measure [progress](/experiment-analysis/progress-bar) if this metric is the primary metric for an experiment.

6. **Set formatting options**

Here, you can select whether to format the metric as a number or as a percentage.

### Time frames

Eppo allows you to further refine metrics by adding a time frame. For example, we may be interested in a metric that only considers purchases within one week of the user's assignment to an experiment.

![Adding a time frame to a metric](/img/data-management/metrics/create-metric-timeframe.png)

:::note
Consider adding a time frame metric to experiments where you believe the intervention has a short term effect.
For example, suppose sending a promotional email boosts engagement for one week. If we do not add a time frame and run the experiment over 4 weeks, then the experiment effect may be diluted by a factor up to 4.

:::

### Metric properties

Metric properties give you another tool to filter events based on a [metric property](data-management/properties#metric-properties).
Suppose you work at a streaming platform that streams both movies and series and _watch time_ is your primary metric. However, you may also be interested in understanding the impact of experiments on _movie watch time_ and _series watch time_ separately. In this case, you can add _show type_ as a category and create separate metrics for movies and shows.

When creating such a metric, specify that you want to use a metric property and select which values are valid.
![Adding a metric property](/img/data-management/metrics/create-metric-property.png)

## Editing metrics

![Editing a metric](/img/building-experiments/edit-metric.gif)

1. Navigate to the **Metrics** tab on the left-hand side menu.

2. Navigate to the metric you want to edit

3. Click on the three dots on the right hand side of the row

4. Select **Edit Metric** from the dropdown

## Deleting metrics

![Deleting a metric](/img/building-experiments/delete-metric.gif)

1. Navigate to **Metrics** on the left side menu

2. Click on the three dots on the right hand side of a metric

3. Select **Delete** from the dropdown menu

Note that if you delete a metric that is being used in an active experiment, that may affect the experiment currently being run.
