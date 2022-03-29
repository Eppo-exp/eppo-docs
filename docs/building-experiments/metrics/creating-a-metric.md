# Creating a Metric

1. Navigate to **Metrics**

2. Click **+Metric**

3. Select the subject of the User SQL

This should one of the entities you created.

In this case we are assigning users into different groups, so we choose **Users**

4. Select a fact

5. Select an aggregation

The aggregation will aggregate over the fact on a per-entity basis. So for example, if you select the `Revenue` fact and the `SUM` aggregation, the metric will be the total revenue for each user; contrastingly, if you select the `Upgrades` fact and the `SUM` aggregation, the metric will be the total number of upgrades for each user, which should only be 1 across the board.

Eppo supports the following aggregations:

- SUM
- COUNT DISTINCT
- COUNT
- RETENTION
- CONVERSION

6. (Optional) Select a Filter

You can select any of the dimensions that you created in the dimensions definitions. In the example above, we just want to focus on upgrades from Canada.

7. Select a minimum detectable effect

The minimum detectable effect refers to the smallest effect you want to reliably detect in experiments. The higher the minimum detectable effect you set, the longer the experiment will take to reach conclusive results.
