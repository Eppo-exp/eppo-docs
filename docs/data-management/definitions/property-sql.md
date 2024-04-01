# Entity Property SQL

**Entity Property SQLs** define entity-level properties that do not change as a result of experiments. Examples include original traffic source and primary country:

```sql
select user_id
    ,  original_traffic_source
    ,  primary_country
  from analytics_prod.user_dim
```

If your property could change as part of the experiment (subscription tier, etc.), we suggest you add the property value at point of assignment to the [Assignment SQL](/data-management/definitions/assignment-sql) definition.

Both properties added to Assignment SQLs and Entity Property SQLs are listed on the Definitions page under the Entity Properties tab

![Properties](/img/building-experiments/dimensions-from-bnpl.png)

## Creating an Entity Property SQL

To create an Entity Property SQL follow the steps below:
1. Navigate to the **Definitions** page, click **Create Definition SQL**, select **Entity Property SQL** and choose the relevant entity
2. Give the Entity Property SQL a title
3. Write SQL that returns the properties of interest
4. Use the right panel to specify which column ties to the entity
5. Create one or more Entity Properties by specifying a column in the table and giving it a human-readable name

![Write SQL Properties](/img/building-experiments/dimension-sql-query.png)

Once you're finished adding mapping columns into Eppo, click **Save & Close**.
