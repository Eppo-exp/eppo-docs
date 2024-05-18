# Next.js Setup with Eppo Feature Flags

This guide will walk through how to setup an Eppo Feature Flag on a client and server rendered component in a Next.js app. More specifically, this guide will walk through the set up and settings of a sample Next.js app.

## Start a new Next.js React App

### Create the Next.js app

```tsx
npx create-next-app
```
Provide the following answers when prompted:
- What is your project named? `react-sdk-walkthrough`
- Would you like to use TypeScript? `Yes`
- Would you like to use ESLint? `Yes`
- Would you like to use Tailwind CSS? `No`
- Would you like to use `src/` directory? `No`
- Would you like to use App Router? (recommended) `Yes`
- Would you like to customize the default import alias (@/*)? `No`

### Run the Next.js app

```tsx
cd react-sdk-walkthrough
yarn dev
```

Open a browser to the location output for `local` (e.g., [http://localhost:3000](http://localhost:3000/))

## Eppo flag setup
1. [Create and copy an SDK key](/sdks/sdk-keys.md) in your Eppo app if you don't already have one.
2. [Create a feature flag](/quick-starts/feature-flag-quickstart.md/#2-create-a-flag) in your Eppo app.
3. Make sure your flag is turned on in the environment that correlates to your SDK key.

## Client rendered component setup

### Install the Eppo JS client SDK

```bash
yarn add @eppo/js-client-sdk
```

### Create a randomization provider

1. Create a provider based off our [Usage in React](/sdks/client-sdks/javascript#usage-in-react) documentation
2. Create a new `/app` file called `EppoRandomizationProvider.tsx`
3. Copy and paste the following example code into `EppoRandomizationProvider.tsx`:
```tsx
import { ReactElement, useEffect, useState } from "react";

import { init } from "@eppo/js-client-sdk";

interface IEppoRandomizationProvider {
  waitForInitialization?: boolean;
  children: ReactElement;
  loadingComponent?: ReactElement;
}

const EppoRandomizationProvider = ({
  waitForInitialization = true,
  children,
  loadingComponent = <div>Loading...</div>,
}: IEppoRandomizationProvider): ReactElement => {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    init({
      apiKey: "<SDK-KEY>",
      assignmentLogger: {
        logAssignment(assignment) {
          console.log('TODO: log', assignment)
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

export default EppoRandomizationProvider;
```
4. Replace API key placeholder with your SDK key

### Create a component to use the randomization provider
1. Create a new `/app` file  `OfferExperiment.tsx`
2. Copy and paste the following code into the `OfferExperiment.tsx` file.
```tsx
import { useMemo } from "react";
import { getInstance } from "@eppo/js-client-sdk";

const OfferComponent = () => {

    const subjectKey = "<SUBJECT-KEY>"

    const assignedVariation = useMemo(() => {
      const eppoClient = getInstance();
      return eppoClient.getStringAssignment("<FLAG-KEY>", subjectKey, <SUBJECT-ATTRIBUTES>, "<DEFAULT-VALUE>");
    }, []);
  
    return (
      <div>
        {assignedVariation === "control" && <p>50% off widgets!</p>}
        {assignedVariation === "test" && <p>Buy one widget get one free!</p>}
        {!assignedVariation && <p>Buy a widget today</p>}
      </div>
    );
  }

export default OfferComponent;
```
In the example above the disabled/error (`null`) case is handled as well as assigned variations. 
```tsx
<h1>
  {assignedVariation === "control" && <p>50% Off widgets!</p>}
  {assignedVariation === "test" && <p>Buy one widget, get one free!</p>}
  {!assignedVariation && <p>Buy a widget today!</p>}
</h1>
```

For the sake of demonstration purposes, there is a display other than control for the disabled/error case which is the "Buy a widget today!" text. In most implementations, we’d default to control in that situation like so:

```tsx
<h1>
  {(!assignedVariation || assignedVariation === "control") && <p>50% Off widgets!</p>}
  {assignedVariation === "test" && <p>Buy one widget, get one free!</p>}
</h1>
```

3. Copy and paste your flag key into the `getStringAssignment()` method, along with a user id, user attributes, and default variation value.

### Use the component in the application

1. Put the offer component under the logo in `page.tsx`

Below is a snippet from what you will see in your `page.tsx` and where you should place the offer component:

```tsx
<div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
</div>

// Offer component will go here

```

2. Include the following line at the top of `page.tsx` to tell the Next.js app to treat the page as a client component (e.g., it is not server-side rendered, and can use react hooks)

```tsx
"use client"; // Mark this file as a Client Component
```

3. Import our offer experiment component

```tsx
import OfferExperiment from "./OfferExperiment";
```

4. Add it to the page

```tsx
<div className={styles.center}>
  <EppoRandomizationProvider>
    <OfferExperiment />
  </EppoRandomizationProvider>
</div>
```

Since the experiment is off, we should get the default experience

!['Buy a widget' experience](/img/guides/nextjs/default-experience.png)

3. Turn the flag on in Eppo

![Flag switch](/img/guides/nextjs/flag-switch.png)
![Confirm flag updates](/img/guides/nextjs/confirm-flag-update.png)

4. Change the subject key to see the other experience
```tsx
const subjectKey = 'TODO-A';
```
![Variation experience with '50% off widgets'](/img/guides/nextjs/variation-experience.png)

## Server rendered component setup

### Install Eppo Node SDK

First we need to replace the client SDK with the server SDK:

```bash
yarn add @eppo/node-server-sdk
```

### Create a server function to get assignments

Then we create a new top-level folder `shared` and in that a new file `get-assignment.ts` 

In this file we’ll create a function that uses the Eppo client to determine experiment assignments.

```tsx
import { getInstance, init } from "@eppo/node-server-sdk";

let initializeAttempted = false;
export async function getAssignment(subjectKey: string, flagKey: string): Promise<String | null> {
  if (!initializeAttempted) {
    initializeAttempted = true;
    try {
      await init({
        apiKey: "<SDK-KEY>"
        assignmentLogger: {
          logAssignment(assignment) {
            console.log("TODO: log ", assignment);
          },
        },
      });
    } catch (error) {
      console.error("Error initializing Eppo SDK:", error);
    }
  }
  const eppoClient = getInstance();
  return eppoClient.getStringAssignment(subjectKey, flagKey);
}
```

### Update offer component

Update the following code in `OfferExperiment.tsx`. In this example, the assigned variation is passed to the offer component from `OfferExperiment`. This way, the server-rendered `Page.tsx` can fetch the assignment, and pass the assignment data to the offer component. 

```tsx
import { ReactElement } from "react";

interface OfferExperimentProps {
    variation: String | null;
}
const OfferExperiment = ({ variation }: OfferExperimentProps): ReactElement => {
    return (
        <h1>
            {variation === 'control' && <p>50% Off widgets!</p>}
            {variation === 'test' && <p>Buy one widget, get one free!</p>}
            {!variation && <p>Buy a widget today!</p>}
        </h1>
    );
};

export default OfferExperiment;
```

### Update main page

1. In `page.tsx` remove the `"use client"` we added previously

2. Remove the now invalid import of `EppoRandomizationProvider.tsx` and add in an import of our shared `getAssignment()` method.

```tsx
import { getAssignment } from "@/shared/get-assignment";
```

3. Before `Home()` returns elements, retrieve the assignment so we can pass it to `OfferExperiment`.

```tsx
const subjectKey = '<SUBJECT-KEY>'; // Ideally populated from something like login context
const offerVariation = await getAssignment(subjectKey, '<FLAG-KEY>');
```

4. In the returned elements, we can remove the now unused `<EppoRandomizationProvider>` parent element, and pass the `<OfferExperiment>` the variation assigned to the user.

```tsx
<div className={styles.center}>
  <OfferExperiment variation={offerVariation} />
</div>
```

5. You should now see your experiment running with the new server rendered component.

![Server rendered experiment](/img/guides/nextjs/server-rendered-experiment.png)
