# Slack notifications

<img width="440" alt="data issues alert" src="https://user-images.githubusercontent.com/90637953/213244183-a3580e3b-e077-4fc5-9bbb-2dc307660ebd.png" /> &ensp;
<img width="440" alt="status change alert" src="https://user-images.githubusercontent.com/90637953/213244188-3dbd1333-185e-4416-b925-d36bbac08223.png" /> &ensp;
<img width="440" alt="metrics alert" src="https://user-images.githubusercontent.com/90637953/213244191-5cfcceec-5019-4d82-bd40-ead2aeacd20e.png" />

1. [Allow Permissions to a Slack Workspace](#allow-permissions-to-a-slack-workspace)
2. [Configure System Wide Slack Notifications](#configure-system-wide-slack-notifications)
3. [Configure Slack Notifications for a Specific Experiment](#configure-slack-notifications-for-a-specific-experiment)
4. [Configure Slack Notifications for a Specific Metric](#configure-slack-notifications-for-a-specific-metric)
5. [Notification Triggers](#notification-triggers)

## Allow Permissions to a Slack Workspace
![connect slack](https://user-images.githubusercontent.com/90637953/223586097-a2a1e567-7a9c-4e60-bff1-103d91a65c91.gif)


Go to Admin > Notifications to allow permissions to a Slack workspace. This is required before you can select Slack channels to recieve system wide notifications as well as for any user to add Slack channels for specific experiments and metrics.


## Configure System Wide Slack Notifications
You can select specific Slack channels to receive notifications for **ANY** experiment running in Eppo.
<img width="1386" alt="image" src="https://user-images.githubusercontent.com/90637953/197908102-3f9f5ec4-98ce-427c-8888-079f89b8ec0c.png"/>


## Configure Slack Notifications for a Specific Experiment
![experiment-slack-notifications](https://user-images.githubusercontent.com/90637953/197909040-bb01590c-d329-4d50-8aba-505ba0c60cdc.gif)

Go to an experiment and click on the bell icon in the upper right of the page. Select a Slack channel to receive notifications.

To configure which types of notifications this channel will recieve, click on "Configure" next to the channel name and update preferences.

To remove the Slack channel from this experiment, click on "Configure" and turn off the channel.


## Configure Slack Notifications for a Specific Metric
![metric-slack-notifications](https://user-images.githubusercontent.com/90637953/197909642-14ed977c-8ce0-4cad-b512-9c40d7ae20a5.gif)

Go to a metric and click on the bell icon in the upper right of the page. Select a Slack channel to receive notifications.

To remove the Slack channel from this metirc, click on "Configure" and turn off the channel.


## Notification Triggers
### A data problem on an experiment
* When there is a traffic imbalance detected
* When there is an error and the experiment results cannot be refreshed

### A status change on an experiment
* When an experiment changes status from `DRAFT` &rarr; `RUNNING` &rarr; `WRAP UP` &rarr; `COMPLETED`

See more on <a href="https://docs.geteppo.com/building-experiments/experiments/experiment-status" target="_blank">experiment statuses</a>.

### A primary or guardrail metric reached statistical significance on this experiment
* When a primary metric or a guardrail metric on an experiment reaches statistical significance for **Sequential experiments ONLY**

---

The Eppo App for Slack is included for free in any subscription plan for the Eppo experimentation platform. If you have any questions or feedback, please contact Eppo Support at [support@geteppo.com](mailto:support@geteppo.com).

Eppo's [Privacy Policy](https://app.termly.io/document/privacy-policy/a555478b-524f-4b53-b70e-6575d94ad3c7) and [Terms of Use](https://app.termly.io/document/terms-of-use-for-saas/4c635cc8-24f6-4c05-83fa-0382fca756ce). 
