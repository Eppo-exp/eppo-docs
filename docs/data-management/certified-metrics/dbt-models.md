---
sidebar_position: 3
---

# Syncing DBT Models

You can import existing DBT models as [Fact Sources](/data-management/definitions/fact-sql) by adding tags to your dbt configuration file. This helps Eppo stay in sync with changes in your DBT project.

:::info
This page discusses integrating with DBT models, not DBT's semantic layer. If you are interested in integrating with a semantic layer, please reach out to support@geteppo.com
:::

## Adding tags to DBT models

To specify a DBT model as an Eppo Fact Source, first add a tag `eppo_fact_source` to the model specification to indicate that the model should be interpreted as an Eppo Fact Source:

```yaml
version: 2

models:
  - name: revenue
    description: "Central Revenue Model"
    tags:
      - eppo_fact_source
```

Next, specify what columns correspond to timestamps, entities, facts, and properties using the corresponding tags:

```yaml
version: 2

models:
  - name: revenue
    description: "Central Revenue Model"
    tags:
      - eppo_fact_source
    columns:
      - name: anonymous_id
        tags:
          - eppo_entity:Anonymous User
      - name: purchase_timestamp
        tags:
          - eppo_timestamp
      - name: gross_revenue
        description: "The gross revenue amount"
        tags: 
          - eppo_fact
      - name: event_name
        description: "The name of the event"
        tags: 
          - eppo_property

```

Note that to specify that a column corresponds with an Eppo entity, use the format: 

```
tags: 
  - eppo_entity:{name of entity in the UI}
```

## Syncing 

Eppo provides a [python package](https://github.com/Eppo-exp/eppo-metrics-sync) to sync metrics to your Eppo workspace. This section walks through syncing your DBT models either manually from your local environment, or as part of a CI/CD workflow that automatically keeps metrics in sync with your existing version control system (e.g., GitHub).

### From your local environment

To start, you'll need an Eppo API key with read/write Certified Metrics access. This can be created in the Eppo UI by navigating to **Admin** >> **API Keys**.

Next, install the eppo_metrics_sync package and set local environment variables:

```bash
python3 -m pip install eppo_metrics_sync
export EPPO_API_KEY=<your API key>
export EPPO_SYNC_TAG=local_dev_sync
```

Now, call the eppo_metrics_sync module and point it at a directory of yaml files (replacing `my_database.my_schema` with the location of your data models within the warehouse):

```bash
python3 -m eppo_metrics_sync models --schema=dbt-model --dbt-model-prefix="my_database.my_schema"
```

Not that this assumes the DBT yaml files live in the `models` directory. If they live somewhere in your repository, simply replace `models` with the path to your DBT yaml files.

You should now see your DBT models in your Eppo workspace under **Definitions** >> **Facts** tab. To push updated fact source definitions, simply call the eppo_metrics_sync module again.

:::note
If you would like an additional workspace for testing, please reach out to support@geteppo.com
:::

### From a GitHub repository

We recommend setting up a separate Eppo workspace for staging changes to Certified Metrics. Please contact your Eppo support representative or email support@geteppo.com to have this created.

To connect a GitHub repository, you’ll need to complete the following steps:
1. Add tags to your DBT model configuration files as described above
2. Create an API key in both your production and staging Eppo workspaces. This can be done by going to **Admin** >> **API Keys** in each workspace. Make sure that the keys have read/write access to the Certified Metrics Sync permission
3. Add the API keys as a [GitHub secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) named `EPPO_API_KEY` and `EPPO_API_KEY_STAGING` to your DBT project. (Alternatively, you can use GitHub environments, but will need to adjust the workflow yaml below slightly)
4. Copy the following GitHub workflow yaml into a new file `.github/workflows/run_eppo_metric_sync.yaml` . Replace `my_database.my_schema` with the location of your DBT models within your data warehouse.

```yaml
name: Sync Eppo Metrics

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Set up Python 3.10
      uses: actions/setup-python@v3
      with:
        python-version: "3.10"
    - name: Install dependencies
      run: |
        python3 -m pip install --upgrade pip
        python3 -m pip install eppo_metrics_sync
    
    - name: Sync Eppo Metrics (Prod)
      env:
        EPPO_API_KEY: ${{ secrets.EPPO_API_KEY }}
        EPPO_SYNC_TAG: demo_company_metric_repository
      if: github.event_name != 'pull_request'
      run: |
        python3 -m eppo_metrics_sync models --schema=dbt-model --dbt-model-prefix="my_database.my_schema" 
    
    - name: Sync Eppo Metrics (Staging)
      env:
        EPPO_API_KEY: ${{ secrets.EPPO_API_KEY_STAGING }}
        EPPO_SYNC_TAG: demo_company_metric_repository
      run: |
        python3 -m eppo_metrics_sync models --schema=dbt-model --dbt-model-prefix="my_database.my_schema"
```

5. Push this to your new GitHub branch and confirm that the new metrics are showing up in your staging environment. You can view the metric sync logs on the **Admin** page under **Metric Sync Log**

![Certified metrics logs](/img/metrics/certified-metrics-2.png)

6. Once you are happy with your new fact sources, merge the branch to main and you should see your new certified fact sources in your production Eppo environment!

