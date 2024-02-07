---
sidebar_position: 3
---

# Warehouse best practices

Eppo sits on top of your data warehouse, allowing you to run automated experimentation analyses with data you know and trust. To do this properly, Eppo expects your data to be formatted in a certain way. Fortunately, these expectations are very simple and are designed to require very little, if any, preparatory work on the user’s side.

Furthermore, while SQL based approach can be very flexible, not all SQL queries are the same: efficient SQL queries can drastically reduce the time it takes to refresh experiments.

## Minimum Requirements

Eppo requires, at a minimum, a table containing a record of every user’s assignment into an experiment and a separate table (or tables) featuring user events that metrics can be calculated from.

The assignment table should include a column specifying the unique identifier for the user, the experiment or feature flag the user saw, the variant they were shown, and the timestamp they saw all of this. Immediately below, we can see an example table with the required columns.

![Assignment Table Example](/img/warehouse-tables/assignment_source.png)

The event tables should have a timestamp associated with the time the event occurred, the unique identifier associated with the user who performed the action, and any columns that aggregations need to be performed on top of to create a metric. For example, in the screenshot below, a purchase_value column indicates the value of the purchase made by the user and will be used to create metrics like Total Value of Goods Purchased.

![Fact Source Example](/img/warehouse-tables/fact_source.png)

## Efficient computations

Eppo allows users to create SQL definitions using custom SQL. This means joins, aggregations, and window functions can all be utilized with the SQL definition layer. This enables a large amount of flexibility.

However, it is important to consider the implications of performing complex logic within the SQL definition layer. This query will be executed anytime an experiment is refreshed. Accordingly, these complex joins and aggregations will be executed for every experiment separately. So, if for example, you had 10 active experiments all utilizing the same assignment SQL definition, Eppo would run the same query ten times to wrangle assignment data.

### Push complex logic to the transformation layer

For optimal performance, it is recommended to move any complex logic to the transformation layer of your data warehouse as an incremental model. By doing so, the computationally intensive aggregations and joins will only be executed once during each incremental model build.

In addition to efficiency gains, this approach offers the benefit of an additional layer of version control for your SQL definitions. If users wish to modify these definitions, they will need to follow the established internal processes for altering models in the data transformation layer.

Once this model is built and maintained within the transformation layer, you can simply reference it in your Eppo SQL statements using `SELECT * FROM transformed.model`. Eppo will then query the pre-built table without performing any calculations, resulting in significant efficiency improvements.
