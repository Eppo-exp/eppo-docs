---
sidebar_position: 2
---

# Properties [wip]

## Entity properties

## Assignment properties

## Metric properties

A class of properties that is sourced from Fact SQL.

### Adding via Fact Definition

![Configuring a Fact SQL](/img/properties/metric-property-fact-sql.png)

Add a Metric property to any of your existing Facts or by creating a new one.

This only needs to be configured once and re-use many times for any Metrics created.

### Configure a Metric with a property filter

Metric Properties can be added as filters when creating Metrics. This will allow you to filter down to a particular value or values when calculating that metric. For example, you may want to create a metric called 'Purchases (USA)' to track purchases within a single country.

![Create a new Metric](/img/properties/metric-property-create-metric.png)

Any number of Metric Properties can be created with one or more Fact properties applied.

![Update a new Metric](/img/properties/metric-property-update-metric.png)

Existing Metrics can also be updated with any configured Metric properties on their Definition.

### Viewing Experiment results

![Update a new Metric](/img/properties/metric-property-experiment-results.png)

Metrics with filters appear normally on Experiment results.

### Exploring Experiment results

For Metrics that use a Metric Property filter, the filter is already applied and cannot be used to explore only Assignment and Entity properties are available.

![Explore](/img/properties/metric-property-explore-lift1.png)

For Metrics that do not use a Metric Property filter, you can explore the results and split by Metric Property values.

![Explore as a time series](/img/properties/metric-property-explore-ts1.png)

Explore as a time-series split by any property with lifts at each day.
