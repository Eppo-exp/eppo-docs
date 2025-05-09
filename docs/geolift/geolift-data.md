---
sidebar_position: 7
---
# Data Model

## Overview

Eppo Geolift leverages Eppo's metric primitives but has additional considerations when compared to A/B testing, detailed in this document.

Geolift focuses on detecting attributable differences in the Metrics analyzed from ground up, at aggregated levels.

## Planning New Tests

To plan a new test, consider:

- The channel, creative, or campaign you'd like to test
- The business question or hypothesis you'd like to answer
- What units of randomization might fit your data (see below)
- Any units/regions that must be included in treatment or excluded from the synthetic control
- Eligible testing dates (blackout periods, promotional periods, other tests in-flight)

## Analyzing Existing Tests

To analyze an existing test, consider:

- The baseline test design
- The start and end dates of the intervention
- The unit of randomization (see below)
- The units/regions included in treatment and included in control

## Geolift Units

In A/B testing, the unit of analysis is often a user, account, order, etc. In Geolift, the units of analysis are usually geographies or a set of non-geographic units that are more aggregated than individal actions. For example, in a regional geotest, the treatment and control would vary across US States, DMAs, or postal code clusters.

The Geolift unit of analysis is created as an **Entity** in Eppo. The provided units are read as strings and must be consistent across the entire pipeline, including KPI modeling, spend data, and results.

Eppo supports multiple entities across Geolift, A/B testing, and contextual bandits. [Read more on how to create entities that match your business here.](../../data-management/definitions/entities/)

### Geographic Units

Popular geographic levels include:

- US Regions (DMAs, MSAs)
- Commuting Zones
- ZIP/Postal Code Clusters
- States
- Countries

### Non-Geographic Units

Popular non-geographic levels include:

- Retail stores
- Fufillment centers
- Web pages

:::tip

The unit should be consistently available across:

- **Targeting** (e.g. ad platform location inclusion/exclusion controls)
- **Spend reporting** (e.g. ad platform reporting breakdowns)
- **Metric reporting** (e.g. transaction-level dimensions)

:::

### Metrics and Spend

Primary and secondary metrics and ad spend data are made available to the Eppo Geolift system by creating [**Metrics**](/data-management/metrics/simple-metric/). Generally, a Metric should be aligned with the source of truth in your warehouse. For Geolift, the most important factors are:

- The **Entity** to be analyzed is mapped to the column that contains its values
- The **Entity value (e.g. location)** is attached to the Metric

Geolift supports SUM and COUNT aggregations. The Metric layer is also where filtering can be performed on values that are supplied as Fact Properties.

### Spend

Ad spend data is supplied through the same process as your measurement metrics -- creating a SUM metric that maps to the appropriate level of aggregation and matches the intervention.

## Historical Data Needs

For your Primary Metric, we require at least three months of historical data to exist in the system. We support up to 18 months of data.