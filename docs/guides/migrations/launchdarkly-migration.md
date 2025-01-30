# LaunchDarkly Feature Flag Migration Guide

1. **Install the Eppo SDK**
    - Login to Eppo with your work email: https://eppo.cloud/
    - [Generate an SDK key](https://docs.geteppo.com/sdks/sdk-keys) by navigating to “SDK Keys” under Configuration
    - [Define a logging function](https://docs.geteppo.com/sdks/event-logging/assignment-event-logging/) for the Eppo SDK to log assignments so they end up in your data warehouse.
      
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
        
    - Initialize the SDK in your code using the SDK guides for your language [here](https://docs.geteppo.com/sdks/).
      
      *TypeScript Example:*
        
        ```tsx
        await init({
          apiKey: EPPO_SDK_KEY,
          assignmentLogger,
        });
        ```
        
2. **Set up a new flag and verify its functionality**
    - [Create a new flag in Eppo](https://docs.geteppo.com/feature-flag-quickstart#2-create-a-flag) by navigating to “Feature Flags” under Configuration
    - [Implement the flag](https://docs.geteppo.com/feature-flag-quickstart#6-embed-the-flag-in-your-code) in your application code
    - Test the flag in your local development environment to ensure it works as expected.
      
      *TypeScript Example:*
        
        ```tsx
        const variation = getInstance().getBooleanAssignment(
          'show-new-feature', 
          user.id, 
          { 
        	  'country': user.country, 
        	  'device': user.device
        	}, 
          false
        );
        ```
        
    - Deploy the application to your staging or testing environments and verify the flag's functionality.
    - Once verified, deploy the application to your production environment and test the flag again.
3. **Identify critical flags in LaunchDarkly**
    - Make a list of all the feature flags currently in use within your application using the provided template
    - Categorize the flags as critical or non-critical based on their importance and impact on your application's functionality.
    - Flags that are disabled or are rolled out to 100% can be categorized as non-critical
4. **For all non-critical flags, remove existing flag code**
    - For the non-critical flags identified in the previous step, remove the flag code from your application and from LaunchDarkly. They are no longer relevant.
    - Test your application thoroughly to ensure that the removal of these flags does not introduce any regressions or unintended behavior.
5. **For critical flags, create a fallback value in a wrapper**
    - Implement a function that wraps calling Eppo’s SDK to have a fallback mechanism to use the LaunchDarkly flag values if the new service is unavailable or experiences issues.
    - When attempting to retrieve a flag value from Eppo, catch any exceptions or errors that may occur due to service unavailability or issues and return the old value.
    - Eppo SDKs only strongly typed assignment functions (e.g `getBooleanAssignment`), whereas some LaunchDarkly SDKs use a single evaluation function across types. For such SDKs, we recommend moving towards typed usage and creating wrappers for each type. Uses of the generic function can the be replaced with the typed wrappers in your application. Here are two examples:
      
      *TypeScript Example:*
        
        ```tsx
        // After initialization, turn off graceful failure so exceptions are rethrown
        getInstance().setIsGracefulFailureMode(false);
        
        // Drop-in wrapper replacement for getting a boolean LD assignment.
        // Replace boolean calls to variation() with getBoolVariationWrapper() in the code.
        export function getBoolVariationWrapper(
          featureKey: string,
          userId: string,
          attributes?: Record<string, string | number | boolean | null>
        ) {
          let assignment = false;
          
          try {
            // For grouping values with a single flag, JSON-typed variations are used
            assignment = getInstance().getBoolAssignment(
              userId,
              featureKey,
              attributes,
              false
            );
          } catch (e) {
            logger.warn(
              'Error encountered evaluating boolean assignment from Eppo SDK; falling back to LaunchDarkly',
              { featureKey, userId, attributes }
            );
            
            // Exact signature may differ based on LD SDK used.
            assignment = launchDarklyClientInstance.variation(
              featureKey,
              userId,
              attributes
            );
          }
          return assignment;
        }
        
        // Drop-in wrapper replacement for getting a string LD assignment.
        // Replace string calls to variation() with getStringVariationWrapper() in the code.
        export function getStringVariationWrapper(
          featureKey: string,
          userId: string,
          attributes?: Record<string, string | number | boolean | null>
        ) {
          let assignment = false;
          
          try {
            // For grouping values with a single flag, JSON-typed variations are used
            assignment = getInstance().getStringAssignment(
              userId,
              featureKey,
              attributes,
              'default'
            );
          } catch (e) {
            logger.warn(
              'Error encountered evaluating boolean assignment from Eppo SDK; falling back to LaunchDarkly',
              { featureKey, userId, attributes }
            );
            
            // Exact signature may differ based on LD SDK used.
            assignment = launchDarklyClientInstance.variation(
              featureKey,
              userId,
              attributes
            );
          }
          return assignment;
        }
        ```
        If you want to use JSON or Numeric variants, you will have
        to define `getJSONAssignment` and `getNumericAssignment` the same way.

6. **Recreate critical flags in Eppo**
    
    :::note
    Eppo can help with migrating flags to the Eppo dashboard. Please reach out to your customer support rep for help.
    :::
    
    - In the Eppo dashboard, recreate the critical flags from LaunchDarkly.
    - Ensure that the flag configurations, such as rollout percentages, targeting rules, and variations, are accurately replicated in the new service.
7. **Switch existing flags to the new application**
    - Once you have verified that the Eppo flags are working correctly, switch your application to use the function that checks Eppo for flags instead of the LaunchDarkly ones.
    - Remove the fallback mechanism and the LaunchDarkly flag code once you have confirmed that the Eppo flags are working as expected in production.
    - It’s recommended to keep the wrapper as a facade to make future changes easier, as they will typically only need to be made to the wrapper.
      
      *TypeScript Example:*
      
        ```tsx
        // FeatureHelper.ts
        
        export function isFeatureEnabled(
          featureKey: string,
          userId: string,
          attributes?: Record<string, string | number | boolean | null>
        ) {
          return getInstance().getBoolAssignment(userId, featureKey, attributes, false);
        }
        ```
        
        ```tsx
        // PlaceUsingFlags.ts
        
        const useBigButtons = isFeatureEnabled(userId, 'use-big-buttons', userAttributes);
        ```
        
    
    ## Appendix: TypeScript Implementation Comparison
    
    LaunchDarkly and Eppo have very similar interfaces, making switching from one to the other straightforward.
    
    *Note: Above each code example is a link to its respective documentation source.*
    
    ### Initialization
    
    [LaunchDarkly](https://docs.launchdarkly.com/sdk/features/config#javascript):
    
    ```tsx
    LDClient.initialize('client-side-key', context, options)
    ```
    
    [*Eppo*](https://docs.geteppo.com/sdks/client-sdks/javascript/initialization):
    
    ```tsx
    await init({ 
      apiKey: EPPO_SDK_KEY 
    });
    ```
    
    ### Wiring Up Assignment Logger
    
    [LaunchDarkly](https://docs.launchdarkly.com/sdk/features/logging/#javascript):
    
    ```tsx
    class CustomAssignmentLogger {
      logAssignmentEvent(user: LDUser, flagKey: string, value: any): void {
        // Your custom logging logic here
        console.log(`Flag: ${flagKey}, User: ${user.key}, Value: ${value}`);
      }
    }
    
    const options: LDOptions = {
      assignmentEventLogger: new CustomAssignmentLogger(),
    };
    
    LDClient.initialize('client-side-key', context, options)
    ```
    
    [*Eppo*](https://docs.geteppo.com/sdks/client-sdks/javascript#define-an-assignment-logger-experiment-assignment-only):
    
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
    
    [LaunchDarkly](https://docs.launchdarkly.com/sdk/features/evaluating#javascript):
    
    ```tsx
    const enabled = 
      launchDarklyClientInstance.variation(featureKey, false) as boolean;
    ```
    
    [*Eppo*](https://docs.geteppo.com/sdks/client-sdks/javascript/assignments):
    
    ```tsx
    const enabled = 
      getInstance().getBoolAssignment(userId, featureKey, attributes, false);
    ```
    
    ### Getting a Multivariate Value: String, JSON, Numeric
    
    [LaunchDarkly](https://docs.launchdarkly.com/sdk/features/evaluating#javascript):
    
    ```tsx
    const enabled = 
      launchDarklyClientInstance.variation(featureKey, 'default') as string;
    
    ```
    
    [*Eppo*](https://docs.geteppo.com/sdks/client-sdks/javascript#typed-assignments):
    
    ```tsx
     
    // If it's part of a Multivariate flags (How LaunchDarkly organizes values), 
    // you will have to figure out the type of the flag as Eppo uses different calls
    // for each variant type.
    // If it's a JSON variation value (Eppo only):
    const value =
    	getInstance().getJSONAssignment(userId, featureKey, attributes)?.[variableKey];
    	
    // If it's a stand-alone string variation value (Eppo only):
    const value = 
      getInstance().getStringAssignment(userId, featureKey, attributes);

    // If it's a numeric variation value (Eppo only):
    const value = 
      getInstance().getNumericAssignment(userId, featureKey, attributes);
    ```

    ### Getting All Values of a Multi-Valued Flag Variation
    
    For example, getting all variables for a feature
    
    [LaunchDarkly](https://docs.launchdarkly.com/sdk/features/evaluating#javascript):
    
    ```tsx
    const enabled = 
      launchDarklyClientInstance.variation(featureKey, 'default') as object;
    ```
    
    [*Eppo*](https://docs.geteppo.com/sdks/client-sdks/javascript#typed-assignments):
    
    ```tsx
    const values = 
      getInstance().getJSONAssignment(userId, featureKey, attributes);
    ```
