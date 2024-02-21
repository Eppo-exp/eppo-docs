# Assignment deduplication

Each invocation of the `get*Assignment` methods triggers the logging callback function. 
If you have connected it to transmit events to your Data Warehouse this 
will store duplicate data and increase associated costs unnecessarily.

Eppo's SDK deduplicates assignment events using an internal cache
that takes into account changes in subject variations and other factors to ensure
one and only one canonical event is transmitted. 

Since your client likely only handles a single subject, memory pressure should not be a concern 
and the cache attempts to store all flags for the subject; 
our goal is to completely eliminate duplicate events.

This behavior is enabled by default and no action is required beyond upgrading to the supported version.

## Supported SDKs
This functionality is available in the Javascript, and React Native, and NodeJS clients.
