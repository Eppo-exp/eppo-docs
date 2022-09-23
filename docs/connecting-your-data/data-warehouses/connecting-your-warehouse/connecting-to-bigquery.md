# Connecting to BigQuery

## Enter credentials into Eppo

1. Open the JSON file created in Step 10 under _Create a Service Account_
2. Log in to your Eppo account at [eppo.cloud](https://eppo.cloud/), enter the values into the form fill as shown below, and click **Test and Save Connection**
 - **Connection type** - BigQuery
 - **Service Account JSON** - From step 10 above
 - **BigQuery Dataset** - `eppo_output`
 - **BigQuery Project** - Name of the BQ project to which `eppo_output` belongs
 - **BigQuery Region** - The region in which you created the `eppo_output` dataset
   ![Bigquery warehouse connection](../../../static/img/connecting-data/BigQuery-Connection-UI_V2.png)
3. Eppo uses [Google Secret Manager](https://cloud.google.com/secret-manager) to store and manage your credentials. Credentials are never stored in plaintext, and Secret Manager can only be accessed via authorized roles in GCP, where all usage is monitored and logged.
