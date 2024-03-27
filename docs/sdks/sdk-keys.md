---
sidebar_position: 2
---

# SDK keys and environments

To create an SDK key, navigate to the **SDK Keys** section of the **Configuration** section and click **New SDK Key**. 

![SDK key setup](/img/feature-flagging/environments/sdk-keys.png)

SDK keys are used to determine with variant a given Entity will be assigned to.

They also determine the environment in which the SDK is being used: a flag can have a different status and different targeting rules for each environment. By default Eppo has two environments: Test and Production, but you can add more on the **Environments** page.

::: note
SDK Keys are meant to be used in the SDK to decide Entity assignment. They are distinct from [API Keys](/reference/api/) that are used to query Eppo’s API, to read and edit information about metrics, definitions, and more.
:::
