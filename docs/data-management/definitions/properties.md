---
sidebar_position: 5
---

# Properties

Properties are additional descriptors of entities and metrics used to enable further analysis. Eppo supports entity-level properties and fact-level properties. Entity properties are one-to-one with experiment subjects (e.g., users), such as a user's primary country, their subscription tier, etc. Fact properties on the other hand are many-to-one with experiment subjects. Examples include product category, support ticket reason, etc.

## Entity Properties

Entity Properties define additional details about the given entity that do not change. For example, a consumer entity could have properties to describe their primary country, marital status, or age. Entity Properties can be used to create Segments and to split or filter experiment results.

Each Entity can only have one value for a given property. If you will be using properties that change often, we recommend using Assignment or Metric Properties.

### Adding via Entity Properties SQL

Click on the **Create Definition SQL** button in the Definitions page and select **Entity Properties SQL**.

![Create Definition SQL](/img/data-management/properties/properties-1.png)

Select the Entity you wish to add properties for.

![Select the Entity](/img/data-management/properties/properties-2.png)

Write SQL that includes the Entity ID and the properties you wish to define. All properties will be evaluated as strings.

![Writing Entity Property SQL](/img/data-management/properties/properties-3.png)

### Viewing experiment results with Entity Properties

You can filter all metrics on an experiment by Entity Properties. Click on the “Filter” button to select an Entity Property and the associated value you want to filter by. Keep in mind that only Entity Properties that match the Entity of the experiment will be available to filter by.

This filter is a temporary view and will not be saved when you leave the page.

![Filter on an experiment](/img/data-management/properties/properties-4.png)

### Exploring experiment metrics with Entity Properties

Entity Properties can be used to both filter and split a given metric in the Explore view.

To filter a metric, click on the “Add Filter” button and select a property and value. You can add as many filters as you like.

To split a metric, click on the “Split By” dropdown and select a property.

When you save an Explore by clicking the “Add to Experiment” button all filters and splits applied will be saved with it.

![Filter and split an Explore](/img/data-management/properties/properties-5.png)

## Assignment Properties

Assignment Properties are similar to Entity Properties - they are used to further describe a given Entity. In fact, they will show up on the Entity Properties tab and can be used to filter experiment results in the same way.

The main difference is that Assignment Properties, unlike Entity Properties, are defined with your Assignment SQL and have a timestamp associated with them. This can save you time if these properties are defined in the same table as your assignments as you don’t have to write the SQL twice.

If we observe multiple values for a given entity in Assignment Properties, Eppo will use the first value observed during the experiment.

### Adding Assignment Properties via Assignment SQL

With your Assignment SQL, add properties that are also present in your table. All properties will be evaluated as strings.

![Writing Assignment SQL](/img/data-management/properties/properties-6.png)

## Metric Properties

Metric Properties are sourced from Fact SQL and describe additional context about the event that occurred. For example, a Metric Property for a click event can describe what was clicked on or what device was used.

Metric Properties can be used to refine Metrics or split experiment metrics when explored.

### Adding Metric Properties via Fact Definition

![Configuring a Fact SQL](/img/properties/metric-property-fact-sql.png)

Add a Metric Property to any of your existing FactSQLs or by creating a new one. A Metric Property only needs to be configured once and is able to be re-used many times for any Metrics created.

By default, Metric Properties will not be included in experiment computation to reduce experiment run time. This means that they are not available for analysis in [Explores](/experiment-analysis/deep-dive/explores) and [Property Analysis](/experiment-analysis/deep-dive/property_analysis) for a given experiment.

This can be changed by toggling the Metric Property to enabled, which will make it available in all experiments. However, it is recommended instead that you set Metric Properties to be available for experiment analysis by choosing to include them in Protocols settings and in individual experiment settings.

![Metric property with toggle to include in experiment computation](/img/properties/metric-property-toggle.png)

### Configure a Metric with a property filter

Metric Properties can be added as filters when creating Metrics. This will allow you to filter down to a particular value or values when calculating that metric. For example, you may want to create a metric called 'Purchases (USA)' to track purchases within a single country.

![Create a new Metric](/img/properties/metric-property-create-metric.png)

Any number of Metric Properties can be created with one or more Fact properties applied.

![Update a new Metric](/img/properties/metric-property-update-metric.png)

Existing Metrics can also be updated with any configured Metric properties on their Definition.

### Viewing Experiment results with Metric Properties

![Update a new Metric](/img/properties/metric-property-experiment-results.png)

Metrics with filters appear normally on Experiment results.

### Exploring Experiment metrics with Metric Properties

For Metrics that use a Metric Property filter, the filter is already applied and cannot be used to explore only Assignment and Entity properties are available.

![Explore](/img/properties/metric-property-explore-lift1.png)

For Metrics that do not use a Metric Property filter, you can explore the results and split by Metric Property values.

![Explore as a time series](/img/properties/metric-property-explore-ts1.png)

Explore as a time-series split by any property with lifts at each day.
