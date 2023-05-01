# Experiment Schedule Settings

## Set Experiment Update Schedules
Go to Admin > Settings > Experiment Schedule Settings to set the default schedule for experiments to update recurringly as well as create additional custom schedules. The default schedule will automatically be used for all running experiments, unless particular experiments have opted to use a custom schedule.

![Experiment Update Schedule](/img/administration/experiment-update-schedule-admin.png)

### Custom Schedules
Custom schedules can be created to fit different experiment needs. Schedules created here can be used for individual experiments as needed. 
![Custom Experiment Update Schedule](/img/administration/custom-exp-update-schedule.png)

## Automations
### Auto-set an End Date for Indefinite Experiments
With this enabled, Eppo will automatically set an end date for experiments without a defined end date for the configured time period. You may want to enable this to prevent experiments from running indefinitely and incurring data warehouse costs. This does not apply to Eppo randomized experiments.

![Auto-set End Date](/img/administration/auto-set-end-date.png)