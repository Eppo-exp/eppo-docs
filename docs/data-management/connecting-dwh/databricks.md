# Connecting Databricks

## Preparing your Databricks workspace for Eppo

In order to connect your Databricks SQL warehouse to Eppo, it is highly recommended that you create a service principal to enable the connection.
This guide will walk you through how to do that, as well as set up the necessary permissions.

### 1. Create a service principal

- Navigate to the "Admin Settings" of your workspace.
- Click the "Service principals" tab
- Click "Add service principal"
- Name the service principal something like "Eppo Service Principal"

### 2. Create an Eppo account group

- Navigate to the [Databricks Account Admin](https://accounts.cloud.databricks.com/)
- Click "User Management" in the left navigation
- Click "Groups" tab
- Click "Add group"
- Name the group something like "Eppo Service Group"
- Add the "Eppo Service Principal" to the group

### 3. Add the Eppo account group to your workspace

- Navigate to the "Admin Settings" of your workspace
- Click the "Groups" tab
- Click "Add Group"
- Select the "Eppo Service Group" to add
- Click into the group
- Click "Entitlements" tab
- Enable "Databricks SQL access" and "Workspace access"

### 4. Enable Personal Access Token usage for the Eppo Service Group

- Navigate to the "Admin Settings" of your workspace
- Click "Workspace settings"
- Under "Access Control", next to Personal Access Tokens, click "Permission Settings"
- Select "Eppo Service Group" and "Can Use". Add and save.

## Create an output catalog and schema

Eppo runs computations in your SQL warehouse and requires write access to an output catalog/schema. This will walk you through creating those. Note, we assume you've enabled the Unity Catalog and have one attached to your workspace.

### 1. Create an Eppo service catalog

- Navigate to your Databricks workspace
- Click "Data" in the left navigation
- Click "Create catalog"
- Name your catalog something like "eppo_service_catalog"
- Edit the owner. Make it the "Eppo Service Group".
- Add permissions by clicking the permissions tab and then clicking "Grant". Grant all privileges to the "Eppo Service Group".

### 2. Create an Eppo output schema

- Navigate to your Databricks workspace
- Click "Data" in the left navigation
- Click the "eppo_service_catalog"
- Click "Create schema"
- Name it something like "eppo_output"
- Edit the owner. Make it the "Eppo Service Group".
- Check if permissions exist for the Eppo Service Group. If they don't, add them by clicking "Grant". Grant all privileges to the "Eppo Service Group".

## Grant read permissions to your data

Grant the Eppo Service Group the appropriate `select` privileges for any catalogs/schemas/tables we will need to access. This generally includes your assignment or exposure events, fact tables from which your metrics are derived, and dimension tables that you commonly use in your analyses.

## Connecting your warehouse to Eppo

You need five pieces of information to connect your Databricks SQL warehouse to Eppo

1. Host (e.g., `dbc-a141bc7d-bbfe.cloud.databricks.com`)
2. Path (e.g., `/sql/1.0/warehouses/52210464dc0cc5d5`)
3. Token (e.g., `dapidd77f37bd24c5b7fb82500ff79f9122b`)
4. Catalog (e.g., `eppo_service_catalog`)
5. Schema (e.g., `eppo_output`)

### 1. Locate the host info

- Navigate to your Databricks workspace
- Choose the "SQL" persona in the upper left corner
- Click "SQL Warehouses" in the left nav
- Click the SQL warehouse you want to use for Eppo from the list
- Click the "Connection details" tab
- The host should be near the top of the page under "Server hostname". Copy it somewhere.

### 2. Locate the path info

- Follow steps above for locating the host info
- You should see "HTTP path" a bit down the page. Copy it somewhere.

### 3. Generate a token for the Eppo Service Principal

Databricks requires an access token to connect to a SQL warehouse. Generating one for the service principal account we create above is a bit involved and requires API calls. Follow instructions for generating a token here: https://docs.databricks.com/dev-tools/service-principals.html#step-2-create-the-databricks-access-token-for-the-databricks-service-principal. Note, we recommend choosing at least a one year expiration date for the token as you'll need to regenerate the token and update your connection before it expires each time.

Copy the token somewhere.

### 4. Copy the catalog name you created earlier

In an earlier step, you created an output catalog for Eppo. Copy the name somewhere.

### 5. Copy the schema name you created earlier

In an earlier step, you created an output schema for Eppo in the output catalog. Copy the name somewhere.

### 6. Fill out the connection page in Eppo

- Log in to your Eppo account at [eppo.cloud](https://eppo.cloud)
- Click the `Getting Started` button in the top-right corner. Once on that screen, and within the `Connect your Warehouse` tab, click the `Connect your data warehouse to Eppo` button in the bottom right-hand corner of the screen.
- Once on the data warehouse connection screen, click the `Databricks` tab. From there, you should be prompted to enter all of the necessary information for doing so.
- Enter the values into the form, then click `Test Connection`. Once this test succeeds, save your settings by clicking `Test and Save Connection`.

**Note**: Eppo uses [Google Secret Manager](https://cloud.google.com/secret-manager) to store and manage your credentials. Credentials are never stored in plaintext, and Secret Manager can only be accessed via authorized roles in GCP, where all usage is monitored and logged.

### Updating Credentials

Credentials can be updated at any time within the Admin panel of the app.
