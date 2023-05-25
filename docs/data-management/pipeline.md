---
sidebar_position: 6
---

# Data pipeline

At a high level, the Eppo data pipeline performs four major steps when processing your data for experiment analysis:

1. [Clean up assignment data](#clean-up-assignment-data)
2. [Join assignment and event data](#join-assignment-and-event-data)
3. [Summarize metrics at the subject level](#summarize-metrics-at-the-subject-level)
4. [Summarize metrics at the experiment variant level](#summarize-metrics-at-the-experiment-variant-level)

Each experiment configured in Eppo will generate it's own set of tables in the Eppo-scratch schema in your data warehouse.

![Pipeline visualization](/img/building-experiments/experiment-pipeline.png)

## Clean up assignment data

The first step in the Eppo data pipeline is to clean up the data contained in the AssignmentSource SQL. In this step, we remove duplicate assignment events and "dirty" users who have been assigned to more than one variant of your experiment. These “mixed-group” users have likely been exposed to both variants, and cannot be used as part of the analysis.

This will generate a table in the Eppo-scratch schema of your data warehouse named something like `g_assignment_source_*`. Note that in this step, we compute assignment events across all experiments, so that we only read the (often large) assignment tables once.

## Join assignment and event data

Once we have cleaned the assignment data, we update each running experiment independently.
First, we determine which events occurred during the experiment period. To do this, Eppo does a `left join` from the Assignments computed above to your Fact SQLs on two conditions:

```sql
assignment.entity_id = fact.entity_id
AND
assignment.timestamp <= fact.timestamp
```

This generates a table, `g_experiment_enriched_metric_events_*` that includes the variant that each entity was assigned to, and all metric events that the entity generated that occurred after they were assigned to the experiment. We also make sure we only consider assignments and events in the relevant analysis windows. This ensures that we are restricting our calculations to the time period for which we are certain the experiment had an effect.

## Summarize Metrics at the Subject Level

After the Assignment/Event join, Eppo aggregates data at the subject level. For each subject, we compute the cumulative value for each metric of interest. This subject level aggregation is done mainly for two reasons:

1. By aggregating data at the subject level first, we are able to reduce the size of data before applying joins to Dimension SQLs in order to compute dimensional cuts.
2. Eppo applies [Winsorization](https://en.wikipedia.org/wiki/Winsorizing) at the 99th percentile to reduce the impact of outliers on experiment results. _Note that this may cause results from Eppo’s data pipeline to differ from simple aggregates, especially if your metrics have heavy skew._

The output of this step has the following schema:

| Experiment | Variant | Subject ID | Assigned Timestamp | Aggregation Name | Aggregation Value |
| ---------- | ------- | ---------- | ------------------ | ---------------- | ----------------- |

We calculate the cumulative experiment results of your experiment on each day the experiment has been running, so the final output table, `g_experiment_subject_summaries_*` contains a row like the above for each subject on each day for which that subject was in the experiment.

## Summarize Metrics at the Experiment Variant Level

The final step is to aggregate data to the experiment variant level. After this stage, individual experiment subjects are no longer visible in the data. This aggregated data is then transferred to Eppo’s database, where the Statistics engine is able to generate confidence intervals and serve low-latency results to the frontend.

The output of this step has the following schema:

| Experiment | Variant | Dimension Name | Dimension Value | Assigned Count | Aggregation Name | Aggregation Sum | Aggregation Sum of Squares |
| ---------- | ------- | -------------- | --------------- | -------------- | ---------------- | --------------- | -------------------------- |

The above table can be found in the Eppo-scratch dataset with the name `g_experiment_dimensionalized_summaries_*`

## CUPED pipeline

If CUPED is enabled, we run additional tasks to compute the CUPED models. First, we extract pre-experiment data that is used as input to the CUPED models. We look at pre-experiment events for all sum, count, and count distinct metrics that have been added to an experiment, as well as assignment dimensions.

The resulting table with features can be found in the `g_experiment_subject_features_experiment_*` tables.

We then combine data from `g_experiment_subject_features_*` and `g_experiment_subject_summaries_*` to compute CUPED estimates in a Python process. The resulting CUPED estimates are written to `g_experiment_cuped_test_statistics_*`. This latter table is then transferred to Eppo's database, where the Statistics engine is able to generate CUPED confidence intervals and serve low-latency results to the frontend.
