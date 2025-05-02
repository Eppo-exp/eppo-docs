---
sidebar_position: 1
id: home
slug: /
---

import FeatureCard from '../src/components/FeatureCard';
import ClientSDKsGrid from '../src/components/ClientSDKsGrid';
import ServerSDKsGrid from '../src/components/ServerSDKsGrid';

# Welcome to the Eppo Docs

Eppo is a composable next-generation feature flagging and experimentation platform focused on tightly integrating with your existing tech stack. 

To get started right away, check out one of our quickstart guides below. Otherwise, read on to learn more about Eppo's approach to experimentation.

<div className="feature-card-container">
  <FeatureCard 
    title="Create a Feature Flag" 
    description="Add a kill switch, plan a gradual rollout, or run an experiment"
    link="/quick-starts/sdk-integration/creating-a-flag/"
    iconSrc="/img/what-is-eppo/feature-flag.svg"
  />
  <FeatureCard 
    title="Create a Metric" 
    description="Annotate data in your warehouse and create a metric"
    link="/quick-starts/analysis-integration/adding-metrics/"
    iconSrc="/img/what-is-eppo/metric.svg"
  />
  <FeatureCard 
    title="Analyze an Experiment" 
    description="Measure the impact of a past or running experiment"
    link="/quick-starts/analysis-integration/creating-experiment-analysis/"
    iconSrc="/img/what-is-eppo/experiment.svg"
  />
</div>

## Eppo's Architecture

Eppo has two main components: a lightweight SDK to control feature rollouts, kill switches, and advanced experimentation use cases, and an analytics platform for experiment analysis and program management. These two components fit naturally into your tech stack. We have SDKs for most modern development frameworks, and support a variety of deployment options. Our warehouse-native analysis engine is tightly coupled with your existing data, either through our data annotation UI or through our code-based semantic framework.

<div align="center">
<img src="/img/what-is-eppo/basic-architecture.png" alt="What is Eppo" className="with-shadow" />
</div>


### The Eppo SDK

Eppo's SDK supports feature gating, progressive rollouts and randomized experimentation through a simple, reusable interface. Our SDK is designed to be easy to get started with while also providing flexibility for more advanced deployment patterns. 

Feature gates and experiments are configured in Eppo's UI. Eppo then turns this into a generalized configuration file and distributes it across our global CDN. On initialization, this file is downloaded and cached locally (either on the user's device or on your server, depending on the SDK). Evaluating which variant a user should see is then done locally within the SDK with no further network requests. Most SDKs will also handle polling for you to ensure the configuration is up to date.

<img src="/img/what-is-eppo/sdk-architecture.png" alt="What is Eppo" className="with-shadow" />

Eppo's SDK does not do any tracking of its own, meaning that no user-level data passes through Eppo's system. Instead you'll pass in a simple interface to your existing event tracking system. In addition to mitigating security risks of using a third party vendor, this also simplifies considerations around ad blocking and cookie consent.

To learn more about Eppo's SDK, see the [SDK docs](/sdks) or check out one of our quickstart guides below:

#### Client SDKs

<ClientSDKsGrid />

#### Server SDKs

<ServerSDKsGrid />

### The Eppo Analytics Platform

Eppo processes experiment data within your data warehouse environment. This means that no data leaves your system and that you have full visibility into the SQL logic used to produce results. Further, Eppo will always use the latest logic for core business metrics. If this logic or data ever changes, Eppo can automatically recompute results to account for those changes without you having to update any data pipelines specific to experimentation.

Metrics are added to Eppo by pointing Eppo at existing data models in your data warehouse. This can be a basic `select * from ...` statement, or a more complex SQL definition. Since Eppo's analysis engine is built on SQL, you can be very flexible in defining metrics.

Once you've annotated your data models into Eppo's data model, you can craft metrics using either the in-app metric builder, or in code using Eppo's metric yaml standard. 

<div align="center">
<img src="/img/what-is-eppo/analytics-architecture.png" alt="What is Eppo" className="with-shadow" />
</div>

Eppo is designed so that once a Data team has annotated tables in their warehouse, anyone in the company can use them to plan, monitor, and analyze experiments. This is paired with a comprehensive set of automated diagnostics to ensure that data quality and statistical rigor are both held to a high standard. 


Generating an experiment report on Eppo involves five steps:

1. Connect Eppo to your data warehouse: [Snowflake](/data-management/connecting-dwh/snowflake), [Redshift](/data-management/connecting-dwh/redshift), [BigQuery](/data-management/connecting-dwh/bigquery), or [Databricks](/data-management/connecting-dwh/databricks)
2. Point Eppo at randomization logs from Eppo's SDK, or your own email marketing system, ML models, or other surface area on which you experiment
3. Map metric data in your warehouse into Eppo's entity, fact, and dimension data model
4. Analyze the impact the experiment had on business metrics
5. Perform diagnostics, deep dive on results, and curate learnings in sharable experiment reports

To learn more about Eppo's analytics platform, check out the [Data Management](/data-management) and [Experiment Analysis](/experiment-analysis) sections.

## Navigating the docs

The docs are organized into the following sections:

### Getting Started

Start here for basic 10 minute tutorials on using core Eppo functionality.

<h4>Analysis Integration</h4>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
  <div>
    <ul>
      <li><a href="/quick-starts/analysis-integration/connect-warehouse/">**Connecting your Warehouse**</a></li>
      <li><a href="/quick-starts/analysis-integration/adding-metrics/">**Adding metrics**</a></li>
      <li><a href="/quick-starts/analysis-integration/creating-experiment-analysis/">**Analyzing experiments**</a></li>
    </ul>
  </div>
  <div>
    <ul>
      <li><a href="/quick-starts/analysis-integration/sizing-a-test/">**Sizing experiments**</a></li>
      <li><a href="/quick-starts/analysis-integration/defining-protocols/">**Defining protocols**</a></li>
    </ul>
  </div>
</div>

<h4>SDK Integration</h4>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
  <div>
    <ul>
      <li><a href="/quick-starts/sdk-integration/creating-a-flag/">**Creating a flag**</a></li>
    </ul>
  </div>
  <div>
    <ul>
      <li><a href="/quick-starts/sdk-integration/launching-an-experiment/">**Launching an experiment**</a></li>
    </ul>
  </div>
</div>

<h4>Advanced Use Cases</h4>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
  <div>
    <ul>
      <li><a href="/bandit-quickstart/">**Launching a Contextual Bandit**</a></li>
    </ul>
  </div>
  <div>
    <ul>
      <li><a href="/geolift-quickstart/">**Creating a Geolift test**</a></li>
    </ul>
  </div>
</div>

### Core Concepts

- [**Flag and experiment configuration**](/feature-flagging) - Learn the core concepts, workflows, and use cases for Eppo feature flags and how to configure them in the UI, as well as details on advanced concepts like targeting, mutual exclusion, and global holdouts.
- [**SDKs**](/sdks) - Learn about how to install and use Eppo's SDKs into your environment(s), as well as more details on the Eppo architecture and supported deployment patterns.
- [**Data Management**](/data-management) - Learn about Eppo's data and metric model, how to connect your data warehouse, and how to use Eppo to manage data governance across experimentation use cases.
- [**Experiment Analysis**](/experiment-analysis) - Learn how to create experiment analysis in Eppo's UI, as well as how to deep dive into experiment results and curate custom experiment reports to communicate and track learnings.
- [**Contextual Bandits**](/contextual-bandits) - Learn how to use Eppo to personalize user experiences with contextual bandits.

### Reference
- [**Guides**](/guides) - Dive into detailed guides on advanced use cases including marketing integrations, engineering tutorials, and advanced experimentation topics.
- [**Statistics**](/statistics) - Learn about the nitty-gritty details of how Eppo's statistical engine works, including confidence interval methods, CUPED++, sample size calculation, and more.
- **Administration** - Learn about Eppo's approach to Role Based Access Control, SSO, SCIM, Teams, and other global admin settings.

:::note
Need help? Do not hesitate to reach out to us via support@geteppo.com; we would love to hear from you!
:::