# Slack notifications

The Eppo App for Slack allows you to receive notifications for important updates on your feature flags and experiments, such as when Eppo detect a [traffic imbalance](/statistics/sample-ratio-mismatch) in your assignments.

<img width="440" alt="data issues alert" src="https://user-images.githubusercontent.com/90637953/213244183-a3580e3b-e077-4fc5-9bbb-2dc307660ebd.png" /> &ensp;
<img width="440" alt="status change alert" src="https://user-images.githubusercontent.com/90637953/213244188-3dbd1333-185e-4416-b925-d36bbac08223.png" /> &ensp;
<img width="440" alt="metrics alert" src="https://user-images.githubusercontent.com/90637953/213244191-5cfcceec-5019-4d82-bd40-ead2aeacd20e.png" />

1. [Allow Permissions to a Slack Workspace](#allow-permissions-to-a-slack-workspace)
2. [Configure System Wide Slack Notifications](#configure-system-wide-slack-notifications)
3. [Configure Slack Notifications for a Specific Experiment](#configure-slack-notifications-for-a-specific-experiment)
4. [Configure Slack Notifications for a Specific Metric](#configure-slack-notifications-for-a-specific-metric)
5. [Notification Triggers](#notification-triggers)

## Allow Permissions to a Slack Workspace

![connect slack](https://user-images.githubusercontent.com/90637953/223587265-019faec4-279a-4ebe-b410-5fe2a3982a1d.gif)

Go to Admin > Notifications to allow permissions to a Slack workspace. This is required before you can select Slack channels to receive system wide notifications as well as for any user to add Slack channels for specific experiments, feature flags, or metrics.

## Configure System Wide Slack Notifications

You can select specific Slack channels to receive notifications for **ANY** experiment or feature flag in Eppo.

![Slack notification setup](/img/administration/global-slack-notifications.png)

## Configure Slack Notifications for a Specific Experiment

![experiment-slack-notifications](https://user-images.githubusercontent.com/90637953/197909040-bb01590c-d329-4d50-8aba-505ba0c60cdc.gif)

Go to an experiment and click on the bell icon in the upper right of the page. Select a Slack channel to receive notifications.

To configure which types of notifications this channel will receive, click on "Configure" next to the channel name and update preferences.

To remove the Slack channel from this experiment, click on "Configure" and turn off the channel.

## Configure Slack Notifications for a Specific Metric

![metric-slack-notifications](https://user-images.githubusercontent.com/90637953/197909642-14ed977c-8ce0-4cad-b512-9c40d7ae20a5.gif)

Go to a metric and click on the bell icon in the upper right of the page. Select a Slack channel to receive notifications.

To remove the Slack channel from this metric, click on "Configure" and turn off the channel.

## Configure Slack Notifications for a Specific Feature Flag

Go to a feature flag and click on the bell icon in the upper right of the page. Select a Slack channel to receive notifications.

To remove the Slack channel from this feature flag, click on "Configure" and turn off the channel.

## Experiment Notification Triggers

### A data problem on an experiment

- When Eppo detects a [traffic imbalance](/statistics/sample-ratio-mismatch) in your assignments
- When there is an error and the experiment results cannot be refreshed

### A status change on an experiment

- When an experiment changes status from `DRAFT` &rarr; `RUNNING` &rarr; `WRAP UP` &rarr; `COMPLETED`

See more on <a href="https://docs.geteppo.com/experiment-analysis/reading-results/experiment-status" target="_blank">experiment statuses</a>.

### A primary or guardrail metric reached statistical significance on this experiment

- When a primary metric or a guardrail metric on an experiment reaches statistical significance for **Sequential experiments ONLY**

## Feature Flag Notification Triggers

### A Feature Flag is enabled or disabled in production environment

- When a user enables or disables a feature flag in the Production environment only

### A new allocation is added, edited, or deleted to a flag in production environment

- When a user adds, edit, or deletes an allocation of a flag in the Production environment only
- When a user adds a value to the default allocation of a flag in the Production environment only

---

The Eppo App for Slack is included for free in any subscription plan for the Eppo experimentation platform. If you have any questions or feedback, please contact Eppo Support at [support@geteppo.com](mailto:support@geteppo.com).

Eppo's [Privacy Policy](https://app.termly.io/document/privacy-policy/a555478b-524f-4b53-b70e-6575d94ad3c7) and [Terms of Use](https://www.geteppo.com/terms-and-conditions).
