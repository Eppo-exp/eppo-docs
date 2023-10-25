---
sidebar_position: 6
---

# Integrating with Contentful

It is common for marketing and content teams to want an A/B testing solution with a point-and-click visual editor to make straightforward copy or image optimizations. However, these solutions most often rely on blocking scripts that cause performance degradations—slowing your site down by 200-500 milliseconds in best-case scenarios. You could avoid these performance issues by fully implementing feature flags for marketing experiments—but this will mean marketing has to rely on engineering for every test they want to run.

Using a headless CMS like Contentful, and a lightweight, robust feature flagging SDK, like Eppo, allows the best of both worlds: an easy way for marketing teams to run tests without sacrificing performance. In this tutorial, we will walk through how to set up Eppo’s Node SDK so Marketing teams can run their own experiments by updating [Content](https://www.contentful.com/help/content-model-and-content-type/) defined in Contentful and feature flags in Eppo. 


## Setting up Contentful

For this example, imagine we are running an experiment on the Eppo homepage. There are a few places where we might want to experiment on this page:

![Eppo homepage](/img/how-tos/integrating-with-contentful/eppo-homepage.png)

1. The hero title (”Run reliable, impactful experiments”)
2. The hero body (”Eppo streamlines …”)
3. The CTA text (”Preview Eppo Now”), and the CTA link (”www.geteppo.com/get-access”)
4. The demo video

To build this experiment out in our Contentful space, create a new Content Model with the name “Homepage Baseline”. Add the following content fields:

![Contentful field setup](/img/how-tos/integrating-with-contentful/contentful-field-setup.png)

Now to create our variants, navigate to the content page and create two content entries using the Homepage Content Model you created above. Name one “Homepage Redesign” and the other “Homepage Redesign”. Each version should reflect the copy you want to test:

![Contentful variant setup](/img/how-tos/integrating-with-contentful/contentful-variant-setup.png)


:::note
For this tutorial, we are including a Control and Variant for an A/B test, but you can repeat this process to add additional variants.
:::

Now that we have the content defined, we’ll need to get the entry ID for our two pages. In Contentful, the entry ID can be found on the content page and by clicking on the 3 dots next to your content entries and clicking ‘Copy entry ID’. Save these for now, we will use them in our Eppo setup next.

![Getting Contentful entry ids](/img/how-tos/integrating-with-contentful/getting-contentful-entry-ids.png)

## Setting up Eppo

Next, we’ll create a [corresponding flag in Eppo](/feature-flag-quickstart/) (Feature Flags >> Create). For each variant above, simply add a new variant in the Eppo UI. For each variant value, paste in the corresponding Contentful entry ID. Make sure to also save your Feature Flag key – you will need it for your Node implementation later.

![Eppo feature flag setup](/img/how-tos/integrating-with-contentful/eppo-feature-flag-setup.png)

## Setting up your Node environment
Now that we have the flag and a few variants defined, you can enable the flag in your local environment and start developing the page using the content defined in Contentful. For details on setting up your first flag, please see the [Feature Flag quick start section](https://docs.geteppo.com/feature-flag-quickstart) of our docs.

The code example below does the following:

1. Initialize the Eppo and Contentful clients
2. Use the Eppo client to determine which variation a user should be assigned
3. Use the variation assignment to fetch content from Contentful

To get the implementation we built running locally, [clone this repo from Github](https://github.com/hhargreaveseppo/contentful_eppo_blog), and follow the README instructions. If you have an idea in mind of where you would like to implement this integration already then using the following code as a boilerplate for your instance:

```js

import { init } from "@eppo/node-server-sdk";
import * as EppoSdk from "@eppo/node-server-sdk";

import contentful from "contentful";
import 'dotenv/config'

// Eppo Specific methods
await init({
    apiKey: <EPPO SDK KEY>
});

let userid = “user id”
let experiment_key = <EPPO EXPERIMENT KEY>

const eppoClient = EppoSdk.getInstance();

const homepage_entry_id = eppoClient.getStringAssignment(
    userid, // unique identifier for the user
    experiment_key, // flag key from Eppo UI
)
console.log(experiment_key, homepage_entry_id)

// Contentful specific methods
const contentfulClient = await contentful.createClient({
    space: <CONTENTFUL SPACE ID>, // Add your Contentful Space ID here
    accessToken: <CONTENTFUL ACCESS TOKEN> // add your Contentful Access Token here
})

const entry = await contentfulClient.getEntry(homepage_entry_id)
console.log(entry) // see the different assignments that a user received
```

Once your application is running you should see your entry fields logged based on what variation that user ID was assigned.

![Example variation and Contentful content logged](/img/how-tos/integrating-with-contentful/example-variation-log.png)


### Initial Deployment

Engineering will still need to build the site to read from the CMS and render the page as appropriate. For the initial deployment, it may be easiest to only include one variant. The addition of new content and randomized variants can then all be managed in the Contentful and Eppo UIs.

We recommend having a default entry ID in case there are any issues initializing the Eppo client; in this case the Eppo SDK will return `NULL` for the variant value.

### Workflow for deploying a new content experiment

The recommended workflow for launching a content-based experiment is as follows:

1. Create a new entry in Contentful for the appropriate content model.
2. Create a new variant in Eppo with the `entry_id` from Contentful UI.
3. Create an allocation to test the new content in production (see screenshot below).
4. Load page to QA new content and [add screenshots to Eppo](https://docs.geteppo.com/experiments/creating-experiments/#8-click-save-changes) for reference.
5. [Create an experiment allocation](https://docs.geteppo.com/feature-flags/use-cases/experiment-assignment/) and launch the experiment.
6. Analyze experiment and make rollout decisions like any other Eppo experiment.

:::tip
This can all be done in the Contentful and Eppo UIs with no additional engineering support.
:::

![Updating Eppo Experiment allocation](/img/how-tos/integrating-with-contentful/updating-eppo-allocation.png)

## Conclusion

Now that you have Contentful and Eppo set up, you can see how easy it is to run no-code experiments once the initial setup is complete. Once your content models are defined and Eppo feature flags are set up, teams can set up additional variations and define content in Contentful without any additional code releases.
