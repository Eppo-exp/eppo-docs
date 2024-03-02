---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Simple metrics

Metrics play a pivotal role in experiment analysis within Eppo, offering quantitative measures to assess the performance of various variations in an A/B test. In this page, we'll delve into simple metrics, which aggregate data over specific entities. Simple metrics are highly configurable and support a wide variety of use cases. 


## Anatomy of a simple metric

Simple metrics aggregate [fact events defined in SQL](/data-management/definitions/fact-sql) to the experiment level. Specifically, this aggregation is done in two steps:

1. First, the events are aggregated at the entity level (e.g., user) using a specified aggregation method
2. Second, the entity-level values are averaged across entities and analyzed by Eppo's statistics engine

For example, to compute a revenue metric, first Eppo will sum the amount spent by each user. Second, Eppo will compute the average across all users by experiment variant. In SQL terms, a simplified version of this two step process looks like this:

```sql
WITH user_summaries AS (
    SELECT
        user_spent.user,
        assignments.variant,
        SUM(user_spent.spent) AS user_spent
   FROM spent_events
   JOIN assignments
     ON spent_events.user = assignments.user
    AND spent_events.timestamp >= assignments.timestamp
  GROUP BY user
  WHERE spent_ts BETWEEN experiment_start AND experiment_end
)

SELECT
    variant,
    AVG(COALESCE(user_spent, 0)) as metric_estimate
FROM user_summaries
GROUP BY variant
```

## Creating a metric

Creating a simple metric in Eppo consists of the following steps:
1. Navigate to the **Metrics** page, click **+ Create** and select **Metric**
2. Select the fact you wish to analyze
3. Tell Eppo how to aggregate the fact to the entity level
4. (Optional) Add filters based on time since assignment and/or fact property filters
5. (Optional) Configure outlier handling by setting winsorization thresholds
6. Set a default precision target and formatting options

![Create a metric flow](/img/data-management/metrics/create-metric.png)

### Aggregation methods

The table below describes each of the aggregation methods that Eppo supports, along with an illustrative SQL example. Note that for all aggregation types, metrics are normalized by the number of subjects (users) in the experiment.

In each of the calculations below, NULL-valued facts are not included.

| Aggregation | Description | SQL | Example Metrics |
| ----------- | ----------- | ----------- | ----------- |
| Sum | Sum of fact values per entity | <pre><code>select <br></br>  <entity_id>, <br></br>  sum(<fact_col>) <br></br>from ... <br></br>group by 1</code></pre> | User-level revenue, minutes streamed, etc. |
| Unique Entities | Percent of entities with at least 1 non-null fact value  | <pre><code>select <br></br>  distinct <entity_id> <br></br>from ... <br></br>where <fact_col> is not null </code></pre> | Percent of users that reached check out, engaged with feature, etc.|
| Count | Count of non-null fact values per entity  | <pre><code>select <br></br>  <entity_id>, <br></br>  count(<fact_col>) <br></br>from ... <br></br>group by 1</code></pre> | Orders placed, videos watched, etc. |
| Count Distinct | Distinct non-null fact values observed per entity (use this to count the number of unique values in a field other than the entity_id)  | <pre><code>select <br></br>  <entity_id>, <br></br>  count(distinct <fact_col>) <br></br>from ... <br></br>group by 1 </code></pre> | Number of distinct videos watched per user, distinct products viewed, etc. If a user watches the same video twice, it will only count once |
| Retention | The proportion of entities with at least one occurrence of the fact X days after assignment, limited to entities assigned at least X days ago* | <pre><code>select <br></br>  distinct <entity_id>, <br></br>from ... <br></br>where fact_ts >= <br></br>  assignment_ts + 7 days  <br></br>and assignment_ts < <br></br>  current_date - 7 days </code></pre> | Percent of users who visit a website at least 7 days after being assigned to the experiment |
| Conversion | The proportion of entities with at least one occurrence of the fact within a set time window of assignment | <pre><code>select <br></br>  distinct <entity_id> <br></br>from ... <br></br>where fact_ts <= <br></br>  assignment_ts + 7 days </code></pre> | Percent of users who sign up for a free trial within 7 days of being assigned to the experiment |
| Threshold | The proportion of entities with a sum or count above a specified threshold | <pre><code>select <br></br>  distinct <entity_id> <br></br>from ... <br></br>group by <entity_id> <br></br>having sum(<fact_col>) > 3 </code></pre> | Percent of users that spent more than $100 within 7 days of assignment into the experiment |

\*Only entities that were assigned at least X days ago are included in both numerator and denominator. Those assigned within the last X days cannot yet have retained, by construction. For those the numerator is always 0, and including them would make retention appear artificially low.

### Time frames

Eppo allows you to further refine metrics by adding a time frame. For example, we may be interested in a metric that only considers purchases within one week of the user's assignment to an experiment.

![Adding a time frame to a metric](/img/data-management/metrics/create-metric-timeframe.png)

:::note
Consider adding a timeframe metric to experiments where you believe the intervention has a short term effect.
For example, sending a promotional email may boost engagement for one week. If the experiment runs for 4 weeks, adding a timeframe to the metric prevents that one week of boosted engagement from being diluted.
:::

### Metric properties

Metric properties allow you to filter events based on [properties associated with the fact](/data-management/properties#metric-properties).
For example, a streaming platform may run an experiment with watch time as the primary metric. We may be interested in understanding the impact not just on total watch time, but also on movie watch time and series watch time separately. In this case, you can add show type as a property on the Fact SQL and create separate metrics for movies and shows.

To apply a property filter, select **Specify metric properties**, select the property of interest, and the specific values of interest. Eppo will run a scheduled job to determine the different values a property may take, but if your specific value is not yet available, you can add it manually.
![Adding a metric property](/img/data-management/metrics/create-metric-property.png)

### Outlier handling

Eppo handles outliers through a technique called [winsorization](/guides/running-well-powered-experiments#handling-outliers-using-winsorization). The percentiles used for lower and upper bounds can be configured per metric. For example, in the screenshot below, we are setting the upper bound for winsorization at the 99.9th percentile. This means that any user with a value above the 99.9th percentile will be replaced with the 99.9th percentile value.

Note that winsorization is only available for `SUM`, `COUNT`, and `COUNT DISTINCT` aggregations. This is because conversion and retention metrics are binary variables that are not prone to influence from outliers. As a result, winsorization is not needed for these metric types.

![Adding winsorization to a metric](/img/data-management/metrics/create-metric-outliers.png)

### Set a default precision target

[Precision](/experiment-analysis/progress-bar#precision) refers to the uncertainty within which you want to measure (i.e., the width of confidence intervals). You can set a default at the metric level, which will be used to measure an experiment's [progress](/experiment-analysis/progress-bar). Note that this default can be overridden at the experiment level.

### Set formatting options

Finally, you can select how the metric should be formatted: as a number or as a percentage.
