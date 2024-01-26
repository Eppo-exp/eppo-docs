---
sidebar_position: 5
---

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
