# Experiment Update Webhook

Webhooks let your integrations take action in response to events that occur in Eppo. The Experiment Update Webhook is a good solution when a custom application needs to display or take action on the most up to date state of an experiment.

## Webhook Events
The webhook sends four types of experiment update events. If you only want to take action based on certain types of events, you can filter to just the events you are interested in subscribing to based on their event type in the request body.

| Event | Triggers | Request body |
| :--- | :--- | :--- |
| experiment.metric.updated | <li> When metric is added /  removed </li><li> When metric collection is added / removed </li>| <code>{<br/> "event": "experiment.metric.updated", <br/> "data": {"experiment_id": <experiment_id>,"experiment_key": "<experiment_key>"},<br/> "signature": "&lt;signature&gt;" <br/>}</code>|
| experiment.configuration.updated | <li>When user edit any configuration</li> | <code>{<br/> "event": "experiment.configuration.updated", <br/> "data": {"experiment_id": <experiment_id>,"experiment_key": "<experiment_key>"},<br/> "signature": "&lt;signature&gt;" <br/>}</code> |
| experiment.status.updated	| <li>When experiment's status changes</li> | <code>{<br/> "event": "experiment.status.updated", <br/> "data": {"experiment_id": <experiment_id>,"experiment_key": "<experiment_key>"},<br/> "signature": "&lt;signature&gt;"<br/>}</code>  |
| experiment.calculated_metrics.updated	| <li> When data pipeline run irrespective of success or failure and mode of trigger manual or scheduled</li> | <code>{<br/> "event": "experiment.calculated_metrics.updated", <br/> "data": {<br/>"experiment_id": <experiment_id>,<br/>"experiment_key": "<experiment_key>", <br/> "meta_data": { <br/> "status": "<success \| failure>",<br/>  "is_manual_refresh": &lt;boolean&gt;,<br/> "is_data_updated": &lt;boolean&gt;, <br/>  "time_taken_seconds": &lt;number&gt;,<br/>  "is_traffic_imbalance": &lt;boolean&gt;, <br/>  "assignments_scan_start_date": &lt;date&gt;,<br/>  "assignments_scan_start_date": &lt;date&gt;<br/>}<br/>},<br/> "signature": "&lt;signature&gt;"  <br/> }</code> |

## Configuring the webhook
To use the webhook, you first need to setup a URL on your side to receive the webhook payload. Once that is done, contact [Eppo support](emailto:support@geteppo.com) to set and enable the webhook.