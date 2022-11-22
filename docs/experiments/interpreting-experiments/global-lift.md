# Global Lift
Some experiments only apply to a subset of your users, for example, you run an experiment on your Iphone app.
In such a case, it is often useful to know what the overall impact from the experiment on metrics is, for example to help with demand forecasting. We call this **impact accounting** and it consists of two compontents: coverage and global lift.
To view the impact accounting page, first navigate to the **Experiments** page using the tab on the left panel and click on the experiment you are interested in. Then, stay on the **Overview** tab and click on the Impact Accounting icon, which is the second icon next to the heading **Decision Metrics**.

![Global Lift](../../../static/img/measuring-experiments/global-lift.png)

The **B** column tells you the lift for that metric in the experiment for users in your experiment. The **Coverage** column captures how much of the events for the metric are captured by the experiment, versus come from outside of the experiment.
Note that coverage is not adjusted for overall traffic allocation: if you run an experiment on a 10% subset of all your users, you should see a coverage number of approximately 10% for all your metrics.

The **Global Lift** column tells you the lift for that metric by taking the **Coverage** and overall traffic allocation for that metric into account.

For example, suppose that you are running an experiment on your mobile app which shows that revenue is up by 50% (lift). However, if only 10% of your total users actually use your mobile app (coverage), the actual impact on your bottom line is only 5% (global lift), assuming that there is no difference in how mobile app users and web users. This number may be higher or lower depending on whether mobile app users lead to relvatively more or less revenue, respectively.
