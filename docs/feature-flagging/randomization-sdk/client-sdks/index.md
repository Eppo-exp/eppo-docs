# Client SDKs

Eppo's client SDK integrates with client-side applications that run on a user device. The below diagram shows how the SDK interacts with your application code, event tracking system, and Eppo's servers:

1. **Initialization**: The SDK retrieves experiment configurations from Eppo using an API key provided during initialization. The configuration data includes experiment variations and traffic allocation. The SDK stores these configurations locally on the device for quick lookup during assignment.

2. **Assignment**: Once the SDK is initialized, your application code invokes the SDK to assign a variation to an experiment subject. This step does not involve any network request.

3. **Logging**: The SDK logs assignment events to whichever event tracking system you use, for example Segment. The assignment data includes information about the assigned variation and subject. 

![client-sdk-diagram](../../../../static/img/connecting-data/client-sdk-diagram.png)

### Language-specific Documentation
- [JavaScript](./javascript.md)