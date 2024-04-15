---
sidebar_position: 8
---

# How to run mutually exclusive experiments in Eppo

Research from Microsoft has shown that in practice [interaction effects are vanishingly rare](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/a-b-interactions-a-call-to-relax/). Given this, we recommend only using mutual exclusion when the overlap of two new treatments critically degrades the user experience. For instance, a design team might want to run a homepage redesign test while a marketing team might want to experiment on the headline messaging on the same page. If the new layout removes the messaging altogether or makes it unreadable, these experiments should clearly not overlap.

If you do find yourself running an experiment where there would be a true interaction effect, we recommend setting up nested feature flags with [targeting rules](/feature-flagging/targeting). Using the same homepage example where each experiment has a control and one treatment, you would create 3 feature flags total:

- one flag called `exclusion_group` will randomize the users into being in either the `copy_test` or `layout_out` test
- one flag called `copy_test` will randomize users into the variations set up to test the new messaging against the control
- one flag called `layout_test` will randomize users into the variations setup to test the new layout against control

The feature flag naming convention could look like this:

|  | Feature Flag name | Variation Name | Variation Name |
| --- | --- | --- | --- |
| Feature Flag 1 | mutual_exclusion_group | copy_test | layout_test |
| Feature Flag 2 | copy_test | copy_control | copy_treatment |
| Feature Flag 3 | layout_test | layout_control | layout_treatment |

:::note

Follow the quickstart [here](/feature-flag-quickstart/) for additional guidance on how to set up an Eppo Feature Flag in the app.

:::

## Eppo App Setup

For your first flag, your setup should look like this:

![Screenshot 2023-11-06 at 3.51.28 PM.png](/img/guides/mutually-exclusive-experiments/exclusion-group-flag-setup.png)

Your `copy_test` flag should look like this:

![Screenshot 2023-11-06 at 3.59.49 PM.png](/img/guides/mutually-exclusive-experiments/copy-test-flag-setup.png)

Where the targeting traits are set up like this:

![Screenshot 2023-11-06 at 3.57.50 PM.png](/img/guides/mutually-exclusive-experiments/copy-test-targeting-rules-setup.png)

Repeat the feature flag setup and allocation for your `layout_test` flag:

![Screenshot 2023-11-06 at 4.02.24 PM.png](/img/guides/mutually-exclusive-experiments/layout-test-flag-setup.png)

![Screenshot 2023-11-06 at 4.04.00 PM.png](/img/guides/mutually-exclusive-experiments/layout-test-targeting-rules-setup.png)

Lastly, make sure that you set up the `copy_test` and `layout_test` Feature Flags as Experiments in Eppo with the metrics that make sense for each respective experiment.

## Eppo SDK setup

The SDK setup would look like this in your application:

```javascript
import * as EppoSdk from "@eppo/node-server-sdk";

const eppoClient = EppoSdk.getInstance();

// randomize assignment for which exclusion group they will be in
const exclusion_group = eppoClient.getStringAssignment(
  userId,
  "mutual_exclusion_group",
  "<default_variation>"
)

// user profile
let user = {
	userId: 'unique userid',
	exclusion_group: exclusion_group // make sure this attribute matches with the targeting traits you define in Eppo
}

// randomize assignment on what variation the user will receive for the Copy Test
const copy_variation = eppoClient.getStringAssignment(
												 user.userId,
												 "copy_test",
												 "<default_variation>",
				                 {"exclusion_group": exclusion_group}
											 )
// randomize assignment on what variation the user will receive for the Layout Test
const layout_variation = eppoClient.getStringAssignment(
												 user.userId,
												 "layout_test",
												 "<default_variation>",
				                 {"exclusion_group": exclusion_group}
											 )
```
