# AI Explores

Instead of hunting for value differences by property for the primary metric, Eppo can surface those differences automatically.

In the Explore tab, click the "Auto-Generate Explore Charts" button.
![Create AI Explores](/img/measuring-experiments/auto-generate-explores.png)

This will check every property value for the primary metric amongst each variant and surface any explores where the confidence interval for that dimensional cut differs significantly from from the overall metric confidence interval.

Eppo will generate up to four Explore charts for you.
![Create Explore](/img/measuring-experiments/ai-explores-example.png)

Note that if the primary metric does not have any dimensions with interesting results, no Explore charts will be generated. 