# Audit Logs

Audit logs are a record of all user actions performed on the platform across experiments, feature flags, metrics, and facts.

Audit logs are written to your warehouse in the `merged_eppo.eppo_entity_change_logs` table. Audit logs are updated every 24 hours.

## Audit Log Columns

* id
* entity_name - The table name of the entity that was changed  
* record_id - The ID of the entity that was changed
* user_id - The ID of the User who initiated the change
* log_type - INSERT, UPDATE, DELETE
* timestamp - The date/time of the change
* data - JSON of the data that was changed
    * INSERT - The contents of the new record
    * UPDATE - The contents of *only* the columns being updated
    * DELETE - The contents of the record being deleted
* propogated_at - Date/Time of when the change was propagated to the customer's Data Warehouse

## User actions recorded in Audit Logs

Audit logs record the following changes:

- Experiments
    - Experiment created
    - Experiment configuration change 
    - Experiment metric changes
    - Experiment manual update
- Metrics
    - Name change
    - Fact change
    - Aggregation change
    - Additional details (metric properties, winsorization, etc)
- Facts
    - FactSQL changes
    - Fact create, edit, delete
- Feature Flags
    - Creation
    - Update
    - Deletion