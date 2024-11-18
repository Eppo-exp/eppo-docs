---
sidebar_position: 3
---

# Avoid round trips to internal servers

:::note
Don't be blocked! We're here to help you get up and running with Eppo. Contact us at [support@geteppo.com](mailto:support@geteppo.com).
:::

Centralizing experiment assignment on an internal server can lead to performance issues and poor user experience. Eppo's client-side SDKs work best when they can evaluate assignments locally without additional network calls.

### What Happens With Internal Server Round Trips
When implementing centralized experiment assignment on internal servers, you'll face two main challenges:

1. Performance Impact:
   - Each call to the server adds latency for each flag evaluation
   - Additional server load and maintenance
   - More complex application architecture

2. Implementation Compromises:
   - Pressure to implement "fetch all flags at initialization"
   - Potential conflicts with other best practices
   - Reduced quality of analytic data

### Best Practice
Use Eppo's client-side SDKs for most use cases. They:
- Pre-fetch obfuscated flag configurations
- Perform assignment logic locally
- Evaluate flags only when features are rendered
- Typically complete round trips in [under 20ms](/sdks/architecture/latency)

### Exception Cases
Server-side assignment can be useful in the following cases:
- Experiences originate from the backend
- A/B testing machine learning models with server-side predictions
- Other scenarios requiring server-side logic

:::tip
If you need to remove the CDN dependency entirely, you can fetch Eppo's configuration file independently and pass it to the client during app initialization. See our [deployment modes](/sdks/architecture/deployment-modes#local-flag-evaluation-using-configurations-from-internal-server) documentation for details.
:::
