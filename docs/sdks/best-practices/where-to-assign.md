---
sidebar_position: 1
---

# Where to assign

:::note
Don't be blocked! We're here to help you get up and running with Eppo. Contact us at [support@geteppo.com](mailto:support@geteppo.com).
:::

### Best Practice

Strive to place assignment calls as close to the intervention as possible. This ensures that users who are assigned to an experiment actually experience the feature being tested, leading to cleaner data and more reliable conclusions.

### Why It Matters

When assignment and delivery are not tightly coupled, we face several challenges:

- **Impact dilution**: Assigning users too early means many will never reach the intervention. These users contribute no meaningful data, making it harder to detect real differences between groups. This weakens the statistical power of the experiment, increasing both the uncertainty in the results, and the required duration of the experiment.

- **Difficulty tracking experiment results**: When users are assigned far in advance, it becomes unclear who actually experienced the intervention. This makes debugging, customer support, and analyzing outcomes more difficult, as there is uncertainty around which users were truly exposed to the change.

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
