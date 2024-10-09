---
title: Introduction
sidebar_position: 1
---

# Eppo's SDKs

Eppo's SDKs all follow a similar architecture and interface. Whether you are using Eppo for feature gates, progressive rollouts, or randomized experiments, you can determine what variant a specific subject (e.g., user) should see with a call like this:


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
