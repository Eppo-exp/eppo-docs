# Connecting to Snowflake

## Enter credentials into Eppo
1. Log in to your Eppo account at [eppo.cloud](https://eppo.cloud/)
2. To connect Snowflake, you will need to input the following information:

- **Connection type** - Snowflake
- **Server** - everything before the `.snowflakecomputing.com` in the customer's snowflake URL. For example, if your Snowflake account URL is `my-company.us-east-1.snowflakecomputing.com` then the value to enter is `my-company.us-east-1`.
- **Warehouse** - from inside your Snowflake instance, click the **Warehouses** item from the menu -- choose from among the listed warehouses
- **Database** - **Database name** from step 3 in the previous section
- **Schema** - `eppo_output`
- **Username** - `eppo_user`
- **Password** - the `<password>` you chose

Enter the values into the form, then click **Test and Save Connection**.
3. Eppo uses [Google Secret Manager](https://cloud.google.com/secret-manager) to store and manage your credentials. Credentials are never stored in plaintext, and Secret Manager can only be accessed via authorized roles in GCP, where all usage is monitored and logged.
