---
sidebar_position: 1
---

# Where to assign

:::note
Don't be blocked! We're here to help you get up and running with Eppo. Contact us at [support@geteppo.com](mailto:support@geteppo.com).
:::


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
