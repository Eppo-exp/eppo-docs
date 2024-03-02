---
sidebar_position: 4
---

# Certified metrics

Certified Metrics are a class of metrics that are synced to Eppo from an outside source. This allows teams to use metrics that are stored in Github or other centralized repositories. Certified Metrics sit alongside metrics created in Eppo to provide teams with maximum flexibility in the metrics they can track in experiments.

Certified Metrics allow you to define both [fact sources](/data-management/definitions/fact-sql) and [metrics](/data-management/metrics/) in code. For example, a simple revenue metric might look like this:

```yaml
fact_sources:
- name: Revenue
  sql: |
    SELECT * from analytics_prod.revenue
  timestamp_column: revenue_timestamp
  entities:
  - entity_name: User
    column: user_id
  facts:
  - name: Purchase Revenue
    column: Revenue

metrics:
- name: Total Revenue per User
  entity: User 
  numerator:
    fact_name: Purchase Revenue
    operation: sum
```

Metrics are certified via the [metric sync API](https://eppo.cloud/api/docs#/Metrics%20Sync/syncMetrics). You can either post to that endpoint directly or, if using GitHub, add a simple GitHub action using the `eppo-metrics-sync` python package (see below for details). 

Any metric or fact created through the metric sync API will have a Certified badge and will not be editable in the UI:

![Certified metric example](/img/metrics/certified-metrics-1.png)

## Certified Metric Schema
Eppo supports a YAML schema to describe Facts and Metrics.

The Eppo certified metrics schema is [described here](https://eppo.cloud/api/docs#/Metrics%20Sync/syncMetrics)

Notes:
- Metrics are unique based on the `name` field.
- `sync_tag` describes the source of the synced metrics and will show in the UI
- The following fields are optional: descriptions, reference URLs, properties, filters, and winsorization percentiles

## Sync with a Github repository

Once files are in the Eppo YAML schema, you are ready to sync them.

We recommend setting up a separate Eppo workspace for staging changes to Certified Metrics. Please contact your Eppo support representative or email support@geteppo.com to have this created.

To connect a GitHub repository, you’ll need to complete the following steps:
1. Create an API key in both your production and staging Eppo workspaces. This can be done by going to **Admin** >> **API Keys** in each workspace. Make sure that the keys have read/write access to the Certified Metrics Sync permission
2. Add the API keys as a GitHub secrets named `EPPO_API_KEY` and `EPPO_API_KEY_STAGING`. (Alternatively, you can use GitHub environments, but will need to adjust the workflow yaml below slightly)
3. Create a new branch on the repository you want to connect, and add metric yaml files to a directory called `eppo_metrics` (you can name this whatever you like, you’ll just need to adjust the directory name referenced in the GitHub workflow below)
4. Copy the following GitHub workflow yaml into a new file `.github/workflows/run_eppo_metric_sync.yaml` . Replace `demo_company_metric_repository` with something that applies to your business and the set of metrics you are syncing (e.g., `business_north_star_metrics`)

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
        python3 -m eppo_metrics_sync eppo_metrics
    
    - name: Sync Eppo Metrics (Staging)
      env:
        EPPO_API_KEY: ${{ secrets.EPPO_API_KEY_STAGING }}
        EPPO_SYNC_TAG: demo_company_metric_repository
      run: |
        python3 -m eppo_metrics_sync eppo_metrics
```

5. Push this to your new GitHub branch and confirm that the new metrics are showing up in your staging environment. You can view the metric sync logs on the **Admin** page under **Metric Sync Log**

![Certified metrics logs](/img/metrics/certified-metrics-2.png)

6. Once you are happy with your new metrics, merge the branch to main and you should see your new Certified Metrics in your production Eppo environment!