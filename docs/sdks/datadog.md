---
sidebar_position: 5
---
# Datadog integration

## Overview

This guide will walk through how to send Eppo feature flag assignments as RUM data to Datadog using Eppo’s [Node SDK](/sdks/sever-sdks/node.md) and Datadog’s [Node APM Tracer library](https://www.npmjs.com/package/dd-trace). While Node is used for this example, the concepts can be extrapolated to any language that are supported by Eppo SDKs and Datadog environments.

:::info

This example assumes there is a [feature flag](/feature-flagging/feature-gates.md) set up in Eppo and a [Datadog Agent](https://docs.datadoghq.com/tracing/trace_collection/automatic_instrumentation/dd_libraries/nodejs/) set up.  

:::

## Node Example

The following is an example that shows how to log Eppo feature flag assignments to Datadog as a [metric](https://docs.datadoghq.com/metrics/).

```jsx
import EppoSdk from '@eppo/node-server-sdk';
const { init } = EppoSdk;

import dotenv from 'dotenv'; 
dotenv.config();  // Load environment variables from .env file

// Datadog startup
import tracer from 'dd-trace';
tracer.init(); // initialize

// Eppo startup
await init({
    apiKey: process.env.EPPO_SDK_KEY,
});

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "<SUBJECT-KEY>",
  "<FEATURE-FLAG-OR-EXPERIMENT-KEY>"
);
tracer.dogstatsd.increment('flagViewed', 1, { experiment: '<FEATURE-FLAG-OR-EXPERIMENT-KEY>', variation: variation } );
```

## Datadog reporting

In this example, we are logging an event called `flagViewed` to Datadog that has the experiment key and variation key assigned to the metric as a property. This metric, `flagViewed` can be used to create and save dashboards under [Datadog’s Metrics Explorer](https://docs.datadoghq.com/metrics/explorer/) page that highlight the correlation between what flag and variant was used with other metrics such as CPU that would indicate performance. 

Below is a dashboard created on the Metrics Explorer page that shows the user’s CPU usage, all exposures to our flag called `datadog-testing`, and our variants in that flag called `control` and `variation`. 

![Datadog Feature Flagging Dashboard](/img/feature-flagging/datadog-feature-flag-dashboard.png)