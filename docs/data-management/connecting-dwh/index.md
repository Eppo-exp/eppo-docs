# Connecting Eppo to your data warehouse

Eppo never stores raw data and instead directly uses data that lives in your data warehouse. This section provides instructions on connecting to warehouses currently supported by Eppo.

In each case, a service account is used to connect Eppo to your warehouse. This service account needs read access for data relevant to experimentation and write access to an output schema.

Specifically Eppo needs to read:
* [Assignment logs](/data-management/definitions/assignment-sql) - logs of every time a subject was enrolled into an experiment, the name of that experiment, and the variant that was assigned
* [Fact events](/data-management/definitions/fact-sql) - logs of metric events to analyze in Eppo by subject
* [Properties](/data-management/definitions/property-sql) - subject-level tables of properties that do not change as a result of experiments
* [Entry points](/statistics/sample-size-calculator/setup/#defining-an-entry-point) - logs of events that correspond to an “entry” into the experiment

Eppo writes experiment results along with intermediate tables used to calculate those final results. Please visit the [data pipeline page](/data-management/data-pipeline) to learn more about how the pipeline works and the intermediate tables we write to your data warehouse.

## Warehouse specific instructions
- [BigQuery](/data-management/connecting-dwh/bigquery)
- [Databricks](/data-management/connecting-dwh/databricks)
- [Redshift](/data-management/connecting-dwh/redshift)
- [Snowflake](/data-management/connecting-dwh/snowflake)
