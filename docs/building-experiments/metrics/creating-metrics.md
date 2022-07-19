# Creating metrics

Metrics are statistics like Revenue or Signups that you are interested in tracking in your experiment

1. Navigate to **Metrics**, click **+Metric**, then select **User** as the subject of the metric

**User** is the default entity in Eppo, but you can also create a [custom entity](../../building-experiments/entities) and select it here.

2. Select a fact

![Select Fact](../../../static/img/building-experiments/select-fact-for-metric.png)

This should be one of the facts that you created in the step above, and should correspond to a metric that you want to track in an experiment.

3. Select an aggregation

![Select Aggregation](../../../static/img/building-experiments/select-aggregation-for-metric.png)

The aggregation will aggregate over whatever the fact is measuring on a per-entity basis. So for example, if you select the `Revenue` fact and the `SUM` aggregation, the metric will be the total revenue for each user;, if you select the `Upgrades` fact and the `SUM` aggregation, the metric will be the total number of upgrades for each user, which should only be 1 across the board.

Eppo supports the following aggregations:

- SUM
- COUNT DISTINCT
- COUNT
- RETENTION
- CONVERSION

4. (Optional) Create a denominator for your metric

You may actually want to create a metric that is a ratio of two facts. To do this, click on the **Ratio** tab, and select the appropriate fact and aggregation for the denominator as well.

![Select filter](../../../static/img/building-experiments/create-metric-ratio.png)

In the example above, we're creating a metric that corresponds to the revenue per user per purchase.

5. (Optional) Select a filter

When you created an assignment SQL above, you may have also created additional dimensions, i.e. country or browser. These dimensions are now available under the **Definitions** > **Dimensions SQL**.

![Select filter](../../../static/img/building-experiments/filter-on-dimensions-create-metric.gif)

Here, you can filter on any of those dimensions. In the example above, we want to track the revenue metric by country.

6. Select a minimum detectable effect

The minimum detectable effect refers to the smallest effect you want to reliably detect in experiments. The higher the minimum detectable effect you set, the longer the experiment will take to reach conclusive results.