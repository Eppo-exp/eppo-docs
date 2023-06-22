# Eppo Feature Flagging Performance

Eppo’s feature flagging architecture enables faster delivery of client-side web experiments. By leveraging a "dumb server, smart client" approach and utilizing the power of the Fastly CDN, Eppo offers low-latency feature flag evaluations and efficient updates.

### Architecture Overview

The Eppo feature flagging architecture is designed as a JSON delivery service. The server maintains a file containing feature flags and their corresponding assignment rules. The client downloads this file and determines which feature flags apply to its group.

Our architecture follows the "smart client" principle, offloading the evaluation work to the client-side SDKs. This approach requires initial development effort to implement new SDKs and update existing ones when new targeting rules are introduced. However, it allows us to tap into the resources of the Fastly CDN, benefiting from its global infrastructure and distributed caching capabilities.

### Latency Considerations

When it comes to feature-flagging services, latency is a crucial factor for client experiences. We distinguish between two types of latency:

1. **Evaluation Latency**: The time it takes for a client to determine which flag value applies to it.
2. **Update Latency**: The time it takes for updated rules to reach the client.

We have made architectural tradeoffs to optimize these latency factors. Instead of a "smart server" architecture that requires frequent server polling, Eppo prioritizes fast evaluations by accepting relatively slower updates.

### Leveraging the Fastly CDN

To ensure low-latency evaluations, Eppo leverages the Fastly CDN. Acting as a decentralized "first line of defense," the CDN intercepts and responds to requests near their origin, preventing them from reaching our backend servers located in Iowa.

The diagram below illustrates our architecture, where requests enter from the right. If a request can be serviced by the cache, a response is returned without involving our backend servers on the far left.

![Feature flag architecture](/img/feature-flagging/latency-1.png)

This architectural choice allows us to achieve impressive latency figures. Let's explore the uncached and cached latency numbers to understand the client experience better.

### Uncached Latency

The following map displays uncached latency figures obtained using a generic latency testing tool. Clients can download the feature-flag file in less than a second from most locations worldwide.

![Uncached latency](/img/feature-flagging/latency-2.png)

### Cached Latency

The cached latency numbers provide a more representative view of typical client experiences. These numbers correspond to requests made within a couple of minutes after the initial request.

![Cached latency](/img/feature-flagging/latency-3.png)

Most regions, including the US, Europe, South Korea, and Australia, experience latencies under 100ms. Even in locations further away, latencies are generally below half a second. To put it into perspective, the ping time between New York and London is approximately 72ms. From the client's perspective, it appears as though Eppo's servers are distributed globally, even though they are physically located in the corn fields and cow pastures of Iowa.

### Update Latency

Update latency refers to the time required for updated feature-flagging rules (JSON file) to reach the clients. 

For client side SDKs (Android, iOS, React, etc), the rules are updated each time the Eppo SDK is initialized, which should happen only one time per application lifecycle. If the SDK is initialized more than once during an application’s lifecycle, an exception is thrown. 

For server side SDKs (Java, Node.js, Ruby, etc), the rules are first updated when the Eppo SDK is initialized, then again every 30 seconds for the duration of the application’s lifecycle. 

### Conclusion

Eppo's feature-flag architecture offers a faster and cost-effective way to deliver client-side web experiments. By prioritizing client-side evaluation and leveraging the Fastly CDN, we achieve sub-100ms evaluation latencies while maintaining efficient update processes.

For any further questions or assistance, please refer to the Eppo Feature Flagging Service documentation or reach out to our support team.