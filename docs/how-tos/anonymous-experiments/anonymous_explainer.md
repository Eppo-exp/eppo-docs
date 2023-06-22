# Analyzing Anonymous User Experiments in Eppo

In the world of A/B testing, it is very common to assign unauthenticated users to an experiment using anonymous identifiers like a Cookie ID. These assignments need to then be linked to user-level events so that metrics can be calculated for those unauthenticated users. However, it is likely that a handful of these events will have an associated User ID and a handful of these events will not due to a user’s flow from authenticated to unauthenticated states.

For example, a typical E-Commerce company might have a table with a collection of events tracking user clicks and their advancement through the purchase funnel (add-to-cart, checkout, and purchase events). Until a user makes their first purchase and authenticates, any events before that moment will not be associated with a User ID. Following authentication, this user could remain logged-in, meaning their events will be associated with a User ID. They might also log out, meaning their events will not be associated with a User ID until they authenticate again. This creates the potential for time periods in which an important event is not associated with a User ID.

To remedy this, attribution models can be built within the transformation layer of the data warehouse. Although these attribution models can differ, it is most standard to assume that a cookie’s association with a specific user can be assumed until proven otherwise. Specifically, once an association between an Anonymous ID and a User ID has been established using data post-authentication, all events prior to that moment of authentication can be assumed to have also been performed by this user.  This relationship persists until that Anonymous ID is associated with a new User ID within the data. At this point, this observed relationship between an Anonymous ID and User ID can be assumed until another relationship is observed.

With just a small amount of data transformation work within the data warehouse and a few minutes of setup within Eppo, these types of anonymized user experiments can be analyzed within Eppo.

## Warehouse Setup

To build an anonymous visitor-to-user attribution model, begin with a table similar to the one described above. From this table, build a model that identifies the minimum and maximum time in which an Anonymous ID was associated with a specific User ID. A template query to do this can be viewed below.

```sql
with 

users_lag as (
    SELECT
        user_id,
				, anonymous_id
        , lag(user_id) OVER (PARTITION BY anonymous_id ORDER BY ts) as last_user_id
        , lag(ts)  OVER (PARTITION BY anonymous_id ORDER BY ts) as last_ts
        , lead(ts)  OVER (PARTITION BY anonymous_id ORDER BY ts) as next_ts
    FROM event_table
)

, user_switch as (
SELECT
    *
    , SUM(IF(last_user_id != user_id, 1, 0)) OVER (PARTITION BY anonymous_id ORDER BY ts) as cumulative_switch
FROM users_lag
)

, user_login_windows_collapsed as (
select
    anonymous_id
    , user_id
    , cumulative_switch
    , LOGICAL_OR(last_ts IS NULL) as is_first
    , LOGICAL_OR(next_ts IS NULL) as is_last
    , min(ts) as ts_min
    , max(next_ts) as ts_max
from user_switch
group by 1,2,3
)

SELECT
    anonymous_id
    , IF(is_first, TIMESTAMP("0001-01-01 00:00:00"), ts_min) as ts_start_window
    , IF(is_last, TIMESTAMP("9999-12-31 23:59:59"), ts_max) as ts_end_window
FROM user_login_windows_collapsed
order by anonymous_id, ts_min;

```

For the first identified relationship between an Anonymous ID and a User ID, a timestamp infinitely far into the past is used for the `ts_start_window` in order to provide an inferred User ID for events prior to a user’s first moment of authentication. Similarly, for the last identified relationship between an Anonymous ID and a User ID, a timestamp far into the future is used for the `ts_end_window` column to ensure that any events created in an unauthenticated state will have an inferred User ID. This association will be used for all unauthenticated events until a new relationship for any given Anonymous ID and User ID is identified. At this point, a new `ts_start_window` is defined for the given Anonymous ID.

Once this model is built, it can be joined to any fact table within the data warehouse. It should be joined onto these fact tables by User ID wherever a fact event’s timestamp is between a given user’s `ts_start_window` and `ts_end_window`. By doing this, all fact tables at the user level can now have an inferred Anonymous ID. This inferred Anonymous ID can then be used by Eppo to link Assignment SQL definitions at the Anonymous ID level to these fact tables.

```sql 
select 
 facts.ts,
 mapping.anonymous_id,
 facts.user_id

from fact_table as facts
	left join anon_visitor_to_user_mapping as mapping
		on facts.user_id = mapping.user_id 
		and facts.ts between mapping.ts_start_window and mapping.ts_end_window
```

## Eppo Setup

Within Eppo, first create an ‘anonymous’ entity. Feel free to give it whatever name makes the most sense for the organization. This entity will be used to organize both the Assignment SQL definition and the Fact SQL together.

![Creating Anonymous Experiments](/img/anonymous-experiments/creating_anonymous_entity.gif)

Once this entity is created, create an Assignment SQL definition and link it to the anonymous entity. Be sure to use the anonymous identifier (such as cookie id) for the `Experiment Subjects` column. This anonymous identifier will be used by Eppo to link your Assignment SQL definition to your Fact SQL definition.

![Creating Anonymous SQL Assignments](/img/anonymous-experiments/creating_assignment_definition.gif)

Finally, create a Fact SQL definition that utilizes the anonymous visitor-to-user model described previously to infer an anonymous idea for the user-level fact table. Be sure to specify the anonymous entity as the `Entity` and use the anonymous identifier from the anonymous visitor-to-user model for the `Enity ID` column.

![Creating Fact SQL Definition](/img/anonymous-experiments/creating_fact_sql.gif)

With this setup, all metrics derived from this fact will successfully link back to assignments with Anonymous IDs.  Follow the pattern described above for all other facts associated with metrics that need to be added to the metric repository.