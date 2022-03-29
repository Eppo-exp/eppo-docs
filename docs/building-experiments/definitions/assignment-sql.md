# Assignment SQL

When you write an **Assignment SQL**, you're defining how to identify which subjects will be assigned to which experiments and variants.

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
