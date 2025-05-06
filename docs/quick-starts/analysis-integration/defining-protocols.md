---
title: Creating an experiment protocol
sidebar_position: 5
---

## Introduction

For most businesses, the majority of experiments fall into a few common patterns. For instance, a product development team might measures the same guardrail metrics for every feature rollout. Similarly, a search ranking team might routinely tests different algorithms and measure a similar set of metrics for each experiment.

Further, these use cases often have different requirements for decision making. A new ranking algorithm might only get rolled out if we have high confidence that it's indeed better than the incumbent algorithm. On the other hand, a team managing a technical migration might instead just want to ensure no regressions are introduced in key performance or business metrics.

**Experiment Protocols** in Eppo let you standardize the metrics, analysis methods, and decision criteria for each experimentation use case at you business. Specifically, protocols let you:
1. Streamline experiment analyses by allowing users to select from a pre-approved set of experiment designs
2. Standardize the metrics and analysis method for each experimentation use case
3. Pre-register and standardize the decision criteria for your experiments

This page gives a high-level overview of how to create an experiment protocol. For more details on protocols, see the full docs [here](/experiment-analysis/configuration/protocols).

## Creating a protocol

To create an experiment protocol, navigate to **Admin** > **Experiment Protocols** and click **Create Protocol**:

![Create protocol button](/img/experiments/protocols/protocol-creation.png)

Once you've given the protocol a name, you'll be able to configure the following settings:

- **Team** - What team is this protocol relevant for? You can also select "Global Protocol" to make it available to all users.
- **Analysis Settings** - What entity is tested, what assignment SQL to use, what statistical methods to use, and how long experiments should run by default.
- **Decision Criteria** - What primary and guardrail metrics should be used in decision making? What criteria should be met before recommending rolling out a variant?
- **Metrics** - Other than the primary and guardrail metrics, what other secondary metrics should be tracked?
- **Advanced Settings** - What metric property breakouts should be computed?

Once you've configured the protocol, you can publish it to make it available to users.

## Using protocols to create experiment analyses

Once you've created a protocol, you can use it to create experiment analyses. To do so, navigate to **Analysis** > **Create Analysis** and select the protocol you'd like to use:

![Create analysis from protocol](/img/experiments/protocols/protocol-create-experiment.png)

Once you've selected a protocol, the analysis will be pre-configured with the metrics, analysis methods, and decision criteria defined in the protocol.

Congratulations! You've now created your first experiment protocol. Moving forward, analyzing a net new experiment will be as easy as selecting the protocol you want to use and selecting the flag allocation you want to analyze.
