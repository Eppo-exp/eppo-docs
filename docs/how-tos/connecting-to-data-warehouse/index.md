# Connecting Eppo to your data warehouse

Eppo never stores raw data and instead directly uses data that lives in your data warehouse. This section provides instructions on connecting to warehouses currently supported by Eppo.

In each case, a service account is used to connect Eppo to your warehouse. This service account needs read access for data relevant to experimentation (assignment logs, fact events, etc.) and write access to an output schema. 

See below for warehouse-specific instructions:

1. [Snowflake](connecting-to-snowflake)
2. [Redshift](connecting-to-redshift)
3. [BigQuery](connecting-to-bigquery)
4. [Databricks](connecting-to-databricks)