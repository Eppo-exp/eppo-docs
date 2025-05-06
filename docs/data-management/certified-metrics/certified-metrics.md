---
sidebar_position: 1
---

# Certified Metrics

Certified Metrics are a type of metric that are synced to Eppo from an outside source. This allows teams to use metrics that are stored in GitHub or other centralized repositories. Certified Metrics sit alongside metrics created in Eppo's UI to provide teams with maximum flexibility in the metrics they can track in experiments.

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
    column: revenue

metrics:
- name: Total Revenue per User
  entity: User 
  numerator:
    fact_name: Purchase Revenue
    operation: sum
```

Metrics are certified via the [metric sync API](https://eppo.cloud/api/docs#/Metrics%20Sync/syncMetrics). You can either post to that endpoint directly or use the `eppo_metrics_sync` [python package](https://github.com/Eppo-exp/eppo-metrics-sync) to post a directory of yaml files to Eppo's API. See [Syncing Metrics](#syncing-metrics) below for details. [Simple](/data-management/metrics/simple-metric/), [Ratio](/data-management/metrics/ratio-metric/) and [Percentage](/data-management/metrics/percentile-metric/) metrics can be certified; [Funnel metrics](/data-management/metrics/funnel-metric/) cannot.

Any metric or fact source created through the metric sync API will have a Certified badge and will not be editable in the UI:

![Certified metric example](/img/metrics/certified-metrics-1.png)

## Using Certified Metrics

There are several ways that you can leverage Certified Metrics into your workflow:

1. You can write Eppo yaml files from scratch. To get started, see the page on the [Eppo YAML schema](/data-management/certified-metrics/eppo-schema)
2. You can export metrics created in the UI as yaml. To learn more, read [Upgrading Metrics to Certified](/data-management/certified-metrics/upgrading-metrics)
3. You can tag models or columns in your dbt configuration files. To get started, see [Syncing dbt Models](/data-management/certified-metrics/dbt-models)

