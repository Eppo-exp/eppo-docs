# Assignment SQL

When you write an **Assignment SQL**, you're defining which entities will be assigned to which experiment and variation, and at what time.

You can optionally include any [properties](./property-sql.md) that you want to be able to slice/dice the analysis by.

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

## Creating an Assignment SQL

1. Navigate to **Definitions** and click **Create Definition SQL**

![Create Definition SQL](/img/building-experiments/create-definition-sql.png)

2. Click **Assignment SQL**

![Create Assignment SQL](/img/building-experiments/create-assignment-sql.png)

3. Select the subject of the Assignment SQL

![Select user as entity](/img/building-experiments/select-user-as-entity.png)

Entities are the randomization units of your experiment. By default, entities in Eppo are **User**, but you can also [create your own customized entities](../entities.md) and attach Assignment SQL's to them.

4. Name your Assignment SQL

5. Write SQL in the SQL editor to pull assignments from data warehouse and click **Run**

Recall tht you should have an assignment table in your data warehouse with certain column types.

In this step, you're going to write SQL to pull that data.

![Write Assignment SQL Query](/img/building-experiments/add-assignment-sql-query.png)

Then click **Run**, and the rows from that assignment table should appear in the bottom left.

6. Annotate the columns that you've selected from the data warehouse

In case there's any ambiguity as to which properties the columns correspond to, we annotate them here.

![Annotate assignment SQL columns](/img/building-experiments/annotate-assignment-sql-columns.png)

7. Make note of your feature flag name and variant names

Note the value of the **FEATURE FLAG** column; in this example it's `new_user_onboarding` - this is your feature flag name.

Note the values of the **VARIANT** column; in this example it's `control` and `treatment` - these are the names of your variants.

You will need these names later.

8. Adding optional properties

![Add Assignment SQL Properties](/img/building-experiments/add-assignment-sql-dimensions.png)

Your feature flag tooling may have logged additional data about the user, like what country they're from or which browser they're using. You can annotate these additional properties here, and they will show up under the **Entity Property SQL** tab.

<!-- <img src="https://firebasestorage.googleapis.com/v0/b/eppo-documentation-images.appspot.com/o/add-assignment-sql-dimensions.png?alt=media&token=dfd583db-4ea7-4013-b5fc-d90612118738" width="500" height="200"/> -->

9. Click **Save & Close**
