---
sidebar_position: 6
---

# Latency

Eppo’s feature flagging architecture enables fast delivery of client-side web experiments. By leveraging a "dumb server, smart client" approach and utilizing the power of the Fastly CDN, Eppo provides low-latency feature flag evaluations with efficient updates.

## Introduction

Eppo’s feature flagging system is designed as a JSON delivery service. Our CDN maintains a file containing feature flags and their corresponding assignment rules. The SDK client downloads this file and determines which feature flags apply for a specific subject (e.g., user).

Our architecture follows the "smart client" principle, offloading the evaluation work to the client-side SDKs. This means that once the SDK is initialized, all evaluation happens locally, typically in under 1 ms. Further, if user context changes mid-session, there is no need to reach out to Eppo's servers to understand their new targeting eligibility. All of the targeting happens locally, so Eppo's SDK will always ensure users see the right experiment given their unique targeting attributes.

This page walks through some of the latency considerations associated with building a global feature flagging system, describes options for how to reach your internal SLAs, and presents performance benchmarks numbers.

## Latency Considerations

When it comes to feature-flagging services, latency is a crucial factor for client experiences. We distinguish between two types of latency:

1. **Evaluation Latency**: The time it takes to determine which flag value applies for a specific subject (user).
2. **Update Latency**: The time it takes for updated rules to reach end users.

Eppo's "smart client" approach allows us to give very impressive evaluation latencies (typically under 1ms), while still providing update latencies that can satisfy internal SLAs for quickly disabling problematic features. 

This is in contrast to a server-side evaluation which requires frequent network requests each time a flag is evaluated, or a user's context changes.

### Leveraging the Fastly CDN

To ensure low-latency evaluations, Eppo leverages the Fastly CDN. Acting as a decentralized "first line of defense," the CDN intercepts and responds to requests near their origin, preventing them from reaching our backend servers located in Iowa.

The diagram below illustrates our architecture, where requests enter from the right. If a request can be serviced by the cache, a response is returned without involving our backend servers on the far left.

![Feature flag architecture](/img/feature-flagging/latency-1.png)

### Latency benchmark

This architectural choice allows us to achieve impressive latency figures. To understand initialization times around the world, we ran a benchmark with ~80 active feature flag using the open source tool Grafana k6. Two users (i.e., threads) executed 500 requests in a row. This is repeated for each region in GCP.

The table below shows the measured percentiles for each region, reported in milliseconds.

:::note
These figures measure latency from the VMs used for the test, so they are data center to data center. These figures will not be representative of what an end-user would experience in the mentioned locations for each provider - those figures would be higher (due to having to traverse the open internet/low bandwidth connections). 
:::


| **Region**              | **Location**                  | **p50**   | **p90**   | **p99**  |
| ----------------------- | ----------------------------- | ----- | ----- | ---- |
| africa-south1           | Johannesburg, South Africa    | 2     | 2.4   | 5.1  |
| asia-east1              | Changhua County, Taiwan       | 15.4  | 15.8  | 19.7 |
| asia-east2              | Hong Kong                     | 2     | 2.6   | 5.6  |
| asia-northeast1         | Tokyo, Japan                  | 1.2   | 1.5   | 2.6  |
| asia-northeast2         | Osaka, Japan                  | 9.9   | 10.1  | 13   |
| asia-northeast3         | Seoul, South Korea            | 2.8   | 4.2   | 4.9  |
| asia-south1             | Mumbai, India                 | 24.8  | 35    | 35.6 |
| asia-south2             | Delhi, India                  | 2.7   | 2.9   | 3.7  |
| asia-southeast1         | Jurong West, Singapore        | 2.3   | 2.8   | 4    |
| asia-southeast2         | Jakarta, Indonesia            | 19    | 19.9  | 29.3 |
| australia-southeast1    | Sydney, Australia             | 2.3   | 3     | 3.9  |
| australia-southeast2    | Melbourne, Australia          | 16.3  | 16.7  | 18.9 |
| europe-central2         | Warsaw, Poland                | 24.8  | 25    | 27.7 |
| europe-north1           | Hamina, Finland               | 3.4   | 4     | 6.1  |
| europe-southwest1       | Madrid, Spain                 | 1.7   | 2.6   | 3.7  |
| europe-west1            | St. Ghislain, Belgium         | 5.2   | 5.8   | 7.3  |
| europe-west10           | Berlin, Germany               | 13.9  | 14.1  | 15.9 |
| europe-west12           | Turin, Italy                  | 6.2   | 7.3   | 13   |
| europe-west2            | London, England               | 1.6   | 2.1   | 3.1  |
| europe-west3            | Frankfurt, Germany            | 1.4   | 1.8   | 2.7  |
| europe-west4            | Eemshaven, Netherlands        | 4.7   | 5.1   | 6.4  |
| europe-west6            | Zurich, Switzerland           | 5.6   | 6     | 7.3  |
| europe-west8            | Milan, Italy                  | 1.5   | 1.8   | 2.7  |
| europe-west9            | Paris, France                 | 1.8   | 2.9   | 3.9  |
| me-central1             | Doha, Qatar                   | 126.3 | 126.8 | 130  |
| me-west1                | Tel Aviv, Israel              | 48.1  | 48.8  | 49   |
| northamerica-northeast1 | Montréal, Québec              | 9.3   | 10    | 13.3 |
| northamerica-northeast2 | Toronto, Ontario              | 1.8   | 2.2   | 2.9  |
| southamerica-east1      | Osasco, São Paulo             | 2.1   | 2.3   | 4.1  |
| southamerica-west1      | Santiago, Chile               | 1.1   | 1.4   | 2.4  |
| us-central1             | Council Bluffs, Iowa          | 12.6  | 12.9  | 14.2 |
| us-east1                | Moncks Corner, South Carolina | 14.8  | 15    | 16.2 |
| us-east4                | Ashburn, Virginia             | 1.8   | 2.2   | 3.1  |
| us-east5                | Columbus, Ohio                | 12.2  | 12.6  | 17   |
| us-south1               | Dallas, Texas                 | 1.8   | 2.3   | 3.3  |
| us-west1                | The Dalles, Oregon            | 8.1   | 8.4   | 10.6 |
| us-west2                | Los Angeles, California       | 1     | 1.3   | 2.3  |
| us-west3                | Salt Lake City, Utah          | 18.4  | 19.4  | 19.7 |
| us-west4                | Las Vegas, Nevada             | 7.9   | 8.2   | 9.6  |

Most regions experience latencies under 20ms. Even in locations further away, latencies are well below half a second. To put this into perspective, the ping time between New York and London is approximately 72ms. From the client's perspective, it appears as though Eppo's servers are distributed globally, even though they are physically located in the corn fields and cow pastures of Iowa.

### Update Latency

Update latency refers to the time required for updated feature-flagging rules (JSON file) to reach the clients. Most of Eppo's SDKs have built-in polling that is configurable at initialization. This makes it easy to set a desired update latency: simply set the polling cadence to reach your internal SLA for changes to go live.

Some SDKs also offer a method to manually trigger a reload of configurations, allowing for a lot of flexibility in how to handle update latency.

## Conclusion

Eppo's feature-flagging architecture is optimized for evaluation latency. Once the SDK is initialized (typically in under 20ms), all evaluation of flags happen effectively immediately. Eppo also provides flexibility in how to handle update latency, ensuring changes made in Eppo's UI reach end users within a specified time window.

