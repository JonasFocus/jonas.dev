import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { randomUUID } from 'node:crypto';
const db = new PGlite();
const owner = '11111111-1111-4111-8111-111111111111';
const stranger = '22222222-2222-4222-8222-222222222222';
const payload = (id = randomUUID()) => ({
  submissionId: id,
  name: 'Test Visitor',
  email: 'visitor@example.test',
  service: 'website',
  description: 'A website for a fictional test company.',
  consent: true,
});
before(async () => {
  await db.exec(
    `create role anon; create role authenticated; create role service_role; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`,
  );
  await db.exec(
    'alter default privileges in schema public grant execute on functions to anon, authenticated',
  );
  for (const file of (await readdir('supabase/migrations'))
    .filter((file) => file.endsWith('.sql'))
    .sort()) {
    await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'));
  }
  await db.query('insert into auth.users values ($1),($2)', [owner, stranger]);
  await db.query('insert into public.admin_users(user_id) values ($1)', [
    owner,
  ]);
});
after(() => db.close());
async function submit(
  input = payload(),
  fingerprint = 'hash',
  ip = randomUUID(),
  email = randomUUID(),
) {
  const r = await db.query<{ id: string }>(
    "select public.submit_request($1::jsonb,$2,$3,$4)->>'id' id",
    [JSON.stringify(input), fingerprint, ip, email],
  );
  return r.rows[0].id;
}
async function asUser<T>(user: string, fn: () => Promise<T>) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user]);
  await db.exec('set role authenticated');
  try {
    return await fn();
  } finally {
    await db.exec('reset role');
  }
}
test('request survives retries without duplicate records or activities', async () => {
  const input = payload();
  const id = await submit(input);
  assert.equal(await submit(input), id);
  assert.equal(
    (
      await db.query<{ n: number }>(
        'select count(*)::int n from requests where id=$1',
        [id],
      )
    ).rows[0].n,
    1,
  );
  assert.equal(
    (
      await db.query<{ n: number }>(
        'select count(*)::int n from activity_events where request_id=$1',
        [id],
      )
    ).rows[0].n,
    1,
  );
  await assert.rejects(submit(input, 'different'), /SUBMISSION_CONFLICT/);
});
test('email limit rejects fourth request atomically', async () => {
  const email = randomUUID();
  for (let i = 0; i < 3; i++)
    await submit(payload(), 'hash', randomUUID(), email);
  const input = payload();
  await assert.rejects(
    submit(input, 'hash', randomUUID(), email),
    /RATE_LIMIT/,
  );
  assert.equal(
    (
      await db.query<{ n: number }>(
        'select count(*)::int n from requests where id=$1',
        [input.submissionId],
      )
    ).rows[0].n,
    0,
  );
});
test('anonymous cannot read records or call intake directly', async () => {
  await db.exec('set role anon');
  try {
    await assert.rejects(
      db.query('select * from requests'),
      /permission denied/,
    );
    await assert.rejects(submit(), /permission denied/);
  } finally {
    await db.exec('reset role');
  }
});
test('signed-in non-owner sees nothing and cannot insert or convert', async () => {
  const id = await submit();
  await asUser(stranger, async () => {
    assert.equal((await db.query('select * from requests')).rows.length, 0);
    assert.equal((await db.query('select * from customers')).rows.length, 0);
    await assert.rejects(
      db.query(
        "insert into customers(name,email) values('Attacker','a@example.test')",
      ),
      /row-level security/,
    );
    await assert.rejects(
      db.query('select public.convert_request($1)', [id]),
      /NOT_AUTHORIZED/,
    );
  });
});
test('owner reviews, annotates, follows up and converts once', async () => {
  const id = await submit();
  await asUser(owner, async () => {
    assert.equal(
      (await db.query('select id from requests where id=$1', [id])).rows.length,
      1,
    );
    await db.query(
      "update requests set status='qualified',read_at=now() where id=$1",
      [id],
    );
    await db.query(
      "insert into request_notes(request_id,body) values($1,'Discuss scope')",
      [id],
    );
    await db.query(
      "insert into follow_ups(request_id,title,due_at) values($1,'Review brief',now())",
      [id],
    );
    await db.query(
      'update follow_ups set completed_at=now() where request_id=$1',
      [id],
    );
    const a = await db.query<{ id: string }>(
      'select public.convert_request($1) id',
      [id],
    );
    const b = await db.query<{ id: string }>(
      'select public.convert_request($1) id',
      [id],
    );
    assert.equal(a.rows[0].id, b.rows[0].id);
    assert.equal(
      (
        await db.query('select * from activity_events where request_id=$1', [
          id,
        ])
      ).rows.length,
      6,
    );
    await assert.rejects(
      db.query(
        "insert into activity_events(request_id,action) values($1,'Forged history')",
        [id],
      ),
      /permission denied/,
    );
  });
});
test('owner cannot convert spam, malformed data rejected by DB', async () => {
  const id = await submit();
  await asUser(owner, async () => {
    await db.query("update requests set status='spam' where id=$1", [id]);
    await assert.rejects(
      db.query('select public.convert_request($1)', [id]),
      /SPAM_REQUEST/,
    );
    await assert.rejects(
      db.query("update requests set status='bogus' where id=$1", [id]),
      /check constraint/,
    );
  });
});

test('anonymous cannot execute the owner membership helper', async () => {
  const result = await db.query<{ allowed: boolean }>(
    "select has_function_privilege('anon','public.is_owner()','EXECUTE') allowed",
  );
  assert.equal(result.rows[0].allowed, false);
});

test('stores every service selection and preserves legacy submissions', async () => {
  const input = { ...payload(), services: ['website', 'saas', 'web-app'] };
  const id = await submit(input);
  assert.equal(await submit(input), id);
  const result = await asUser(owner, () =>
    db.query<{ service: string; services: string[] }>(
      'select service,services from public.requests where id=$1',
      [id],
    ),
  );
  assert.deepEqual(result.rows[0], {
    service: 'website',
    services: ['website', 'saas', 'web-app'],
  });
  const legacyId = await submit(payload());
  const legacy = await db.query<{ services: string[] }>(
    'select services from public.requests where id=$1',
    [legacyId],
  );
  assert.deepEqual(legacy.rows[0].services, ['website']);
  for (const services of [[], ['unknown'], ['website', null]]) {
    const invalid = { ...payload(), services };
    await assert.rejects(() => submit(invalid));
  }
});

test('newsletter defaults hidden and only the owner can change visibility', async () => {
  const read = async () =>
    (
      await db.query<{ newsletter_enabled: boolean }>(
        'select newsletter_enabled from public.homepage_settings where id=true',
      )
    ).rows[0].newsletter_enabled;
  assert.equal(await read(), false);
  await db.exec('set role anon');
  try {
    assert.equal(await read(), false);
    await assert.rejects(() =>
      db.exec(
        'update public.homepage_settings set newsletter_enabled=true where id=true',
      ),
    );
    await assert.rejects(() => db.exec('delete from public.homepage_settings'));
  } finally {
    await db.exec('reset role');
  }
  await asUser(stranger, async () => {
    await db.exec(
      'update public.homepage_settings set newsletter_enabled=true where id=true',
    );
    assert.equal(await read(), false);
  });
  for (let pass = 0; pass < 2; pass++) {
    await asUser(owner, () =>
      db.exec(
        'update public.homepage_settings set newsletter_enabled=true where id=true',
      ),
    );
    assert.equal(await read(), true);
    await asUser(owner, () =>
      db.exec(
        'update public.homepage_settings set newsletter_enabled=false where id=true',
      ),
    );
    assert.equal(await read(), false);
  }
});

test('converting two requests from the same email reuses one customer', async () => {
  const email = `repeat-${randomUUID()}@example.test`;
  const first = await submit({ ...payload(), email });
  const second = await submit({ ...payload(), email: email.toUpperCase() });
  await asUser(owner, async () => {
    const a = await db.query<{ id: string }>(
      'select public.convert_request($1) id',
      [first],
    );
    const b = await db.query<{ id: string }>(
      'select public.convert_request($1) id',
      [second],
    );
    assert.equal(a.rows[0].id, b.rows[0].id);
    const linked = await db.query<{ n: number }>(
      'select count(*)::int n from requests where customer_id=$1',
      [a.rows[0].id],
    );
    assert.equal(linked.rows[0].n, 2);
  });
});

test('customer emails are unique regardless of case', async () => {
  const email = `unique-${randomUUID()}@example.test`;
  await db.query("insert into customers(name,email) values('First',$1)", [
    email,
  ]);
  await assert.rejects(
    db.query("insert into customers(name,email) values('Second',upper($1))", [
      email,
    ]),
    /duplicate key/,
  );
});

test('email uniqueness migration merges existing duplicate customers', async () => {
  const email = `dupe-${randomUUID()}@example.test`;
  await db.exec('drop index public.customers_email_lower_key');
  const inserted = await db.query<{ id: string }>(
    `insert into customers(name,email,created_at) values
      ('Oldest',$1,now()-interval '2 days'),
      ('Newer',upper($1),now()-interval '1 day'),
      ('Newest',$1,now())
      returning id`,
    [email],
  );
  const customerIds = inserted.rows.map((row) => row.id);
  const requestIds: string[] = [];
  for (const customerId of customerIds) {
    const id = await submit();
    await db.query('update requests set customer_id=$1 where id=$2', [
      customerId,
      id,
    ]);
    requestIds.push(id);
  }
  await db.exec(
    await readFile(
      'supabase/migrations/20260922090000_customer_email_unique.sql',
      'utf8',
    ),
  );
  const remaining = await db.query<{ id: string }>(
    'select id from customers where lower(email)=$1',
    [email],
  );
  assert.deepEqual(remaining.rows, [{ id: customerIds[0] }]);
  const linked = await db.query<{ n: number }>(
    'select count(*)::int n from requests where id = any($1) and customer_id=$2',
    [requestIds, customerIds[0]],
  );
  assert.equal(linked.rows[0].n, 3);
});

test('intake reports whether a submission is new or a retry', async () => {
  const input = JSON.stringify(payload());
  const call = async () =>
    (
      await db.query<{ result: { id: string; created: boolean } }>(
        'select public.submit_request($1::jsonb,$2,$3,$4) result',
        [input, 'hash', randomUUID(), randomUUID()],
      )
    ).rows[0].result;
  const first = await call();
  assert.equal(first.created, true);
  assert.deepEqual(await call(), { id: first.id, created: false });
});

test('admin_users holds exactly one owner', async () => {
  await assert.rejects(
    db.query('insert into public.admin_users(user_id) values ($1)', [
      stranger,
    ]),
    /duplicate key/,
  );
  const owners = await db.query<{ user_id: string }>(
    'select user_id from public.admin_users',
  );
  assert.deepEqual(owners.rows, [{ user_id: owner }]);
});
