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

![Create a new Metric](/img/properties/metric-property-create-metric.png)

Any number of Metrics can be created with one or more Fact properties applied.

![Update a new Metric](/img/properties/metric-property-update-metric.png)

Existing Metrics can also be updated with any configured Metric properties on their Definition.

### Viewing Experiment results

![Update a new Metric](/img/properties/metric-property-experiment-results.png)

Metrics with filters appear normally on Experiment results.

### Exploring Experiment results

When exploring a Metric on an Experiment 

Metric property filters are already applied to the Metric values; as such only Assignment and Entity
properties are available.

![Explore](/img/properties/metric-property-explore-lift1.png)


![Explore as a time series](/img/properties/metric-property-explore-ts1.png)

Explore as a time-series split by any dimension with lifts at each day.

![Explore as as time series with data](/img/properties/metric-property-explore-ts2.png)

Tabular view available.

### Impact on warehouse compute

Metric properties are ingested along with their associated events 
and are more efficient than Entity properties. 