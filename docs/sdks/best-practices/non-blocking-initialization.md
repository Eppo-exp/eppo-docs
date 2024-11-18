---
sidebar_position: 10
---

# Non-blocking initialization

:::note
Don't be blocked! We're here to help you get up and running with Eppo. Contact us at [support@geteppo.com](mailto:support@geteppo.com).
:::

Most initialization methods in Eppo’s SDKs are non-blocking in order to minimize their footprint on the applications in which they are run. One consequence of this, however, is that it is possible to invoke the `get<Type>Assignment` method before the SDK has finished initializing. If `get<Type>Assignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent configurations. There are two possible outcomes when `get<Type>Assignment` is invoked before the SDK has finished initializing:

1. If the SDK downloads configurations to a persistent store, e.g. the JavaScript client SDK uses local storage, and a configuration was previously downloaded, then the SDK will assign a variation based on a previously downloaded configuration.

2. If no configurations were previously downloaded or the SDK stores the configuration in memory and loses it during re-initialization, then the SDK will return the default value when `get<Type>Assignment` is invoked.

Most SDKs have an option to `waitForInitialization`, as well as flexible initialization options that you can pass in at initialization.

