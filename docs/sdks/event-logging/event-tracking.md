# Event tracking

The Track API allows you to record any actions your users perform, like "Signed Up", "Made a Purchase" or "Clicked a Button",
along with any properties that describe the action. Once you send these events, Eppo will ingest them, batch, process and
load into the data warehouse of your choice. You can then, further analyze them, trigger downstream actions, and generally 
get better visibility into user behavior.

## Why to use it

* **Deeper Insights**: You get real-time data about how people use your product. That helps you figure out where users might get stuck, what features they love, and what drives them to come back.
* **Personalized Experiences**: Once you know what actions users are taking, you can customize their experience—like sending personalized messages or recommending features they’d find useful.
* **Consistent Data Flow**: By centralizing your event tracking with an API call, you keep everything neat and standard across all your different tools (analytics, CRM, marketing platforms, etc.).

## When to Use It

Use the Track API any time you want to record a user’s action. This could be:

* User signs up or completes onboarding;
* User views specific screens or pages;
* User interacts with certain in-app features (clicking a button, changing a setting, etc.);
* Transactions, such as making a purchase or completing a subscription upgrade;
* You want Eppo to take care of ingesting and processing your event stream.

Here's how a typical event looks like:

```json
{
  "type": "added_to_cart",
  "payload": {
    "productId": "abc-987",
    "userId": "123",
    "price": 24.99
  }
}
```

## Example usage

Here's an example of how you might use the Track API in a Browser application:

```typescript
import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();
eppoClient.track({
  type: "added_to_cart",
  payload: {
    productId: "abc-987",
    userId: "123",
    price: 24.99
  }
});
```
