---
sidebar_position: 5
---

# Users & Permissions

Eppo uses role-based access control to manage what users can view and actions they can perform. Four roles are provided that can be assigned to users to specify their level of access: "Admin," "Data Owner," "Experiment Editor," and "Viewer."

Roles can be assigned to users in the Admin section under the "Users & Permissions" tab.

![Feature gate 1](/img/reference/users-and-permissions-tab.png)

**Note:** This tab is only accessible to users who have been assigned the Admin role.

## Roles

In the table below, the available roles and their corresponding permissions are listed.

Additionally, [Teams](/administration/teams) provide an additional layer of permissions. Any non-admins that are not part of a Team that owns a metric, experiment, or flag do not have permission to edit it.

| Role              | Permissions                                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Viewer            | <ul><li>Can view Insights</li><li>Can view Experiments</li><li>Can view Feature Flags</li><li>Can view Metrics</li><li>Can view and join Teams</li></ul>                                                                                                                                                                                                                                          |
| Experiment Editor | <ul><li>Can view Insights</li><li>Can view, add, edit, refresh, and remove Experiment Analyses</li><li>Can view, add, edit, and remove Feature Flags</li><li>Can view Metrics</li><li>Can view and join Teams</li></ul>                                                                                                                                                                                            |
| Data Owner        | <ul><li>Can view Insights</li><li>Can view, add, edit, refresh, and remove Experiment Analyses</li><li>Can view, add, edit, and remove Feature Flags</li><li>Can view, add, edit, and remove Metrics</li><li>Can view, add, edit, and remove Definitions</li><li>Can view and join Teams</li><li>Can view and edit Admin settings</li><li>Can view the Metric Sync Log</li><li>Can view Usage Tracking</li></ul>                                                                                                              |
| Admin             | <ul><li>Can view Insights</li><li>Can view, add, edit, refresh, and remove Experiment Analyses</li><li>Can view, add, edit, and remove Feature Flags</li><li>Can view, add, edit, and remove Metrics</li><li>Can view, add, edit, and remove Definitions</li><li>Can create, view, join, and invite others to Teams</li><li>Can view and edit Admin settings</li><li>Can view the Metric Sync Log</li><li>Can view Usage Tracking</li><li>Can view, add, edit, and remove API Keys and Webhooks</li><li>Can view, add, edit, and remove Users & Permissions</li></ul> |
