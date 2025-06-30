# Event tracking with Datadog

:::info Deprecation Notice
Eppo's native event tracking feature has been deprecated in favor of integrating with Datadog's RUM SDK and product analytics platform. This approach provides more robust analytics capabilities and better integration with your existing observability stack.
:::

Eppo now recommends using [Datadog's RUM (Real User Monitoring) SDK](https://docs.datadoghq.com/real_user_monitoring/) and [product analytics platform](https://docs.datadoghq.com/product_analytics/) to track user events and behaviors for experiment analysis. This integration allows you to leverage Datadog's powerful analytics capabilities while maintaining seamless experiment tracking with Eppo.

## Benefits of using Datadog for experiment tracking

* **Unified observability**: Combine experiment data with your existing application monitoring, logs, and traces in a single platform
* **Advanced analytics**: Leverage Datadog's sophisticated funnel analysis, retention tracking, and user journey mapping
* **Real-time insights**: Get immediate visibility into how experiment variations affect user behavior
* **Scalable infrastructure**: Built to handle high-volume event tracking without performance impact
* **Rich visualizations**: Create custom dashboards and reports for experiment results and user behavior

## Getting started

### 1. Set up Datadog RUM SDK

First, install and configure the Datadog RUM SDK for your platform. Follow the platform-specific setup guides:

- [Browser RUM SDK](https://docs.datadoghq.com/real_user_monitoring/browser/)
- [Mobile RUM SDK (iOS)](https://docs.datadoghq.com/real_user_monitoring/mobile_and_tv_monitoring/setup/ios/)
- [Mobile RUM SDK (Android)](https://docs.datadoghq.com/real_user_monitoring/mobile_and_tv_monitoring/setup/android/)
- [React Native RUM SDK](https://docs.datadoghq.com/real_user_monitoring/mobile_and_tv_monitoring/setup/reactnative/)

### 2. Track experiment-relevant events

Use Datadog's custom event tracking to record user actions that are relevant to your experiments:

```javascript
// Browser example
import { datadogRum } from '@datadog/browser-rum';

// Track a custom event
datadogRum.addAction('button_clicked', {
  button_id: 'signup_cta',
  user_id: 'user_123'
});
```

```swift
// iOS example
import DatadogRUM

// Track experiment-related user action
RUMMonitor.shared().addAction(
    type: .custom,
    name: "purchase_completed",
    attributes: [
        "purchase_amount": 29.99,
        "user_id": "user_456"
    ]
)
```

## Integration with Eppo Assignment data

### Using the official Datadog-Eppo integration

Datadog provides an official integration with Eppo that automatically enriches your RUM data with feature flag information. This integration provides visibility into performance monitoring and behavioral changes by showing which users are exposed to which variations.

To set up the integration, follow the [official Datadog-Eppo integration documentation](https://docs.datadoghq.com/integrations/eppo/). The setup involves:

1. **Update your RUM SDK**: Ensure you're using Browser RUM SDK version 4.25.0 or above
2. **Enable feature flags**: Configure the `enableExperimentalFeatures` parameter with `["feature_flags"]` when initializing the RUM SDK
3. **Configure Eppo SDK**: Initialize Eppo's SDK with the assignment logger that reports to Datadog

This integration automatically tracks feature flag evaluations and provides rich visualizations in your Datadog dashboards, showing how experiments impact user experience and performance metrics.

Continue using Eppo's Experiment Analysis for calculating statistical signicance and confidence intervals with metrics from your warehouse.

## Data organization and querying

Events tracked through Datadog RUM are automatically organized and can be queried using [Datadog's query language](https://docs.datadoghq.com/logs/explorer/search_syntax/). You can:

- Filter events by experiment key and variation
- Aggregate metrics across experiment cohorts  
- Create custom metrics based on experiment performance
- Set up alerts for real time experiment-related anomalies

## Best practices

1. **Consistent naming**: Use consistent naming conventions for experiment keys and event types
2. **Include context**: Always include relevant experiment metadata with your events
3. **Monitor performance**: Use Datadog's performance monitoring to ensure event tracking doesn't impact user experience
4. **Set up alerts**: Create alerts for unusual patterns in experiment metrics
5. **Regular cleanup**: Remove tracking for concluded experiments to maintain data hygiene

For detailed implementation guides and advanced features, refer to the [Datadog RUM documentation](https://docs.datadoghq.com/real_user_monitoring/) and [product analytics documentation](https://docs.datadoghq.com/product_analytics/).
