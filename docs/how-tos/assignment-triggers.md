# Assign users close to experiences

When implementing experiments in code, it’s best practice to place assignment calls as close to your end experience as possible. This reduces the likelihood of logging the assignment but not delivering the experience, which can skew analysis.

### Good assignment example

Suppose we are testing out a new payment experience with users. When implementing the assignment, we’d like to fetch the assignment and delivery the experience as close in the code as possible:

```jsx
export default function PaymentPage({ user: User }): JSX.Element {
  const useNewPaymentFlow =
    eppoClient.getAssignment('new-payment-flow', user) === 'true';

  return (
    <Container>
      {useNewPaymentFlow
				? <PaymentPageV2 user={user} />
			  : <PaymentPage user={user} />
      )}
    </Container>
  );
}
```

Here we have a tightly couple assignment and delivery. Users who are assigned the new product always see the new one, and users are assigned the old product always see the old one. There is little room for assignment to happen but the experience not to be delivered.

### Bad assignment example: Batch assignment on page load

It can be tempting to preemptively compute all possible assignments for a given user on page load. Centralization on the server can be especially practical if you don’t pass a full version of the user to the front-end, limiting how you can target. You may end up with a huge object like this:

```jsx
current_user_assignments = {
  new_payment_flow: eppoClient.getAssignment(user, "new-payment-flow"),
  feed_ranking: eppoClient.getAssignment(user, "feed-ranking"),
  caching_experiment: eppoClient.getAssignment(user, "caching-experiment"),

  // ... all possible assignments for user.
};
```

However tempting, this is a poor pattern because when assembling this object you are letting the experiment system know that the user _actually experienced all these variants_, when in fact they have not. The value for the flag `new_payment_flow` may return `true`, but unless the user actually saw the new payment flow then that value is not only wrong, it throws a wrench in your analytics.
