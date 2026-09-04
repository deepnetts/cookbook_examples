# Page feedback backend

The cookbook stays a static MkDocs site. Its `Was this helpful?` control sends
anonymous page responses to the public `page-feedback` Edge Function, which
validates each request and writes it with a server-side Supabase secret.

## Deploy

1. Create a Supabase project and install Supabase CLI 1.215.0 or later. The
   JavaScript entrypoint is configured in `supabase/config.toml`.
2. From the repository root, authenticate and link the project:

   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Apply the table, protected RPC, and dashboard views:

   ```bash
   supabase db push
   ```

4. Configure exact site origins. Include localhost only while testing:

   ```bash
   supabase secrets set FEEDBACK_ALLOWED_ORIGINS="https://YOUR_DOCUMENTATION_DOMAIN,http://localhost:8000,http://127.0.0.1:8000"
   ```

   Hosted functions receive `SUPABASE_URL` and Supabase secret keys
   automatically. The function supports the current `SUPABASE_SECRET_KEYS`
   environment variable, the local `SUPABASE_SECRET_KEY`, and the legacy
   `SUPABASE_SERVICE_ROLE_KEY`. No secret belongs in MkDocs, Git, or browser
   JavaScript.

5. Deploy the function:

   ```bash
   supabase functions deploy page-feedback
   ```

6. Supply the public endpoint while building or serving MkDocs:

   ```bash
   export DEEPNETTS_FEEDBACK_ENDPOINT="https://YOUR_PROJECT_REF.supabase.co/functions/v1/page-feedback"
   cd course
   python -m mkdocs build --strict
   ```

   `course/mkdocs.yml` reads this build-time environment variable into
   `extra.feedback_endpoint`. If it is absent, the feedback control is omitted
   instead of rendering a form that cannot save responses. Deploy the rebuilt
   static site after setting the endpoint.

   PowerShell equivalent for the existing Windows virtual environment:

   ```powershell
   $env:DEEPNETTS_FEEDBACK_ENDPOINT="https://YOUR_PROJECT_REF.supabase.co/functions/v1/page-feedback"
   Set-Location course
   .\.venv\Scripts\python.exe -m mkdocs build --strict
   ```

The function has `verify_jwt = false` because documentation visitors are not
signed in. The origin allowlist, honeypot, small request limit, strict payload
validation, exact versioned page-path allowlist, anonymous per-page UUID, and
database constraints protect the write-only endpoint. When adding or removing
a feedback-enabled page, update `functions/page-feedback/allowed-pages.js`
together with the exclusion list in `course/overrides/base.html`. Placeholder
NLP and Language Models example categories are deliberately excluded. Origin
checks are not authentication; if automated spam becomes a real problem, add
Turnstile rather than collecting visitor identity or raw IP addresses.

## Local test

Copy `.env.example` to the ignored `.env.local`, replace the local Supabase
values printed by `supabase status`, and run:

```bash
supabase start
supabase db reset
supabase functions serve page-feedback --env-file supabase/.env.local --no-verify-jwt
```

Run validation tests when Deno is installed:

```bash
deno test supabase/functions/page-feedback/validation_test.js
```

After the local Supabase stack is running, verify RLS, grants, protected views,
and RPC access with:

```bash
supabase test db
```

## Professor dashboard

Use a dedicated, feedback-only Supabase project and invite the professor as an
Owner or Developer instead of exposing an admin page on the documentation site.
A read-only project role cannot query these `security_invoker` views because
their source table intentionally has no public RLS read policy. In the Table
Editor or SQL Editor, use:

```sql
select *
from public.feedback_page_summary
order by total_count desc, page_path;
```

This shows helpful, neutral, not-helpful, total, helpful percentage, and the
latest response for every page. To review optional neutral and negative comments:

```sql
select *
from public.feedback_page_comments
order by updated_at desc;
```

The dashboard can filter either view and export the result as CSV. Export
comments from `feedback_page_comments`, not the raw table: the
view prefixes comments beginning with `=`, `+`, `-`, or `@` with an apostrophe
to prevent spreadsheet formula execution. The table, views, and submission RPC
revoke access from public browser roles; the invited Owner or Developer retains
administrative access to the dedicated project.
