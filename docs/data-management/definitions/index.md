# Definitions

Definitions tell Eppo how to use the data in your data warehouse. These basic SQL definitions are compiled into a larger SQL data pipeline that computes experiment-level summaries. Only the end result of this data pipeline (anonymized aggregate values) leave your data warehouse. You can read more about the Eppo data pipeline on the [Data Pipeline](/experiment-analysis/data-pipeline) page.

There are four types of SQL Definitions in Eppo:

1. [**Assignment SQL**](/data-management/definitions/assignment-sql) - a log of each time a subject (e.g., user) was assigned to an 
experiment. These assignments can be created by Eppo's SDK or by any existing randomization service (email marketing system, internal randomization service, etc.). Assignment SQLs can also contain [Entity Properties](/data-management/properties#entity-properties).

2. [**Fact SQL**](/data-management/definitions/fact-sql) - the metric events to be analyzed in Eppo. Each Fact SQL contains one or more entity identifiers (`user_id`, `company_id`, `anonymous_id`, ...), fact values (`purchase_revenue`, `purchase_profit`, ...), and optional fact properties (`purchase_type`, ...).

3. [**Entity Property SQL**](/data-management/definitions/property-sql) - entity models with static properties.

4. [**Entry Point SQL**](/statistics/sample-size-calculator/setup#entry-points) - a list of qualifying events used to [size experiments](/statistics/sample-size-calculator/) and [filter experiment assignments](/experiment-analysis/configuration/filter-assignments-by-entry-point).
