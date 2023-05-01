---
sidebar_position: 5
---
# Users & Permissions

Eppo uses role-based access control to manage what users can view and actions they can perform. Four roles are provided that can be assigned to users to specify their level of access: `Admin`, `Data Owner`, `Experiment Editor`, and `Viewer`.

## Roles

| Role              | Permissions                                                                                                   |
|-------------------|-------------------------------------------------------------------------------------------------------------- |
| Viewer            | <ul><li>Can view Definitions</li><li>Can view Metrics</li><li>Can view Experiments</li><li>Can view Feature Flags</li></ul> |
| Experiment Editor | <ul><li>Can view, add, edit, and remove Definitions</li><li>Can view, add, edit, and remove Metrics</li><li>Can view Experiments</li><li>Can view Feature Flags</li></ul> |
| Data Owner        | <ul><li>Can view, add, edit, and remove Definitions</li><li>Can view, add, edit, and remove Metrics</li><li>Can view, add, edit, and remove Experiments</li><li>Can view, add, edit, and remove Feature Flags</li><li>Can view Admin settings</li></ul> |
| Admin             | <ul><li>Can view, add, edit, and remove Definitions</li><li>Can view, add, edit, and remove Metrics</li><li>Can view, add, edit, and remove Experiments</li><li>Can view, add, edit, and remove Feature Flags</li><li>Can view Admin settings</li><li>Can view, add, edit, and remove API Keys</li><li>Can view, add, edit, and remove Users & Permissions</li></ul> |