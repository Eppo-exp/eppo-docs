---
sidebar_position: 1
id: what-is-eppo
---

# What is Eppo?

Eppo is a next-generation experimentation platform build right on top of your data warehouse.

![What is Eppo Gif](../static/img/building-experiments/what-is-eppo.gif)

# How Eppo works

![How Eppo Works](../static/img/building-experiments/how-eppo-works.png)

There are five pieces to Eppo:

1. **Use your feature flagging tool of choice to generate experiment data into your data warehouse**

2. **Connect your data warehouse**

   Currently Eppo supports:

- [Snowflake](./connecting-your-data/data-warehouses/connecting-to-snowflake)
- [Redshift](./connecting-your-data/data-warehouses/connecting-to-redshift)
- [BigQuery](./connecting-your-data/data-warehouses/connecting-to-bigquery)

3. **Build your experiments by writing SQL**

4. **Monitor your experiments' progress**

5. **Explore and share experiment results**

# Getting started resources

- [10 minute quickstart to getting up and running with Eppo](./quickstart.md)
- [From feature flag to data warehouse](./feature-flagging/index.md)
- [Connect your data warehouse to Eppo](./connecting-your-data/data-warehouses/connecting-to-bigquery)
- [How the Eppo data pipeline works](./building-experiments/eppo-data-pipeline)
