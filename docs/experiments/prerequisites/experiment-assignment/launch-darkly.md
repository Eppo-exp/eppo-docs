# LaunchDarkly

## Set up feature flagging with LaunchDarkly

If you have not already integrated LaunchDarkly with your application, you can do so by following the [Getting Started with LaunchDarkly](https://docs.launchdarkly.com/home/getting-started) guide on the LaunchDarkly docs site.

## Export data from LaunchDarkly

In order to perform its analyses, Eppo needs access to an assignment table in your data warehouse that lists each user that comes through the system and which variant they saw at which time.

| timestamp | user_id | experiment | variation |
| --------- | ------- | ---------- | --------- |
| 2021-06-22T17:35:12.000Z | 165740867980881574 | adding_BNPL_experiment | affirm |

By default, LaunchDarkly does not make accessible the data which allows Eppo to determine which users were assigned/exposed to any given feature/experiment.

To access this data, you have a couple of options:

- [Pay to export data from LaunchDarkly to PubSub Systems](https://docs.launchdarkly.com/home/getting-started)
  - If you go this route, you will subsequently then need to move the data from the pubsub system to the data warehouse.
- [Log assignments manually with wrapper code](../../connecting-your-data/assignment-tables/assignment-table-launchdarkly)
