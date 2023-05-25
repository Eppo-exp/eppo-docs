---
sidebar_position: 5
---

# Users & Permissions

Eppo uses role-based access control to manage what users can view and actions they can perform. Four roles are provided that can be assigned to users to specify their level of access: "Admin," "Data Owner," "Experiment Editor," and "Viewer."

Roles can be assign to users in the Admin section under the "Users & Permissions" tab.

![Feature gate 1](/img/reference/users-and-permissions-tab.png)

**Note:** This tab is only accessible to users who have been assigned the Admin role.

## Roles

In the table below, the available roles and their corresponding permissions are listed.

| Role              | Permissions                                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Viewer            | <ul><li>Can view Definitions</li><li>Can view Metrics</li><li>Can view Experiments</li><li>Can view Feature Flags</li></ul>                                                                                                                                                                                                                                          |
| Experiment Editor | <ul><li>Can view Definitions</li><li>Can view Metrics</li><li>Can view, add, edit, and remove Experiments</li><li>Can view, add, edit, and remove Feature Flags</li></ul>                                                                                                                                                                                            |
| Data Owner        | <ul><li>Can view, add, edit, and remove Definitions</li><li>Can view, add, edit, and remove Metrics</li><li>Can view, add, edit, and remove Experiments</li><li>Can view, add, edit, and remove Feature Flags</li><li>Can view Admin settings</li></ul>                                                                                                              |
| Admin             | <ul><li>Can view, add, edit, and remove Definitions</li><li>Can view, add, edit, and remove Metrics</li><li>Can view, add, edit, and remove Experiments</li><li>Can view, add, edit, and remove Feature Flags</li><li>Can view Admin settings</li><li>Can view, add, edit, and remove API Keys</li><li>Can view, add, edit, and remove Users & Permissions</li></ul> |
