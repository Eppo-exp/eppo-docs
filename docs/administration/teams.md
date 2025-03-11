# Teams

Create and join Teams to organize your Eppo workspace. Teams apply to experiments, metrics, and feature flags.

Anyone can choose to join or leave any Team from the Teams menu under Admin > Teams.

## Team ownership and permissions
Teams can be assigned to Flags, Experiments, and Metrics. Teams are available as filtering criteria on these pages and help you see only what you're interested in.

Teams also provide an additional layer of change control, meant to minimize unintended actions. Any non-admins that are not part of a Team that owns a metric, experiment, or flag do not have permission to edit it. If those users do want to make intentional changes, they can join the Team from the Teams menu under Admin > Teams. To strictly require reviews to make changes to Feature Flags, [enable Feature Flag Approvals approvals](/feature-flagging/workflow/feature-flag-approvals).

Metrics have "Global Metric" as an additional option for Team ownership. Global Metrics are great for top-level metrics that stretch across teams, such as Revenue or DAU.

## Configure
Admins have permission to create, edit, and archive teams. Admins can also assign other users to Teams.

![Teams Home](/img/administration/Teams_Home.png)

### Create Teams
Create teams under the [Teams home](https://eppo.cloud/teams) by selecting an icon and giving the team a name. 

### Archive Teams
Archive teams by selecting from the more menu. Archiving cannot be undone and will prevent this team from being assigned to future users, experiments, metrics, and feature flags.

To keep a historical record, all currently assigned objects will remain assigned to the archived team and can be re-assigned as needed.

## Assigning Users to Teams
Assign users to teams under the [Admin > Users tab](https://eppo.cloud/admin/users_and_permissions?show=1-25). Users can be members of multiple teams.

![Assign Users to Teams](/img/administration/Assign_Users_Teams.png)
