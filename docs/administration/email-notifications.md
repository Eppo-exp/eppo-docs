# Email notifications

Email notifications allow you to receive notifications for important updates on your feature flags, experiments, and metrics such as when Eppo detects a [traffic imbalance](/statistics/sample-ratio-mismatch) in your assignments.

1. [Configure System Wide Email Notifications](#configure-system-wide-email-notifications)
2. [Configure Slack Notifications for Team owned Flags, Experiments, and Metrics](#configure-email-notifications-for-for-team-owned-flags-experiments-and-metrics)
3. [Notification Triggers](#experiment-notification-triggers)

## Configure System Wide Email Notifications

![Enable system wide email notifications](/img/administration/system-wide-email-notifications.png)

You can select specific email addresses to receive notifications for **ANY** experiment in Eppo. This is particularly good option for email groups where the notification can be sent to a relevant group of people.

Only experiment traffic imbalances and experiment refresh errors are available for system-wide email notifications.

## Configure Email Notifications for for Team owned Flags, Experiments, and Metrics

You can select to recieve notifications related to flags, experiments, and metrics that are owned by the Teams you belong to.

![Find your user profile](/img/administration/user-profile.png)

Click on your Workspace name in the left nav to reveal your profile. Click on your profile and you'll find the profile menu. Here you can see what Teams you belong to and manage your personal email notifications.

![Enable team level notifications](/img/administration/user-profile-menu.png)

To turn your notifications on, toggle the switch to the right of your email. You can configure which types of notifications you'll recieve by checking the boxes for each option.

To turn off email notifications, return to the profile menu and toggle notifications off.

## Experiment Notification Triggers

### A data problem on an experiment

![Traffic imbalance notification email](/img/administration/traffic-imbalance-email.png)

- When Eppo detects a [traffic imbalance](/statistics/sample-ratio-mismatch) in your assignments
- When there is an error and the experiment results cannot be refreshed

### A status change on an experiment

- When an experiment changes status from `DRAFT` &rarr; `RUNNING` &rarr; `READY TO REVIEW` &rarr; `COMPLETED`

See more on <a href="https://docs.geteppo.com/building-experiments/experiment-analysis/experiment-status" target="_blank">experiment statuses</a>.

### A primary or guardrail metric reached statistical significance on this experiment

- When a primary metric or a guardrail metric on an experiment reaches statistical significance for **Sequential experiments ONLY**

## Feature Flag Notification Triggers

![Allocation created notification email](/img/administration/flag-change-email.png)

### A Feature Flag is enabled or disabled in production environment

- When a user enables or disables a feature flag in the Production environment only

### A new allocation is added, edited, or deleted to a flag in production environment

- When a user adds, edit, or deletes an allocation of a flag in the Production environment only
- When a user adds a value to the default allocation of a flag in the Production environment only

## Metric Notification Triggers

### A metric reached statistical significance on any team’s sequential experiment

- When a metric reaches statistical significance across all experiments for **Sequential experiments ONLY**