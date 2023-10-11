---
slug: /feature-flag-quickstart
sidebar_position: 3
---

# Your first feature flag

This 10 minute guide will get you set up with your first running feature flag on Eppo. In the example we'll imagine that we are using a flag on our frontend to gradually launch a new checkout page.

### 0. Generate an SDK key

If you have not created an API key yet, set that up first.
From the Feature Flag page, navigate to the SDK keys tab.
Here you can generate keys to use both in production (1) as well as for testing purposes (2).

![Setup Eppo SDK key](/img/feature-flagging/environments/sdk-keys.png)

For now, let's create a Test environment SDK key.
Give the key a name and give it read access: we want the feature flagging SDK to be able to read the configuration.

![Generate an SDK key](/img/feature-flagging/api-key-modal.png)

Store the SDK key securely; it is not possible to view it after closing the modal.
However, generating a new key is easy in case you do lose it.

### 1. Creating a flag

Start by creating a flag that will serve as a gate for who sees the new page:

![Feature gate 0](/img/feature-flagging/feature-gate-0.png)

Give the flag a descriptive human readable name and create a single variation for the on state. When using flag for boolean values we don't have to create an explicit `off` variation. If the assigned variation is not `on`, then `null` is returned and we can assume the page should not be shown:

![Feature gate 1](/img/feature-flagging/feature-gate-1.png)

### 2. Create allocations to describe your target audience

After creating the flag, decide who to target by creating [allocations](/feature-flags#allocations). In this case we will create two feature gate allocations that describe our target audience for the new page: internal users and half of all North American web users:

![Feature gate 2](/img/feature-flagging/feature-gate-2.png)

Create each allocation one by one, giving each a name and specifying the traffic split and traffic exposure. Finally, enter rules that specify which subjects are part of that allocation. In the example above `Internals users` are determined by their email, and `North America Web Users` are determined by their country and device. For this allocation we'll set the traffic exposure to 50% so that 50% of the group still sees the original page (SDK will return `null`).

### 3. Connect a logging function to the Eppo SDK (optional)

If you are using feature flags to implement a randomized experiment, you will need to log each time a user is assigned a variant. Instead of integrating an additional event logging system, Eppo connects to your existing data warehouse logging infrastructure. Whether you are using a third party system to log events to the data warehouse or have an internally built solution, you'll simply pass in a logging function when initializing the SDK.

For instance, if you are using Segment, the logging function might look something like this:

```jsx
import { IAssignmentLogger } from '@eppo/js-client-sdk';
import { AnalyticsBrowser } from '@segment/analytics-next'

// Connect to Segment (or your own event-tracking system)
const analytics = AnalyticsBrowser.load({ writeKey: '<SEGMENT_WRITE_KEY>' })

const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: 'Eppo Randomized Assignment',
      type: 'track',
      properties: { ...assignment }
    });
  },
};
```

The [event logging](/how-tos/event-logging/) page has more information on how to set up logging using different logging tools

### 4. Initialize the SDK

Choose the [Eppo SDK](/feature-flags/sdks) that fits in your stack. You'll need to install initialize the SDK in your app and create an Eppo client. Here is an example in Javascript:

```javascript
import { init } from "@eppo/js-client-sdk";

await init({
  apiKey: '<API_KEY>',
  assignmentLogger,
});
```
Note, here is where you use the API key generated in step 0.

If you are using React, we have some [React specific recommendations](../feature-flags/sdks/javascript#usage-in-react).

### 5. Embed the flag in your code

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

### 6. Turn on the flag to start splitting traffic

The last step is turning on the flag, which can be done back in the interface using the toggle on the flag's detail view:

![Feature gate 3](/img/feature-flagging/feature-gate-3.png)

Congrats on setting up your first flag!
