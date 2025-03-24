---
sidebar_position: 1
---

# Overview

Eppo's analysis engine is powered by SQL. This means that anything in your warehouse can be leveraged in Eppo's experimentation analysis pipeline. This section describes the SQL definitions that tell Eppo how to leverage the data in your warehouse.

These basic SQL definitions are compiled into a larger SQL data pipeline that computes experiment-level summaries. Only the end result of this data pipeline (anonymized aggregate values) leave your data warehouse. You can read more about the Eppo data pipeline on the [Data Pipeline](/data-management/data-pipeline) page.

Eppo's SQL definitions are managed in the "Definitions" section on the left navigation bar. Here you'll see all of the definitions that have been mapped into Eppo. The section below talks through the four types of SQL definitions in Eppo: facts, assignments, entry points, and entity properties.

## SQL Definitions

### Facts (required)

Fact tables are the building blocks of metrics in Eppo. In the simplest case, a fact just needs to contain a timestamp and an identifier for the experiment subject (e.g., user). Facts can also include optional numeric columns (revenue, time spent on page, etc.), or categorical properties (purchase type, device type, etc.) to leverage in downstream analysis. Common examples of facts include:

1. Purchase data with purchase timestamp, revenue amount, and categorical properties like product type or user device.
2. Click stream event data. This table typically includes the timestamp the event occurred, the associated user or cookie identifier, and the name of the event: `add_to_cart`, `checkout_started`, etc.
3. Pre-aggregated user-level data. This data is typically aggregated to the session or daily level and contains columns for the metrics of interest: revenue, subscription status, etc.

Fact tables should point at raw or lightly aggregated data. Eppo's pipeline will manage the aggregation of these facts by experiment subject and, ultimately, experiment variant.

Read more about fact tables [here](/data-management/definitions/fact-sql).

### Assignments (required)

Fact tables are all you need to create metrics. To analyze experiments, you'll also need to add assignment tables. These tables include information about who was enrolled into an experiment, at what time they were exposed, and which variant they received. 

If you are already running experiments, you can add your existing assignment logs as assignment tables in Eppo. This might include randomization logs from an internal feature flagging service, a email marketing service, or even a flat file randomized in Excel. If you are just getting started using Eppo, you can still use historical assignment logs to analyze past experiments.

For Eppo-randomized experiments, this table to will point to where the Eppo analytic event is tracked (see [Assignment Logging](/sdks/event-logging/assignment-logging/) for details). Note that if you are using Eppo's event logger to track assignments, an assignment table will be created automatically.

Assignment tables contain subject-level properties. These categorical columns are used to filter and segment experiment results, and are also used as additional control variables in Eppo's [CUPED++ variance reduction model](/statistics/cuped/).

Finally, assignment tables can capture advanced experiment designs such as pre-authenticated traffic splits and clustered experiments. Read more about this and assignment tables in general [here](/data-management/definitions/assignment-sql).

### Entry Points (optional)

Facts and assignments are all you need to start analyzing experiments. If you want to use Eppo to plan sample size and run time for new tests however, you'll need to add entry points. Entry points are the qualifying events that are used to size experiments. For example, if you want to size an experiment based on the number of users who have added an item to their cart, you'll need to add an entry point for the `add_to_cart` event.

Entry Points can be thought of as simplified facts. All you need to specify an entry point is a table of subject identifiers (e.g., user IDs), and the timestamp at which they hit the qualifying event of interest (add to cart, session started, support ticket filed, etc.). Read more about entry points and the sample size calculator [here](/statistics/sample-size-calculator/setup/).

You can also use entry points to filter experiment analyses. This is useful when users are assigned a variant upstream of their actual exposure into the test. You can read more about filtering experiments by entry point [here](/experiment-analysis/configuration/filter-assignments-by-entry-point/).


### Entity Properties (optional)

The final type of definition in Eppo is entity properties. Entity properties are used to specify static entity-level (typically user-level) properties that don't change as a part of an experiment. Examples include original marketing channel, region, or user age. 

Note that entity properties should only be used for static properties. If a subject's property value changes over time, it should instead be added as a property on the assignment table. This way Eppo can guarantee that the property value at the start of the experiment is used. This helps simplify analysis and give more robust results.

Read more about entity properties [here](/data-management/definitions/property-sql).
