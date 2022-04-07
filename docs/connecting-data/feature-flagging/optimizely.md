# Optimizely

## Set up feature flagging with Optimizely

If you have not already integrated Optimizely with your application, you can do so by following the [Getting Started with Optimizely](https://docs.launchdarkly.com/home/getting-started) guide on the Optimizely docs site.

## Export data from Optimizely to your data warehouse

By default, Optimizely does not make accessible the data which allows Eppo to determine which users were assigned/exposed to any given feature/experiment. To access this data, you have a couple of options:

- [Pay to Export data from Optimizely to Snowflake](https://docs.developers.optimizely.com/optimizely-data/docs/snowflake-integration)
- [Make a wrapper around feature flag calls in your own codebase](./wrap-feature-flag.md)
