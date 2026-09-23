import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import { open, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';

const {
  NEXT_PUBLIC_SUPABASE_URL: url,
  SUPABASE_SECRET_KEY: key,
  OWNER_EMAIL: rawEmail,
} = process.env;
if (!url || !key || !rawEmail)
  throw new Error(
    'Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY and OWNER_EMAIL.',
  );
const email = rawEmail.trim().toLowerCase();
const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: existing, error: lookupError } = await client
  .from('admin_users')
  .select('user_id');
if (lookupError)
  throw new Error('Apply migrations before provisioning the owner.');

if (existing.length) {
  const { data, error } = await client.auth.admin.getUserById(
    existing[0].user_id,
  );
  if (error || data.user?.email?.toLowerCase() !== email)
    throw new Error(
      'Another owner already exists. No account or credentials changed.',
    );
  console.log(
    `Owner already provisioned (user ${data.user.id}). Existing credentials are unchanged.`,
  );
  process.exit(0);
}

await mkdir('work', { recursive: true });
const recoveryPath = 'work/owner-recovery.json';
let file;
let recovery;
try {
  file = await open(
    recoveryPath,
    constants.O_CREAT |
      constants.O_EXCL |
      constants.O_RDWR |
      constants.O_NOFOLLOW,
    0o600,
  );
  if (existing.length)
    throw new Error(
      'An owner already exists. This script will not replace it.',
    );
  recovery = {
    projectUrl: url,
    email,
    password: randomBytes(32).toString('base64url'),
    userId: null,
  };
  // Commit the recovery secret to disk before creating any remote account.
  await file.writeFile(JSON.stringify(recovery, null, 2) + '\n');
  await file.sync();
} catch (error) {
  if (
    !(error instanceof Error) ||
    !('code' in error) ||
    error.code !== 'EEXIST'
  ) {
    await file?.close();
    throw error;
  }
  file = await open(recoveryPath, constants.O_RDWR | constants.O_NOFOLLOW);
  const stat = await file.stat();
  if ((stat.mode & 0o077) !== 0) {
    await file.close();
    throw new Error('Recovery file permissions must be 0600.');
  }
  try {
    recovery = JSON.parse(await file.readFile('utf8'));
  } catch {
    await file.close();
    throw new Error(
      'Recovery file is unreadable. Do not overwrite it; inspect account state first.',
    );
  }
  if (
    !recovery ||
    recovery.projectUrl !== url ||
    recovery.email !== email ||
    typeof recovery.password !== 'string' ||
    recovery.password.length < 32
  ) {
    await file.close();
    throw new Error(
      'Recovery file does not match this project and owner. Refusing to replace credentials.',
    );
  }
}
try {
  // A prior attempt may have created the account before its response arrived.
  const resumed = await client.auth.signInWithPassword({
    email,
    password: recovery.password,
  });
  let user = resumed.data.user;
  if (!user) {
    if (existing.length || recovery.userId)
      throw new Error(
        'Existing owner could not be verified with the saved recovery credential. No account changed.',
      );
    const created = await client.auth.admin.createUser({
      email,
      password: recovery.password,
      email_confirm: true,
    });
    if (created.error || !created.data.user)
      throw new Error(
        'Owner creation could not be confirmed. Recovery credentials are preserved; rerun to resume safely.',
      );
    user = created.data.user;
  }
  if (
    user.email?.toLowerCase() !== email ||
    (recovery.userId && recovery.userId !== user.id)
  )
    throw new Error('Owner identity did not match. No access granted.');
  if (existing.length && existing[0].user_id !== user.id)
    throw new Error('Another owner already exists. No access changed.');
  recovery.userId = user.id;
  const contents = Buffer.from(JSON.stringify(recovery, null, 2) + '\n');
  await file.write(contents, 0, contents.length, 0);
  await file.truncate(contents.length);
  await file.sync();
  // Keep the privileged client separate: sign-in above replaces its auth token.
  const provisioner = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  if (!existing.length) {
    const { error } = await provisioner
      .from('admin_users')
      .insert({ user_id: user.id });
    if (error)
      throw new Error(
        'Account is saved but admin access could not be confirmed. Recovery credentials are preserved; rerun after checking database grants.',
      );
  }
  console.log(
    `Owner ready without sending email (user ${user.id}). Recovery credentials are in work/owner-recovery.json. Move them to your password manager and remove the local file.`,
  );
} finally {
  await file.close();
}
