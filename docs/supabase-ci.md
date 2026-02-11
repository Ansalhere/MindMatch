# CI: Supabase migration (one-click)

This workflow lets you run the `requests` table creation + demo-data migration and a quick smoke-test from GitHub Actions (no secrets in PRs).

How it works
- You add repository secrets (below).  
- Open Actions → **Supabase — migrate requests and smoke-test** → Run workflow.  
- Workflow runs the migration and uploads migration/backend logs as an artifact.

Required repository secrets
- SUPABASE_URL — e.g. `https://<project>.supabase.co`  
- SUPABASE_SERVICE_ROLE_KEY — **server-only** (rotate after use)  
- (optional) POSTGRES_URL — direct Postgres URI; if provided the CI will run the CREATE TABLE step via `create_requests_table.js`.

How to run (after you add secrets)
1. Go to Actions → Supabase — migrate requests and smoke-test → Run workflow.  
2. Wait for the run to complete and download the `supabase-migration-logs` artifact.  

Security
- The `SUPABASE_SERVICE_ROLE_KEY` must be added as a GitHub repository secret and never committed to source.  
- Rotate the service_role key and DB password after migration completes.

If you prefer, run the migration locally instead (see README or ask me for the one-liners).