# Audit log

Each Eppo feature flag comes with a historical log that documents all updates made to that flag:

![Audit log](/img/feature-flagging/audit-log.png)

Eppo logs the following updates:

- Flag creation
- Variation creation and deletion
- Flag name change
- Change in flag state (on or off) by environment
- Allocation creation or deletion by environment
- Allocation reordering by environment
- Allocation update by environment
- Default value change by environment
- Flag archival

Knowing who changed what is useful both for governance and accounting for any unexpected behavior in your application.

## Restore old versions

:::note
Restore functionalty is currently in closed Beta
:::

The audit log also provides restore version functionality. When inspecting a previous version, you can easily see what changes will be made by restoring this version. Click on the `Restore` button to make the change.

[Compare version and restore](/img/feature-flagging/restore-version.png)

Restore functionality is only available to users who have edit rights to the Feature Flag.