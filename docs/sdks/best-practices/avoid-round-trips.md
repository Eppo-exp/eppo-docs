---
sidebar_position: 3
---

# Avoid round trips to internal servers


It may be tempting to implement to centralize experiment assignment on an internal server. This would remove the need to fetch flag configurations from Eppo's network independently for each individual who uses your application. This however either incurs latency each time a flag is evaluated (from doing a round trip to your internal server), or encourages implementing a "fetch all flags at initialization" approach, in direct conflict with the previous best practice.

Eppo's client-side SDKs are designed to mitigate both of these problems. By pre-fetching an obfuscated flag configuration, the full assignment logic can happen locally without any network calls. Further, by only evaluating flag values when the feature is rendered, we guarantee high-quality analytic data.

Accordingly, Eppo recommends using the client-side SDK for most use cases. The main exception is when the experience originates from the backend, e.g. A/B testing machine learning models whose predictions are generated server-side.

Eppo's SDK will by default fetch configurations from our global CDN hosted on Fastly. In most situations, this round trip completes in [under 20ms](/sdks/faqs/latency), but some teams may prefer to remove the dependency all together. In this case, you can fetch Eppo's configuration file independently and then pass that to the client as part of routine app initialization. To read more about that, please see the [deployment modes](/sdks/architecture/deployment-modes#local-flag-evaluation-using-configurations-from-internal-server) page.
