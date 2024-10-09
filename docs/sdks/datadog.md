---
sidebar_position: 6
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Datadog integration

## Overview
This guide will walk through how to send Eppo feature flag assignments as RUM data to Datadog. 
This functionality enhances your ability to monitor user experience and performance by enabling you to identify which users are exposed to a particular feature and assess whether any introduced change impacts the user experience or degrades performance

Enhancing your real-user monitoring data with feature flag information allows you to verify that new features are launched smoothly, without inadvertently introducing bugs or performance regressions. This added level of visibility enables you to establish connections between feature releases and performance metrics, rapidly identify issues tied to specific releases, and expedite troubleshooting efforts.

:::info

This example assumes there is a [feature flag](/feature-flagging/concepts/feature-gates.md) set up in Eppo and the [Datadog RUM SDK](https://docs.datadoghq.com/real_user_monitoring/browser/#setup) set up.  

:::

## Setup
<Tabs>
<TabItem value="javascript" label="Javascript" default>
Initialize Eppo's SDK and create an assignment logger that additionally reports feature flag evaluations to Datadog using the snippet of code shown below.

For more information about initializing Eppo's SDK, see [Eppo's JavaScript SDK documentation](https://docs.geteppo.com/sdks/client-sdks/javascript)

```tsx
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    datadogRum.addFeatureFlagEvaluation(assignment.featureFlag, assignment.variation);
  },
};

await eppoInit({
  apiKey: "<API_KEY>",
  assignmentLogger,
});
```
</TabItem>
<TabItem value="iOS" label="iOS">
Initialize Eppo's SDK and create an assignment logger that additionally reports feature flag evaluations to Datadog using the snippet of code shown below.

For more information about initializing Eppo's SDK, see [Eppo's iOS SDK documentation](https://docs.geteppo.com/sdks/client-sdks/ios)

```swift
func IAssignmentLogger(assignment: Assignment) {
  RUMMonitor.shared().addFeatureFlagEvaluation(featureFlag: assignment.featureFlag, variation: assignment.variation)
}

let eppoClient = EppoClient(apiKey: "mock-api-key", assignmentLogger: IAssignmentLogger)
```
</TabItem>
<TabItem value="android" label="Android">
Initialize Eppo's SDK and create an assignment logger that additionally reports feature flag evaluations to Datadog using the snippet of code shown below.

For more information about initializing Eppo's SDK, see [Eppo's Android SDK documentation](https://docs.geteppo.com/sdks/client-sdks/android)


```java
AssignmentLogger logger = new AssignmentLogger() {
    @Override
    public void logAssignment(Assignment assignment) {
      GlobalRumMonitor.get().addFeatureFlagEvaluation(assignment.getFeatureFlag(), assignment.getVariation());
    }
};

EppoClient eppoClient = new EppoClient.Builder()
    .apiKey("YOUR_API_KEY")
    .assignmentLogger(logger)
    .application(application)
    .buildAndInit();
```

</TabItem>
<TabItem value="react" label="React Native">
Initialize Eppo's SDK and create an assignment logger that additionally reports feature flag evaluations to Datadog using the snippet of code shown below.

For more information about initializing Eppo's SDK, see [Eppo's React native SDK documentation](https://docs.geteppo.com/sdks/client-sdks/react-native)

```typescript
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    DdRum.addFeatureFlagEvaluation(assignment.featureFlag, assignment.variation);
  },
};

await eppoInit({
  apiKey: "<API_KEY>",
  assignmentLogger,
});
```
</TabItem>
</Tabs>

For more information, read Datadog's [Getting Started with Feature Flag Data in RUM documentation.](https://docs.datadoghq.com/real_user_monitoring/guide/setup-feature-flag-data-collection/?tab=browser#eppo-integration)

You can [install Eppo's Datadog integration here](https://app.datadoghq.com/integrations/eppo)
