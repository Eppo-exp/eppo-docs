# Server SDKs {#server-sdks}

Eppo's server-side SDKs may be used to implement flags and run experiments in your application server code. The below diagram shows the interactions of the SDK with Eppo's server:

1. **Initialization**: The SDK is designed to be initialized once when your application server starts up. Upon initialization, the SDK begins polling Eppo's API at regular intervals (not configurable) to retrieve flag/experiment configurations. The flag/experiment configurations such as variations and traffic allocation are stored in memory for quick lookup during assignment.

2. **Assignment**: The application server code invokes the SDK to assign a subject (e.g. user ID) to an experiment variation.

3. **Logging** (Experiments only): The SDK logs assignment events to whichever event tracking system you use (for example [Segment](https://segment.com/docs/)) using a callback function you provide on SDK initialization. The assignment data includes information about the assigned variation and subject.

![server-sdk-diagram](/img/connecting-data/server-sdk-diagram.png)

### Language-specific Documentation

- [Node](/sdks/server-sdks/node)
- [Python](/sdks/server-sdks/python)
- [Java](/sdks/server-sdks/java)
- [Dot Net](/sdks/server-sdks/dotnet/intro)
- [Go](/sdks/server-sdks/go)
- [Ruby](/sdks/server-sdks/ruby/intro)
- [PHP](/sdks/server-sdks/php)
- [Rust](/sdks/server-sdks/rust)
