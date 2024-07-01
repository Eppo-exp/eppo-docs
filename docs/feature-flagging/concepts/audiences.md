---
sidebar_position: 6
---

# Audiences

Audiences allow you to easily define reusable targeting criteria such that you don't have to recreate the same targeting rules for every flag. Audiences are also built to minimize risk. When creating new flag allocations, using Audiences minimizes the number of free entry fields that can contain errors. Eppo has also made Audiences resilient such that changes to Audiences in active flags require proper permissions, are clearly communicated, and are non-destructive.

![Audience page](/img/feature-flagging/audiences/audience-overview.png)

## Creating an Audience
In the Configuration section, click the "Create" button and select "Audience". Input a title, description (optional), and the [targeting rules](/feature-flagging/concepts/targeting.md). 

![Creating an Audience](/img/feature-flagging/audiences/create-audience.png)

## Editing and Archiving Audiences
You can access existing Audiences by visiting the Audiences tab under the Configuration section. Here you can edit, duplicate, or delete an Audience.

Both editing and deletion have the potential to impact enabled flags. To reduce any potential risk, we ask for confirmation and give you the following options:

### Editing
* Change everywhere - This updates the targeting of all Flags with this Audience. We list the Flags that will be impacted.
* Only change for new allocations and audiences - The old Audience will be converted to targeting rules on their Flags and detached from the new Audience definition.

![Editing confirmation](/img/feature-flagging/audiences/audience-editing.png)

### Archiving
The old Audience will be converted to targeting rules on their Flags. The Audience will be archived.

![Archiving confirmation](/img/feature-flagging/audiences/audience-archive.png)

## Adding an Audience to an allocation

When selecting a targeting rule in an Allocation, there is a dropdown to select `Audiences` or `Custom Rules`. If `Audiences` is selected, you'll be able to select an Audience to add. 

Multiple Audiences can be targeted using an OR operator. To do so, first add an Audience. Then select "Add Rule" and add another Audience as a target.

![Add Audience to allocation](/img/feature-flagging/audiences/add-to-targeting.png)