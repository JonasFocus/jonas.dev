import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inquirySchema } from '../lib/crm/validation';
const input = {
  submissionId: '11111111-1111-4111-8111-111111111111',
  name: 'A Visitor',
  email: 'visitor@example.test',
  service: 'website',
  description: 'Please help build a site for my new business.',
  consent: true,
};
test('requires valid email, meaningful description, consent and known fields', () => {
  assert.equal(inquirySchema.safeParse(input).success, true);
  for (const changed of [
    { email: 'bad' },
    { description: 'short' },
    { consent: false },
    { role: 'admin' },
    { submissionId: 'bad' },
    { caseStudy: 'invented' },
  ])
    assert.equal(
      inquirySchema.safeParse({ ...input, ...changed }).success,
      false,
    );
});
test('normalizes user input and enforces size limits', () => {
  const valid = inquirySchema.parse({
    ...input,
    name: '  A Visitor  ',
    email: 'VISITOR@example.test',
  });
  assert.equal(valid.name, 'A Visitor');
  assert.equal(valid.email, 'visitor@example.test');
  assert.equal(
    inquirySchema.safeParse({ ...input, description: 'a'.repeat(5001) })
      .success,
    false,
  );
});

test('accepts multiple services, normalizes retries, and rejects empty or unknown choices', () => {
  assert.deepEqual(
    inquirySchema.parse({ ...input, service: ['website', 'saas', 'website'] })
      .service,
    ['saas', 'website'],
  );
  assert.deepEqual(inquirySchema.parse(input).service, ['website']);
  for (const service of [[], ['unknown'], ['website', 'unknown']]) {
    assert.equal(inquirySchema.safeParse({ ...input, service }).success, false);
  }
});
