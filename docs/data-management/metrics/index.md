# Metrics

Metrics serve as the foundation for evaluating experiments and determining the effectiveness of different variations. This overview provides a brief introduction to metrics in Eppo and highlights their significance in data-driven decision making.

# Entities and aggregations

Metrics in Eppo are created at the [entity](/data-management/entities) level (such as a user), allowing you to define specific measurement criteria for different aspects of their experiments. An entity can be any meaningful unit of analysis, such as a user, session, or page view. To capture meaningful insights, metrics combine a [fact](/data-management/definitions/fact-sql) and an [aggregation](/data-management/metrics/simple-metric#metric-aggregation-types). The fact represents the event or action being measured, while the aggregation defines how the data is summarized (e.g., _sum_, _count_, _conversion_, and _retention_) across the specified entity.

## Ratio Metrics

[Ratio metrics](/data-management/metrics/ratio-metric) allow you to calculate ratios based on different metrics, providing deeper insights into the relative performance of variations.
This enables a more nuanced analysis of experimental results, allowing businesses to understand the impact of changes in a more comprehensive manner.

For example, consider an _average order value_ metric, which is created by dividing revenue (sum of prices) by number of orders (_sum_ of items purchased or _count_ of prices).

$$
\text{Average order value} = \frac{\text{Revenue}}{\text{Number of orders}}
$$

## Funnels

[Funnels](/data-management/metrics/funnel-metric) are another powerful metric type in Eppo. They allow you to track and analyze multi-step processes or user flows. By defining the sequence of events in a funnel, you can identify bottlenecks, drop-off points, and conversion rates at each step. This facilitates a granular analysis of user behavior and helps optimize the customer journey.

## Guardrail metrics

Furthermore, you can set metrics as [guardrail metrics](/data-management/metrics/guardrails), which means they are automatically added to every experiment. This feature ensures that specific metrics are consistently tracked across experiments, providing a standardized measurement framework. By setting metrics as guard rails, you can maintain a unified approach to experimentation and easily compare results across different tests.
