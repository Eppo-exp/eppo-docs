# Warehouse Table Best-Practices

Eppo sits on top of your data warehouse, allowing you to run automated experimentation analyses with data you know and trust. To do this properly, Eppo expects your data to be formatted in a certain way. Fortunately, these expectations are very simple and are designed to require very little, if any, preparatory work on the user’s side. 

## Minimum Requirements

Eppo requires, at a minimum, a table containing a record of every user’s assignment into an experiment and a separate table (or tables) featuring user events that metrics can be calculated from. 

The assignment table should include a column specifying the unique identifier for the user, the experiment or feature flag the user saw, the variant they were shown, and the timestamp they saw all of this. Immediately below, we can see an example table with the required columns.

![Assignment Table Example](/img/warehouse-tables/assignment_source.png)

The event tables should have a timestamp associated with the time the event occurred, the unique identifier associated with the user who performed the action, and any columns that aggregations need to be performed on top of to create a metric. For example, in the screenshot below, a purchase_value column indicates the value of the purchase made by the user and will be used to create metrics like Total Value of Goods Purchased. 

![Fact Source Example](/img/warehouse-tables/fact_source.png)

## Efficiency Considerations

Eppo allows users to create SQL definitions using custom SQL. This means joins, aggregations, and window functions can all be utilized with the SQL definition layer. This enables a large amount of flexibility. 

However, it is important to consider the implications of performing complex logic within the SQL definition layer. This query will be executed anytime an experiment is refreshed. Accordingly, these complex joins and aggregations will be executed for every experiment separately. So, if for example, you had 10 active experiments all utilizing the same assignment SQL definition, Eppo would run the same query ten times to wrangle assignment data. 

## Alternative Options

If efficiency is of concern, it is recommended that any complex logic be pushed up into your data warehouse’s transformation layer as an incremental model. By doing so, the complex aggregations and joins will only be performed once per incremental model build. 

Outside of gains in efficiency, this approach will also provide an extra layer of version control for your SQL definitions. If users want to alter these definitions, they’d need to go through whatever internal processes exist for altering models in the data transformation layer. 

Once this model is built and maintained within the transformation layer, a SQL definition can simply reference this model with a  `select * from transformed.model` SQL statement within Eppo. Eppo will then query the pre-built table, performing no calculations, providing large gains in efficiency.