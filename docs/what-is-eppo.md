---
sidebar_position: 2
id: what-is-eppo
---

# What is Eppo?

Eppo is a next-generation feature flag and experimentation platform built right on top of your data warehouse:

![What is Eppo Gif](/img/building-experiments/what-is-eppo.gif)

We offer companies an end-to-end suite of experimentation tools, but let you decide which ones are right for you. Here are a few common ways teams use Eppo:

- For [**experiment analysis**](/experiment-quickstart) alongside another feature flagging tool such as LaunchDarkly.
- For [**feature flagging**](/feature-flag-quickstart) without experimentation.
- As an [**end-to-end experimentation platform**](/feature-flags/use-cases/experiment-assignment) - both feature flagging and analysis.

<br />

# How feature flagging works

Eppo’s lightweight [feature flagging SDKs](/feature-flags/sdks) can run on either the client- or server-side. Our SDKs span the most common tech stacks, including [Node](/feature-flags/sdks/node), [JavaScript](/feature-flags/sdks/javascript) (including [React](/feature-flags/sdks/react)), [Python](/feature-flags/sdks/python), [Go](/feature-flags/sdks/go), [PHP](/feature-flags/sdks/php), [Ruby](/feature-flags/sdks/ruby), [iOS](/feature-flags/sdks/ios), and [Android](/feature-flags/sdks/android).

Creating a feature flag in Eppo involves the following steps:

1. Set up variations, with values that you control from the SDK
2. Optionally, you can create fine-tuned targeting allocations that allow you to target subjects that match specific rules.
3. Initialize the SDK.
4. Embed the SDK in your code base.
5. Enable the feature flag in your test or production environment.
6. Log which experiments a user has been exposed to. You can pass in a [logging callback](https://docs.geteppo.com/experiments/prerequisites/event-logging/) to any SDK (e.g. a wrapper around Segment or Rudderstack) to route Eppo assignments to your data warehouse.

# How experiment analysis works

Eppo's analysis is built on top of your data warehouse. Concretely, this means experiment results are computed within the warehouse without data ever leaving your system. As part of that process, intermediate and aggregate tables are always available in the warehouse for you to audit. In Eppo business metrics are defined in SQL, the same definitions that you use for business reporting.

![How Eppo Works](/img/building-experiments/how-eppo-works.png)

Generating an experiment report on Eppo involves five pieces:

1. Use your feature flagging tool of choice to send experiment assignments into your data warehouse.
2. Connect Eppo to your data warehouse. Currently Eppo supports [Snowflake](/how-tos/connecting-dwh/snowflake), [Redshift](/how-tos/connecting-dwh/redshift), [BigQuery](/how-tos/connecting-dwh/bigquery), and [Databricks](/how-tos/connecting-dwh/databricks).
3. Annotate experiment assignments and event streams by writing short SQL snippets.
4. Monitor your experiments' progress.
5. Explore and share experiment results.

<br />
