alter table public.page_feedback
    drop constraint page_feedback_rating_values;

alter table public.page_feedback
    add constraint page_feedback_rating_values check (
        rating in ('helpful', 'neutral', 'not_helpful')
    );

drop view public.feedback_page_summary;

create view public.feedback_page_summary
with (security_invoker = true)
as
select
    page_path,
    (array_agg(page_title order by updated_at desc))[1] as page_title,
    count(*) filter (where rating = 'helpful') as helpful_count,
    count(*) filter (where rating = 'neutral') as neutral_count,
    count(*) filter (where rating = 'not_helpful') as not_helpful_count,
    count(*) as total_count,
    round(
        100.0 * count(*) filter (where rating = 'helpful')
        / nullif(count(*), 0),
        2
    ) as helpful_percentage,
    max(updated_at) as latest_response_at
from public.page_feedback
group by page_path;

comment on view public.feedback_page_summary is
    'One dashboard row per documentation page with helpful, neutral, and not-helpful totals.';

create view public.feedback_page_comments
with (security_invoker = true)
as
select
    page_path,
    page_title,
    rating,
    case
        when pg_catalog.left(
            pg_catalog.ltrim(feedback_comment, E' \t\r\n'),
            1
        ) in ('=', '+', '-', '@')
            then '''' || feedback_comment
        else feedback_comment
    end as comment,
    created_at,
    updated_at
from public.page_feedback
where rating in ('neutral', 'not_helpful')
  and feedback_comment is not null;

comment on view public.feedback_page_comments is
    'Optional neutral and not-helpful comments with spreadsheet-formula prefixes escaped for safe CSV export.';

revoke all privileges on table public.feedback_page_summary from public, anon, authenticated;
revoke all privileges on table public.feedback_page_comments from public, anon, authenticated;
