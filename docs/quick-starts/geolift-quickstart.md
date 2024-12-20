---
sidebar_position: 3
---
# Creating your first Geolift test

This guide will walk you through creating your first Eppo Geolift quasi-experiment. We will create a new quasi-experiment, specify the business question, specify test parameters, and submit the test to the power analysis and simulation pipeline.

1. **Create the aggregation Entity**: First, create an Entity in Eppo that defines the unit of randomization you want to use for the quasi-experiment. This is often geographic in nature. It should match what’s available in your data warehouse in the following step. More information on entities here. For example, if your test is going to split on countries, you might create a "Country" entity.
2. **Create a Fact SQL for the events to be measured**: If you want to test the intervention’s effect on revenue by Country, you’ll want to create a Fact SQL that brings net revenue into Eppo along with the Country that the revenue took place in. More information on Facts here.
3. **Create a Metric for the event to be measured**: Next, create a metric that aggregates the revenue by country created in the previous step into the metric that you’d like to examine in this test. When creating a new metric, select the Entity you just created, then the Fact and the Aggregation type desired. More information on Metrics here. Eppo Geolift currently supports SUM and COUNT metrics with no timeframes specified.

## Test objective and data

1. **Create a Quasi-experiment**: Now, you can specify the parameters for the Geolift test.
2. **Test Objective**: Specify whether you are looking to evaluate an existing marketing campaign or other intervention, a new marketing effort, or a non-marketing use case.
3. **Randomization Unit**: Use the entity to be measured in this case. Using the examples above, it’d be Country. Once the Randomization Unit is selected, you’ll be able to add a Primary Metric and Daily Spend Data.
4. **Primary Metric**: Metrics that belong to the entity under measurement are selectable here, for example "Revenue by Country."
5. **Daily Spend Data**: If an advertising test is selected, you’ll have the option available to supply daily spend data for the advertising channel being measured. We’ll use this data later.

![Create a Quasi-experiment](/img/geolift/geolift_create_quasi.png)

## Eligible test units

On the next page, you can specify the units (countries, in this example) that the test design can treat as eligible to be turned off or on, depending on the parameters of your test. Additionally, you can exclude specific units from being included in the synthetic control. We generally encourage customers to include all markets in both the test treatment as well as the synthetic control markets, but there are valid business and analytical reasons to exclude or include only some markets:

   1. **New initiative test in a single/few market(s).** Here, you’d select only the markets being treated.
   2. **Exclude mega-markets from being included in treatment regions.** For example, New York City might be too large/important a market to turn advertising off in, or too large a market in terms of dollar volume to recommend testing a new channel in.
   3. **Idiosyncratic and unrepresentative behavior in a synthetic control region.** For example, if you sell sports merchandise or tickets and plan to run a nationwide advertising test during a major league championship, you may want to exclude the markets belonging to the teams playing in the series, as their behavior will be fundamentally and temporarily different from other markets. For more on assessing these dynamics, see [Statistical Assumptions and Best Practices](../geolift/assumptions_best_practices.md)

![Modify eligible units](/img/geolift/geolift_create_page2.png)

Once you’ve submitted the test objectives and parameters, the test is submitted into our planning pipeline. At this stage, Eppo will use the information provided to propose test and control groups, a 2-cell or 3-cell design, and a minimum detectable effect estimation.

Once a test is launched, the [Results Analysis](../geolift/analysis.md) screen will be enabled and visible from the Quasi-experiments tab of the Analysis section.