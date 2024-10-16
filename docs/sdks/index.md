---
title: Introduction
sidebar_label: Get Started
sidebar_position: 1
---

import FeatureCard from '../../src/components/FeatureCard';

# Get Started with Eppo's SDKs

Eppo's SDKs offer powerful tools for feature flagging, progressive rollouts, and randomized experiments, designed to work seamlessly across various platforms. Each SDK retrieves flag and experiment configurations, performs local assignments, and logs experiment data for analysis, all while ensuring fast and reliable performance.

You can get started with any of the SDKs below:

## Client SDKs

<div className="feature-card-container">
  <FeatureCard 
    title="iOS" 
    description="Integrate the iOS SDK for feature flags and experiments with instant assignment." 
    link="/sdks/client-sdks/ios" 
    iconSrc="/img/icons/apple.png" 
    noGreyScale 
  />
  <FeatureCard 
    title="Android" 
    description="Use the Android SDK to manage feature flags and log experiment data." 
    link="/sdks/client-sdks/android" 
    iconSrc="/img/icons/android.png" 
    noGreyScale 
  />
  <FeatureCard 
    title="React Native" 
    description="Implement feature flags and experiments with the React Native SDK." 
    link="/sdks/client-sdks/react-native" 
    iconSrc="/img/icons/react-native.png" 
    noGreyScale 
  />
  <FeatureCard 
    title="JavaScript" 
    description="Use the JavaScript SDK for in-browser feature flagging and experiments." 
    link="/sdks/client-sdks/javascript" 
    iconSrc="/img/icons/js.png" 
    noGreyScale 
  />
</div>

## Features

With features like typed assignments, configuration caching, and real-time updates, Eppo’s SDKs are optimized for flexible experimentation and rapid deployment in production environments.

```javascript
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "<FLAG-KEY>",
  "<SUBJECT-KEY>",
  <SUBJECT-ATTRIBUTES>,
  "<DEFAULT-VALUE>",
);
```

Here,`FLAG-KEY` is a unique identifier for the feature of interest (e.g., `new_user_onboarding`). `SUBJECT-KEY` is a unique identifier for the unit on which you are assigning (e.g., `user_id`). `SUBJECT-ATTRIBUTES` provides subject-level properties for targeting (can be an empty object if none are needed). `DEFAULT-VALUE` is the value that will be returned if no allocation matches the subject, if the flag is not enabled, or if the SDK was not able to retrieve the flag configuration.

For experimentation use cases, Eppo uses a deterministic hashing function to ensure that the same variant is returned for a given `SUBJECT-KEY`. This guarantee also holds across different SDKs. That is, experiment assignments from a server SDK will be consistent with experiment assignments from a client SDK for the same `SUBJECT-KEY`.

Before using the Eppo SDK, you'll need to [generate an SDK key](/sdks/sdk-keys) and [create a logging callback function](/sdks/event-logging).

You can read more about our specific SDKs here:
1. [Client SDKs](/sdks/client-sdks)
2. [Server SDKs](/sdks/server-sdks)
