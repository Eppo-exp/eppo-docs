# Eppo Developer Tools - Chrome Extension

The **Eppo Developer Tools** Chrome Extension allows you to instantly override flag assignments for your local user in a shared environment, such as staging or production. This helps you easily QA features by enabling and disabling flags as needed and testing the resulting experience.

## Installation

To install Eppo's Chrome Extension, navigate to the [Eppo Developer Tools](https://chromewebstore.google.com/detail/eppo-developer-tools/aommfcceagiaibbaepafcpdfpmpidbme) extension on the Chrome Web Store and click **Add to Chrome**.

Next, [create a Browser Extension Key](https://eppo.cloud/configuration/environments/browser-extension-keys) in Eppo by navigating to Flags > Environments > Browser Extension Keys. Create a new Browser Extension Key, give it a name, and select the Production environment. Browser Extension Keys can only be scoped to the Production environment, but will pull in all flags and variations regardless of the flag's state in your Production environment. Only Admins have the permission level to create a Browser Extension Key. Next, copy the key to your clipboard once it has been created, and paste it in in the "Settings" page of your browser extension. Click **Save** once you have pasted in your key.

![Browser Extension Key](/img/developer-tools-extension/browser-extension-key.png)

Click **Back to feature flags list** to view your list of flags. Click the refresh icon in the extension's header if they don't immediately appear. At this point, you'll be able to see a list of your flags, but will not yet be able to override them. Follow the instructions below to enable overrides for client or server configuration.

## Configuring Client Overrides

*Available in **@eppo/js-client-sdk@3.11.0** and later*

To configure overriding client-side flags, ensure you have configured a storage key. You can name this however you'd like.

![Storage Key](/img/developer-tools-extension/storage-key.png)

During your client-side SDK initialization, make sure you specify the `overridesStorageKey` with the same value as your **Storage Key** setting in your extension. Additionally, make sure you set `enableOverrides` to `true`.

```typescript
import { init } from '@eppo/js-client-sdk';

init({
  apiKey: '<your-sdk-key>',
  assignmentLogger: {
    logAssignment(assignment) {
      console.log('TODO: log', assignment);
    },
  },
  overridesStorageKey: 'eppo-overrides', // your overrides key goes here
  enableOverrides: true, // don't forget to enable flag overriding!
});
```

That's it! You should be able to override flag assignments by clicking on the variations in your flags list in the chrome extension.

![Flag Override Example](/img/developer-tools-extension/flag-override-example.png)

## Configuring Server Overrides

*Available in **@eppo/node-server-sdk@3.8.0** and later*

With **Eppo Developer Tools**, you have the option to configure your extension to override server-side flags.

To do so, you'll first need to specify which server-side URLs you want to receive your flag overrides. The Chrome extension intercepts all browser requests that match these URL filters and sends both your browser extension key and your flag overrides in the `x-eppo-overrides` header so that they can be applied on the server.

![Server-Side URL Filters](/img/developer-tools-extension/server-side-url-filters.png)

Note that since the `x-eppo-overrides` header also includes your browser extension key, **only trusted URLs should be added**.

### Configuring your middleware

You'll also need to add middleware to process and apply the overrides. You can leverage Node's `AsyncLocalStorage` to store your flag overrides so that it is available anywhere in your application, but scoped only to the request so that overrides are not applied to other users. The `parseOverrides` function available in the `@eppo/node-server-sdk` package will validate and parse the overrides from the `x-eppo-overrides` header. The `withOverrides` function will process the overrides and return a client instance with overrides applied.

Putting this all together, an example using NestJS middleware and TypeScript might look like this.

```typescript
// eppo-overrides-middleware.ts

import { AsyncLocalStorage } from 'async_hooks';
import { FlagKey, Variation } from '@eppo/js-client-sdk-common';
import * as EppoSDK from '@eppo/node-server-sdk';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export const eppoOverridesStorage = new AsyncLocalStorage<Record<FlagKey, Variation> | undefined>();

@Injectable()
export class EppoOverridesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const eppoOverridesPayload = req.headers['x-eppo-overrides'] as string | undefined;
    if (eppoOverridesPayload) {
      getInstance()
        .parseOverrides(eppoOverridesPayload)
        .then((overrides) => eppoOverridesStorage.run(overrides, next))
        .catch((err) => {
          console.error('overrides error', err);
          next();
        });
    } else {
      next();
    }
  }
}

// Use this function instead of `EppoSDK.getInstance()` throughout
// your app to apply overrides when they exist in the request.
export const getEppoInstance = () => {
  const overrides = eppoOverridesStorage.getStore();
  return EppoSDK.getInstance().withOverrides(overrides);
};
```

Once configured, flags that are used in server-side code can be overridden using the **Eppo Developer Tools** extension without affecting other users connecting to the same web server.