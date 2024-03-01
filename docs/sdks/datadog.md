---
sidebar_position: 5
---
# Datadog integration

## Overview

This guide will walk through how to send Eppo feature flag assignments as RUM data to Datadog using Eppo’s [Node SDK](/sdks/server-sdks/node.md) and Datadog’s [Node APM Tracer library](https://www.npmjs.com/package/dd-trace). While Node is used for this example, the concepts can be extrapolated to any language that are supported by Eppo SDKs and Datadog environments.

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

// Eppo Assignment logger
const assignmentLogger = {
    logAssignment(assignment) {
      tracer.dogstatsd.increment(
        'flagViewed',
        1,
        {
          allocation: assignment.allocation,
          experiment: assignment.experiment,
          featureFlag: assignment.featureFlag,
          variation: assignment.variation,
          holdout: assignment.holdout,
          holdoutVariation: assignment.holdoutVariation
        }
      )
    },
  };

// Eppo startup
await init({
    apiKey: process.env.EPPO_SDK_KEY,
});

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "<SUBJECT-KEY>",
  "<FEATURE-FLAG-KEY>"
);
```

## Datadog reporting

In this example, we are logging an event called `flagViewed` to Datadog that logs Eppo assignment data like the variation key, assignment key, and feature flag key as properties to that metric in Datadog. Now you can create and save dashboards under [Datadog’s Metrics Explorer](https://docs.datadoghq.com/metrics/explorer/) page with the metric, `flagViewed`, to highlight the correlations between flags and other performance metrics such as CPU to indicate whether a new flag is inadvertently causing performance issues. 

Below is a dashboard created on the Metrics Explorer page that shows the user’s CPU usage, all exposures to our flag called `datadog-testing`, and our variants in that flag called `control` and `variation`. 

![Datadog Feature Flagging Dashboard](/img/feature-flagging/datadog-feature-flag-dashboard.png)