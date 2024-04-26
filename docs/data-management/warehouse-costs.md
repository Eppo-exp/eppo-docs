---
sidebar_position: 10
---


# Warehouse best practices

As a warehouse native product, Eppo takes managing warehouse costs seriously. While Eppo's SQL-based approach makes integration easy, transparent, and secure, it also means that configuring Eppo properly is important to avoid increasing your warehouse bill.

This page outlines some best practices to help keep Eppo's pipeline as lightweight as possible.

## Data modeling

Eppo's SQL editor makes it easy to quickly pilot new SQL logic, but in the steady state all complex logic (joins, aggregations, etc.) should happen upstream of Eppo in your data warehouse's transformation layer. In Eppo, the SQL should then be a simple `SELECT ... FROM` statement (just make sure the table is materialized as table and not a view). 

By materializing data upstream of Eppo, you can avoid having Eppo perform complex joins and aggregations separately for each experiment. Simple `WHERE` statements are typically fine to include in Eppo, just avoid `JOIN` and `GROUP BY`. 

### One metric table vs many

The most intensive part of the experiment pipeline is often joining assignments to facts (metric events). By consolidating multiple metric events into one pre-computed table, you can reduce the number of times that Eppo has to perform this join.

```sql
SELECT 
  ...
FROM assignments AS a
LEFT JOIN facts AS f
  ON f.subject_id = a.subject_id
 AND f.timestamp >= a.timestamp
  ...
```

### Pre-aggregating data

If your metric sources are extremely large you might want to consider aggregating up to the subject-day grain (e.g., daily user values) before adding to Eppo. If you do opt to do this, make sure you truncate the assignment date to the start of the day as well so that the join above does not remove data from the day of assignment.

Pre-aggregating to the date level can reduce warehouse usage at the cost of minor dilution to metrics. Specifically, all events that happen on the day of assignment will be included, not just those after the subject is exposed to the experiment. Depending on your business and use cases, this may be a suitable tradeoff to make in order to drastically reduce warehouse costs.

## Configuring Eppo

In addition to passing in well-modeled data to Eppo, there are also decisions when configuring Eppo that can impact compute costs. This section talks through how to set up Eppo to ensure the pipeline is as efficient as possible.


### Setting up properties

In order to provide rapid exploration of experiment results, Eppo will pre-compute dimensional breakouts of metrics. This is typically more efficient than computing breakouts live as we can leverage pipeline incrementality and only run the computation once instead of each time a user explores data. That said, it is worth being mindful of how many properties are added to the platform. If there are properties that teams never use, it is better to omit them from Eppo SQL definitions.

It is also worth limiting the number of dimensions with very high cardinality (number of possible values). Two common approaches are to bucket to a higher granularity (instead of country, use region) or to group all but the 10 most common values into an "other" bucket.

Finally, Eppo supports adding properties on both entities and facts. Fact properties should only be used when the property value is not one-to-one with the experiment subject (e.g., user). Common examples include product type, support ticket reason, etc.


### Scheduling experiment refreshes

By default, Eppo will refresh results every 24 hours. If you have certain experiments that don't need daily results (for instance, long term marketing holdouts), consider adding a [custom schedule](/administration/experiment-schedule-settings). Eppo's incremental pipeline will automatically adjust to only scan data since the last scheduled run.

### Leverage partitioning 

Eppo never runs SQL definitions directly but rather uses them to compile a data pipeline that runs in your warehouse. Every query will be wrapped in a date filter to ensure Eppo only scans recent data:

```sql
select ...
  from (
    {{ your SQL definition}}
  )
 where {{selected timestamp column}} > current_date - 2
```
(A 2 day lookback is the default, your Eppo Support Engineer can configure a custom look back if desired)

If the event timestamp is the partition key, this naturally leads to efficient scans of your data. However, if the table is partitioned on a different column (for instance, event date), some SQL compilers will still scan the full table.

If you'd like to specify a separate column to use in filtering, you can add an optional "Partition Date" column on the SQL definition:

![Partition Date](/img/data-management/best-practices/partition_date.png)

:::info
Partition dates are disabled by default, if you'd like to enable them in your workspace, please reach out to your Eppo representative or email us at support@geteppo.com.
:::

## Monitoring

### Identifying problematic sources

When an experiment refresh fails or times out, Eppo will automatically [run diagnostics](/data-management/source-diagnostics) against the fact sources connected to the experiment to help identify poorly configured sources.

Your Eppo support team can provide a custom dashboard showing how long each source is taking to compute. This naturally highlights specific sources that either contain complex logic or do not fully leverage partitioning.

### Setting up notifications

Finally, you can subscribe to [Slack notifications](/administration/slack-notifications) for any time a data pipeline fails. If a SQL source is poorly configured, or an underlying data model changes, these notifications can help guarantee that the pipeline runs smoothly and within the timeout parameters configured within your data warehouse. 