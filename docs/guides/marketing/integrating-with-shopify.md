# Integrating with Shopify

## Introduction

This guide will walk you through how to integrate Eppo’s feature flags with your Shopify site to randomize visitors for experiments. How you integrate Eppo’s flags will depend on how you are using and deploying Shopify:

- [Shopify Classic using Liquid templates](https://shopify.dev/docs/api/liquid)
- [Headless deployment using Hydrogen/Oxygen](https://shopify.dev/docs/api/hydrogen)

### **Shopify Classic (Liquid Templates)**

In a Shopify Classic site, you’ll mostly be working with Liquid templates and JavaScript, which means you will implement feature flags using a combination of backend control (via Liquid) and frontend logic.

### Steps to Implement:

1. **Include the Eppo JavaScript SDK**:
First, add the Eppo SDK to your theme so you can use it across pages:
- Open the **`theme.liquid`** file in your **Layout** folder.
- Include the SDK in the `<head>` tag or right before `</body>`. Below is a version of the JS SDK hosted by the service [jsdelivr](https://www.jsdelivr.com/), feel free to host a minified version of this SDK using your own CDN:
    
```javascript title="/layout/theme.liquid"
    <script src="https://cdn.jsdelivr.net/npm/@eppo/js-client-sdk@latest/dist/eppo-sdk.min.js"></script>
```
    
2. **Initialize Eppo and Evaluate Feature Flags**:
You can use JavaScript to initialize the SDK and check the status of the feature flag, enabling different behaviors in your storefront. Below is an example of what to include on any page or Liquid template that you would like to run an experiment on.
    
```javascript title="/sections/my-page.liquid"
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        // Define assignment logger
        const IAssignmentLogger = {
          logAssignment(assignment) {
            // Your analytics tracking code here
            console.log("Assignment logged:", assignment);
          }
        };
    
        // Initialize Eppo Client
        const opts = {
          apiKey: "<YOUR-SDK-KEY>", 
          assignmentLogger: IAssignmentLogger,
          maxCacheAgeSeconds: 180 // Adjust to an interval that makes sense for your use case
        };
    
        window.eppo.init(opts)
          .then(() => {
            console.log("Eppo SDK initialized successfully");
              const defaultVariationData = "default";
    
              // User context
              const userId = "<YOUR-SUBJECT-KEY>" // This can be any id
              const subjectAttributes = {}; // Optional: Add additional attributes for targeting
        
              // Get variation data from Eppo
              const variationData = window.eppo.getInstance().getStringAssignment(
                "<YOUR-FLAG-KEY>", // Replace with your actual feature flag key
                userId,
                subjectAttributes,
                defaultVariationData
              );      
          })
          .catch((error) => {
            console.error("Eppo SDK initialization failed:", error);
          });
      });
    </script>
```

- Replace `"<YOUR-SDK-KEY>"` with the [SDK key](/sdks/sdk-keys/) you created in Eppo.    
- Replace `"<YOUR-FLAG-KEY>"` with the specific [flag key](/feature-flag-quickstart/#create-a-flag) you configured in Eppo for the feature. 
- Replace `"<YOUR-SUBJECT-KEY>"` with the id you are using to randomize users. This can be a cookie id, device id, or an id from your analytics platform such as Heap or Rudderstack to name a few. We encourage our customers to keep this id consistent to ensure that bucketing remains consistent. If you will randomizing users who are logged out, see our guidance here on [Subject Keys in a Pre-Authenticated Experiment](/guides/engineering/preauth-experiments/).
- The Eppo client stores your flag configuration locally; it remains available for as many calls, flags and users as you need. You can refresh the cached configuration as often as you need to update flags by setting the `intervalmaxCacheAgeSeconds`. Shopify Classic is not a single-page app. You do not need to re-instantiate the client for every page, but by refreshing the local client, you keep each new page load up-to-date with your configuration. In this example we have arbitrarily set `intervalmaxCacheAgeSeconds` to `180` seconds, which will wait 180 seconds before refreshing the Eppo configuration from our CDN. Feel free to update this interval whatever time frame makes sense for your use case. Read more about the advanced initialization options [here](/sdks/client-sdks/javascript/initialization).

### **Shopify Hydrogen (React-Based Storefront)**

Hydrogen is a React framework for building custom storefronts using Shopify. Since it is a JavaScript-based frontend, implementing Eppo is straightforward with React components.

### Steps to Implement:

1. **Install the Eppo SDK**:
Start by installing the Eppo client SDK into your Hydrogen app.
    
```bash
    npm install @eppo/js-client
```
    
2. **Initialize Eppo**:
Set up the Eppo client, preferably in a global file or context, so it can be accessed easily across different components. Our [Usage in React documentation](/sdks/server-sdks/node/) covers how to set up an Eppo provider and how to use to assign variations to any child component.
3. **Manage Feature Flags Using React State**:
    - Use the `useEffect` hook to determine the user's assignment when the component loads. Read more about the Javascript SDK’s usage in React [here](/sdks/client-sdks/javascript/react).
    - Depending on the feature flag assignment, you can conditionally render different parts of your React components.
4. **Server-Side Rendering Considerations**:
If you’re server-side rendering (SSR) parts of your Hydrogen store, make sure to account for how you want to handle feature flag evaluation on the server. You might need to fetch assignments during server rendering, especially if flags need to influence SEO or static content. [Eppo’s Node SDK](/sdks/server-sdks/node/) can be used for server rendered flag evaluations.

### **Other Considerations:**

**Keeping the subject key consistent to persist the same variation.**
We recommend using a consistent id from a CDP or analytics provider you’re using for the `"<SUBJECT-KEY>"` you pass in to `getAssignment`. This will ensure consistent bucketing even when a user may be logged into Shopify. Read more on how to ensure [consistent bucketing in pre-authenticated experiments.](/guides/engineering/preauth-experiments.md)

**Limited testing on ‘closed’ aspects of Shopify sites.**

There are portions of Shopify sites that ‘closed’ and can not be changed by code such as the Shop checkout page. While there are settings you can customize in your Shopify Admin portal, changing the overall look and feel or adding a banner will not be editable.


### **Summary**

- For **Shopify Classic**, add the Eppo Javascript SDK through the `theme.liquid` and control feature behavior with JavaScript after initialization.
- For **Shopify Hydrogen**, leverage the JavaScript SDK in React components, and manage the state of feature flags within React, allowing for more dynamic interactions.