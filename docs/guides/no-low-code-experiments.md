# Running no and low code experiments in Eppo

Often times there are frequently tested parts of a site or app where teams would like to execute changes in a self-service manner. Running experiments without an additional code release is easy to do in Eppo with some initial set up. With a JSON flag and parameterizing parts of the site or app where frequent changes are made, users can create additional experiment allocations on the same flag.

## Creating multiple experiments on the same flag

For this example let’s use the following feature flag in Eppo. There are 2 allocations; one is a feature gate that prioritizes sending any internal users to the treatment variation, and the other is an experiment allocation that evaluates whether the other users meet the audience criteria. If users meet the experiment audience criteria, they will be split 50-50 between the control and treatment variations.

![Initial experiment allocation on a flag](/img/guides/no-low-code-experiments/first-exp-allocation.png)

To demonstrate how to run multiple experiments on the same flag, create a new variation by editing your feature flag and clicking **Add Variation**.

![Add a variation to a flag](/img/guides/no-low-code-experiments/add-variation.png)

Once the new variation is added, go back to the feature flag overview page and create a new experiment allocation by clicking **Add Allocation** and selecting **Experiment**.

After adding an additional Experiment Allocation, the allocation shows up on your Feature Flag overview page.

![Second experiment allocation on a flag](/img/guides/no-low-code-experiments/second-exp-allocation.png)


This new allocation logic splits the remaining users 50/50 into the second and third variations if those users do not qualify for the first 2 allocations. The previous experiment allocation can be archived by selecting the ‘bin’ icon on the right hand side of the allocation. Additionally, by clicking the gray side bar on the right hand side of the allocation, allocations can be dragged and dropped to reprioritize the order of logic executed.

:::warning

Eppo does not recommend running two experiments on the same flag at the same time since it can interfere with experiment results. We recommend archiving the experiment allocation after the test is complete before adding a new experiment allocation to the same flag. The example above is to illustrate the ability to have multiple experiments created on the same flag.

:::

You can now run multiple experiments off of this same flag without any additional releases. Continuing this example, this is the code required for this flag regardless of how many experiment allocations or feature gates are created:

```jsx
import * as EppoSdk from '@eppo/node-server-sdk';

const client = EppoSdk.getInstance();
const variation = client.getAssignment("winter-promo", "<SUBJECT-KEY>", <SUBJECT-ATTRIBUTES>, "<DEFAULT-VALUE>")
```


## Using JSON flags to parameterize frequently tested areas

JSON flags can be used to parameterize your app or site to run experiments without an additional release. By using a [JSON flag](/feature-flagging/flag-variations#json-flags), values from Eppo dynamically update predefined values in your code. Extending the feature flag example above, variables in your code can be created to accept a value defined in the JSON object defined in Eppo.

Below is an example extended from our [React](/sdks/client-sdks/javascript#usage-in-react) documentation.

```
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
```
<EppoRandomizationProvider>
  <CTAComponent />
</EppoRandomizationProvider>
```
```
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