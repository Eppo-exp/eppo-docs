---
slug: /setup-quickstart
sidebar_position: 1
---

# Initial setup

This page walks through the initial setup of your Eppo instance. In this guide, you'll learn how to access Eppo, connect your data warehouse, create your first entity, and connect historical experiment assignment logs.

## 1. Log in to Eppo

Eppo can be accessed at [eppo.cloud](http://eppo.cloud). You can sign in with any of the providers that Auth0 supports, including Google SSO. If your company does not yet have an Eppo instance, please contact us at [support@geteppo.com](mailto:support@geteppo.com).

## 2. Connect your data warehouse

Eppo uses your data warehouse to host all experimentation data. This means that you have full control over your data and full visibility into how Eppo calculates results. To connect your data warehouse, please see read the relevant guide below:

- [Snowflake](/how-tos/connecting-dwh/snowflake)
- [Databricks](/how-tos/connecting-dwh/databricks)
- [BigQuery](/how-tos/connecting-dwh/bigquery)
- [Redshift](/how-tos/connecting-dwh/redshift)

## 3. Create an Entity

Entities specify the different subjects on which you plan to run experiments. Common examples include users, anonymous IDs, or organizations. To create an Entity, navigate to the [definitions page](https://eppo.cloud/definitions), click **Manage Entities** in the top right corner, and then click **+Create Entity**. You can name the entity anything relevant to your business. To learn more about entities see [this page](/data-management/entities/).

![Create Entity](/img/initial-setup/quick-start-1.png)

## 4. Create an Assignment SQL definition (optional)

At the core of Eppo's data model is a log of every time a subject (e.g., user) was assigned to an experiment and which variant they received. If you have past experiments you would like to add to Eppo, you can create an Assignment SQL definition and specify where this data lives in your data warehouse. If you have not run an experiment before, see our [Feature Flagging quickstart](/feature-flag-quickstart) to implement your first randomized experiment.  

To add historical experiments, navigate to the **Assignments** section on the **Definitions** tab and click **+Create Assignment Table**. Give the Assignment SQL a name (e.g., "Historical Experiment Assignments") and enter some SQL to return the following fields from your data warehouse:

1. A unique identifier tied to the [entity](/data-management/entities) you created (e.g., `user_id`)
2. A unique identifier for the experiment that the subject (user) was enrolled into
3. The variant the subject (user) received
4. A timestamp associated with assignment into the experiment
5. (Optional) any properties about the user that you would like to use to break out experiment results (country, browser, user persona, etc.)

![Create Assignment SQL](/../static/img/initial-setup/quick-start-2.png)

Once this query has been written, pull in a sample data set by clicking **Run** and tell Eppo how to use the columns in the right panel.

You can read more about Assignment SQL Definitions [here](/data-management/definitions/assignment-sql).

Congratulations, you've completely the initial set up of Eppo! Next, check out our [metric](/metric-quickstart) and [feature flag](/feature-flag-quickstart) quickstart guides.
