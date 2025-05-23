---
sidebar_position: 3
---

# SDK keys and environments

To help control feature deployment and configuration across different environments, Eppo supports adding multiple environments. When the SDK is initialized, Eppo will check what environment the provided SDK key belongs to and return variants based on allocations in the corresponding environment. By default Eppo has two environments: Test and Production, but you can add more on the **Environments** page.

From the feature flagging page, you can toggle which environment you are in by clicking **Switch Environment**. A flag can have a different status and different targeting rules for each environment. 

![Switching Environments](/img/feature-flagging/feature-flag-qs-2.png)

When Eppo's SDK is initialized, only configurations from flags enabled in that environment will be downloaded. This can help when using flags across a variety of use cases and it's not necessary to download every flag for every instance of the Eppo client. A common example is when different flags are used in mobile and web applications. In this case, you can create separate Web and Mobile environments and use Eppo's UI to manage which flags are active in each.

## Types of SDK keys
There are 3 types of SDK keys - SDK keys itself, Client Tokens and Browser Extension keys. SDK keys and Client Tokens are used by SDKs. Browser Extension keys are used by [Eppo Developer Tools - Chrome Extension](/sdks/developer-tools-extension/). SDK keys and Client Tokens are the same functionality keys, except config always is obfuscated when Client Tokens are used. Therefore, the main application of the Client Tokens is SDK clients requesting configurations for clients such as browsers or mobile applications. Meanwhile, the primary application of the SDK keys is on server side.

## Creating SDK keys

To create an SDK key, navigate to the **Environments** page under **Flags** on the left. Then select **Create** in the top right and select **SDK Key**.

![SDK key setup](/img/feature-flagging/environments/sdk-keys.png)

## Creating Client Tokens

To create a Client Token, navigate to the **Environments** page under **Flags** on the left. Then select **Create** in the top right and select **Client Token**.

![Client Token setup](/img/feature-flagging/environments/client-tokens.png)

In the Client Token creation modal enter key name, select environment, optionaly assign tags to the Client Token and then select **Create** in the bottom right of the modal.

![Client Token setup](/img/feature-flagging/environments/client-token-modal.png)

:::note
SDK Keys and Client Tokens are used to deploy feature flags and experiments. They are distinct from [API Keys](/reference/api/), which are used in Eppo’s REST API.
:::
