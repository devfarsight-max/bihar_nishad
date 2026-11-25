import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';

async function load(file, mocks = {}) {
  const context = vm.createContext({ console, setTimeout, clearTimeout });
  const source = transformSync(fs.readFileSync(file, 'utf8'), { loader: file.endsWith('jsx') ? 'jsx' : 'js', jsx: 'automatic', format: 'esm' }).code;
  const module = new vm.SourceTextModule(source, { context });
  await module.link(async specifier => {
    const exports = mocks[specifier];
    assert.ok(exports, `Missing mock: ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    }, { context });
  });
  await module.evaluate();
  return module.namespace;
}

test('login authenticates a regular user without any admin requirement', async () => {
  const user = { id: 'regular-user' };
  const auth = { signInWithPassword: async credentials => {
    assert.equal(credentials.email, 'member@example.com');
    assert.equal(credentials.password, ' password ');
    return { data: { user, session: { user } }, error: null };
  } };
  const service = await load('src/services/authService.js', { '../lib/supabaseClient': { supabase: { auth } } });
  assert.equal((await service.signIn(' member@example.com ', ' password ')).user, user);
});

test('login preserves the actual Supabase credential/confirmation error', async () => {
  for (const code of ['invalid_credentials', 'email_not_confirmed']) {
    const failure = { code };
    const service = await load('src/services/authService.js', { '../lib/supabaseClient': { supabase: { auth: { signInWithPassword: async () => ({ error: failure }) } } } });
    await assert.rejects(service.signIn('member@example.com', 'bad'), error => error === failure);
  }
});

test('membership lookup matches authenticated UUID, never display metadata', async () => {
  for (const member of [true, false]) {
    let selected = false;
    const client = {
      auth: { getUser: async () => ({ data: { user: { id: 'uuid', user_metadata: { isAdmin: true } } }, error: null }) },
      schema: schema => { assert.equal(schema, 'public'); return { from: table => {
        assert.equal(table, 'admin_users');
        return { select: column => { assert.equal(column, 'user_id'); return { eq: (key, id) => {
          assert.equal(key, 'user_id'); assert.equal(id, 'uuid'); selected = true;
          return { maybeSingle: async () => ({ data: member ? { user_id: id } : null, error: null }) };
        } }; } };
      } }; },
    };
    const service = await load('src/services/adminService.js', { '../lib/supabaseClient': { supabase: client } });
    assert.equal(await service.isAdminUser('different-user'), false);
    assert.equal(selected, false);
    assert.equal(await service.isAdminUser('uuid'), member);
    if (!member) await assert.rejects(service.requireAdmin('uuid'), error => error.code === 'admin_access_denied');
  }
});

test('membership query errors fail closed and remain distinct from invalid credentials', async () => {
  const client = { auth: { getUser: async () => ({ data: { user: { id: 'uuid' } } }) }, schema: () => ({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ error: { message: 'RLS failure' } }) }) }) }) }) };
  const service = await load('src/services/adminService.js', { '../lib/supabaseClient': { supabase: client } });
  await assert.rejects(service.isAdminUser('uuid'), error => error.code === 'admin_check_failed');
});

test('route guards cover signed out, regular user, admin, recovery and loading', async () => {
  const Navigate = () => {}, Outlet = () => {};
  let auth = {};
  const { default: Guard } = await load('src/components/auth/ProtectedRoute.jsx', {
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    'react-router-dom': { Navigate, Outlet, useLocation: () => ({ pathname: '/admin/projects', search: '' }) },
    '../../hooks/useAuth': { useAuth: () => auth },
  });
  auth = { loading: true }; assert.equal(Guard({ admin: true }).props.role, 'status');
  auth = {}; assert.equal(Guard({ admin: true }).props.to, '/admin/login');
  assert.equal(Guard({}).props.to, '/login');
  auth = { user: { id: 'member' } }; assert.equal(Guard({}).type, Outlet);
  assert.equal(Guard({ admin: true }).props.role, 'alert');
  auth.isAdmin = true; assert.equal(Guard({ admin: true }).type, Outlet);
  auth.recovering = true; assert.equal(Guard({ admin: true }).props.to, '/reset-password');
});

test('validation, safe redirects, and distinct friendly errors', async () => {
  const { validateAuth, safeDestination, authError } = await load('src/utils/validators.js');
  assert.equal(safeDestination('//evil.example'), '/dashboard');
  assert.equal(safeDestination('/admin/projects'), '/admin/projects');
  assert.match(validateAuth({ email: 'member@example.com', name: 'Member', password: '12345678', confirm: 'different' }, 'register'), /match/);
  assert.match(authError({ code: 'email_not_confirmed' }), /verify/);
  assert.match(authError({ code: 'admin_access_denied' }), /administrator/);
  assert.match(authError({ code: 'invalid_credentials' }), /email or password/);
});

test('context restores regular sessions, synchronizes login/logout, and permits regular-user recovery', async () => {
  let slots = [], cursor = 0, effects = [], output, dirty = false;
  const hooks = {
    createContext: () => ({ Provider: 'Provider' }), useContext: () => {},
    useRef: initial => { const index = cursor++; return slots[index] ??= { current: initial }; },
    useState: initial => { const index = cursor++; if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; dirty = true; }]; },
    useEffect: (run, deps) => { const index = cursor++; const old = slots[index];
      if (!old || deps.some((dep, i) => dep !== old.deps[i])) { effects.push(() => { old?.cleanup?.(); slots[index] = { deps, cleanup: run() }; }); } },
  };
  let listener;
  const member = { id: 'member' };
  const session = { user: member, access_token: 'one' };
  const calls = [];
  const client = { auth: {
    onAuthStateChange: callback => { listener = callback; return { data: { subscription: { unsubscribe() {} } } }; },
    getSession: async () => ({ data: { session } }),
    updateUser: async args => { calls.push(args); listener('USER_UPDATED', session); return { data: { user: member } }; },
  } };
  const runAuth = async action => { const result = await action(client.auth); if (result.error) throw result.error; return result.data; };
  const module = await load('src/context/AuthContext.jsx', {
    react: hooks, 'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
    '../lib/supabaseClient': { authConfigured: true, authRedirect: path => path, supabase: client },
    '../services/authService': { runAuth, signIn: async () => { listener('SIGNED_IN', session); return { user: member, session }; }, signOut: async () => listener('SIGNED_OUT', null) },
    '../services/adminService': { isAdminUser: async () => false },
  });
  async function flush() {
    for (let i = 0; i < 12; i++) {
      cursor = 0; dirty = false; output = module.AuthProvider({ children: null });
      const next = effects; effects = []; for (const effect of next) effect();
      await new Promise(resolve => setImmediate(resolve));
      if (!dirty && !effects.length) break;
    }
    return output.props.value;
  }
  let value = await flush();
  assert.equal(value.user, member); assert.equal(value.isAuthenticated, true); assert.equal(value.isAdmin, false); assert.equal(value.loading, false);
  await value.logout(); value = await flush(); assert.equal(value.user, null);
  await value.login('member@example.com', 'password'); value = await flush(); assert.equal(value.user, member);
  listener('PASSWORD_RECOVERY', session); value = await flush(); assert.equal(value.recovering, true);
  await value.updatePassword('new-password'); value = await flush();
  assert.equal(calls[0].password, 'new-password'); assert.equal(value.recovering, false);
  listener('SIGNED_OUT', null); value = await flush(); assert.equal(value.isAuthenticated, false);
  for (const slot of slots) slot?.cleanup?.();
});
