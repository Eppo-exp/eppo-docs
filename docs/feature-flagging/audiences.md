# Audiences

:::note
Real time rollout monitoring is currently in closed Beta. Contact [support@geteppo.com](mailto:support@geteppo.com) for access to this feature.
:::

Audiences allow you to easily define reusable targeting criteria such that you don't have to recreate the same targeting rules for every flag. Audiences are also built to minimize risk. When creating new flag allocations, using Audiences minimizes the number of free entry fields that can contain errors. Eppo has also made Audiences resilient such that changes to Audiences in active flags require proper permissions, are clearly communicated, and are non-destructive.

## Creating an Audience

## Editing and Deleting Audiences

## Adding an Audience to an allocation


- There is a tab on the feature flag page to manage Audiences
    - Audiences can be created, edited, and deleted
    - The create and edit UI matches the targeting rules component that already exists for an allocation
    - Each Audience has a name
    - If an audience is in use for flag, it is shown
- For each targeting rule in an allocation, there is an option to select a `audience` and a dropdown of available audiences
- Stretch goal - Save a targeting rule on a variation as a reusable audience