# Eppo Data Pipeline

At a high level, the Eppo data pipeline performs three major steps when processing your data for experiment analysis:

1. [Join assignment and event data](#join-assignment-and-event-data)
2. [Summarize metrics at the subject level](#summarize-metrics-at-the-subject-level)
3. [Summarize metrics at the experiment variant level](#summarize-metrics-at-the-experiment-variant-level)

## Join assignment and event data

The first step in the Eppo data pipeline is to determine which events occurred during the experiment period. To do this, Eppo does a left join from your Assignment SQL to your Fact SQLs on two conditions:

```sql
assignment.entity_id = fact.entity_id
AND
assignment.timestamp <= fact.timestamp
```

This generates a table that includes the variant that each entity was assigned to, and all metric events that the entity generated that occurred after they were assigned to the experiment.

This ensures that we are restricting our calculations to the time period for which we are certain the experiment had an effect.

Eppo applies the following transformations to ensure the integrity of results:

- De-duplicate rows in the Assignment SQL. If an entity has many rows in the Assignment SQL for the same variant, then we only consider the earliest instance.
- Discard any entities that appear in more than one variant of an experiment. These “mixed-group” users have likely been exposed to both variants, and cannot be used as part of the analysis.
- Restrict the time range of both Assignment SQL and Fact SQLs to within the Experiment start and end date

## Summarize Metrics at the Subject Level

After the Assignment/Event join, Eppo aggregates data at the subject level. For each subject, we compute the cumulative value for each metric of interest. This subject level aggregation is done mainly for two reasons:

1. By aggregating data at the subject level first, we are able to reduce the size of data before applying joins to Dimension SQLs in order to compute dimensional cuts.
2. Eppo applies [Winsorization](https://en.wikipedia.org/wiki/Winsorizing) at the 99th percentile to reduce the impact of outliers on experiment results. _Note that this may cause results from Eppo’s data pipeline to differ from simple aggregates, especially if your metrics have heavy skew._

The output of this step has the following schema:

| Experiment      | Variant | Subject ID | Assigned Timestamp | Aggregation Name | Aggregation Value |
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |


## Summarize Metrics at the Experiment Variant Level

The final step is to aggregate data to the experiment variant level. After this stage, individual experiment subjects are no longer visible in the data. This aggregated data is then transferred to Eppo’s database, where the Statistics engine is able to generate confidence intervals and serve low-latency results to the frontend.

The output of this step has the following schema:

| Experiment      | Variant | Dimension Name | Dimension Value | Assigned Count | Aggregation Name | Aggregation First Moment (Sum) | Aggregation Second Moment (Sum of Squares)|
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |