# Real time rollout monitoring

:::note
Real time rollout monitoring is currently in closed Beta. Contact [support@geteppo.com](mailto:support@geteppo.com) for access to this feature.
:::

The early stages of an experiment are critical for ensuring that everything is functioning as intended. This is where Eppo real time rollout monitoring comes into play, focusing on reducing risk by verifying an even user split and confirming the operational status of new features. It's a foundational step for safeguarding against performance issues or disruptions to core metrics.

![Real time monitoring example](/img/measuring-experiment/real-time/monitoring.png)

## Criteria
If your warehouse has a data table with performance data and critical business metrics that refreshes every ten minutes or less, you are eligible to use Eppo real time.

Note that if data arrives outside this ten minute window it will not be included in our monitoring.

## How it works
Metrics in a running experiment are monitored every ten minutes for the first 24 hours after the experiment start datetime. Manual refreshes are also possible.

All metrics attached to the experiment will be monitored during this time-frame. You can even include performance specific metrics such as latency.