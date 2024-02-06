# Eppo's SDKs

Eppo's SDKs all follow a similar architecture and interface. Whether you are using Eppo for feature gates, progressive rollouts, or randomized experiments, you can determine what variant a specific subject (e.g., user) should see with a call like this:

```{js}
eppo.getAssignment(
    "<subjectKey>",
    "<flagKey>",
    [subjectProperties]
)
```

Here, `subjectKey` is a unique identifier for the unit on which you are assigning variant (e.g., `userId`), `flagKey` is a unique identifier for the feature of interest (e.g., `newUserOnboarding`), and `subjectProperties` is an optional argument of additional properties to use in targeting.

For experimentation use cases, Eppo uses a deterministic hashing function to ensure that the same variant is returned for a given `subjectKey`. This guarantee also holds across different SDKs. That is, experiment assignments from a server SDK will be consistent with experiment assignments from a client SDK for the same `subjectKey`.

Before using the Eppo SDK, you'll need to [generate an SDK key](/sdks/api-keys) and [create a logging callback function](/sdks/event-logging).

You can read more about our specific SDKs here:
1. [Client SDKs](/sdks/client-sdks)
2. [Server SDKs](/sdks/server-sdks)
