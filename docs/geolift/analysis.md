---
sidebar_position: 4
---
# Results Analysis

Once your test is running, let’s see some results! Eppo will refresh the test results two weeks after the start of the test, then refresh every week thereafter.

:::info
**Definitions:**

- **Lookback period**: The historical data that is used for the determination of the synthetic control until the start of the test period.
- **Test period**: The date range in which the treatment is applied.

:::

## Overview

At the top of the page, Eppo gives an overview of the topline results included with the test, including:

- **Incremental Lift** (as a value) - the metric compared to the synthetic counterfactual metric
- **Incremental Lift** (as a percentage) - the metric compared to the synthetic counterfactual metric relative
- **Cost per Incremental Event** (if Daily Spend Data is supplied) - Counterfactual spend divided by Incremental Lift as a value

Below, we include three plots per variant of the test:

- **Absolute values**: The Metric compared to its synthetic control counterfactual as absolute values
- **Difference in values**: The difference in values between the metric and its counterfactual
- **Cumulative difference**: The cumulative sum of the difference in values

![Geolift Results Analysis](/img/geolift/geolift_overview_tab.png)

## Assignments

The Assignment tab lists key information about the test, including dates and the units that are assigned to each test variant.

![Geolift Assignments](/img/geolift/geolift_assignment_tab.png)

## Metric Inputs

In most synthetic control tests, there are relatively few underlying units, and so idiosyncratic behavior from one or a few units can drive visible changes in the behavior of the synthetic control. So, it’s useful to visually inspect some of the units that go into the synthetic control.

![Geolift Metric Inputs](/img/geolift/geolift_metric-inputs_tab.png)
