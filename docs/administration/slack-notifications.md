# Slack notifications
<p float="left">
  <img width="300" style=”margin: 4px 4px 4px 4px;" alt="data issues alert" src="https://user-images.githubusercontent.com/90637953/213244183-a3580e3b-e077-4fc5-9bbb-2dc307660ebd.png" />
  <img width="300" style=”margin: 4px 4px 4px 4px;" alt="status change alert" src="https://user-images.githubusercontent.com/90637953/213244188-3dbd1333-185e-4416-b925-d36bbac08223.png" /> 
  <img width="300" style=”margin: 4px 4px 4px 4px;" alt="metrics alert" src="https://user-images.githubusercontent.com/90637953/213244191-5cfcceec-5019-4d82-bd40-ead2aeacd20e.png" />
</p>

1. [Allow Permissions to a Slack Workspace](#allow-permissions-to-a-slack-workspace)
2. [Configure System Wide Slack Notifications](#configure-system-wide-slack-notifications)
3. [Configure Slack Notifications for a Specific Experiment](#configure-slack-notifications-for-a-specific-experiment)
4. [Configure Slack Notifications for a Specific Metric](#configure-slack-notifications-for-a-specific-metric)
5. [Notification Triggers](#notification-triggers)

## Allow Permissions to a Slack Workspace
![Enable Slack Notifications](https://user-images.githubusercontent.com/90637953/197907443-9c3d3db1-65fa-405f-b808-bac63d4d09f8.gif)

Go to Admin > Notifications to allow permissions to a Slack workspace. This is required before you can select slack channels to recieve system wide notifications as well as for any user to add slack channels for specific experiments and metrics.


## Configure System Wide Slack Notifications
You can select specific Slack channels to receive notifications for **ANY** experiment running in Eppo.
<img width="1386" alt="image" src="https://user-images.githubusercontent.com/90637953/197908102-3f9f5ec4-98ce-427c-8888-079f89b8ec0c.png"/>


## Configure Slack Notifications for a Specific Experiment
![experiment-slack-notifications](https://user-images.githubusercontent.com/90637953/197909040-bb01590c-d329-4d50-8aba-505ba0c60cdc.gif)

Go to an experiment and click on the bell icon in the upper right of the page. Select a slack channel to receive notifications.

To configure which types of notifications this channel will recieve, click on "Configure" next to the channel name and update preferences.

To remove the slack channel from this experiment, click on "Configure" and turn off the channel.


## Configure Slack Notifications for a Specific Metric
![metric-slack-notifications](https://user-images.githubusercontent.com/90637953/197909642-14ed977c-8ce0-4cad-b512-9c40d7ae20a5.gif)

Go to a metric and click on the bell icon in the upper right of the page. Select a slack channel to receive notifications.

To remove the slack channel from this metirc, click on "Configure" and turn off the channel.


## Notification Triggers
### A data problem on an experiment
* When there is a traffic imbalance detected
* When there is an error and the experiment results cannot be refreshed

### A status change on an experiment
* When an experiment changes status from `DRAFT` &rarr; `RUNNING` &rarr; `WRAP UP` &rarr; `COMPLETED`

See more on <a href="https://docs.geteppo.com/building-experiments/experiments/experiment-status" target="_blank">experiment statuses</a>.

### A primary or guardrail metric reached statistical significance on this experiment
* When a primary metric or a guardrail metric on an experiment reaches statistical significance for **Sequential experiments ONLY**
