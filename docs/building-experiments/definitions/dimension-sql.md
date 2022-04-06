# Dimension SQL

For example:

```sql
SELECT
ts_assigned,
experiment_name,
variant_name,
user_id,
browser,
device_type
FROM mydb.myschema.assignments
```

In this example, `user_id` is assigned to `experiment_name` in the `variant_name` treatment group.

At the time of assignment, we logged the `browser` and `device_type` of the user. Later on, we can look at how our metrics perform across different browsers and devices.

These dimensions can be any categorical data that lives in your data warehouse. Other potential examples include UTM parameters (source, medium, campaign), or geolocation.
