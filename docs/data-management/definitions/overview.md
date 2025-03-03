---
sidebar_position: 1
---

# Overview

Eppo's analysis engine is fully powered by SQL. This means that anything in your warehouse can be leveraged in Eppo's experimentation analysis pipeline. This section describes the SQL definition that tells Eppo how to leverage the data in your warehouse.

These basic SQL definitions are compiled into a larger SQL data pipeline that computes experiment-level summaries. Only the end result of this data pipeline (anonymized aggregate values) leave your data warehouse. You can read more about the Eppo data pipeline on the [Data Pipeline](/data-management/data-pipeline) page.

There are four types of SQL Definitions in Eppo:

1. [**Assignment SQL**](/data-management/definitions/assignment-sql) - a log of each time a subject (e.g., user) was assigned to an 
experiment. These assignments can be created by Eppo's SDK or by any existing randomization service (email marketing system, internal randomization service, etc.). Assignment SQLs can also contain [Entity Properties](/data-management/definitions/properties#entity-properties).

2. [**Fact SQL**](/data-management/definitions/fact-sql) - the metric events to be analyzed in Eppo. Each Fact SQL contains one or more entity identifiers (`user_id`, `company_id`, `anonymous_id`, ...), fact values (`purchase_revenue`, `purchase_profit`, ...), and optional fact properties (`purchase_type`, ...).

3. [**Entity Property SQL**](/data-management/definitions/property-sql) (optional) - entity-level models with static properties.

4. [**Entry Point SQL**](/statistics/sample-size-calculator/setup#entry-points) (optional) - a list of qualifying events used to [size experiments](/statistics/sample-size-calculator/) and [filter experiment assignments](/experiment-analysis/configuration/filter-assignments-by-entry-point).
