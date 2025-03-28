# Architecture and Security 

Eppo is built using industry-leading best practices to protect and secure your data. Sensitive data never leaves your environment, and we have robust internal controls to ensure the security of all Eppo development and operations.

## Application Architecture

Eppo infrastructure is built entirely using GCP in an environment that is SOC2 Type 2 compliant.

### Data Analysis

Eppo operates on a Warehouse Native model, whereby you provision a dedicated service account in your Data Warehouse (Snowflake, BigQuery, Redshift, Databricks) for Eppo to use. This means that you retain full control over what Eppo can and cannot access, have full audit capabilities of Eppo's behavior, and can terminate Eppo's access at any time. The majority of data processing is done using compute and storage resources in your own Data Warehouse — Eppo never stores that raw data anywhere in our own system.

![Architecture Diagram](/img/reference/data-architecture.png)

**Steps:**
1. Customer configures Data Warehouse (DW) credentials and metadata in Eppo Application. Eppo stores credentials in Google Secrets Manager.
2. Customer uses Eppo Application UI to trigger or schedule data pipelines and queries.
3. Eppo Backend retrieves DW credentials from Google Secrets Manager.
4. Eppo uses credentials to connect to Customer DW and issue queries.
5. Queries to process raw data execute on Customer DW — raw data never leaves Customer DW. Queries generate aggregated summaries of data for analysis.
6. Eppo retrieves aggregated query results, without PII or other sensitive information.
7. Eppo stores results in cache on Eppo DB.
8. Eppo uses these results to serve charts and reports to Customer User on frontend UI.

### Flag and Experiment Deployment

Eppo's feature flagging and experimentation SDKs are also architected in a way that never requires sending raw data to Eppo's environment. 

![SDK Architecture](/img/reference/sdk-architecture.png)

**Steps:**
1. End user configures flag and experiment allocation in Eppo UI.
2. Experiment-level configurations are stored in Eppo Postgres database.
3. Eppo pushes experiment-level ruleset to global CDN, hosted on Fastly.
4. Customer application requests configuration from Eppo CDN, either as experiment ruleset or as a list of pre-computed flag values (evaluated with an Eppo Edge Function).
5. Customer can provide callback function to log data to customer warehouse, Eppo SDK invokes this function on experiment assignment.

Once assignment logs are written to the Customer DW, data is analyzed using the process described in the previous section.

## Data Storage

Eppo never stores your raw data. Eppo will export aggregated data (without PII or other sensitive information) from your system and cache it in an internal Postgres database hosted on GCP. All data is encrypted in-transit and at-rest, with TLS and AES-256.
Credentials to the Customer DW are stored in Google Secrets Manager, and accessible only to a Service Account used by our production application. Administrative access to our Google Cloud Platform account is limited to a short list of Senior Software Engineers.

### Data Deletion

All client data is deleted when offboarding.

## Eppo Security Program

Eppo understands that security of your data is of the utmost importance, so from the start, we have implemented procedures and controls to ensure that development and operation of our software is secure.
 - Critical services are accessed via SSO when possible, with passwords stored in a Password Manager only if SSO is unavailable.
 - Infrastructure-as-code using Terraform in a GitHub repository with Branch Protection, requiring both Code Review and passing CI before merge.
 - We use the Security Command Center in GCP for security and risk management of our Google Cloud assets.
 - All actions within our GCP account are logged.
 - All employees undergo background checks before joining.
 - We use Rippling as an HR+IT system to automate on-boarding and off-boarding.
 - SOC2 Type 2 report available upon request.
