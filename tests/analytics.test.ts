import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  beatSchema,
  describeAgent,
  isBot,
  referrerHost,
} from '../lib/analytics/beat';

const session = '11111111-1111-4111-8111-111111111111';
test('beacons accept site paths and known event types only', () => {
  assert.equal(
    beatSchema.safeParse({
      session,
      path: '/',
      events: [{ type: 'click', path: '/', label: 'Pricing' }],
    }).success,
    true,
  );
  for (const changed of [
    { path: 'https://evil.test/' },
    { session: 'nope' },
    { events: [{ type: 'keystroke', path: '/' }] },
    {
      events: Array.from({ length: 31 }, () => ({ type: 'click', path: '/' })),
    },
    { email: 'visitor@example.test' },
  ])
    assert.equal(
      beatSchema.safeParse({ session, path: '/', ...changed }).success,
      false,
    );
});
test('referrers keep only the external host', () => {
  assert.equal(
    referrerHost('https://www.google.com/search?q=jonas', 'jonasinfocus.com'),
    'google.com',
  );
  assert.equal(
    referrerHost('https://www.jonasinfocus.com/privacy', 'jonasinfocus.com'),
    undefined,
  );
  assert.equal(referrerHost('not a url', 'jonasinfocus.com'), undefined);
});
test('user agents are summarized and bots skipped', () => {
  const iphone =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
  assert.deepEqual(describeAgent(iphone), {
    device: 'mobile',
    browser: 'Safari',
    os: 'iOS',
  });
  assert.equal(isBot(iphone), false);
  assert.equal(isBot('Googlebot/2.1 (+http://www.google.com/bot.html)'), true);
  assert.equal(isBot(''), true);
});
