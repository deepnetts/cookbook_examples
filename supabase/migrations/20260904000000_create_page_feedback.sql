create table public.page_feedback (
    response_id uuid not null,
    page_path text not null,
    page_title text not null,
    rating text not null,
    feedback_comment text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint page_feedback_pkey primary key (response_id, page_path),
    constraint page_feedback_path_format check (
        char_length(page_path) between 1 and 255
        and page_path ~ '^/(?:[A-Za-z0-9][A-Za-z0-9_-]*/)*$'
    ),
    constraint page_feedback_title_length check (
        char_length(btrim(page_title)) between 1 and 160
    ),
    constraint page_feedback_rating_values check (
        rating in ('helpful', 'not_helpful')
    ),
    constraint page_feedback_comment_length check (
        feedback_comment is null
        or (
            char_length(feedback_comment) between 1 and 500
            and feedback_comment = btrim(feedback_comment)
        )
    ),
    constraint page_feedback_helpful_has_no_comment check (
        rating <> 'helpful' or feedback_comment is null
    )
);

comment on table public.page_feedback is
    'Anonymous, page-specific responses submitted through the page-feedback Edge Function.';
comment on column public.page_feedback.response_id is
    'Random UUID stored in one browser for one documentation page; it is not a user identifier.';
comment on column public.page_feedback.feedback_comment is
    'Optional improvement note for a not_helpful response; no personal data is requested.';

create index page_feedback_updated_at_idx
    on public.page_feedback (updated_at desc);

create index page_feedback_negative_comments_idx
    on public.page_feedback (updated_at desc)
    where rating = 'not_helpful' and feedback_comment is not null;

alter table public.page_feedback enable row level security;
alter table public.page_feedback force row level security;

-- There are deliberately no public policies. Browser traffic must pass through
-- the Edge Function, whose server-side client uses a secret/service role.
revoke all privileges on table public.page_feedback from public, anon, authenticated;

create or replace function public.submit_page_feedback(
    p_response_id uuid,
    p_page_path text,
    p_page_title text,
    p_rating text,
    p_feedback_comment text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
    v_now timestamp with time zone := pg_catalog.clock_timestamp();
    v_comment text := nullif(pg_catalog.btrim(p_feedback_comment), '');
    v_existing public.page_feedback%rowtype;
    v_saved public.page_feedback%rowtype;
begin
    if p_rating = 'helpful' then
        v_comment := null;
    end if;

    -- Serialize requests for the same anonymous page response. This makes the
    -- upsert deterministic even if a browser retries before the first call ends.
    perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(p_response_id::text || ':' || p_page_path, 0)
    );

    select *
      into v_existing
      from public.page_feedback
     where response_id = p_response_id
       and page_path = p_page_path
     for update;

    -- An identical network retry is successful without creating a new event or
    -- changing the timestamps.
    if found
       and v_existing.page_title = pg_catalog.btrim(p_page_title)
       and v_existing.rating = p_rating
       and v_existing.feedback_comment is not distinct from v_comment then
        return pg_catalog.jsonb_build_object(
            'responseId', v_existing.response_id,
            'pagePath', v_existing.page_path,
            'rating', v_existing.rating,
            'comment', v_existing.feedback_comment,
            'createdAt', v_existing.created_at,
            'updatedAt', v_existing.updated_at
        );
    end if;

    -- Permit the expected second step (adding an optional comment after a No
    -- vote), but throttle other rapid changes for the same browser and page.
    if found
       and v_now - v_existing.updated_at < interval '750 milliseconds'
       and not (
           v_existing.rating = 'not_helpful'
           and v_existing.feedback_comment is null
           and p_rating = 'not_helpful'
           and v_comment is not null
       ) then
        raise exception using
            errcode = 'P0001',
            message = 'feedback_rate_limited';
    end if;

    insert into public.page_feedback (
        response_id,
        page_path,
        page_title,
        rating,
        feedback_comment,
        created_at,
        updated_at
    ) values (
        p_response_id,
        p_page_path,
        pg_catalog.btrim(p_page_title),
        p_rating,
        v_comment,
        v_now,
        v_now
    )
    on conflict (response_id, page_path) do update
       set page_title = excluded.page_title,
           rating = excluded.rating,
           feedback_comment = excluded.feedback_comment,
           updated_at = excluded.updated_at
    returning * into v_saved;

    return pg_catalog.jsonb_build_object(
        'responseId', v_saved.response_id,
        'pagePath', v_saved.page_path,
        'rating', v_saved.rating,
        'comment', v_saved.feedback_comment,
        'createdAt', v_saved.created_at,
        'updatedAt', v_saved.updated_at
    );
end;
$function$;

comment on function public.submit_page_feedback(uuid, text, text, text, text) is
    'Validates database invariants and atomically inserts or updates one anonymous page response.';

revoke all privileges on function public.submit_page_feedback(uuid, text, text, text, text)
    from public, anon, authenticated;
grant execute on function public.submit_page_feedback(uuid, text, text, text, text)
    to service_role;

create view public.feedback_page_summary
with (security_invoker = true)
as
select
    page_path,
    (array_agg(page_title order by updated_at desc))[1] as page_title,
    count(*) filter (where rating = 'helpful') as helpful_count,
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
    'One dashboard row per documentation page with Yes/No totals and helpful percentage.';

create view public.feedback_negative_comments
with (security_invoker = true)
as
select
    page_path,
    page_title,
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
where rating = 'not_helpful'
  and feedback_comment is not null;

comment on view public.feedback_negative_comments is
    'Optional negative comments with spreadsheet-formula prefixes escaped for safe dashboard CSV export.';

revoke all privileges on table public.feedback_page_summary from public, anon, authenticated;
revoke all privileges on table public.feedback_negative_comments from public, anon, authenticated;
