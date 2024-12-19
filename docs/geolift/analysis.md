---
sidebar_position: 4
---
# Results Analysis

Once your test is running, let’s see some results! Eppo will refresh the test results two weeks after the start of the test, then refresh every week thereafter.

- Initial read: Start date + 2 weeks
- Subsequent refreshes: Weekly

:::info
**Definitions:**

- **Lookback period**: The historical data that is used for the determination of the synthetic control until the start of the test period.
- **Test period**: The date range in which the treatment is applied.

:::

## Overview

At the top of the page, Eppo gives an overview of the topline results included with the test, including:

- **Incremental Lift** (as a count)
- **Incremental Lift** (as a percentage)
- **Cost per Incremental Event** (if Daily Spend Data is supplied)

Below, we include three plots per variant of the test:

- **Absolute values**: The Metric compared to its synthetic control counterfactual as absolute values
- **Difference in values**: The difference in values between the metric and its counterfactual
- **Cumulative difference**: The cumulative sum of the difference in values

## Test Plan

Coming soon.

## Assignments

The Assignment tab lists key information about the test, including dates and the units that are assigned to each test variant.

TK IMAGE

## Metric Inputs

In most synthetic control tests, there are relatively few underlying units, and so idiosyncratic behavior from one or a few units can drive visible changes in the behavior of the synthetic control. So, it’s useful to visually inspect some of the units that go into the synthetic control.

TK IMAGE
![Bandit experiment analysis](/img/contextual-bandits/bandit-analysis.png)