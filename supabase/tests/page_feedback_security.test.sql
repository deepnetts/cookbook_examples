begin;

create extension if not exists pgtap with schema extensions;

select plan(27);

select is(
    (select relrowsecurity from pg_catalog.pg_class where oid = 'public.page_feedback'::regclass),
    true,
    'page_feedback has row level security enabled'
);

select is(
    (select relforcerowsecurity from pg_catalog.pg_class where oid = 'public.page_feedback'::regclass),
    true,
    'page_feedback forces row level security'
);

select is(
    (
        select count(*)::integer
        from pg_catalog.pg_policies
        where schemaname = 'public' and tablename = 'page_feedback'
    ),
    0,
    'page_feedback deliberately exposes no browser policies'
);

select ok(
    not pg_catalog.has_table_privilege('anon', 'public.page_feedback', 'SELECT'),
    'anon cannot read page feedback'
);
select ok(
    not pg_catalog.has_table_privilege('anon', 'public.page_feedback', 'INSERT'),
    'anon cannot insert page feedback directly'
);
select ok(
    not pg_catalog.has_table_privilege('anon', 'public.page_feedback', 'UPDATE'),
    'anon cannot update page feedback directly'
);
select ok(
    not pg_catalog.has_table_privilege('anon', 'public.page_feedback', 'DELETE'),
    'anon cannot delete page feedback'
);

select ok(
    not pg_catalog.has_table_privilege('authenticated', 'public.page_feedback', 'SELECT'),
    'authenticated cannot read page feedback'
);
select ok(
    not pg_catalog.has_table_privilege('authenticated', 'public.page_feedback', 'INSERT'),
    'authenticated cannot insert page feedback directly'
);
select ok(
    not pg_catalog.has_table_privilege('authenticated', 'public.page_feedback', 'UPDATE'),
    'authenticated cannot update page feedback directly'
);
select ok(
    not pg_catalog.has_table_privilege('authenticated', 'public.page_feedback', 'DELETE'),
    'authenticated cannot delete page feedback'
);

select ok(
    not pg_catalog.has_table_privilege('anon', 'public.feedback_page_summary', 'SELECT'),
    'anon cannot read the summary view'
);
select ok(
    not pg_catalog.has_table_privilege('authenticated', 'public.feedback_page_summary', 'SELECT'),
    'authenticated cannot read the summary view'
);
select ok(
    not pg_catalog.has_table_privilege('anon', 'public.feedback_negative_comments', 'SELECT'),
    'anon cannot read negative comments'
);
select ok(
    not pg_catalog.has_table_privilege('authenticated', 'public.feedback_negative_comments', 'SELECT'),
    'authenticated cannot read negative comments'
);
select ok(
    not pg_catalog.has_table_privilege('anon', 'public.feedback_page_comments', 'SELECT'),
    'anon cannot read page comments'
);
select ok(
    not pg_catalog.has_table_privilege('authenticated', 'public.feedback_page_comments', 'SELECT'),
    'authenticated cannot read page comments'
);

select ok(
    not pg_catalog.has_function_privilege(
        'anon',
        'public.submit_page_feedback(uuid,text,text,text,text)',
        'EXECUTE'
    ),
    'anon cannot invoke the write RPC directly'
);
select ok(
    not pg_catalog.has_function_privilege(
        'authenticated',
        'public.submit_page_feedback(uuid,text,text,text,text)',
        'EXECUTE'
    ),
    'authenticated cannot invoke the write RPC directly'
);
select ok(
    pg_catalog.has_function_privilege(
        'service_role',
        'public.submit_page_feedback(uuid,text,text,text,text)',
        'EXECUTE'
    ),
    'the server-side service role can invoke the write RPC'
);

select has_view(
    'public',
    'feedback_page_summary',
    'the migration creates the summary dashboard view'
);
select has_view(
    'public',
    'feedback_negative_comments',
    'the migration creates the negative-comments dashboard view'
);
select has_view(
    'public',
    'feedback_page_comments',
    'the migration creates the page-comments dashboard view'
);

insert into public.page_feedback (
    response_id,
    page_path,
    page_title,
    rating,
    feedback_comment
) values (
    '7f1d11a7-809d-4b33-8703-a22568766351',
    '/lectures/02-linear-regression/',
    'Linear Regression',
    'not_helpful',
    '=HYPERLINK("https://example.invalid")'
), (
    '70d2e94f-fbb5-4cf3-bbbb-a5784ec8ebcc',
    '/lectures/03-logistic-regression/',
    'Logistic Regression',
    'not_helpful',
    '+SUM(A1:A2)'
), (
    '03594c50-b310-487d-9d31-f0fa29ca13e5',
    '/lectures/02-neural-networks/',
    'Neural Networks',
    'not_helpful',
    '-1+2'
), (
    '8ee86b76-7b90-4b14-aa78-f65a19150826',
    '/lectures/05-backpropagation/',
    'Backpropagation',
    'not_helpful',
    '@SUM(1,2)'
), (
    '34401229-1d88-47b3-a10d-565a2fd2e7a2',
    '/lectures/01-ml-basics/',
    'Machine Learning Basics',
    'neutral',
    'More examples would help.'
);

select is(
    (
        select comment
        from public.feedback_negative_comments
        where page_path = '/lectures/02-linear-regression/'
        limit 1
    ),
    '''=HYPERLINK("https://example.invalid")',
    'negative comment view escapes spreadsheet formula prefixes'
);

select is(
    (
        select comment
        from public.feedback_negative_comments
        where page_path = '/lectures/03-logistic-regression/'
        limit 1
    ),
    '''+SUM(A1:A2)',
    'negative comment view escapes a leading plus sign'
);

select is(
    (
        select comment
        from public.feedback_negative_comments
        where page_path = '/lectures/02-neural-networks/'
        limit 1
    ),
    '''-1+2',
    'negative comment view escapes a leading minus sign'
);

select is(
    (
        select comment
        from public.feedback_negative_comments
        where page_path = '/lectures/05-backpropagation/'
        limit 1
    ),
    '''@SUM(1,2)',
    'negative comment view escapes a leading at sign'
);

select is(
    (
        select rating
        from public.feedback_page_comments
        where page_path = '/lectures/01-ml-basics/'
        limit 1
    ),
    'neutral',
    'page comments view includes neutral feedback'
);

select * from finish();
rollback;
