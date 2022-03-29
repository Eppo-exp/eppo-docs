# Fact SQL

Fact SQL queries are queries that correspond to events. A food delivery app might have events such as “Customer X placed an order worth $23.44 from Restaurant Y at time T”. These events are then aggregated to form the metrics which you use to evaluate experiments:

```sql
SELECT
ts,
customer_id,
restaurant_id,
order_value,
promo_amount
FROM mydb.myschema.restaurant_orders
```

- From the above event, you can construct metrics such as:
  - Total order volume -- the sum of order values across all customers
  - Number of orders -- the number of orders placed by all customers
  - Distinct ordering customers -- the number of customers who have placed an order
- Within Eppo, when you provide us with the above event, you must annotate the following columns:

  - Timestamp - when the event occurred
  - In the example above, the “ts” column is the timestamp that the order was placed
  - Entities - who was involved in the event
  - In the example above, “customer” and “restaurant” are the two entities that were involved in the event.

- In the Fact configuration interface, associate `customer_id` with the `customer` entity, and `restaurant_id` with the `restaurant`
  entity.

- Facts - what are the numeric quantities associated with this event?
- In the example above, `order_value` and `promo_amount` are the numeric values that you select as your facts.
  - These are typically the columns that are aggregated to produce
    metrics, such as “Total order volume”
  - With this setup, you can construct many different types of metrics from a single event. For example:
  - Total revenue by customer (entity = customer, fact = order_value)
  - Total revenue by restaurant (entity = restaurant, fact = order_value) ○ Total promos received by restaurant (entity = customer, fact =
    promo_amount)

When you write Fact SQL's, you're pulling data from the data warehouse that correspond to specific events that serve as input to metrics. For example, signups, activations, net subscriptions, etc.

## Creating a Fact SQL

1. Navigate to **Definitions**

2. Click **Create Definition SQL**

3. Click **Assignment SQL**

4. Select the subject of the Fact SQL

This should one of the entities you created.

In this case we are assigning users into different groups, so we choose **Users**

5. Name your Assignment SQL

6. Write SQL in the SQL editor to pull events data from the data warehouse

7. Annotate the columns that you've selected from the data warehouse

In the example above, Eppo has already automatically determined that the `timestamp of creation` column is `ts` and the relenvant `entity id` column is `USER_ID`.

8. Add Facts

You'll want to add facts, one fact per column.

In the example above, we would like to measure the effect of the experiment on the number of upgrades.

In the data warehouse, every time someone upgrades, that event is logged as a row in the data warehouse.

This event is translated into an integer value, `1`, that can then be used as an Eppo fact and tracked in an experiment.

10. Save & Close
