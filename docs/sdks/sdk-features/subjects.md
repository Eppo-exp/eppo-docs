# Subjects

The subject key is a unique identifier for the entity being experimented on (e.g., a user). This key is used to deterministically assign subjects to variations. Randomization can be implemented on any unit (user ID, team ID, company ID, etc.).

## Anonymous subjects

A key that is unique and persistent for each subject entity is ideal for assigning variations fully according to the feature flag's configuration on Eppo. Therefore, anonymous subjects that lack such an identifier necessitate special provisions and caveats. 

1. Option 1: Set the subject key to a constant value for all anonymous users. If feature gate assignments with targeting rules and traffic exposures percentiles at exactly 0% or 100% are the only required configurations, then this is a viable option. However, the subject key is used to randomize variation assignment, so fractional traffic percentages for rollouts and experiment randomization would not work as intended.
2. Option 2: Use a proxy identifier for the subject. Such identifiers are not ideal, but may suffice depending on the budget for inconsistent assignments and the available capabilities for tracking subjects.
    * Accessing a cookie id from a third-party analytics service, which often persist across sessions and automatically associate with signed-in users.
    * Using a [browser fingerprinting](https://en.wikipedia.org/wiki/Device_fingerprint#Browser_fingerprint) library.
    * Using the session ID. However, these IDs are discarded at the ends of sessions, so this approach would require stitching the sessions and IDs together.

It is also necessary to provide a key that is unique and persistent for the subject to properly randomize subjects in experiments. In the case of anonymous subjects, a lack of a unique and persistent identifier does not necessarily negate the ability to run experiments.

1. The aforementioned identifiers can be used as a proxy so that experiment analysis is still possible. Eppo can be configured [to associate multiple identifiers for the same subject together while processing assignment data](/guides/advanced-experimentation/anonymous-explainer/#assignment-logs-with-multiple-identifiers).
2. [Sticky assignments](/feature-flagging/concepts/sticky-flags) can be used to maintain deterministic assignments. A mapping of associated subject keys to assignments can be constructed in the post-assignment hook, and the pre-assignment hook can be used to consistently assign the same subject to the same variant.
