---
sidebar_position: 1
id: home
slug: /
---

import FeatureCard from '../src/components/FeatureCard';

# What is Eppo?

Eppo is a composable next-generation feature flagging and experimentation platform focused on tightly integrating with your existing tech stack. 

To get started right away, check out one of our quickstart guides below. Otherwise, read on to learn more about Eppo's approach to experimentation.

<div className="feature-card-container">
  <FeatureCard 
    title="SDK Quickstart" 
    description="Install the SDK and create a basic flag"
    link="/feature-flag-quickstart/"
    iconSrc="/img/what-is-eppo/feature-flag.svg"
  />
  <FeatureCard 
    title="Creating a Metric" 
    description="Annotate data in your warehouse and create a metric"
    link="/metric-quickstart/"
    iconSrc="/img/what-is-eppo/metric.svg"
  />
  <FeatureCard 
    title="Analyzing an Experiment" 
    description="Measure the impact of a past or running experiment"
    link="/experiment-quickstart/"
    iconSrc="/img/what-is-eppo/experiment.svg"
  />
</div>

## Eppo's Architecture

Eppo has two main components: a lightweight SDK to control feature rollouts, kill switches, and advanced experimentation use cases, and an analytics platform for experiment analysis and program management. These two components fit naturally into your tech stack. We have SDKs for most modern development frameworks, and support a variety of deployment options. Our warehouse-native analysis engine is tightly coupled with existing data, either through our data annotation UI or through code-based semantic modeling. 

<div align="center">

![What is Eppo](/img/what-is-eppo/basic-architecture.png)

</div>


### The Eppo SDK

Eppo's SDK supports feature gating, progressive rollouts and randomized experimentation through a simple, reusable interface. Our SDK is designed to be easy to get started with while also providing flexibility for more advanced deployment patterns. 

Feature gates and experiments are configured in Eppo's UI. Eppo then turns this into a generalized configuration file and distributes it across our global CDN. On initialization, this file is downloaded and cached locally (either on the user's device or on your server depending on the SDK). Evaluating which variant a user should see is then done locally within the SDK with no further network requests. Most SDKs will also handle polling for you to ensure the configuration is up to date.

![Eppo SDK](/img/what-is-eppo/sdk-architecture.png)

Eppo's SDK does not do any tracking of its own, meaning that no user-level data passes through Eppo's system. Instead you'll pass in a simple interface to your existing event tracking system. In addition to mitigating security risks of using a third party vendor, this also simplifies considerations around ad blocking and cookie consent.

To learn more about Eppo's SDK, check out the [SDK docs](/sdks) or read the [quickstart guide](/feature-flag-quickstart).

### The Eppo Analytics Platform

Eppo processes experiment data within your data warehouse environment. This means that no data leaves your system and that you have full visibility into the SQL logic used to produce results. Further, Eppo will always use the latest logic for core business metrics. If this logic or data ever changes, Eppo can automatically recompute results to account for those changes without you having to update any data pipeline specific to experimentation.

Metrics are added to Eppo by pointing Eppo at existing data models in your data warehouse. This can be a basic `select * from ...` statement, or a more complex SQL definition. Since Eppo's analysis engine is built on SQL, you can be very flexible in defining metrics.

Once you've annotated your data models into Eppo's data model, you can craft metrics using either the in-app metric builder, or in code using Eppo's metric yaml standard. 

![Eppo Analytics](/img/what-is-eppo/analytics-architecture.png)

Eppo is designed so that once a Data team has annotated tables in their warehouse, anyone in the company can use them to plan, monitor, and analyze experiments. This is paired with a comprehensive set of diagnostic tools to ensure that data quality and statistical rigor in the analysis are both held to a high standard. 


Generating an experiment report on Eppo involves five steps:

1. Connect Eppo to your data warehouse: [Snowflake](/data-management/connecting-dwh/snowflake), [Redshift](/data-management/connecting-dwh/redshift), [BigQuery](/data-management/connecting-dwh/bigquery), or [Databricks](/data-management/connecting-dwh/databricks)
2. Point Eppo at randomization logs from Eppo's SDK, or your own email marketing system, ML models, or other surface area on which you experiment
3. Map metric data in your warehouse into Eppo's entity, fact, and dimension data model
4. Analyze the impact the experiment had on business metrics
5. Perform diagnostics, deep dive on results, and curate learnings in sharable experiment reports

## Navigating the docs

To quickly get up and running, check out our [getting started guides](/quick-starts). If you want to dive deeper into how Eppo works and understand Eppo's full functionality, check out the following pages:

1. [Flag and experiment configuration](/feature-flagging)
2. [SDKs](/sdks)
3. [Experimentation analysis](/experiment-analysis)
4. [Data management](/data-management)
5. [Contextual bandits](/contextual-bandits)
6. [Statistics](/statistics)

Finally, check out our [how to guides](/guides/) to get detailed instruction on how to best accomplish advanced tasks, such as integrating with third-party tools and performing advanced analysis.


:::note
Need help? Do not hesitate to reach out to us via support@geteppo.com; we would love to hear from you!
:::