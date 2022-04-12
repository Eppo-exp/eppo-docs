# LaunchDarkly

## Set up feature flagging with LaunchDarkly

If you have not already integrated LaunchDarkly with your application, you can do so by following the [Getting Started with LaunchDarkly](https://docs.launchdarkly.com/home/getting-started) guide on the LaunchDarkly docs site.

## Export data from LaunchDarkly

By default, LaunchDarkly does not make accessible the data which allows Eppo to determine which users were assigned/exposed to any given feature/experiment.

To access this data, you have a couple of options:

- [Pay to export data from LaunchDarkly to PubSub Systems](https://docs.launchdarkly.com/home/getting-started)
  - If you go this route, you will subsequently then need to move the data from the pubsub system to the data warehouse.
- [Make a wrapper around feature flag calls in your own codebase](./wrap-feature-flag.md)
