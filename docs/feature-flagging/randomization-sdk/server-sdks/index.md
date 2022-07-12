# Server SDKs

Eppo's server-side SDKs may be used to run experiments in your application server code. The below diagram shows the interactions of the SDK with Eppo's server:

1. **Initialization**: The SDK is designed to be initialized once when your application server starts up. Upon initialization, the SDK will begin polling Eppo's API at regular intervals to retrieve experiment configurations. The experiment configurations such as variations and traffic allocation are stored in memory for quick lookup during assignment.

2. **Assignment**: The application server code invokes the SDK to assign a subject (e.g. user ID) to an experiment variation.

3. **Logging**: The SDK logs assignment events to whichever event tracking system you use, for example Segment. The assignment data includes information about the assigned variation and subject.

![server-sdk-diagram](../../../../static/img/connecting-data/server-sdk-diagram.png)

### Language-specific Documentation
- [Node JS](./node.md)
- [Python](./python.md)
