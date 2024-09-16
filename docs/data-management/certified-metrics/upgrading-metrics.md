---
sidebar_position: 2
---

# Upgrading Metrics to Certified

Eppo makes it easy to convert existing, UI-created metrics to yaml-defined Certified Metrics. You can either upgrade metrics individually by copying metric YAML from the metrics page, or export all of your metrics in bulk from the admin page.

Once you sync your metric yaml files to Eppo, the existing metrics will be upgraded to certified and will no longer be editable in the UI. Experiments that use these metrics will not be affected and will automatically start using the certified version of the metric.

## Upgrading individual fact sources and metrics

To upgrade an individual fact sources as yaml, navigate to the fact source page and select "Copy YAML" from the overflow menu in the top right:

![Copy Fact Source Yaml](/img/metrics/copy-fact-source-yaml.png)

Paste the resulting YAML into a new file in your certified metric repository (or create a new git repository if this is your first Certified Metric):

```yaml title="sessions.yml"
name: Sessions
sql: |
  select * from dbt_analytics.dbt_tbuffington.sessions
reference_url: ""
timestamp_column: EVENT_TIMESTAMP
entities:
  - entity_name: User
    column: USER
facts:
  - column: SESSION_DURATION
    description: ""
    desired_change: increase
    name: Session Duration
  - column: PAGES_VIEWED
    description: ""
    desired_change: increase
    name: Pages Viewed
properties: []
```

In addition to exporting fact sources as yaml, you can also export the metrics built on top of those fact sources. To copy a metric as yaml, navigate to the metric page and select "Copy YAML" in the top right:

![Copy Metric Yaml](/img/metrics/copy-metric-yaml.png)

Paste this either into the same file as above or a new file. Each file can contain one or more fact source and one or more metric. 

Once you're happy with your Certified Metric yaml files, sync metrics to your workspace either from your [local environment](/data-management/certified-metrics/eppo-schema#from-your-local-environment) or [with a GitHub action](/data-management/certified-metrics/eppo-schema#from-a-github-repository).

## Upgrading metrics in bulk

You can also export all of the metrics in your workspace as a JSON file by navigating to **Admin** >> **Metric Sync Log** >> **Create Export**:

![Create Export](/img/metrics/export-metrics.png)

This will allow you to download a full list of fact sources and metrics in your workspace:

```json title="metric_export.json"
{
  "sync_tag": "export",
  "fact_sources": [
    {
      "name": "Sessions",
      "sql": "select * from dbt_analytics.dbt_tbuffington.sessions\n",
      "reference_url": "",
      "timestamp_column": "EVENT_TIMESTAMP",
      "entities": [
        {
          "entity_name": "User",
          "column": "USER"
        }
      ],
      "facts": [
        ...
```

To certify your fact sources and metrics of interest, select the relevant elements of this JSON file and format them as YAML files. We recommend grouping fact source and metric definitions into files specific to a given domain (e.g., checkout flow, search results, call center metrics, etc.).

Once you're happy with your Certified Metric yaml files, sync metrics to your workspace either from your [local environment](/data-management/certified-metrics/eppo-schema#from-your-local-environment) or [with a GitHub action](/data-management/certified-metrics/eppo-schema#from-a-github-repository).
