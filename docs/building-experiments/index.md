# Building Experiments

In Eppo, you can build your experiments using a few core building blocks:

- [Entities](./entities/)
- [Definitions](./definitions/)
    - [Assignments](./definitions/assignment-sql)
    - [Facts](./definitions/fact-sql)
- [Metrics](./metrics/creating-metrics)
- [Experiments](./experiments/creating-experiments)

## Overview

Let's suppose that you're a food delivery app that wants to track the effect of a new push notification on customer ordering habits.

_Assignments_ refer to the assignment of customers into different experiment groups (some of the customers received the push notifications and some of them did not).

The food delivery app will have events that occur like "Customer X placed an order worth $23.44 from Restaurant Y at time T".

```sql
SELECT
  ts,
  customer_id,
  restaurant_id,
  order_value,
  promo_amount
FROM mydb.myschema.restaurant_orders
```

_Entities_ are who was involved in the event - in this case _Customer_ and _Restaurant_.

_Facts_ (one of kind of _Definition_) are the numeric quantities associated with the event - in this case `order_value` and `promo_amount`.

_Facts_ are aggregated to form _Metrics_ which you use to evaluate _Experiments_.

From the above `restaurant_orders` event, you can construct metrics such as:

  - Total order volume -- the sum of order values across all customers
  - Number of orders -- the number of orders placed by all customers
  - Distinct ordering customers -- the number of customers who have placed an order
  - Total revenue by customer (entity = customer, fact = `order_value`)
  - Total revenue by restaurant (entity = restaurant, fact = `order_value`)
  - Total promos received by restaurant (entity = customer, fact =
    `promo_amount`)
