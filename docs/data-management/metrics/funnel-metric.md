---
sidebar_position: 3
---

# Funnel metrics

Funnel metrics allow you to track and analyze multi-step processes or user flows.
By defining the sequence of events in a funnel, you can identify bottlenecks, drop-off points, and conversion rates at each step.
This facilitates a granular analysis of user behavior and helps understand experiment effects throughout the user journey.

:::info

Eppo considers each step of the funnel as a binary outcome: either the user has made it to this step (at least once), or they have not. If a user completes the funnel twice, that is still counted as a single conversion.

:::

## Creating a funnel

Creating a funnel requires you to specify a sequence of events that need to happen consecutively.
A natural example of a funnel is the checkout flow for an ecommerce platform:

- User adds item to cart
- User clicks checkout button
- User fills out address
- User fills out credit card details page
- User confirms order

Each of these actions are connected to separate events, and we want to understand the user drop-off in each of the steps.

![Creating a funnel metric](/img/data-management/metrics/funnel-create-metric.png)

:::note

Eppo requires the funnel steps to happen in order, but does not care whether unspecified events happen in between the funnel steps.

:::

### Timeframes

You can additionally specify a timeframe in which a user needs to complete the funnel in order to count as a funnel conversion.

There are three options:

- No timeframe: as long as the user completes the steps in order, it counts as a conversion.
- Time window from time of assignment: the user has to complete the funnel within the set duration, where the time of assignment starts the clock.
- Time window from time of first event: the user has to complete the funnel within the set duration, but the clock starts at the time of the first step in the funnel for that user.

![Funnel metric timeframe](/img/data-management/metrics/funnel-metric-timeframe.png)

## Analysis of funnel metrics

To analyze the effects of an experiment on a funnel, add it as a metric to an experiment as usual.
Initially, the funnel will show up in a collapsed format, but can be expanded by clicking the carrot.

![Funnel metric analysis](/img/data-management/metrics/funnel-analysis-collapsed.png)

The results show the conversion rate from assignment to each particular step; the overall results thus are the same as the results for the last step.
The popover shows additional details:

- drop-off from the prior step indicates what fraction of users who made it to the previous step in the funnel did not make it to this step
- survivors are the total number of users that made it all the way to this step in the funnel.

![Funnel metric analysis](/img/data-management/metrics/funnel-analysis.png)
