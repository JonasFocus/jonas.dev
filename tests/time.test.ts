import { test } from 'node:test';
import assert from 'node:assert/strict';
import { endOfTodayIn } from '../lib/crm/time';

const timeZone = 'America/Chicago';
const cases = [
  [
    'spring transition before the clock changes',
    '2026-03-08T00:30:00-06:00',
    '2026-03-09T05:00:00.000Z',
  ],
  [
    'spring transition after the clock changes',
    '2026-03-08T03:30:00-05:00',
    '2026-03-09T05:00:00.000Z',
  ],
  [
    'fall transition before the clock changes',
    '2026-11-01T00:30:00-05:00',
    '2026-11-02T06:00:00.000Z',
  ],
  [
    'fall transition first repeated hour',
    '2026-11-01T01:30:00-05:00',
    '2026-11-02T06:00:00.000Z',
  ],
  [
    'fall transition second repeated hour',
    '2026-11-01T01:30:00-06:00',
    '2026-11-02T06:00:00.000Z',
  ],
  [
    'ordinary winter day with milliseconds',
    '2026-01-15T12:34:56.789-06:00',
    '2026-01-16T06:00:00.000Z',
  ],
  [
    'ordinary summer day with milliseconds',
    '2026-07-15T12:34:56.789-05:00',
    '2026-07-16T05:00:00.000Z',
  ],
  [
    'spring transition final millisecond',
    '2026-03-08T23:59:59.999-05:00',
    '2026-03-09T05:00:00.000Z',
  ],
  [
    'fall transition final millisecond',
    '2026-11-01T23:59:59.999-06:00',
    '2026-11-02T06:00:00.000Z',
  ],
  [
    'midnight starts a new day',
    '2026-03-09T00:00:00.000-05:00',
    '2026-03-10T05:00:00.000Z',
  ],
  [
    'year rollover',
    '2026-12-31T23:59:59.999-06:00',
    '2027-01-01T06:00:00.000Z',
  ],
];

for (const [name, input, expected] of cases) {
  test(`Chicago today cutoff handles ${name}`, () => {
    const now = new Date(input);
    const before = now.getTime();
    const cutoff = endOfTodayIn(timeZone, now);
    assert.equal(cutoff.toISOString(), expected);
    assert.equal(now.getTime(), before);
    assert.ok(cutoff.getTime() > now.getTime());
  });
}

test('today uses an exclusive next-midnight boundary on both DST transition days', () => {
  for (const input of [
    '2026-03-08T00:30:00-06:00',
    '2026-11-01T00:30:00-05:00',
  ]) {
    const now = new Date(input);
    const cutoff = endOfTodayIn(timeZone, now).getTime();
    const localDate = new Intl.DateTimeFormat('en-US', {
      timeZone,
      dateStyle: 'short',
    });
    assert.equal(localDate.format(cutoff - 1), localDate.format(now));
    assert.notEqual(localDate.format(cutoff), localDate.format(now));
    const dueToday = (dueAt: number) =>
      dueAt >= now.getTime() && dueAt < cutoff;
    assert.equal(dueToday(now.getTime() - 1), false);
    assert.equal(dueToday(now.getTime()), true);
    assert.equal(dueToday(cutoff - 1), true);
    assert.equal(dueToday(cutoff), false);
  }
});
