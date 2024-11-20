---
sidebar_position: 2
---

# Entities

Entities are the subjects (randomization unit) of your experiments. For example, a food delivery app might run experiments on several entities: restaurants, customers, or drivers. Similarly, a B2B SaaS company may have a user entity, a team entity, and a company entity.

Assignment, Property, and Fact SQLs are all attached to entities. Each assignment SQL ties to exactly one entity, whereas a Fact SQL can tie to multiple entities. To read more about adding your data models to Eppo, see the [Overview](/data-management/definitions/overview) page.

## Creating an Entity

To create an Entity, navigate to **Definitions** in the left menu bar from the Eppo homepage, then click **Manage Entities**.

![Manage Entities](/img/building-experiments/manage-entities.png)

On the Manage Entities page click **+ Create Entity** to add a new entity.

![Create Entities](/img/building-experiments/create-entity.png)

Click **Confirm** and then **Save Changes**.

Now that you've created an entity, you can start adding data models to Eppo by adding [SQL definitions](/data-management/definitions/overview).