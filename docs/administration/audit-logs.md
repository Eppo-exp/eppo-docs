# Audit Logs

Audit logs are a record of all user actions performed on the platform across experiments, feature flags, metrics, and facts.

Audit logs are written to your warehouse in the `eppo_entity_change_logs` table. Audit logs are updated every hour.

## Audit Log Columns

* id
* entity_name - The table name of the entity that was changed  
* record_id - The ID of the entity that was changed
* user_email - The email of the User who initiated the change
* log_type - INSERT, UPDATE, DELETE
* timestamp - The date/time of the change
* data - JSON of the data that was changed
    * INSERT - The contents of the new record
    * UPDATE - The contents of *only* the columns being updated
    * DELETE - The contents of the record being deleted
* propagated_at - Date/Time of when the change was propagated to the customer's Data Warehouse

## User actions recorded in Audit Logs

Audit logs record the following changes:

- Experiments
    - Experiment created
    - Experiment configuration change 
    - Experiment metric changes
    - Experiment refresh changes
- Metrics
    - Metric created
    - Metric updated
    - Metric collection changes
- Definitions
    - FactSQL changes
    - AssignmentSQL changes
    - PropertySQL FactSQL changes
    - Entity changes
- Feature Flags
    - Creation
    - Update
    - Deletion
Allocation,  
  Experiment,  
  ExperimentMetricGroup,  
  ExperimentMetricGroupMetric,  
  ExperimentVariation,  
  ExposureSchedule,  
  FunnelMetricAggregation,  
  Metric,  
  MetricCollectionMetric,  
  MetricEventAggregation,  
  MetricEventEntity,  
  MetricEventMeasure,  
  MetricEventSource,  