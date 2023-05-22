---
sidebar_position: 1
id: what-is-eppo
slug: /
---

# What is Eppo?

Eppo is a next-generation feature flag and experimentation platform built right on top of your data warehouse:

![What is Eppo Gif](../static/img/building-experiments/what-is-eppo.gif)

We offer companies an end-to-end suite of experimentation tools, but let you decide which ones are right for you. Here are a few common ways teams use Eppo:

- For [**experiment analysis**](./experiment-quickstart) alongside another feature flagging tool such as LaunchDarkly.
- For [**feature flagging**](./feature-flag-quickstart) without experimentation.
- As an [**end-to-end experimentation platform**](./feature-flags/use-cases/experiment-assignment) - both feature flagging and analysis.

<br />

# How experiment analysis works

Eppo's analysis is built on top of your data warehouse. Concretely, this means experiment results are computed within the warehouse without data ever leaving your system. As part of that process, intermediate and aggregate tables are always available in the warehouse for you to audit. In Eppo business metrics are defined in SQL, the same definitions that you use for business reporting.

![How Eppo Works](../static/img/building-experiments/how-eppo-works.png)

Generating an experiment report on Eppo involves five pieces:

1. Use your feature flagging tool of choice to send experiment assignments into your data warehouse.
2. Connect Eppo to your data warehouse. Currently Eppo supports [Snowflake](../experiments/prerequisites/connecting-to-data-warehouse/connecting-to-snowflake), [Redshift](../experiments/prerequisites/connecting-to-data-warehouse/connecting-to-redshift), [BigQuery](../experiments/prerequisites/connecting-to-data-warehouse/connecting-to-bigquery), and [Databricks](../experiments/prerequisites/connecting-to-data-warehouse/connecting-to-databricks).
3. Annotate experiment assignments and event streams by writing short SQL snippets.
4. Monitor your experiments' progress.
5. Explore and share experiment results.

<br />

# Getting started resources

- [Your first experiment analysis](./experiment-quickstart)
- [Connect your data warehouse to Eppo](experiments/prerequisites/connecting-to-data-warehouse/connecting-to-bigquery.md)
- [How the Eppo data pipeline works](./experiments/building-experiments/eppo-data-pipeline)
