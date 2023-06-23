---
sidebar_position: 2
---

# Debugging metrics

When configuring a new experiment—especially when using a new metric or assignment source—it is possible that calculating the results of an experiment may lead to no results.

![Experiment with missing data in the primary metric](/img/how-tos/debugging-metrics/empty-metrics.png)

## Troubleshooting Common Scenarios

Missing metric data for an experiment is generally caused by one of the following scenarios.

### The fact source is missing data for the experiment window.

It’s always possible the fact source is missing data for the experiment window. This could be a filter which accidentally excludes rows, a source table which is missing data from a broken ETL, or any number of data problems.

A quick check you can do is to navigate to a metric’s detail page and inspect the volume. Does there appear to be data for the experiment window?

![Does the metric have data in the experiment window](/img/how-tos/debugging-metrics/metric-daily-data.png)

:::caution
It is possible to select a different analysis window for the metric events than the assignments. If this is true, check that the configured metric window has data.

![Assignment window data ranges](/img/how-tos/debugging-metrics/assignment-window.png)

:::

To manually inspect data during the experiment window, you can navigate to a metric’s Fact SQL and manually run the query, manually applying a date filter.

### Assigned subjects did not trigger any relevant events.

Sometimes the set of users or subjects assigned to an experiment have not actually triggered events for a particular metric.

Check the traffic tab to see if the assignment volume for each variant looks correct. Are the right users being assigned to this experiment?

![Check the traffic tab for assignment data](/img/how-tos/debugging-metrics/traffic-tab.png)

Hover over the metric in question and use the “Copy SQL” button to see a SQL snippet enabling you to inspect assigned users for the experiment.

![Copy SQL button](/img/how-tos/debugging-metrics/copy-sql.png)

![SQL for assignment data](/img/how-tos/debugging-metrics/copy-sql-modal.png)

Do the assigned users look correct?

You can also navigate to the “User level aggregations” SQL snippet, which will show the result of joining assigned subjects to the metric data. It’s likely that this has zero rows for the metric in question.

![SQL for subject level data](/img/how-tos/debugging-metrics/copy-sql-modal-users.png)

### Entity ids do not match between the Assignment SQL and the Fact SQL.

For example, the fact definition may have accidentally selected “cookie_id” for the User entity. When Eppo tries to join those facts to User assignments, the join produces no rows.

![Entity selector](/img/how-tos/debugging-metrics/entities.png)

Navigate to the relevant Assignment SQL and Fact SQL and run a query to inspect the data and configured columns.

## Troubleshooting with Diagnostics

The diagnostics tab for your experiment will alert you if an experiment is missing data.

![Primary metric diagnostic check](/img/how-tos/debugging-metrics/diagnostics-primary-metric.png)

Clicking on the diagnostic will open a sidebar with detailed information and troubleshooting tips.

<!-- ![Diagnostics sidebar with additional details](/img/how-tos/debugging-metrics/diagnostics-sidebar.png)

![Diagnostics sidebar with SQL query](/img/how-tos/debugging-metrics/diagnostics-sql.png) -->

The diagnostics window will contain event volume information if it is available, and SQL snippets for the metric source and the diagnostic query can be copied and executed against your warehouse to help investigate.

The diagnostics query represents the code which was executed against the warehouse to test if the diagnostic should pass or fail. It uses common table expressions (CTEs) to break the problem into chunks which can be tweaked to help you investigate the problem.
