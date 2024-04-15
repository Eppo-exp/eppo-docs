---
sidebar_position: 9
---

# Common pitfalls

This page walks through some common pitfalls that occur when first implementing Eppo’s SDK.

:::note
Don't be blocked! We're here to help you get up and running with Eppo. Contact us at [support@geteppo.com](mailto:support@geteppo.com).
:::

## 1. Batching assignments

Always place assignment calls as close to your end experience as possible. This reduces the likelihood of logging an assignment but not delivering the corresponding experience, which can lead to issues in analysis, including lowering statistical power. An example of this is batching assignments.

:::note

While Eppo recommends placing assignment calls as close to the experience as possible, we understand this is not possible in all circumstances. In these cases, we provide the ability to filter analysis results. See [Filter assignments by entry points](/experiment-analysis/filter-assignments-by-entry-point) for more details.
:::

### An example of how to get assignments correctly

Suppose we are testing out a new payment experience with users. When implementing the assignment, it’s better to fetch the assignment and deliver the experience as close together in the code as possible:

```javascript
export default function PaymentPage({ user: User }): JSX.Element {
  const useNewPaymentFlow =
    eppoClient.getBoolAssignment(user.email, "new-payment-flow", false) === true;

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

Here, assignment and delivery are tightly coupled. Users who are assigned the new payment page always see the new one, and users who are assigned the old payment page always see the old one. There is zero chance for the assignment to occur but the experience not to be delivered.

### An example of how **not** to get assignments

It can be tempting to preemptively compute all possible assignments for a given user.

```javascript
const getUserAssignments = (email: string) => ({
  useNewPaymentFlow:
    eppoClient.getBoolAssignment(email, "new-payment-flow", false) === true,
  useNewFeedRanking:
    eppoClient.getBoolAssignment(email, "new-feed-ranking", false) === true,
  useGreenSubmitButton:
    eppoClient.getStringAssignment(email, "submit-button-color", "blue") === "green",
  // ... all possible assignments for user.
});

export default function PaymentPage({ user: User }): JSX.Element {
  const { useNewPaymentFlow } = getUserAssignments(user.email);

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

This is a poor design for getting assignments because when assembling the user assignments object you are logging these assignments to your assignments table. And if the table is used for experiments, the data in the table indicates that the user actually experienced all these variants, when in fact they have not. The value for the flag new-feed-ranking may return true, but unless the user actually saw the new feed ranking then that value is not only wrong, it all also means the logged assignments are unreliable and cannot be used for analysis.

## 2. Getting assignments via a network

Another example of benefitting from placing assignments close to the experience is avoiding network calls. In addition to batching, it may be tempting to centralize assignment fetching on the server. This may seem especially practical if you don’t pass the the full user object to the front-end and the user attribute needed for the subject key is only available on the backend. However, doing the assignments server-side risks stressing and incurring costs on your network, while our client-side SDKs are designed to get assignments without network calls. Therefore, Eppo recommends for the majority of use cases that the client-side SDK is used whenever possible. There are however a few uses where the server-side SDKs are a better choice for getting assignments, specifically when the experience indicated by the assignment variant originates from the backend, e.g. A/B testing machine learning models whose predictions are generated server-side.

## 3. Not handling non-blocking initialization

The initialization methods in Eppo’s SDKs are non-blocking in order to minimize their footprint on the applications in which they are run. One consequence of this, however, is that it is possible to invoke the `get<Type>Assignment` method before the SDK has finished initializing. If `get<Type>Assignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent configurations. There are two possible outcomes when `get<Type>Assignment` is invoked before the SDK has finished initializing:

1. If the SDK downloads configurations to a persistent store, e.g. the JavaScript client SDK uses local storage, and a configuration was previously downloaded, then the SDK will assign a variation based on a previously downloaded configuration.

2. If no configurations were previously downloaded or the SDK stores the configuration in-memory and loses it during re-initialization, then the SDK will return a null value when `get<Type>Assignment` is invoked.

One workaround for this is to pause execution after the initialization method is called (e.g. `time.Sleep(4 * time.Second)`) to give the SDK time to fetch its first configuration before invoking `get<Type>Assignment`. If pausing execution is undesirable, e.g. slowing the start up of a mobile app is poor UX, then the returned null value will need to be handled in your code to gracefully fallback on a sensible default experience.

## 4. Using targeting rules to define a large list of users

Eppo targeting works based on subject attributes passed into the `get<Type>Assignment` function. It is tempting to use these targeting rules to define a list of specific users to target. However, this can lead to performance issues as now every time the SDK is initialized, this full list of users need to be pulled in from the Eppo CDN. To help keep the Eppo SDK lightweight, we limit the list of specific values you can target to 50.

A better pattern is to define audiences via user-level attributes. For instance, if you would like to target a list of beta users, you can pass an attribute into the `get<Type>Assignment` call specifying whether the user is in the beta group.

```javascript
const variation = eppoClient.getStringAssignment("userId", "my-flag-key", "control", {
  beta_user: "true",
});
```

Now, simply add allocation logic specifying to target users with `beta_user = 'true'`.

![Add attribute to allocation](/img/feature-flagging/add-attribute-to-allocation.png)

This does require you to determine whether a user is in the beta group before calling `getStringAssignment`, but it helps to keep the Eppo SDK very light.

## 5. Using default assignments to track control

When you are running an AB experiment, it is best practice to explicitly assign users as control. If you have already confirmed that the default value is handled well and serves a default experience, it may be tempting to serve 10% of traffic the new variant, serve the remaining 90% the default value, and then analyze the experiment using the default value as the control group.

This however can lead to issues in analyzing an experiment. First, if some traffic receives the default assignment due to network issues, they will all land in the control group. This breaks the core assumption of AB experimentation: that on average there is no difference between the two groups other than the feature on which you are experimenting.

Further, if the allocation percentage changes over time, additional bias may be introduced. Imagine ramping up an experiment to 50% after one week of smoke testing at 10%. If you were to randomly select a user from the control group, they are now more likely to be from the first week of the experiment. Again, there is a difference between the two groups (control is more likely to be from the first week).

To solve both of these problems simultaneously, we highly recommend explicitly tracking control users. To do this, create an allocation with an even distribution across test and control and use the traffic exposure dial to control what percent of users see the new treatment. Then, if you want to ramp up an experiment over time, simply increase this exposure dial.

![Traffic exposure in allocation](/img/feature-flagging/traffic-exposure-in-allocation.png)
