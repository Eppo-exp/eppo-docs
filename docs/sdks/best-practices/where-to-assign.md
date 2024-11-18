---
sidebar_position: 1
---

# Where to assign

:::note
Don't be blocked! We're here to help you get up and running with Eppo. Contact us at [support@geteppo.com](mailto:support@geteppo.com).
:::

### Best Practice
Strive to place assignment calls as close to code split as possible. This reduces the likelihood of logging an assignment but not delivering the corresponding experience.

### Why It Matters
When assignment and delivery are not tightly coupled, you may encounter:
- Impact dilution in your analysis
- Inconsistent user experiences
- Difficulty tracking experiment results

### Example Implementation
Here's how to properly implement assignment placement in a payment flow test by fetching the assignment and delivering the experience as close together in the code as possible:

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

In this example, assignment and delivery are tightly coupled:
- Users assigned to the new payment page always see the new version
- Users assigned to the old payment page always see the old version
- There is minimal chance for assignment-experience mismatch

:::info
While Eppo recommends placing assignment calls as close to the code split as possible, we understand this is not possible in all circumstances. In these cases, we provide the ability to filter analysis results. See [filtering assignments by entry points](/experiment-analysis/configuration/filter-assignments-by-entry-point) for more details.
:::
