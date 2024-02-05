# Connecting Eppo to your data warehouse

Eppo never stores raw data and instead directly uses data that lives in your data warehouse. This section provides instructions on connecting to warehouses currently supported by Eppo.

In each case, a service account is used to connect Eppo to your warehouse. This service account needs read access for data relevant to experimentation (assignment logs, fact events, etc.) and write access to an output schema.

See below for warehouse-specific instructions:

- [BigQuery](/guides/connecting-dwh/bigquery)
- [Databricks](/guides/connecting-dwh/databricks)
- [Redshift](/guides/connecting-dwh/redshift)
- [Snowflake](/guides/connecting-dwh/snowflake)
