# Eppo feature flagging SDKs

## Client SDKs {#client-sdks}

Eppo's client SDK integrates with client-side applications that run on a user device. The below diagram shows how the SDK interacts with your application code, event tracking system, and Eppo's servers:

1. **Initialization**: The SDK retrieves flag/experiment configurations from Eppo using an API key provided during initialization. The configuration data includes flag/experiment variations and traffic allocation. The SDK stores these configurations locally on the device for quick lookup during assignment.

2. **Assignment**: Once the SDK is initialized, your application code invokes the SDK to assign a variation to a subject. This step does not involve any network requests.

3. **Logging** (Experiments only): The SDK logs assignment events to whichever event tracking system you use (for example [Segment](https://segment.com/docs/)) using a callback function you provide on SDK initialization. The assignment data includes information about the assigned variation and subject.

![client-sdk-diagram](/img/connecting-data/client-sdk-diagram.png)

### Removing duplicate assignment logs

Each invocation of the `get*Assignment` methods triggers the logging callback function. 
If you have connected it to transmit events to your Data Warehouse this 
will store duplicate data and increase associated costs unnecessarily.

Eppo's SDK deduplicates assignment events using an internal cache
that takes into account changes in subject variations and other factors to ensure
one and only one canonical event is transmitted.

This behavior is enabled by default and no action is required on your behalf to enable this.

*This functionality is available in the Javascript and React Native clients.*

### Globally Distributed Experiment Configurations

The SDK retrieves experiment data from a CDN that is globally distributed to over 100 edge locations. Each CDN location maintains a cache experiment data. 90% of requests are served by the CDN cache, while the remaining are handled by Eppo’s servers in the us-central GCP region. If there is a change to an experiment, such as an increase in traffic allocation, cached experiment configurations are updated within 10 minutes.

The SDK uses a background process to fetch and store the experiment data. The p75 latency of these requests is 50ms. This latency does not affect variation assignments, which use locally stored experiment data.

### Language-specific Documentation

- [JavaScript](./javascript)
- [React Native](./react-native)
- [Android](./android)
- [iOS](./ios)

## Server SDKs {#server-sdks}

Eppo's server-side SDKs may be used to implement flags and run experiments in your application server code. The below diagram shows the interactions of the SDK with Eppo's server:

1. **Initialization**: The SDK is designed to be initialized once when your application server starts up. Upon initialization, the SDK begins polling Eppo's API at 5-minute intervals (not configurable) to retrieve flag/experiment configurations. The flag/experiment configurations such as variations and traffic allocation are stored in memory for quick lookup during assignment.

2. **Assignment**: The application server code invokes the SDK to assign a subject (e.g. user ID) to an experiment variation.

3. **Logging** (Experiments only): The SDK logs assignment events to whichever event tracking system you use (for example [Segment](https://segment.com/docs/)) using a callback function you provide on SDK initialization. The assignment data includes information about the assigned variation and subject.

![server-sdk-diagram](/img/connecting-data/server-sdk-diagram.png)

### Reducing duplicate assignment logs

Each invocation of the `get*Assignment` methods triggers the logging callback function. 
If you have connected it to transmit events to your Data Warehouse this 
will store duplicate data and increase associated costs unnecessarily.

Eppo's SDK deduplicates assignment events using an internal cache
that takes into account changes in subject variations and other factors to ensure
one and only one canonical event is transmitted.

Each of your servers with Eppo's SDK will likely see assignment events from many subjects; 
to balance out memory usage with deduplication the internal cache is limited to 
approximately 10 MB and has an expiration functionality. Therefore our goal is to dramatically 
reduce the number of duplicate events but should still expect to encounter a small number.

This behavior is enabled by default and no action is required on your behalf to enable this.

*This functionality is available in the NodeJS client.*

### Language-specific Documentation

- [Node](./node)
- [Python](./python)
- [Java](./java)
- [Dot Net](./dotnet)
- [Go](./go)
- [Ruby](./ruby)
- [PHP](./php)
