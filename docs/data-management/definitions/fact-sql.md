---
sidebar_position: 4
---

# Facts

Fact SQL queries define the metric events to analyze in Eppo. Each Fact SQL should return the following columns:

1. **Entity ID(s)** - a set of entity-level identifiers used to join to assignment logs. Examples include `user_id`, `company_id`, or `anonymous_id`.
2. **Timestamp** - the timestamp that the event occurred.
3. **Fact Values (optional)** - Optional values associated with the event (revenue amount, minutes watched, etc.).
4. **Fact Properties (optional)** - Optional properties associated with the event (`purchase_type`, etc.). Note that properties that are 1:1 with subjects should be defined in the [Assignment](/data-management/definitions/assignment-sql) or [Entity Property](/data-management/definitions/property-sql) SQL definition.


## Creating a Fact SQL

1. Navigate to **Definitions**, click **Create Definition SQL**, and select **Create Fact SQL**

![Create SQL Definition](/img/building-experiments/create-definition-sql.png)

2. Enter a name for the Fact SQL
3. Write SQL that returns the fact source and hit **Run**
4. Map entity IDs and timestamp columns

![Create Fact SQL](/img/building-experiments/create-fact-sql.png)

## Adding Facts

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

## Adding Fact Properties (optional)

If your facts have properties that you'd like to use either to filter events, or split experiment results, you can add them to the Fact SQL definition.

Note that only properties that are many-to-one with experiment subjects (e.g., users) should be included in the Fact SQL definition. Properties that are one-to-one with experiment subjects should be added to an Entity Properties SQL (if the properties are static), or to and Assignment SQL (if they vary over time).

You can read more about Fact Properties on the [Properties](/data-management/definitions/properties#metric-properties) page.

![Create Property](/img/building-experiments/add-fact-sql-property.png)

Once you have finished defining your Fact SQL, click **Save & Close**. You can now repeat this process for other fact tables, or continue on to create [Metrics](https://docs.geteppo.com/metric-quickstart) from your new Facts.

## Adding Partition keys (optional)
If your table has a partition on a different column other than the event timestamp (i.e. event date), Eppo can use it for filtering queries more efficiently. 

To specify a partition key, map the column to the Partition Date field.

![Partition Date](/img/data-management/best-practices/partition_date.png)

:::info
Partition dates are disabled by default, if you'd like to enable them in your workspace, please reach out to your Eppo representative or email us at support@geteppo.com.
:::
