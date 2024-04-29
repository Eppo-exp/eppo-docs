---
slug: /feature-flag-quickstart
sidebar_position: 2
---

# Creating your first feature flag

This 10 minute guide will walk through creating your first feature flag in Eppo. In the example, we'll imagine that we are adding a basic on/off switch for a new onboarding page.

While Eppo's SDK can be used for targeted rollouts, A/B/n experiments, and personalization via Contextual Bandits, this guide will focus on creating a simple on/off switch in Eppo.

### 1. Generate an SDK key

From the Configuration section, navigate to the SDK keys tab. Here you can generate keys for both production and testing.

![Setup Eppo SDK key](/img/feature-flagging/environments/sdk-keys.png)

For now, create a Test environment SDK key by using the "New SDK Key" button. Give the key a name and select "Test" for the Environment.

![Generate a SDK key](/img/feature-flagging/sdk-key-modal.png)

Store the SDK key securely; it is not possible to view it after closing the modal. However, generating a new key is easy in case you do lose it.

### 2. Create a flag

Start by creating a flag for the new page:

![Feature gate 0](/img/feature-flagging/feature-flag-qs-0.png)

Give the flag a descriptive human readable name and create variations for each version of the checkout page. In this example we only have two states: enabled and disabled. If your flag is more involved, you can change the flag type to be string, numeric, or JSON-valued. Read more about flag types [here](/feature-flagging/flag-variations).

![Feature gate 1](/img/feature-flagging/feature-flag-qs-1.png)

### 3. Create a Feature Gate allocation

After creating the flag, switch into the Test environment:

![Feature gate 2](/img/feature-flagging/feature-flag-qs-2.png)

Now that you're in the Test environment, add a Feature Gate allocation to your flag:

![Feature gate 3](/img/feature-flagging/feature-gate-setup-1.png)

For this example, we will assign all users to the Enabled version of the flag. If you want to target specific users, you can add targeting rules to the allocation. You can read more about targeting [here](/feature-flagging/targeting).

![Feature gate 4](/img/feature-flagging/feature-gate-setup-3.png)

### 4. Initialize the SDK

Choose the Eppo SDK that fits in your stack. You'll need to initialize the SDK in your app and create an Eppo client. Here is an example in Javascript:

```javascript
import { init } from "@eppo/js-client-sdk";

await init({
  apiKey: '<SDK_KEY>'
});
```
Note, here is where you use the SDK key generated in step 1.

If you are using React, we have some [React specific recommendations](/sdks/client-sdks/javascript#usage-in-react).

### 5. Embed the flag in your code

Once the SDK is initialized, use `getBoolAssignment` to check whether a user should see the new page:

```jsx
// Wherever you render the checkout page...

import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();

const variation = eppoClient.getBoolAssignment(
  user.id,
  "new-checkout-page"
);

return variation ? <NewCheckoutPage /> : <OldCheckoutPage />
```

Note that the `get<Type>Assignment` methods in Eppo are deterministic, meaning that they will always return the same flag status for a given subject (e.g., user) wherever the flag is called.

### 6. Turn on the flag

Flip the flag on in the Test environment to start serving the new feature.

![Feature gate 5](/img/feature-flagging/feature-gate-setup-2.png)

You should now see assignments coming through the Eppo SDK!

To deploy to production, create a new SDK key for the production environment, create a production feature gate allocation, and enable the flag.
