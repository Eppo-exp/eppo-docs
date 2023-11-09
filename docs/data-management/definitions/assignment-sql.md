# Assignment SQL

**Assignment SQLs** tell Eppo where to find a log of every time a subject (e.g., user) was enrolled into an experiment, the name of that experiment, and the variant that was assigned. Assignment SQLs can point to either logs from Eppo's SDK or from existing internal or third party randomization tools. You can also create multiple assignment sources if you use a combination of assignment methods.

Assignment SQLs can also include any [properties](./property-sql.md) by which you want to split results.

```sql
SELECT
    ts_assigned,
    experiment_name,
    variant_name,
    user_id,
    -- optional properties that may be later used to split results
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

3. Select the subject (randomized unit) of the Assignment SQL. To learn more about specifying multiple randomization units Eppo, see the [entities page](/data-management/entities).

![Select user as entity](/img/building-experiments/select-user-as-entity.png)

4. Name your Assignment SQL

5. Write SQL in the SQL editor to pull assignments from your data warehouse and click **Run**

At a minimum, this query should return a unique identifier for the subject (e.g., `user_id`), a unique identifier for the experiment, the variant the subject received, and a timestamp. You can also add optional subject properties such as browser or country.

If you do not yet have assignment logs in your warehouse, see the [Event Logging page](/how-tos/event-logging).

![Write Assignment SQL Query](/img/building-experiments/add-assignment-sql-query.png)

Then click **Run**, and the rows from that assignment table should appear in the bottom left.

6. Annotate the columns that you've selected from the data warehouse

In case there's any ambiguity as to which properties the columns correspond to, we annotate them here.

![Annotate assignment SQL columns](/img/building-experiments/annotate-assignment-sql-columns.png)

7. Adding optional properties

Your feature flag tooling may have logged additional data about the user, like what country they're from or which browser they're using. You can annotate these additional properties here, and they will show up under the **Entity Property SQL** tab.

<!-- <img src="https://firebasestorage.googleapis.com/v0/b/eppo-documentation-images.appspot.com/o/add-assignment-sql-dimensions.png?alt=media&token=dfd583db-4ea7-4013-b5fc-d90612118738" width="500" height="200"/> -->

![Add Assignment SQL Properties](/img/building-experiments/add-assignment-sql-dimensions.png)

Holdout columns are also defined here. More information is available on the [dedicated page](/experiments/holdouts).

![Write Assignment SQL Query](/img/experiments/holdouts/holdouts-assignment-sql.png)

8. Click **Save & Close**
