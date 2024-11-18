---
sidebar_position: 10
---

# Best practices

This page walks through some best practices to consider when integrating Eppo’s SDK.

:::note
Don't be blocked! We're here to help you get up and running with Eppo. Contact us at [support@geteppo.com](mailto:support@geteppo.com).
:::

## Assign as close to the split in experience as possible

In general, strive to place assignment calls as close to code split as possible. This reduces the likelihood of logging an assignment but not delivering the corresponding experience, leading to analysis issues such as impact dilution.

Suppose we are testing a new payment experience with users. It’s best to fetch the assignment and deliver the experience as close together in the code as possible:

```javascript
export default function PaymentPage({ user: User }): JSX.Element {
  const useNewPaymentFlow =
    eppoClient.getBooleanAssignment("new-payment-flow", user.email, {}, false) === true;

  return (
    <Container>
      {useNewPaymentFlow ? (
        <PaymentPageV2 user={user} />
      ) : (
        <PaymentPage user={user} />
      )}
    </Container>
  );
}
```

In this example, assignment and delivery are tightly coupled. Users who are assigned the new payment page always see the new one, and users who are assigned the old payment page always see the old one. There is very little chance for an assignment to be logged without the user experiencing the new variant.

:::info
While Eppo recommends placing assignment calls as close to the code split as possible, we understand this is not possible in all circumstances. In these cases, we provide the ability to filter analysis results. See [filtering assignments by entry points](/experiment-analysis/configuration/filter-assignments-by-entry-point) for more details.
:::


## Avoid round trips to internal servers

It may be tempting to implement to centralize experiment assignment on an internal server. This would remove the need to fetch flag configurations from Eppo's network independently for each individual who uses your application. This however either incurs latency each time a flag is evaluated (from doing a round trip to your internal server), or encourages implementing a "fetch all flags at initialization" approach, in direct conflict with the previous best practice.

Eppo's client-side SDKs are designed to mitigate both of these problems. By pre-fetching an obfuscated flag configuration, the full assignment logic can happen locally without any network calls. Further, by only evaluating flag values when the feature is rendered, we guarantee high-quality analytic data.

Accordingly, Eppo recommends using the client-side SDK for most use cases. The main exception is when the experience originates from the backend, e.g. A/B testing machine learning models whose predictions are generated server-side.

Eppo's SDK will by default fetch configurations from our global CDN hosted on Fastly. In most situations, this round trip completes in [under 20ms](/sdks/faqs/latency), but some teams may prefer to remove the dependency all together. In this case, you can fetch Eppo's configuration file independently and then pass that to the client as part of routine app initialization. To read more about that, please see the [deployment modes](/sdks/architecture/deployment-modes#local-flag-evaluation-using-configurations-from-internal-server) page.


## Avoid targeting with a long list of user IDs

Eppo targeting works based on subject attributes passed into the `get<Type>Assignment` function. It is tempting to use these targeting rules to define a list of specific users to target. However, this can lead to performance issues as now every time the SDK is initialized, this full list of users need to be pulled in from the Eppo CDN. To help keep the Eppo SDK lightweight, we limit the list of specific values you can target to 50.

A better pattern is to define audiences via user-level attributes. For instance, if you would like to target a list of beta users, you can pass an attribute into the `get<Type>Assignment` call specifying whether the user is in the beta group.

```javascript
const variation = eppoClient.getStringAssignment("my-flag-key", "userId", { 
  beta_user: "true",
}, "control");
```

Now, simply add allocation logic specifying to target users with `beta_user = 'true'`:

![Add attribute to allocation](/img/feature-flagging/add-attribute-to-allocation.png)

This does require you to determine whether a user is in the beta group before calling `get<Type>Assignment`, but it helps to keep the Eppo SDK very light.


## Wait for SDK Initialization

Eppo's SDK initialization is non-blocking by default. This means your application can continue running while the SDK initializes in the background. However, if you call `get<Type>Assignment` before initialization completes, you may get unexpected results due to race conditions.

### What Happens If You Don't Wait
When you call `get<Type>Assignment` before initialization completes, one of two things will happen:

1. If the SDK has a cached configuration in persistent storage (like localStorage in JavaScript):
   - It will use the previous configuration
   - This might not include your latest changes

2. If there's no cached configuration:
   - The SDK will return your specified default value
   - Your feature flags won't work as expected

### Best Practice
Take advantage of your programming language's tools for waiting for asynchronous operations to complete. For example, the `await` keyword in JavaScript can be used to wait for an async operation to complete.

:::tip
Check your specific SDK's documentation for initialization options and best practices for your programming language.
:::