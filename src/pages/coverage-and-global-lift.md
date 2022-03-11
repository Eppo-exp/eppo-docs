# Coverage and Global Lift

## Coverage

Measures (approximately) the percentage of the overall metric that is covered by the experiment. 

For example, suppose that we run an experiment in the month of January with 3 variants: the control variant, treatment A and treatment B. Suppose total revenue that month is $100. Furthermore, the total revenue by the variants are $20, $18 and $22 for control, treatment A, and treatment B respectively. The coverage 60%.

## Global lift

The global lift metric computes an approximate impact on the overall metric if we roll out a specific variant versus the control variant. This is particularly important when an experiment targets a subset of actions. 

For example, suppose we run an experiment on the checkout flow on the mobile app. We find that the purchases in the mobile app (under control) account for 30% of total revenue, and the treatment cell increases revenue by 10% over the control cell. Then the global impact of the treatment on revenue is 3%.