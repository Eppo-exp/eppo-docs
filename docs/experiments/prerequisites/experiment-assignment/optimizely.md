# Optimizely

## Set up feature flagging with Optimizely

If you have not already integrated Optimizely with your application, you can do so by following the [Getting Started with Optimizely](https://docs.launchdarkly.com/home/getting-started) guide on the Optimizely docs site.

## Export data from Optimizely to your data warehouse

In order to perform its analyses, Eppo needs access to an assignment table in your data warehouse that lists each user that comes through the system and which variant they saw at which time.

| timestamp | user_id | experiment | variation |
| --------- | ------- | ---------- | --------- |
| 2021-06-22T17:35:12.000Z | 165740867980881574 | adding_BNPL_experiment | affirm |

By default, Optimizely does not make accessible the data which allows Eppo to determine which users were assigned/exposed to any given feature/experiment. To access this data, you have a couple of options:

- [Pay to Export data from Optimizely to Snowflake](https://docs.developers.optimizely.com/optimizely-data/docs/snowflake-integration)
- [Log assignments manually with wrapper code](../../connecting-your-data/assignment-tables/assignment-table-optimizely)

In order to perform its analyses, Eppo needs access to an assignment table in your data warehouse that lists each user that comes through the system and which variant they saw at which time.

| timestamp | user_id | experiment | variation |
| --------- | ------- | ---------- | --------- |
| 2021-06-22T17:35:12.000Z | 165740867980881574 | adding_BNPL_experiment | affirm |
