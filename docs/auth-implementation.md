# Authentication audit and implementation — 2 November 2026

## Findings before implementation

The full source tree, route definitions, existing components, services, context, hooks, configuration and README were inspected. There is one AuthProvider. Registration is implemented in pages/auth/Auth.jsx, rather than a separate registration component. No local database migrations or content editing services exist. Public contact/volunteer forms and content currently use local data.

Confirmed implementation defects:
- authService.signIn required admin membership after password authentication and signed out non-admins.
- AuthContext required admin membership when restoring every session, discarding regular users and their recovery sessions.
- Password updates required administrator membership.
- Explicit login marked every accepted user as admin, coupling identity with permission.
- Login failures were rendered both by AuthShell and the form.
- ProtectedRoute only checked a user existed; the requested /admin routes were absent.

Live read-only findings for the configured ngo-website project:
- .env.local points to the expected project; its publishable key is accepted by /auth/v1/settings (HTTP 200). No root .env exists. .env.example uses the correct variable names. No credentials were added to source.
- Email provider and registration are enabled; email confirmation is required.
- dev@gmail.com exists with UUID 638162b3-0b70-4170-b402-2c3dcc6668c0, a password record and a confirmed email. Its matching admin_users record exists.
- admin_users has RLS enabled, a UUID primary key and foreign key, and only an authenticated SELECT policy with auth.uid() = user_id. There are no public INSERT/UPDATE/DELETE policies. Other admins' rows are not visible to regular users.
- Browser roles have unnecessary TRUNCATE, REFERENCES and TRIGGER table grants. RLS does not govern TRUNCATE. The Data API does not expose arbitrary SQL, but these privileges should still be removed.
- admin_users is the only public table; no storage policies or content-management tables were found.
- No audit log entries were available in auth.audit_log_entries.

The frontend bugs explain regular-user rejection and recovery failure. They do not establish why Supabase rejected the administrator's password attempt. That specific failure remains unverified without a real password attempt or corresponding Auth service logs. A membership row cannot create a password or validate a password. No password was guessed, changed or requested in chat.

## Implemented behavior

Authentication and authorization are separate. All successfully authenticated users retain their session. Membership lookup uses the current authenticated UUID against public.admin_users, never email or user metadata. Lookup errors keep user authentication but deny admin access.

The existing context manages session, user, isAuthenticated, isAdmin, loading, login, register, logout, resetPassword(email), and updatePassword(password). Existing signIn/signUp/signOut/forgotPassword aliases remain compatible. Supabase persists and refreshes sessions. Event callbacks remain synchronous; membership requests run in effects outside the auth lock. Version checks discard stale results; timeouts end loading; duplicate SIGNED_IN events for the same token are ignored. Explicit submissions share a concurrency guard.

/dashboard is available to authenticated community members. /admin/login uses the existing login form. /admin/dashboard, /admin/profile, /admin/projects, /admin/gallery and /admin/settings require membership and wait for authorization. Regular users see an access-denied explanation and retain their user session. No public admin registration exists.

Existing registration, confirmation resend, callback, forgotten password and recovery flows remain. Password recovery now works for regular users too. New accounts receive no admin membership. Auth errors are rendered once per failed form submission, with distinct credential, confirmation, authorization and network messages. Password fields have accessible visibility controls.

Recovery requires opening an email link that emits PASSWORD_RECOVERY. Refreshing the reset page loses that transient recovery marker: reopen/request the link. Ordinary persistent sessions cannot open the reset form to change passwords. Email confirmation without an immediate signup session leads to /verify-email.

## Files changed/created

Modified: src/services/authService.js, src/context/AuthContext.jsx, src/components/auth/ProtectedRoute.jsx, src/components/auth/AuthUI.jsx, src/pages/auth/Auth.jsx, src/utils/validators.js, src/routes/AppRoutes.jsx, src/pages/admin/Dashboard.jsx, README.md, package.json.
Created: src/pages/admin/AdminPage.jsx, tests/auth.test.mjs, docs/auth-implementation.md, docs/auth-hardening-proposal.sql.
Unchanged and audited: src/lib/supabaseClient.js, src/services/adminService.js, src/hooks/useAuth.js, .env.example, .env.local. Existing public styling and components are preserved. dist/ was regenerated by the production build.

## Required manual dashboard settings

1. Authentication > Providers > Email: keep Email enabled, signup enabled and confirmation enabled (all verified through the public settings endpoint). Verify password policy, production SMTP and email delivery.
2. Authentication > URL Configuration: set Site URL to your actual production HTTPS origin, or http://localhost:5173 for development. Site URL and the redirect allowlist could not be read through the connected tools.
3. Add exact redirect URLs for http://localhost:5173/auth/callback and http://localhost:5173/reset-password. Add the matching production HTTPS URLs. Adjust for your actual development port; avoid broad production wildcards.
4. Authentication > Email Templates: confirmation and recovery templates should retain the standard {{ .ConfirmationURL }} link. Verify customized templates preserve the intended redirect. Test delivery and expired links.
5. Hosting: configure SPA fallback to index.html so direct /admin and emailed callback/reset URLs work.
6. Restart Vite after environment changes. Required names only: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY. Never use a secret/service-role key in VITE variables.

## SQL proposal — approval required

No database changes were executed. Review docs/auth-hardening-proposal.sql before approving it. It removes unnecessary browser-role privileges and retains authenticated SELECT governed by the existing own-row RLS policy. No replacement RLS policy or admin insertion is needed. It does not delete data or grant membership.

Future content tables require RLS that permits content writes only when the authenticated UUID has membership in admin_users. A frontend guard alone is insufficient. There are currently no such tables to repair.

## Verification and remaining acceptance tests

Passed: production Vite build; seven automated regression tests using mocked Supabase responses and a hook harness; live settings/key HTTP check; live read-only account/membership/policy/grant queries. The build reports a pre-existing-size class warning for a JavaScript chunk over 500 kB. Tests use Node's experimental VM modules and esbuild already supplied by Vite.

Automated coverage: regular-user password login without membership, propagation of invalid-credential and unconfirmed-email errors, UUID-based admin lookup with member/nonmember results, membership lookup failure, regular/admin route guards, loading and recovery redirects, validation and error messages, context session restoration, login/logout synchronization and regular-user password update. These are not browser or email-delivery tests.

Live acceptance checklist (not executed; requires account credentials and access to confirmation/recovery inboxes):
- Register a disposable regular user; verify confirmation email; confirm and log in.
- Log out; verify /dashboard and /admin/dashboard redirect to their respective login routes.
- Log in as dev@gmail.com; visit all five admin paths.
- Log in as the regular user; confirm /dashboard works and all admin paths deny access.
- Enter an incorrect password and verify one error appears. Try an unconfirmed account and verify the confirmation-specific message.
- Refresh after regular/admin login and verify persisted access and correct membership.
- Request recovery for both account types; open links; set a new password; log out and sign in with it.
- Verify used/expired recovery and confirmation links and resend confirmation.
- Check duplicate submissions, show/hide controls and keyboard interaction in the browser.

Content management is not implemented: projects/gallery/settings routes explicitly explain that no editing backend exists. Admin dashboard/profile reuse the existing account information. Building a CMS requires defining content schemas and approved RLS separately; it was not silently invented during this auth repair.

Documentation consulted: https://supabase.com/docs/reference/javascript/auth-onauthstatechange and https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail . Fetching the changelog markdown was attempted but blocked by the available network/content handling.
