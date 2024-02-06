---
sidebar_position: 1
id: home
slug: /
---

# What is Eppo?

Eppo is a next-generation feature flag and experimentation platform built right on top of your data warehouse:

![What is Eppo Gif](/img/building-experiments/what-is-eppo.gif)

We offer companies an end-to-end suite of experimentation tools, but let you decide which ones are right for you. Here are a few common ways teams use Eppo:

- As an [**end-to-end experimentation platform**](/quick-starts) - feature flagging, randomization, and analysis.
- For [**experiment analysis**](/experiment-quickstart) alongside internal or third party randomization systems.
- For [**feature flagging**](/feature-flagging) without experimentation.

<br />

# How feature flagging works

Eppo feature flag support feature gating, progressive rollouts, and randomized experiments with one consistent and intuitive interface. Eppo's lightweight SDKs can run either client side or server side. Our SDKs span the most common tech stacks, including [Node](/sdks/server-sdks/node), [JavaScript](/sdks/client-sdks/javascript) (including [React](/sdks/client-sdks/javascript#usage-in-react)), [Python](sdks/server-sdks/python), [Go](sdks/server-sdks/go), [PHP](sdks/server-sdks/php), [Ruby](sdks/server-sdks/ruby), [iOS](/sdks/client-sdks/ios), and [Android](/sdks/client-sdks/android).

Using an Eppo feature flag involves the following steps:
1. Encode the variant values as booleans, strings, JSONs, or numerics
2. Specify allocation logic for what traffic should see what variants (including randomized variants)
3. Install the Eppo SDK 
4. Initialize the SDK with an environment-specific SDK key and provide a [logging callback](/sdks/event-logging/) function to track exposures in your data warehouse
5. Enable the feature flagging in your local, test, or production environment

# How experiment analysis works

Eppo's analysis is built on top of your data warehouse. Concretely, this means experiment results are computed within the warehouse without data leaving your system. As part of that process, intermediate and aggregate tables are available in the warehouse for you to audit. In Eppo metrics are defined in SQL, the same definitions that you use for business reporting.

![How Eppo Works](/img/building-experiments/how-eppo-works.png)

Generating an experiment report on Eppo involves five pieces:

1. Point Eppo at randomization logs from your application, email marketing system, ML models, or any other surface area on which you experiment
2. Connect Eppo to your data warehouse: [Snowflake](/data-management/connecting-dwh/snowflake), [Redshift](/data-management/connecting-dwh/redshift), [BigQuery](/data-management/connecting-dwh/bigquery), or [Databricks](/data-management/connecting-dwh/databricks)
3. Map the tables in your warehouse into Eppo's fact and dimension data models
4. Analyze the impact the experiment had on business metrics
5. Perform diagnostics, deep dive on results, and curate learnings in sharable experiment reports

## Navigating the docs

If you are just getting started with Eppo, check out our [getting started guides](/quick-starts). If you want to dive deeper into how Eppo works and Eppo's full functionality, check out the following pages:

1. [SDKs](/sdks)
2. [Feature flagging](/feature-flagging)
3. [Experimentation analysis](/experiment-analysis)
4. [Data management](/data-management)
5. [Statistics](/statistics)

Finally, check out our [how to guides](/guides/) to get detailed instruction on how to best accomplish advanced tasks, such as integrating with third-party tools and performing advanced analysis.


:::note
Need help? Do not hesitate to reach out to us via `support@geteppo.com`; we would love to hear from you!
:::