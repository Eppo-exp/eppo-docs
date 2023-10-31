---
sidebar_position: 7
---

## How to run mutually exclusive experiments in Eppo

True interaction effects in experiments are virtually nonexistent. Microsoft has done research across multiple products that show that interaction effects are [incredibly rare](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/a-b-interactions-a-call-to-relax/). Given the very small risk that a true interaction effect poses, we recommend only making experiments mutually exclusive when one of the changes effects the user experience of the other.

There are of course some use cases where it makes sense to make tests mutually exclusive such as when the changes of one experiment effects the experience of another. Take the following scenario for example: the design team wants to run a page redesign test and the marketing team wants to run an experiment on messaging on that same page, and the layout effectively removes the messaging altogether or makes it unreadable. In this situation clearly the changes of one experiment would render the other unusable.

If you do find yourself running an experiment where there would be a true interaction effect, we recommend setting up nested feature flags. Using the same homepage example where each experiment has a control and one treatment, you would create 3 feature flags total where 1 would split traffic into one experiment and the other would split traffic into the other experiment.

The feature flag naming convention could look like this:
|  | Feature Flag name | Variation Name | Variation Name |
| --- | --- | --- | --- |
| Feature Flag 1 | mutual_exclusion_group | copy_test | layout_test |
| Feature Flag 2 | copy_test | copy_control | copy_treatment |
| Feature Flag 3 | layout_test | layout_control | layout_treatment |

::: note

Follow the quickstart [here](/quick-starts/feature-flag-quickstart.md) for additional guidance on how to set up an eppo Feature Flag in the app.

:::

The SDK setup would look like this in your application:
```javascript
import * as EppoSdk from "@eppo/node-server-sdk";
let variation;

const eppoClient = EppoSdk.getInstance();
const exclusion_group = eppoClient.getStringAssignment(
  userId,
  "mutual_exclusion_group"
);

if exclusion_group == "copy_test" {
	let variation = eppoClient.getStringAssignment(
		 userId,
		 "copy_test"
	);
}
elseif exclustion_group == "layout_test" {
	let variation = eppoClient.getStringAssignment(
		 userId,
		 "layout_test"
	);
}
else {
	// run default code
}
```
