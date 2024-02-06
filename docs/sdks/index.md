# Eppo's SDKs

Eppo's SDKs enable you to easily toggle features on and off, run randomized experiment, perform progressive rollouts, and personalize user experiences, all without the need for extensive code deployments.

Our SDKs all follow a similar architecture and interface. Whether you are using Eppo for feature gates, progressive rollouts, or randomized experiments, you can determine what variant a specific subject (e.g., user) should see with a call like:

```{js}
eppo.getAssignment(
    "<subjectKey>",
    "<flagKey>",
    [subjectProperties]
)
```

Here, `subjectKey` is a unique identifier for the unit on which you are assigning variant (e.g., `userId`), `flagKey` is a unique identifier for the feature of interest (e.g., `newUserOnboarding`), and `subjectProperties` is an optional argument of additional property to use in targeting.

For experimentation use cases, Eppo will use a deterministic hashing function to ensure that the same variant is return for a given `subjectKey`. This guarantee also holds across different SDKs (e.g., experiment assignments from a server SDK will be consistent with experiment assignments from a client SDK).

Before using the Eppo SDK, you'll need to [generate an SDK key](/sdks/api-keys) and [create a logging callback function](/sdks/event-logging).

You can read more about our specific SDKs here:
1. [Client SDKs](/sdks/client-sdks)
2. [Server SDKs](/sdks/server-sdks)
