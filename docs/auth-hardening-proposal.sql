-- PROPOSAL ONLY. Review and approve before executing in Supabase SQL Editor.
-- Existing RLS and own-row SELECT policy are already correct.
-- Browser roles only need SELECT; remove unnecessary table-level privileges.
begin;
revoke all privileges on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;
commit;

-- Read-only verification after approval/execution:
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'admin_users'
  and grantee in ('anon', 'authenticated');
select policyname, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public' and tablename = 'admin_users';
