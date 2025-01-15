---
sidebar_position: 4
---

# Facts

## Introduction

**Fact SQL Definitions** are short SQL snippets that tell Eppo how to use the data in your data warehouse. When you create [metrics](/data-management/metrics/) in Eppo, you specify one (or more) facts and an aggregation method. For instance, if you have a fact `revenue`, you could have a metric `Total Revenue` that computes the sum of revenue facts.

Eppo uses these SQL snippets to compile a data pipeline that performs the specified aggregations and uses Eppo's stats engine to measure experiments' impact.

At a minimum, a Fact SQL Definition needs to return a timestamp and a column to join to [assignment records](/data-management/definitions/assignment-sql) (for instance, `user_id`). That said, Fact SQL Definitions can point at anything from simple raw event logs to fully modeled aggregated data. One Fact SQL Definition can also contain multiple facts. For instance, a purchases table might contain a `gross_revenue` fact and a `net_revenue` fact.

## Fact table schema

Each Fact SQL Definition should return the following columns. Note that the specific names of these columns do not matter as you will map them into Eppo's data model when you create the fact definition.

|           | Description| Examples |
|-----------|------------|--------|
| Timestamp | The time at which the event occurred, or the time dimension for aggregated data                            | `event_timestamp` , `session_timestamp` , `daydate` |
| Entity ID | An ID for joining to assignment SQL sources. You can add multiple of these if the fact corresponds to multiple entities. | `user_id` , `device_id` , `company_id`|
| Fact value (optional) | A numeric quantity associated with the fact. You can add several if an event has multiple associated values (e.g., net revenue and gross revenue) | `gross_revenue` , `items_added_to_cart` , `support_ticket_count` |
| Fact property (optional) | A categorical variable associated with the event. This can be used to filter events in metric creation, or to break out experiment results. Note that properties that are 1:1 with experiment subjects should be defined in an [Assignment](/data-management/definitions/assignment-sql) or [Entity Property](/data-management/definitions/property-sql) SQL definition. | `revenue_category` , `support_ticket_reason` , `event_name` |
| Partition date (optional) | An optional additional timestamp for filtering rows with a column other than the event timestamp. Useful if your event timestamp column differs from the table's partition timestamp column. See [here](/data-management/warehouse-best-practices/#leveraging-partitioning) for more information about leveraging partitioning. | `date` |

:::info
Partition date columns are disabled by default. If you would like to enable them, please reach out to your Eppo point of contact or email support@geteppo.com. Enabling this feature will have no impact on billing.
:::

## Creating a Fact SQL

There are two ways to create Fact SQL Definitions in Eppo:

1. Adding them via the SQL definition UI.
2. Defining in code and integrating with Eppo's metric sync API.

When first familiarizing yourself with Eppo's fact-metric model, we recommend starting with UI-defined fact sources. Facts (and associated metrics) can later be [exported as code](/data-management/certified-metrics/upgrading-metrics/) and managed within a source-control system like GitHub.

### Defining in the UI

1. Navigate to **Definitions**, click **Create Definition SQL**, and select **Create Fact SQL**

![Create SQL Definition](/img/building-experiments/create-definition-sql.png)

2. Enter a name for the Fact SQL
3. Write SQL that returns the fact source and hit **Run**
4. Map entity IDs and timestamp columns

![Create Fact SQL](/img/building-experiments/create-fact-sql.png)

#### Adding Facts

Once entity IDs and timestamps have been added, click "Add Fact" to map fact value columns. If each row should be treated as one event, select `Each Record` instead of a column name.

:::note
Fact columns should either be numeric (to support metric aggregations such as SUM) or a string (to support metric aggregations such as COUNT DISTINCT).
If the desired metric is a count of records, conversion rate, or a retention rate, consider using `Each Record` rather than a specific column.
:::

When adding Facts, you can also add a description and the fact's desired change. This will determine whether statistically significant increases in the fact will be highlighted in green or red. For example, support tickets or model timeouts should have desired change set to "Decreasing".

![Create Fact](/img/building-experiments/add-fact-sql-fact.png)

:::note
You must add at least one fact before you can save the Fact SQL definition.
:::

#### Adding Fact Properties (optional)

If your facts have properties that you'd like to use either to filter events, or split experiment results, you can add them to the Fact SQL definition.

Note that only properties that are many-to-one with experiment subjects (e.g., users) should be included in the Fact SQL definition. Properties that are one-to-one with experiment subjects should be added to an Entity Properties SQL (if the properties are static), or to and Assignment SQL (if they vary over time).

You can read more about Fact Properties on the [Properties](/data-management/definitions/properties#metric-properties) page.

![Create Property](/img/building-experiments/add-fact-sql-property.png)

Once you have finished defining your Fact SQL, click **Save & Close**. You can now repeat this process for other fact tables, or continue on to create [Metrics](https://docs.geteppo.com/metric-quickstart) from your new Facts.

#### Adding Partition Keys (optional)
If your table is partitioned on a different column than the event timestamp (i.e. event date), Eppo can leverage the partition column to create more efficient queries.

To specify a partition key, map the column to the Partition Date field.

![Partition Date](/img/data-management/best-practices/partition_date.png)

:::info
Partition dates are disabled by default, if you'd like to enable them in your workspace, please reach out to your Eppo representative or email us at support@geteppo.com.
:::

### Defining template variables

If you need to reduce the volume of data the data warehouse needs to process, you can incorporate analysis-specific variables into your Fact SQL. When the experiment pipeline runs, it will filter the query to the date range specified in the analysis set up.

Supported variables:
- `{{analysis_start_datetime}}` - The ‘event data from’ date in the ‘Analysis Set Up’,
- `{{analysis_end_datetime}}` - The ‘event end date’ date in the ‘Analysis Set Up’,

#### Example

```sql
select * from analytics.reviews
where event_timestamp BETWEEN `{{analysis_start_datetime}}` AND `{{analysis_end_datetime}}`
```

### Defining in code

You can also chose to define Fact SQL Definitions in code and then sync to Eppo via Eppo's metric sync API. For more details, see the [Certified Metrics](/data-management/certified-metrics/) section.

## Common examples

### Data mart tables

If you have well established analytic data models in your warehouse, you can create a Fact SQL Definition based on that table. For instance, imagine you work at a ride share app and have a table tracking reviews. The mapping into Eppo might look something like:

```
select * from analytics.reviews
```

| Column | Type in Eppo |
|--------|--------------|
| `created_at` | Timestamp |
| `driver_id` | Entity ID |
| `passenger_id` | Entity ID |
| `review_rating` | Fact value |
| `review_has_photo` | Fact property |
| `review_is_disputed` | Fact property | 

Since we've added multiple entity columns, this table will be able to power metrics for both passenger-randomized and driver-randomized experiments. We'll be able to create metrics based on both the number of rows in this table (i.e., the number of reviews) and the average rating. We'll also be able to leverage fact properties to build metrics like "Reviews with Dispute", and break out measurements by whether the review had a photo.

### Event stream data

Next, imagine you are working at an ecommerce website and have a log of every button click on the site. This data might look something like this in Eppo's data model:

| Column | Type in Eppo |
|--------|--------------|
| `user_id` | Entity ID |
| `event_timestamp` | Timestamp | 
| `event_name` | Fact property |

In this case, you could have many different `event_name` values corresponding to different buttons in your app. By marking `event_name` as a fact property, you can filter metrics to look at specific button clicks (for instance, add to cart clicks).

### Pre-aggregated data

Finally, some companies may have very large data sources and prefer to pre-aggregate data upstream of Eppo. For instance, instead of pointing Eppo at a raw event stream, you might aggregate data by session and point Eppo at that instead. 

| Column | Type in Eppo |
|--------|--------------|
| `session_id` | (not used) |
| `session_start_timestamp` | Timestamp | 
| `user_id` | Entity ID |
| `pages_viewed` | Fact value |
| `items_added_to_cart` | Fact value |
| `purchase_revenue` | Fact value |

Some companies may instead aggregate data by day instead of session, which would look similar to the example above, just with `date` as the Timestamp instead of `session_start_timestamp`.


:::info
If you opt to use aggregated data as facts, make sure that assignment data timestamp is truncated to the same grain. When the Eppo pipeline runs, it will filter to facts that occur after the first observed assignment for a given subject (e.g., user). If the fact timestamp is truncated to the day (or to session start), but the assignment timestamp is not, it may lead to some events being lost in the analysis. This is easily solved by also truncating the assignment timestamp to the same grain (date, session start, etc.).
:::

## Updating Facts

You can update facts by clicking the `Edit` button to access the Fact SQL. At this point you can edit the SQL as you like, but the mapping fields will be locked down until the SQL is validated with a run.

Pressing the `Run` button will enable the mapping fields. Click `Save & Close` button to save any changes made in either the SQL or mapping.

:::note
Any running experiments with metrics based on the updated Fact SQL will automatically fully refresh those metrics on the next experiment update.
:::

## Deleting Facts

You can delete a Fact SQL as well as individual Facts. First, access the Fact SQL by clicking the `Edit` button. 

To delete the Fact SQL, click `Delete Fact SQL` from the overflow menu.

To delete an individual Fact, press the `Run` button to unlock the mapping fields. Then click into the Fact you wish to remove and press `Delete`. Finally, press `Save & Close` to save your action.

If either type of delete action will impact existing metrics or experiments, a confirmation modal will appear detailing the metrics and experiments impacted.

![Delete fact confirmation](/img/data-management/best-practices/delete_fact.png)
