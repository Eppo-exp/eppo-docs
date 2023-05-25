---
slug: /feature-flag-quickstart
sidebar_position: 3
---

# Your first feature flag

This 10 minute guide will get you set up with your first running feature flag on Eppo. In the example we'll imagine that we are using a flag on our frontend to gradually launch a new checkout page.

### Creating a flag

Start by creating a flag that will serve as a gate for who sees the new page:

![Feature gate 0](/img/feature-flagging/feature-gate-0.png)

Give the flag a descriptive human readable name and create a single variation for the on state. When using flag for boolean values we don't have to create an explicit `off` variation. If the assigned variation is not `on`, then `null` is returned and we can assume the page should not be shown:

![Feature gate 1](/img/feature-flagging/feature-gate-1.png)

### Create allocations to describe your target audience

After creating the flag, decide who to target by creating [allocations](../feature-flags/concepts#allocations). In this case we will create two allocations that describe our target audience for the new page: internal users and half of all North American web users:

![Feature gate 2](/img/feature-flagging/feature-gate-2.png)

Create each allocation one by one, giving each a name and specifying the traffic split and traffic exposure. Finally, enter rules that specify which subjects are part of that allocation. In the example above `Internals users` are determined by their email, and `North America Web Users` are determined by their country and device. For this allocation we'll set the traffic exposure to 50% so that 50% of the group still sees the original page (SDK will return `null`).

### Initialize the SDK

Choose the [Eppo SDK](../feature-flags/sdks) that fits in your stack. You'll need to install initialize the SDK in your app and create an Eppo client. Here is an example in Javascript:

```javascript
import { init } from "@eppo/js-client-sdk";

await init({ apiKey: "<YOUR_API_KEY>" });
```

If you are using React, we have some [React specific recommendations](../feature-flags/sdks/client-sdks/javascript#usage-in-react).

### Embed the flag in your code

Once the SDK is initialized, you can embed the flag in your application's logic to check if users should be see the new page:

```jsx
// Wherever you render the checkout page...

import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();

// Attributes that the targeting rules above depend on.
const userAttributes = {
  email: user.email,
  country: user.country,
  device: user.device,
};

const variation = eppoClient.getAssignment(
  user.id,
  "new-checkout-page",
  userAttributes
);

if (variation == "on") {
  return <NewCheckoutPage />;
} else {
  return <OldCheckoutPage />;
}
```

### Turn on the flag to start splitting traffic

The last step is turning on the flag, which can be done back in the interface using the toggle on the flag's detail view:

![Feature gate 3](/img/feature-flagging/feature-gate-3.png)

Congrats on setting up your first flag!
