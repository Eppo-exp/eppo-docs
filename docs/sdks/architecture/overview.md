---
sidebar_position: 2
---

# Overview

Eppo's SDK is designed to be lightweight and work alongside your existing stack. By using a "dumb server, smart client" architecture, the SDK can be thought of as a simple JSON delivery service. On initialization, the SDK will make a request to our CDN (built on [Fastly](https://www.fastly.com/)) to get a JSON containing active flags and targeting logic. Server-side SDKs will poll the CDN at a regular cadence to keep this config up to date.

The determination of a given subject's (e.g., user's) variation is done locally within the SDK. For randomized flags, a deterministic hashing function salted with the experiment key is used. This means that for a given experiment a subject (user) will see a consistent variant, even across SDKs.

Fastly's load balancer handles large spikes in requests, removing the need for a relay proxy within your network. That said, you can also get assignments server side and pass flag variants back the client, all without issuing any request to Eppo.

Building on top of Fastly also means that if Eppo ever had an outage, all of our SDKs will continue to work based on config files cached in Fastly.

For more information on Eppo SDK performance see the FAQs on [latency](/sdks/architecture/latency) and [risk](/sdks/architecture/risk).

## Event capture

Eppo's SDK is designed to encourage best practices in event capture. We leverage your existing logging infrastructure to avoid us ever handling your raw data. This is implemented by providing a logging callback function at SDK initialization. The callback function will only be invoked when `get<Type>Assignment` is called. Since `get<Type>Assignment` is evaluated locally in a few clock cycles, it is encouraged to put the call as close to the code split as possible. This helps capture clean data for analysis: only subjects (users) that were exposed to the experiment will be included.

In some situations it's not practical to call `get<Type>Assignment` right at the code split. For instance, in some experiments you may want to pre-fetch content before a user reaches that specific section of the page. In these situations, it is fine to call `get<Type>Assignment` ahead of time and then filter to exposed users on the analysis side. This is supported in Eppo by defining [Entry Points](/experiment-analysis/configuration/filter-assignments-by-entry-point) for when the user is exposed to the differentiated experience.

To read more about our architecture and our specific SDKs, see the [client SDKs](/sdks/client-sdks) and [server SDKs](/sdks/server-sdks) pages.