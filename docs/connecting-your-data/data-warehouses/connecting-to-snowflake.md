# Connecting to Snowflake

## Create a Service User for Eppo
1. Log into Snowflake with a user that has `ACCOUNTADMIN` privileges.
2. Create a user with the following command, replacing `<password>` with a unique, secure password:

```sql
USE ROLE ACCOUNTADMIN;
CREATE ROLE IF NOT EXISTS eppo_role;
CREATE USER IF NOT EXISTS eppo_user
PASSWORD = ‘<password>’;
GRANT ROLE eppo_role TO USER eppo_user;
ALTER USER eppo_user
SET DEFAULT_ROLE = eppo_role;
```

3. Grant this user the appropriate privileges for any tables we will need to access. This
generally includes your assignment or exposure events, fact tables from which your
metrics are derived, and dimension tables that you commonly use in your analyses.
```sql
GRANT USAGE ON DATABASE <database> TO ROLE eppo_role;
GRANT USAGE ON SCHEMA <schema> TO ROLE eppo_role;
GRANT SELECT ON TABLE <schema>.<table1> TO ROLE eppo_role;
GRANT SELECT ON TABLE <schema>.<table2> TO ROLE eppo_role;
...
GRANT SELECT ON TABLE <schema>.<tableN> TO ROLE eppo_role;
```

4. Create a schema for Eppo to write intermediate results and temporary tables.
```sql
CREATE SCHEMA IF NOT EXISTS eppo_output;
GRANT ALL ON SCHEMA eppo_output TO ROLE eppo_role;
```

5. (Optional) Create a warehouse for Eppo to use
```sql
CREATE WAREHOUSE IF NOT EXISTS eppo_wh
WAREHOUSE_SIZE = <wh_size>
AUTO_SUSPEND = 300
INITIALLY_SUSPENDED = true;
GRANT ALL PRIVILEGES ON WAREHOUSE eppo_wh TO ROLE eppo_role;
```

6. (Optional) Add Eppo’s static IP addresses to your [Network Policy](https://docs.snowflake.com/en/user-guide/network-policies.html) if you have one:
`35.226.89.62`, `34.133.196.109`

## Enter credentials into Eppo
1. Log in to your Eppo account at [eppo.cloud](https://eppo.cloud/)
2. Enter the values into the form, then click **Test and Save Connection**. For **Database** and **Schema**, enter the values used for the `eppo_output` database/schema
3. Eppo uses [Google Secret Manager](https://cloud.google.com/secret-manager) to store and manage your credentials. Credentials are never stored in plaintext, and Secret Manager can only be accessed via authorized roles in GCP, where all usage is monitored and logged.