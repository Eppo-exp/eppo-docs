---
slug: /setup-quickstart
sidebar_position: 2
---

# Workspace setup

This page walks through the initial setup of your Eppo instance. In this guide, you'll learn how to access Eppo, connect your data warehouse and create your first entity.

### 1. Log in to Eppo

Eppo can be accessed at [eppo.cloud](http://eppo.cloud). You can sign in with any of the providers that Auth0 supports, including Google SSO. If your company does not yet have an Eppo instance, please contact us at [support@geteppo.com](mailto:support@geteppo.com).

### 2. Connect your data warehouse

Eppo uses your data warehouse to host all experimentation data. This means that you have full control over your data and full visibility into how Eppo calculates results. To connect your data warehouse, please see read the relevant guide below:

- [Snowflake](/data-management/connecting-dwh/snowflake)
- [Databricks](/data-management/connecting-dwh/databricks)
- [BigQuery](/data-management/connecting-dwh/bigquery)
- [Redshift](/data-management/connecting-dwh/redshift)

### 3. Create an Entity

Entities specify the different subjects on which you plan to run experiments. Common examples include users, anonymous IDs, or organizations. To create an Entity, navigate to the [definitions page](https://eppo.cloud/definitions), click **Manage Entities** in the top right corner, and then click **+Create Entity**. You can name the entity anything relevant to your business. To learn more about entities see [this page](/data-management/definitions/entities/).

![Create Entity](/img/initial-setup/quick-start-1.png)

Congratulations, you've completely the initial set up of Eppo! Next, check out our quick start guides on [creating your first metric](/metric-quickstart) and [running your first experiment](/feature-flag-quickstart).
