---
title: Introduction
sidebar_position: 1
---

# Eppo Feature Flags

Feature flags enable you to easily toggle features on and off, conduct A/B/n testing, gradually roll out new functionality, and personalize user experiences — all without the need for extensive code deployments. With feature flags, you can empower your team to make dynamic changes, iterate quickly, and deliver enhanced user experiences with ease.

:::info
This section of the docs covers configuring feature flags and experiments in Eppo's UI. For developer guides on integrating Eppo into your tech stack, please see the [SDKs](/sdks) section.
:::

## Concepts

The following are the central feature flagging concepts in Eppo:
- [Variations](/feature-flagging/concepts/flag-variations)
- [Allocations](/feature-flagging/concepts/flag-allocations)
- [Environments](/feature-flagging/concepts/environments)
- [Targeting rules](/feature-flagging/concepts/targeting)
- [Audiences](/feature-flagging/concepts/audiences)
- [Mutual exclusion](/feature-flagging/concepts/mutual_exclusion)

:::caution Flag archival is irreversible
Archiving a feature flag is a **permanent** action — archived flags cannot be unarchived. Before archiving, ensure no running experiments or rollouts depend on the flag. If you need to temporarily disable a flag, turn off all allocations instead.

The flag key of an archived flag can be reused when creating a new flag. However, reusing a key that existing SDK clients may still reference can cause unexpected behavior (the new flag's configuration will be served for the same key). Prefer choosing a new key unless you are certain no deployments reference the old one.
:::

## Use cases

Feature flags are applicable for a number of use cases:
- [Feature gates](/feature-flagging/concepts/feature-gates)
- [Experiment assignment](/feature-flagging/concepts/experiment-assignment)
- [Progressive rollouts](/feature-flagging/use-cases/progressive-rollouts)
- [Kill switches](/feature-flagging/use-cases/kill-switches)
- [Dynamic configuration](/feature-flagging/use-cases/dynamic-config)