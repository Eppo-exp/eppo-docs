# Feature Flag Notifications

The Eppo App for Slack allows you to receive notifications for important updates on your feature flags.

## Allow Permissions to a Slack Workspace

Follow the directions to [setup Slack notifications in your workspace](../administration/slack-notifications.md).

## Configure System Wide Slack Notifications

You can select specific Slack channels to receive notifications for **ANY** change to a Production feature flag in Eppo.

![Slack notification setup](/img/administration/global-slack-notifications.png)

## Configure Slack Notifications for a Specific Feature Flag

Go to a feature flag and click on the bell icon in the upper right of the page. Select a Slack channel to receive notifications.

To remove the Slack channel from this feature flag, click on "Configure" and turn off the channel.

## Feature Flag Notification Triggers

### A Feature Flag is enabled or disabled in production environment

- When a user enables or disables a feature flag in the Production environment only

### A new allocation is added, edited, or deleted to a flag in production environment

- When a user adds, edit, or deletes an allocation of a flag in the Production environment only
- When a user adds a value to the default allocation of a flag in the Production environment only

---

The Eppo App for Slack is included for free in any subscription plan for the Eppo experimentation platform. If you have any questions or feedback, please contact Eppo Support at [support@geteppo.com](mailto:support@geteppo.com).

Eppo's [Privacy Policy](https://app.termly.io/document/privacy-policy/a555478b-524f-4b53-b70e-6575d94ad3c7) and [Terms of Use](https://app.termly.io/document/terms-of-use-for-saas/4c635cc8-24f6-4c05-83fa-0382fca756ce).
