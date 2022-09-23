# Connecting to Redshift

## Enter credentials into Eppo

1. Log in to your Eppo account at [eppo.cloud](https://eppo.cloud/)
2. To connect Redshift, you will need to input the following information:

- **Connection type** - Redshift
- **User** - `eppo_user`
- **Password** - the `<password>` you chose
- **Host Url** - **Endpoint** from [previous section](#gather-redshift-connection-details)
- **Database name** - **Database name** from [previous section](#gather-redshift-connection-details)
- **Schema name** - `eppo_output`
- **Port** - **Database port** from [previous section](#gather-redshift-connection-details)

Enter the values into the form, then click **Test and Save Connection**. For **Database** and **Schema**, enter the values used for the `eppo_output` database/schema

3. Eppo uses [Google Secret Manager](https://cloud.google.com/secret-manager) to store and manage your credentials. Credentials are never stored in plaintext, and Secret Manager can only be accessed via authorized roles in GCP, where all usage is monitored and logged.
