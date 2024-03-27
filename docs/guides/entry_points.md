---
sidebar_position: 11
---

# Filtering assignments by entry point

This note describes why you would want to use Entry points. If you want to learn how to configure one in Eppo, refer to the [manual page](experiment-analysis/filter-assignments-by-entry-point.md).

## Why exclude some users from an experiment?

For some experiments, subjects are assigned to a variant in one place but are not exposed to it until they perform a certain action. For example, users may be assigned to all experiments upon visiting a website's homepage, but only a subset of those users navigate to a page where an experiment is being conducted.

The visitors who don’t see a difference should behave the same between Control and Treatment, so they likely won’t skew your results one way on another. But having more unaffected customers will add **noise** to your results and make it harder to test a good idea apart. You often hear that more participants is better; that’s only true if they are actually participating in the test. More unaffected subjects won’t help.

### Numerical Example 

Let’s say you have 20,000 subscriber coming to your side and buying something per month. About half of your users give you good ratings. Only 10% call customer service. About a quarter of those give you good ratings after the call, and are more likely to come back.

If you A/B test a better customer service, you’ll end up splitting the 2,000 who call into 1,000 for Control (about 250 of which should give you a good rating) and 1,000 for Treatment. If the new service is a lot better and three quarters of customers calling you now give you a good rating, that’s 250/1000 vs. 750/1000, i.e. a very clear result. Experiments are noisy so it won’t be exactly 250 and 750, but probably 250±15 and 750±15.

You can likely make a decision that the new approach to customer service is better within a few weeks.

If you include all your customers in the process, then you’ll have 9,000 extra participants in each variant that are not affected but the test, half of which will rate the service highly. Score will be around 4,500 + 250 = 4,750/10,000 vs. 5,250/10,000. The new treatment is still better but results will be noisier, probably around 4,750±100 and 5,250±100. The result after one month might not be conclusive. Your decision might have to wait for more evidence, while all you need is to focus on the information you already have.

## Examples when an Entry point is useful

Having a gap between assignment and **exposure** (seeing something difference) is common for experiments that involve expensive or slow pre-computation, calls to potentially delayed partner APIs, or post-sales changes.

### First example: slow recommendation below the fold

Let’s say you want to offer visitors **targeted recommendations below the fold of your home** page. You currently have simple recommendation in a carousel. Those are fast to load, but not well targetted. The improved, more complicated recommendation system leverages the information you have about a visitor (likely: IP, time of day, day of week, browser type). However, it takes almost a second to run, a very long time for a web server. Usually, visitors only start scroll after reading what is above the fold, so you typically have the time to generate those before the visitor scrolls and the recommendation carrousel enters the viewport. However, only a third of visitors scroll far enough to see the recommendations.

If you want to A/B test the impact of introducing that new recommendation, should you wait for visitors to scroll to the carrousel? That would be a sub-optimal experience: an empty carrousel would appear, then a very long second later, some suggestions pop in. Many visitors would have scrolled futher down at this point. Unless the computation is very expensive, it’s more likely that you want to trigger it for all visitors, so that it’s ready when they scroll it into view. That means that two thirds of the time, a visitors will not see the results.

When testing, should you assign all users? You need to decide whether to trigger the computation (Treatment) or not (Control). That assignment has to happen before you trigger the computation, therefore as soon as the visitor starts loading the home-page. You would need to assign a visit to either Control (older, fast recommendation) or Treatment (newer, better, slower recommendation) as soon as they start requesting the page.

There’s one concern though: while all visitors will be assigned in the experiment, only the visitors who see the recommendation carousel are exposed to a different experience. (We’ll ignore the impact of triggering an expensive computation for now.) Therefore, the two thirds of visitors who were assigned but never scrolled down the homepage should not be included in that experiment.

For cases like that, we let you define an **Entry Point**: what event needs to happen for visitors to be exposed to a different experience, and considered enrolled to the experiment. It remains up to you to decide if this should be when the carousel enters the viewport, is fully or partially visible; it’s also up to your front-end developpers to trigger and log that event. But once that information is in your data warehouse, then you can use it to filter out which users participate in the experiment.

:::note
If you define an Entry point, all the time-limted metrics (“Conversion 7 days after assignment”) are based on the timestamp of the Entry point, not the assignment. 
:::


### Second example: delivery pricing

Let’s imagine another example: an e-commerce sells large, unusual or even fragile items. Items might not all be in stock, depending on factors like size, colors or other aspect. If you sell plants, you might want to confirm it’s still alive. 

Pricing for custom deliveries depends on a multitude of factors (destination, need for temperature control, tax status) and your logistical partner conveniently offers an API to send quotes. The issue is: the response time of that API is slow. Therefore, you trigger a request as soon as you visitors confirm the contents of their basket and the country where they want it delivered, but before you have confirmed that the items are in stock, for example. 

You also can easily imagine offering renting a car, or a valuable asset and needing a quote from your insurance company, based on many factors: information about the person renting, time and duration, etc. 

Let‘s say you want to test asking for fast and cheap options. Or you could be testing a new provider. Alternatively, you might want to test asking both for a quote and let customers compate. Whatever is the change you want to test, you will need to decide which API call to trigger before the customer is guaranteed to see pricing because you have to wait for confirmation, say, that the items are in stock.

In this case too, the assignment happens when confirming basket contents and the address, but the entry point should be set to a little later, when the customer sees a quote.

:::note

If one of the API integration fails, and some customers assigned to Treatment don’t see the pricing quote because of a bug, then you’ll observe an [asymetric traffic](/statistics/sample-ratio-mismatch.md).

:::

There are more cases where tests on your deliveries would need an Entry point. Let’s say you want to improve the box opening experience, include a note, etc. The assignment has to hapen when packaging; the entry point has to be set when the customer receives the note. There’s no reason to include customers who didn’t get their packages when measuring the impact of a hand-written note on their satisfaction.

Not all logistical test require a separate Entry point. If you want to test a promotion that offers free delivery under certain condition, you can decide which customer sees that promotion when it becomes visible, not earlier.

:::note

Be mindful when testing promotions on anonymous users: you risk contaminating your experiment. If they get re-assigned by refreshing their browser, or opening a private window, some users will stumble on it, notice the discrepancy, and figure out the trick. They might leak that information. If prospective buyers see it, they will try. You are better off testing promotions on entities that buyers can’t change easily: established user account, phone number, postal address.

:::

### Third example: AI-generated customer service

Finally, let’s say you want to test one of those chat-bots that promise to replace human-lead customer service. The vendor recommends to send them as much information about the customer as you can, including their queries and the product description that they open during their session. Small issue: user logs are streamed to your data warehouse, but you don’t really store that information in the browser memory or a convenient session object that could be sent as a single blob to the AI company. No problem: the vendor can ingest page content as the visitor goes through your site, store it, and use it as context when a customer asks a question.

Once again, you have to decide to send information about a customer, i.e. assign them to either Control or Treatment before they ask a question and are exposed to the AI bot. 

In this example (as well as the examples about triggering complex recommendations) you could send an API call for **all users** and only decide which response to use once you need to show the information to the users. That pattern can avoid having to use Entry point. However, that vendor might charge per visitor, and you might want to lower the cost of testing their solution.

More generally, complex models, some API calls, and AI services are non-trivial to scale and **expensive to serve**. You might want to limit the cost of testing Treatment by not wasting half of it. In a gradual roll-out process, you want organise your feature flag so that only internal developpers and testers see the results first, then expose a small minority of visitors to the A/B test, then scale it to a full 50/50 test. That allows you to control who you expose, and if Treatment is expensive, how much valuable ressources you dedicate to testing an idea.

During internal tests, it matters less, but once you run an A/B test on users, if you want properly validate the impact of those changes, an Entry point will help you get better, sharper results.

### More examples

There are many more examples where the assignment has to happen before entities can see a difference, like API calls during time-sensitive ad auctions; or where the different treatment is triggered, but might not be visible to users, like including a legal warning on a pop-up that could be blocked by the browser.

If you have any questions, don’t hesitate to ask your Eppo contact.
