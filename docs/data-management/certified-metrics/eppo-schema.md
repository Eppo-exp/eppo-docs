---
sidebar_position: 1
---

# Using Eppo's YAML Schema

Eppo's YAML schema allows you to define certified metrics with the same flexibility as when creating in the UI. This page walks through the basics of defining metrics in yaml as well as syncing metrics from either your local environment or from a version control system like GitHub.

## Certified Metric schema

Each yaml file can define fact sources, metrics, or both. This section describes the yaml schema in detail and provides a few [examples](#examples).

:::note
We recommend familiarizing yourself with Eppo's [data](/data-management/definitions/overview) and [metric](/data-management/metrics/) models before writing yaml files from scratch.
:::

### Fact sources 

Certified metric files can define one or more [fact sources](/data-management/definitions/fact-sql). The fact source schema is shown below:

| Property |  Description | Example |
| -------- | ----------- | ------- | 
| `name` | A name for the source to display in the Eppo UI | Purchases |
| `sql` | The SQL definition for the source | <pre><code>select * <br></br>  from analytics_prod.purchases </code></pre> |
| `timestamp_column` | The column that represents the time the fact occurred | `purchase_timestamp` |
| `entities` | A list of [entities](/data-management/definitions/entities) in the table, each element containing the name of an existing entity created in the Eppo UI and the corresponding column | <pre><code>- entity_name: User <br></br>  column: user_id </code></pre> |
| `facts` | A list of fact values in the table, their corresponding column, and optionally, a description and desired change (either `increase` or `decrease`) | <pre><code>- name: Purchase Revenue <br></br>  column: purchase_revenue <br></br>  description: ... <br></br>  desired_change: increase </code></pre> |
| `properties` (optional) | An optional list of [fact properties](/data-management/definitions/properties#metric-properties) in the table, their corresponding column, and an optional description | <pre><code>- name: Purchase Type <br></br>  column: purchase_type <br></br>  description: ... </code></pre> |
| `reference_url` (optional) | An optional URL to link to in the Eppo UI | `github.com/<my_repo>` |

### Metrics

Each certified metric yaml file can also define one or more metrics (either [simple](/data-management/metrics/simple-metric) or [ratio](/data-management/metrics/ratio-metric)). The metrics schema is shown below:

| Property |  Description | Example |
| -------- |  ----------- | ------- |
| `name` | A name for the metric to show in the Eppo UI. Note that this is the unique identifier for the metric used when syncing metrics | Purchase Revenue |
| `description` <br></br>(optional) | An optional description for the metric | All non-subscription revenue | 
| `entity` | The [entity](/data-management/definitions/entities) that the metric connects to | User | 
| `numerator` | An aggregation object (see below) to specify how to compute the metric numerator | <pre><code>fact_name: Purchase Revenue <br></br>operation: sum </code></pre> | 
| `denominator` <br></br> (optional)| An aggregation object (see below) that, if set, will specify the metric as a ratio | <pre><code>fact_name: Purchase Revenue <br></br>operation: count </code></pre>| 
| `is_guardrail` <br></br> (optional)| Whether the metric should be analyzed for every experiment run on this entity (default is false) | `true` or `false`| 
| `metric_display_style` <br></br> (optional) | How to display the metric, either `decimal` or `percent` (default is `decimal`) | `decimal`| 
| `minimum_detectable_effect` <br></br> (optional)| The default [MDE](/statistics/sample-size-calculator/mde#what-is-a-minimum-detectable-effect-mde) for the metric | `0.02` | 
| `reference_url` <br></br> (optional)| An optional URL to link to in the Eppo UI | `github.com/.../<my_metric>` | 

### Aggregations

When defining Certified Metrics, you'll need to specify how to aggregate the metric numerator and optionally the denominator. If the denominator is not specified, Eppo will normalize the metric by the number of subjects (e.g., users) enrolled in the experiment.

Numerators and denominators follow a similar schema, with some fields only being applicable to numerators:

| Property |  Description | Example |
| -------- |  ----------- | ------- |
| `fact_name` | The name of a fact as specified in `fact_source`* |  Purchase Revenue |
| `operation` | The [aggregation method](/data-management/metrics/simple-metric#aggregation-methods) to use. <br></br><br></br>For numerator aggregations options are `sum, count, count_distinct, distinct_entity, threshold, conversion, retention`. <br></br><br></br>For denominator aggregations, valid options are `sum, count, count_distinct, distinct_entity` | `sum` |
| `aggregation_timeframe_value` <br></br> (optional) | How many timeframe units since assignment to include | 7 |
| `aggregation_timeframe_unit` <br></br> (optional) | The time unit to use: `minutes`, `hours`, `days`, or `weeks` | `days` |
| `winsorization_lower_percentile` <br></br> (optional) | Percentile at which to clip aggregated metrics | 0.001 |
| `winsorization_upper_percentile` <br></br> (optional) | Percentile at which to clip aggregated metrics | 0.999 |
| `filters` <br></br> (optional) | A list of filters to apply to metric, each containing a fact property, an operation (`equals` or `not_equals`), and a list of values | <pre><code>- fact_property: Source <br></br>  operation: equals <br></br>  values: <br></br>   - organic <br></br>   - search </code></pre>  |
| `retention_threshold_days` <br></br> (optional, numerators only) | Number of days to use in retention calculation (only used if `operation` = `retention`) | 7 |
| `conversion_threshold_days` <br></br> (optional, numerators only) | Number of days to use in conversion calculation (only used if `operation` = `conversion`) | 7 |
| `threshold_metric_settings` <br></br> (optional, numerators only) | Setting for threshold metrics | <pre><code>comparison_operator: gt <br></br>aggregation_type: sum <br></br>breach_value: 0 <br></br>timeframe_unit: days <br></br>timeframe_value: 3 </code></pre> |


*Note that `fact_name` can reference facts defined in a different yaml file.

### Examples

#### Simple Revenue Metrics

As an example, if you have a central source-of-truth revenue table you can define both the table schema (`fact_source`) and metric semantics (`metrics`) in a yaml file like the one below. When Gross Revenue is analyzed in an experiment, Eppo will sum the `gross_revenue` column grouped by `user_id` and then measure the differences in these user-level aggregates between variants. To read more about how metrics are compiled into SQL, see the [Simple Metrics](/data-management/metrics/simple-metric) page.

```yaml
fact_sources:
- name: Revenue
  sql: |
    SELECT user_id
        ,  revenue_timestamp
        ,  gross_revenue
        ,  net_revenue 
      FROM analytics_prod.revenue
  timestamp_column: revenue_timestamp
  entities:
  - entity_name: User
    column: user_id
  facts:
  - name: Gross Revenue
    column: gross_revenue
  - name: Net Revenue
    column: net_revenue

metrics:
- name: Gross Revenue
  entity: User 
  numerator:
    fact_name: Gross Revenue
    operation: sum
- name: Net Revenue
  entity: User 
  numerator:
    fact_name: Net Revenue
    operation: sum
```

#### Measuring User-Level Metrics for Company-Randomized Experiments

In B2B businesses it's often impractical to randomize at the user level. Instead, experiments are typically randomized by company. It is however still valuable to understand any impacts on user-level behavior. Fortunately Eppo makes this easy through [Ratio Metrics](/data-management/metrics/ratio-metric).

As an example, imagine you are trying to get more users to engage with a "change log" page in your application. You can point Eppo at a log of page views and measure what share of users viewed the page of interest during the experiment:

```yaml
fact_sources:
- name: Page Views
  sql: |
    SELECT user_id
        ,  company_id
        ,  page_viewed_timestamp
        ,  page_name
      FROM analytics_prod.page_views
  timestamp_column: page_viewed_timestamp
  entities:
  - entity_name: Company
    column: company_id
  facts:
  - name: User ID
    column: user_id
  properties:
  - name: Page Name
    column: page_name

metrics:
- name: Percent of users that viewed the change log
  entity: Company 
  numerator:
    fact_name: User ID
    operation: count_distinct
    filters:
    - fact_property: Page Name 
      operation: equals 
      values: 
      - Change Log
  denominator:
    fact_name: User ID
    operation: count_distinct
```

Note that a similar pattern can be applied for analyzing session-level metrics for a user-randomized experiment, or any other case where the analysis unit is more granular than the randomization unit.


## Syncing metrics

Certified Metrics are synced using the `eppo_metrics_sync` [python package](https://github.com/Eppo-exp/eppo-metrics-sync). This package is a light wrapper that hits the Eppo `metrics/sync` API endpoint. If you prefer to integrate with the API directly, see the docs [here](https://eppo.cloud/api/docs#/Metrics%20Sync/syncMetrics).

This section walks through using the `eppo_metrics_sync` package to sync metrics both from your local environment (useful for developing metric yaml files) and from a GitHub repository (useful for long term version control). While the latter section focuses on GitHub, a similar approach can be use for any version control system.

### From your local environment

To start, you'll need an Eppo API key with read/write Certified Metrics access. This can be created in the Eppo UI by navigating to **Admin** >> **API Keys**.

Next, install the `eppo_metrics_sync` package and set local environment variables:

```
python3 -m pip install eppo_metrics_sync
export EPPO_API_KEY=<your API key>
export EPPO_SYNC_TAG=local_dev_sync
```

Now, call the `eppo_metrics_sync` module and point it at a directory of yaml files:

```
python3 -m eppo_metrics_sync <path to your yaml files>
```

You should now see Certified Metrics in your Eppo workspace! To push updated metric definitions, simply call the `eppo_metrics_sync` module again.


### From a GitHub repository

For long term version control, we recommend storing Certified Metric files in GitHub or a similar version control system. 

Further, we recommend setting up a separate Eppo workspace for staging changes to Certified Metrics. Please contact your Eppo support representative or email support@geteppo.com to have this created.

To connect a GitHub repository, you’ll need to complete the following steps:
1. Create an API key in both your production and staging Eppo workspaces. This can be done by going to **Admin** >> **API Keys** in each workspace. Make sure that the keys have read/write access to the Certified Metrics Sync permission
2. Add the API keys as a [GitHub secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) named `EPPO_API_KEY` and `EPPO_API_KEY_STAGING`. (Alternatively, you can use GitHub environments, but will need to adjust the workflow yaml below slightly)
3. Create a new branch on the repository you want to connect, and add metric yaml files to a directory called `eppo_metrics` (you can name this whatever you like, you’ll just need to adjust the directory name referenced in the GitHub workflow below)
4. Copy the following GitHub workflow yaml into a new file `.github/workflows/run_eppo_metric_sync.yaml` . Replace `demo_company_metric_repository` with something that applies to your business and the set of metrics you are syncing (e.g., `business_north_star_metrics`)

:::note
We recommend specifying a specific version of the [eppo-metrics-sync](https://pypi.org/project/eppo-metrics-sync/) Python package to avoid unexpected changes. In the example below, it is set to version 0.0.3.
:::

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
        python3 -m pip install eppo-metrics-sync==0.0.3
    
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
