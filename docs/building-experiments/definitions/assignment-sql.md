# Assignment SQL

When you write an **Assignment SQL**, you're defining which entities will be assigned to which experiment and variation, and at what time.

You can optionally include any dimensions that you want to be able to slice/dice the analysis by.

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

## Creating an Assignment SQL

1. Navigate to **Definitions**

2. Click **Create Definition SQL**

3. Click **Assignment SQL**

4. Select the subject of the Assignment SQL

This should one of the entities you created.

In this case we are assigning users into different groups, so we choose **Users**

5. Name your Assignment SQL

6. Write SQL in the SQL editor to pull assignments from data warehouse

7. Click run

8. Annotate the columns that you've selected from the data warehouse

Eppo needs to know which columns correspond to experiment subject, timestamp of assignment, feature flag, and variant.

## 9. Adding optional dimensions

10. Save & Close
