# Teams

Create teams in your workspace to organize users and the scope of ownership of experiments, metrics, and feature flags in Eppo.

## Configure
Only Admins have permission to create, edit, and archive teams.

![Teams Home](/img/administration/Teams_Home.png)

### Create Teams
Create teams under the [Teams home](https://eppo.cloud/teams) by selecting an icon and giving the team a name. 

### Archive Teams
Archive teams by selecting from the more menu. Archiving cannot be undone and will prevent this team from being assigned to future users, experiments, metrics, and feature flags.

To keep a historical record, all currently assigned objects will remain assigned to the archived team and can be re-assigned as needed.

## Assigning Users to Teams
Assign users to teams under the [Admin > Users tab](https://eppo.cloud/admin/users_and_permissions?show=1-25). Users can be members of multiple teams.

![Assign Users to Teams](/img/administration/Assign_Users_Teams.png)

## Team ownership and permissions
Teams can be assigned to Flags, Experiments, and Metrics. Teams are available as filtering criteria on these pages and help you see only what you're interested in.

Teams also provide an additional layer of permissions. Any non-admins that are not part of a Team that owns a metric, experiment, or flag do not have permission to edit it.

Metrics have "Global Metric" as an additional option for Team ownership. Global Metrics are great for top-level metrics that strech across teams, such as Revenue or DAU.