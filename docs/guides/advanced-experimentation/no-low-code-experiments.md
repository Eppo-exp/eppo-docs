---
sidebar_position: 7
---

# Running no and low code experiments in Eppo

Often times there are frequently tested parts of a site or app where teams would like to execute changes in a self-service manner. Running experiments without an additional code release is easy to do in Eppo with some initial set up. With a JSON flag and parameterizing parts of the site or app where frequent changes are made, users can create additional experiment allocations on the same flag.

## Creating additional experiments on the same flag

For this example let’s use the following feature flag in Eppo. There are 2 allocations; one is a feature gate that prioritizes sending any internal users to the treatment variation, and the other is an experiment allocation that evaluates whether the other users meet the audience criteria. If users meet the experiment audience criteria, they will be split 50-50 between the control and treatment variations.

![Initial experiment allocation on a flag](/img/guides/no-low-code-experiments/first-exp-allocation.png)

To demonstrate how to run multiple experiments on the same flag, create a new variation by editing your feature flag and clicking **Add Variation**.

![Add a variation to a flag](/img/guides/no-low-code-experiments/add-variation.png)

Once the new variation is added, go back to the feature flag overview page and archive the completed experiment allocation on the flag by clicking the bin icon on the right side of the allocation. Then create a new experiment allocation by clicking **Add Allocation** and selecting **Experiment**.

After adding an additional Experiment Allocation, the allocation shows up on your Feature Flag overview page.

![Additional experiment allocation on a flag](/img/guides/no-low-code-experiments/second-exp-allocation.png)


This new allocation logic splits all users 50/50 into the second and third variations if those users do not qualify for the first feature gate allocation.

You can now run additional experiments off of this same flag without any additional releases. Continuing this example, this is the code required for this flag regardless of how many experiment allocations or feature gates are created:

```jsx
import * as EppoSdk from '@eppo/node-server-sdk';

const client = EppoSdk.getInstance();
const variation = client.getAssignment(
    "winter-promo", 
    "<SUBJECT-KEY>", 
    <SUBJECT-ATTRIBUTES>, 
    "<DEFAULT-VALUE>"
)
```


## Using JSON flags to parameterize frequently tested areas

JSON flags can be used to parameterize your app or site to run experiments without an additional release. By using a [JSON flag](/feature-flagging/concepts/flag-variations#json-flags), values from Eppo dynamically update predefined values in your code. Extending the feature flag example above, variables in your code can be created to accept a value defined in the JSON object defined in Eppo.

Below is an example extended from our [React](/sdks/client-sdks/javascript/react) documentation.

```jsx
import { useEffect, useState } from "react";

import { init } from "@eppo/js-client-sdk";

interface IEppoRandomizationProvider {
  waitForInitialization?: boolean;
  children: JSX.Element;
  loadingComponent?: JSX.Element;
}

export default function EppoRandomizationProvider({
  waitForInitialization = true,
  children,
  loadingComponent = <div>Loading...</div>,
}: IEppoRandomizationProvider): JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    init({
      apiKey: "<YOUR-SDK-KEY>",
      assignmentLogger: {
        logAssignment(assignment) {
          // logging implementation
        },
      },
    }).then(() => {
      return setIsInitialized(true);
    });
  }, []);

  if (!waitForInitialization || isInitialized) {
    return children;
  }
  return loadingComponent;
}
```
```jsx
<EppoRandomizationProvider>
  <CTAComponent />
</EppoRandomizationProvider>
```
```jsx
function CTAComponent(): JSX.Element {
  const assignedVariation = useMemo(() => {
    const eppoClient = getInstance();
    return eppoClient.getStringAssignment("winter-promo", "<SUBJECT-KEY>", <SUBJECT-ATTRIBUTES>, "<DEFAULT-VALUE>");
  }, []);

  return (
    <div>
	    <img src={assignedVariation.img_url}> // image url defined in the Eppo JSON flag
    </div>
    <button>{assignedVariation.cta}</button> // CTA copy defined in the Eppo JSON flag
  );
}
```