# Required Data for Eppo

## Column types for assignment table

| Field      | Required | Data type                               | Description                                                                                                                           |
| ---------- | -------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| timestamp  | Yes      | Datetime (or ISO 8601 string)           | Date and time (including time zone) when the assignment occurred                                                                      |
| user_id    | No       | Depends on your implementation          | Can be empty if a user is not logged in, in which case device_id should be set                                                        |
| experiment | Yes      | String                                  | Identifier for the experiment                                                                                                         |
| variation  | Yes      | String                                  | Identifier for the variation                                                                                                          |
| device_id  | Yes      | Unique identifier for the user’s device | There are various approaches to getting this based on platform. Reach out to Eppo if you’d like help setting this up on any platform. |
