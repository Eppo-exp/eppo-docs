---
sidebar_position: 1
---

# Creating an experiment

1. Navigate to **Experiments**

2. Click **+Experiment**

3. Fill out the **Create Experiment** Form

Give your experiment a name, start and end date.

4. Click on the **Set Up** tab

5. Click the **Configure the Experiment** button

6. Select an assignment SQL from the definitions you created

7. Input a feature flag name

You may need to refer back to your **Definitions** for the relevant feature flag name:

a) Navigate to **Definitions** and **Assignments**

b) Click on the three dots next to the Assignment SQL you want and then click **Edit Details**

c) Click **Run**

d) Look at the value of the column that you annotated as **feature flag**

e) The feature flag name you will want to input in experiments setup is one of these values.

8. Input what percentage of traffic you want randomized into the experiment.

Traffic refers to the experiment subjects, so if you input 100%, 100% of the relevant entities will be included in the experiment.

9. Select the traffic allocation you would like

10. Add the variants

Again, you may need to refer back to your **Definitions** for you relevant variant names.

a) Navigate to **Definitions** and **Assignments**

b) Click on the three dots next to the Assignment SQL you want and then click **Edit Details**

c) Click **Run**

d) Look at the value of the column that you annotated as **VARIANT**

e) The variant names you will want to add to experiments setup is one of these values.

11. Determine whether you want to split traffic evenly among variants

12. Click **Save Changes**
