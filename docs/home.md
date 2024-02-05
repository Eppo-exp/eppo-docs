---
sidebar_position: 1
id: home
slug: /
---

# What is Eppo?

Eppo is a next-generation feature flag and experimentation platform built right on top of your data warehouse:

![What is Eppo Gif](/img/building-experiments/what-is-eppo.gif)

We offer companies an end-to-end suite of experimentation tools, but let you decide which ones are right for you. Here are a few common ways teams use Eppo:

- For [**experiment analysis**](/experiment-quickstart) alongside another feature flagging tool such as LaunchDarkly.
- For [**feature flagging**](/feature-flag-quickstart) without experimentation.
- As an [**end-to-end experimentation platform**](/feature-flagging/use-cases/experiment-assignment) - both feature flagging and analysis.

<br />

# How feature flagging works

Eppo’s lightweight feature flagging SDKs can run on either the client- or server-side. Our SDKs span the most common tech stacks, including [Node](/sdks/server-sdks/node), [JavaScript](/sdks/client-sdks//javascript) (including [React](/sdks/client-sdks/javascript#usage-in-react)), [Python](/sdks/server-sdks/python), [Go](/sdks/server-sdks/go), [PHP](/sdks/server-sdks/php), [Ruby](/sdks/server-sdks/ruby), [iOS](/sdks/client-sdks/ios), and [Android](/sdks/client-sdks/android).

Creating a feature flag in Eppo involves the following steps:

1. Set up variations, with values that you control from the SDK
2. Optionally, you can create fine-tuned targeting allocations that allow you to target subjects that match specific rules.
3. Initialize the SDK.
4. Embed the SDK in your code base.
5. Enable the feature flag in your test or production environment.
6. Log which experiments a user has been exposed to. You can pass in a [logging callback](/guides/event-logging/) to any SDK (e.g. a wrapper around Segment or Rudderstack) to route Eppo assignments to your data warehouse.

# How experiment analysis works

Eppo's analysis is built on top of your data warehouse. Concretely, this means experiment results are computed within the warehouse without data ever leaving your system. As part of that process, intermediate and aggregate tables are always available in the warehouse for you to audit. In Eppo business metrics are defined in SQL, the same definitions that you use for business reporting.

![How Eppo Works](/img/building-experiments/how-eppo-works.png)

Generating an experiment report on Eppo involves five pieces:

1. Use your feature flagging tool of choice to send experiment assignments into your data warehouse.
2. Connect Eppo to your data warehouse. Currently Eppo supports [Snowflake](/guides/connecting-dwh/snowflake), [Redshift](/guides/connecting-dwh/redshift), [BigQuery](/guides/connecting-dwh/bigquery), and [Databricks](/guides/connecting-dwh/databricks).
3. Annotate experiment assignments and event streams by writing short SQL snippets.
4. Monitor your experiments' progress.
5. Explore and share experiment results.

## Getting started

If you are just getting started with Eppo, check out these guides to get you up and running in a hurry:

- [Initial Eppo Setup](/setup-quickstart)
- [Your first feature flag](/feature-flag-quickstart)
- [Your first experiment analysis](/experiment-quickstart)
- [How the Eppo experiment data pipeline works](/experiment-analysis/data-pipeline)

## How-to guides

Our [How to guides](/guides/) give you detailed instruction on how to best accomplish advanced tasks, such as integrating with third-party tools and advanced analysis.

## Deep dives

Check out the following pages for deeper dives into specific aspects of the Eppo system

- [SDKs](/sdks)
- [Feature flagging](/feature-flagging)
- [Experimentation analysis](/experiment-analysis)
- [Data management](/data-management)
- [Statistics](/statistics)
<br />


:::note
Need help? Do not hesitate to reach out to us via `support@geteppo.com`; we would love to hear from you!
:::