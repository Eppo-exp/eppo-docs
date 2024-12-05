# Optimizely Feature Flag Migration Guide

1. **Install the Eppo SDK**
    - Login to Eppo with your work email: https://eppo.cloud/
    - [Generate an SDK key](/sdks/sdk-keys) by navigating to “SDK Keys” under Configuration
    - [Define a logging function](/sdks/event-logging/) for the Eppo SDK to log assignments so they end up in your data warehouse
        
        *TypeScript Example:*
        
        ```tsx
        const assignmentLogger: IAssignmentLogger = {
          logAssignment(assignment) {
            analytics.track({
              userId: assignment.subject,
              event: "Eppo Randomization Event",
              type: "track",
              properties: { ...assignment },
            });
          },
        };
        ```
        
    - Initialize the SDK in your code using the SDK guides for your language [here](/sdks/)
        
        *TypeScript Example:*
        
        ```tsx
        await init({
          apiKey: EPPO_SDK_KEY,
          assignmentLogger,
        });
        ```
        
2. **Set up a new flag and verify its functionality**
    - [Create a new flag in Eppo](/feature-flag-quickstart#2-create-a-flag) by navigating to “Feature Flags” under Configuration
    - [Implement the flag](/feature-flag-quickstart#6-embed-the-flag-in-your-code) in your application code
    - Test the flag in your local development environment to ensure it works as expected.
        
        *TypeScript Example:*
        
        ```tsx
        const variation = getInstance().getStringAssignment(
          "<SUBJECT-KEY>",
          "<FLAG-KEY>",
          {
            // Optional map of subject metadata for targeting.
          }
        );
        ```
        
    - Deploy the application to your staging or testing environments and verify the flag's functionality.
    - Once verified, deploy the application to your production environment and test the flag again.
3. **Identify critical flags in Optimizely**
    - Make a list of all the feature flags currently in use within your application using the provided template
    - Categorize the flags as critical or non-critical based on their importance and impact on your application's functionality.
    - Flags that are disabled or are rolled out to 100% can be categorized as non-critical
4. **Remove existing flag code for all non-critical flags**
    - For the non-critical flags identified in the previous step, remove the flag code from your application.
    - Test your application thoroughly to ensure that the removal of these flags does not introduce any regressions or unintended behavior.
5. **Create a fallback value for critical flags**
    - Implement a function that wraps calling Eppo’s SDK to have a fallback mechanism to use the Optimizely flag values if the new service is unavailable or experiences issues.
    - When attempting to retrieve a flag value from Eppo, catch any exceptions or errors that may occur due to service unavailability or issues and return the old value.
        
        *TypeScript Example:*
        
        ```tsx
        // After initialization, turn off graceful failure so exceptions are rethrown
        getInstance().setIsGracefulFailureMode(false);
        
        // Drop-in wrapper replacement for isFeatureEnabled()
        export function isFeatureEnabledWrapper(
          featureKey: string,
          userId: string,
          attributes?: Record<string, string | number | boolean | null>
        ) {
          let isEnabled = false;
          try {
            // For grouping values with a single flag, JSON-typed variations are used
            isEnabled = getInstance().getBooleanAssignment(
              userId,
              featureKey,
              attributes
            ) ?? false;
          } catch (e) {
            logger.warn(
              'Error encountered evaluating boolean assignment from Eppo SDK; falling back to optimizely',
              { featureKey, userId, attributes }
            );
            isEnabled = optimizelyClientInstance.isFeatureEnabled(
              featureKey,
              userId,
              attributes
            );
          }
          return isEnabled;
        }
        
        // Drop-in wrapper replacement for getFeatureVariableString()
        export function getFeatureVariableStringWrapper(
          featureKey: string,
          variableKey: string,
          userId: string,
          attributes?: Record<string, string | number | boolean | null>
        ) {
          let assignment: string | null = null;
          try {
            // For grouping values with a single flag, JSON-typed variations are used
            const featureVariables = getInstance().getParsedJSONAssignment(
              userId,
              featureKey,
              attributes
            ) as Record<string, string | number | boolean | null>;
            // Look up the desired specific value
            assignment = featureVariables?.[variableKey]?.toString() ?? null;
          } catch (e) {
            logger.warn(
              'Error encountered evaluating assignment from Eppo SDK; falling back to optimizely',
              { featureKey, variableKey, userId, attributes }
            );
            assignment = optimizelyClientInstance.getFeatureVariableString(
              featureKey,
              variableKey,
              userId,
              attributes
            );
          }
          return assignment;
        }
        ```
        
6. **Recreate existing flags in Eppo**
    - In the Eppo dashboard, recreate the critical flags from Optimizely.
    - Ensure that the flag configurations, such as rollout percentages, targeting rules, and variations, are accurately replicated in the new service.
7. **Switch existing flags to the new application**
    - Once you have verified that the Eppo flags are working correctly, switch your application to use the function that checks Eppo for flags instead of the Optimizely ones.
    - Remove the fallback mechanism and the Optimizely flag code once you have confirmed that the Eppo flags are working as expected in production.
    - It’s recommended to keep the wrapper as a facade to make future changes easier, as they will typically only need to be made to the wrapper.
        
        *TypeScript Example:*
        
        ```tsx
        // FeatureHelper.ts
        
        export function isFeatureEnabledWrapper(
          featureKey: string,
          userId: string,
          attributes?: Record<string, string | number | boolean | null>
        ) {
          return getInstance().getBooleanAssignment(userId, featureKey, attributes) ?? false;
        }
        ```
        
        ```tsx
        // PlaceUsingFlags.ts
        
        const useBigButtons = isFeatureEnabledWrapper(userId, 'use-big-buttons', userAttributes);
        ```
        
    
    ## Appendix: TypeScript Implementation Comparison
    
    Optimizely and Eppo have very similar interfaces, making switching from one to the other straightforward.
    
    *Note: Above each code example is a link to its respective documentation source.*
    
    ### Initialization
    
    *[Optimizely](https://docs.developers.optimizely.com/full-stack-experimentation/docs/javascript-browser-quickstart#2-instantiate-optimizely):*
    
    ```tsx
    const optimizelyClientInstance = optimizelySdk.createInstance({
      datafile: window.optimizelyDatafile,
    });
    ```
    
    *[Eppo](/sdks/client-sdks/javascript/initialization):*
    
    ```tsx
    await init({ 
      apiKey: EPPO_SDK_KEY 
    });
    ```
    
    ### Wiring Up Assignment Logger
    
    *[Optimizely](https://docs.developers.optimizely.com/full-stack-experimentation/docs/set-up-notification-listener-swift#add-and-remove-all-notification-listeners):*
    
    ```tsx
    optimizely.notificationCenter.addDecisionNotificationListener(decisionListener: { (type, userId, attributes, decisionInfo) in    
        // Send data to analytics provider / warehouse here
    })  
    ```
    
    *[Eppo](/sdks/client-sdks/javascript/assignments#Logging-data-to-your-data-warehouse):*
    
    ```tsx
    const assignmentLogger: IAssignmentLogger = {
      logAssignment(assignment) {
        // Send data to analytics provider / warehouse here
      }
    };
    getInstance().setLogger(assignmentLogger); // Note: can also be set in init()
    ```
    
    ### Getting a Boolean Flag
    
    For example, checking if a feature is enabled
    
    *[Optimizely](https://docs.developers.optimizely.com/full-stack-experimentation/docs/is-feature-enabled-javascript-node#examples):*
    
    ```tsx
    const enabled = 
      optimizelyClientInstance.isFeatureEnabled(featureKey, userId, attributes);
    ```
    
    [*Eppo](/sdks/client-sdks/javascript/assignments):*
    
    ```tsx
    const enabled = 
      getInstance().getBooleanAssignment(userId, featureKey, attributes) ?? false;
    ```
    
    ### Getting a String Value
    
    *[Optimizely](https://docs.developers.optimizely.com/full-stack-experimentation/docs/get-feature-variable-javascript-node#section-string):*
    
    ```tsx
    const value = 
      getFeatureVariableString(featureKey, variableKey, userId, attributes)
    
    ```
    
    *[Eppo](/sdks/client-sdks/javascript/assignments):*
    
    ```tsx
     
    // If it's part of a multi-valued variation (How Optimizely organizes values)
    const value =
    	getInstance().getParsedJSONAssignment(userId, featureKey, attributes)?.[variableKey];
    	
    // If it's a stand-alone string variation value (Eppo only)
    const value = 
      getInstance().getStringAssignment(userId, featureKey, attributes);
    ```
    
    ### Getting All Values of a Multi-Valued Flag Variation
    
    For example, getting all variables for a feature
    
    *[Optimizely](https://docs.developers.optimizely.com/full-stack-experimentation/docs/get-all-feature-variables-javascript-node):*
    
    ```tsx
    const values = 
      optimizelyClient.getAllFeatureVariables(featureKey, userId, attributes);
    ```
    
    *[Eppo](/sdks/client-sdks/javascript/assignments):*

    ```tsx
    const values = 
        getInstance().getParsedJSONAssignment(userId, featureKey, attributes);
    ```
