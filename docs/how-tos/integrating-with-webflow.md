---
sidebar_position: 7
---

# Integrating Eppo with Webflow


In this tutorial, you will learn how how run landing page tests in Webflow after minimal  engineering setup. At a high level, you will add a client side version of Eppo’s Javascript SDK as a script in your Webflow workspace that will:

- initialize the Eppo JS client
- handle experiment assignment logic
- dynamically update pre-defined content variables such as text and image URLs

## Prerequisites:

- Eppo Account
- Webflow account
- Client-side analytics platform like Segment, Amplitude, Adobe, Mixpanel, etc to capture Eppo assignment events and send them to your data warehouse for analysis.

## Setting up Eppo

Set up an feature flag in Eppo — for step by step instructions, follow our [quickstart](/feature-flags/). We will be using JSON flag type to fill in the content on our Webflow landing page. For the sake of this tutorial, make sure to include the following keys for both variations:

```json
{
	"title": "some words",
	"image": "https://myimage.com",
	"subtitle": "some more words",
	"cta": "even more words"
}
```

You can make the values of the keys whatever makes sense for your use case, or you can use our example from our prototype below:

![Setting up Eppo Feature Flag with JSON](/img/how-tos/integrating-with-webflow/setting-up-feature-flag.png)

Once you have your feature flag setup, set your [feature flag up as an experiment](/experiments/creating-experiments). Once you have data flowing to your data warehouse from your feature flag, you will be able to analyze your results.

## Setting up Webflow

For the purposes of this tutorial, we will be very explicit on what things to test in your Webflow experiment. Keep in mind that all of the specific elements we’re testing are extendable to anything in your Webflow Environment.

First, set up a Webflow landing page that has the following elements: a Header Title, a Header Subtitle, a Header CTA, and an image element. These elements should have no content in them for now since we will be filling in the image URL and messaging from our feature flag. As you are setting up these elements, make sure that you give each of the 4 elements one of the following custom ids: `header-subtitle`, `header-title`, `header-CTA`, and `header-image`. The custom code we add later specifically looks for these ids to write in the content from Eppo. See the screenshot below on where to update the ID for an element:

![Setting up Webflow element IDs](/img/how-tos/integrating-with-webflow/setting-up-webflow-ids.png)

Next, add the following code to your [custom code at the site level](https://university.webflow.com/lesson/custom-code-in-the-head-and-body-tags?topics=site-settings) in the footer:

:::note

By making sure our elements are “blank” to start with, we can completely reduce any flicker that would be caused by re-writing and element with Javascript. Make sure that you build in logic for default experience in the case that Eppo serves a `null` variation.

:::

```html
<script>console.log('Loading eppo SDK')</script>
<script src="https://cdn.jsdelivr.net/npm/@eppo/js-client-sdk@1.4.0/dist/eppo-sdk.js"></script>
<script>console.log('Done loading eppo SDK')</script>

<script>  
// Init user parameters
urlParams = new URLSearchParams(window.location.search);
subject = urlParams.get('subject') || crypto.randomUUID();

// Prep post-assignment code
function setHeader() {
  
  // Get variation
  const variationData = window.eppo.getInstance().getParsedJSONAssignment(subject, '<FEATURE-FLAG-KEY>');
  console.log('>>> got variation data', variationData);
  
  // Add client side analytics tracking call to capture experiment data 
  // and make sure assignment data is sent to your 
  // data warehouse that is connected to Eppo.

  document.getElementById('header-title').innerText = variationData.title;
  document.getElementById('header-subtitle').innerText = variationData.subtitle;
  document.getElementById('header-cta').querySelector('div').innerText = variationData.cta;
  
  const headerSrc = variationData.image;
  
  const headerImageDiv = document.getElementById('header-image');
  headerImageDiv.style.backgroundImage = 'url('+headerSrc+')';
  headerImageDiv.style.backgroundPosition = 'center center';
  headerImageDiv.style.backgroundRepeat = 'no-repeat';
  headerImageDiv.style.backgroundSize = 'auto 100%';
}

// Init Eppo Client
opts = {apiKey: '<EPPO-SDK-KEY>'};
window.eppo.init(opts).then(setHeader);
window.eppo.getInstance().setIsGracefulFailureMode(false);
</script>
```

- Provide your SDK key and Feature Flag key in the `'<SDK-KEY>'` and `'<FEATURE-FLAG-KEY>'` placeholders above.
- Add your client side analytics tracking call once the assignment has been made. Make sure your analytics platform is sending data to your data warehouse connected to Eppo. This will ensure that assignments made by Eppo will be tracked and can be used for experiment analysis.

## Demo

To see a demo of the Webflow integration in action, see this link: https://star-wars-demo.webflow.io/. 

