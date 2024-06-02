---
sidebar_position: 5
---

# Stale flags 

:::note
Stale flag notifications are currently in closed Beta
:::

In Eppo, you can be notified of Flags that are no longer needed so you can keep your Eppo workspace and your codespace clean.

![Stale flag indicators on the Feature Flag page](/img/feature-flagging/stale-flag.png)

Eppo labels Feature Flags with a `stale` status when the following conditions occur:
* No edits to the Flag within the last 30 days
* The Flag has a variation that is serving 100% or 0% in Production

## Stale flag notifications
Stale flags are eligible for both [Slack](/administration/email-notifications) and [email notifications](/administration/email-notifications). Enable flag notifications in Admin and your user profile.