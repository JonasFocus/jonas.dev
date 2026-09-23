import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatInquiryAlert } from '../lib/crm/notify';
const reference = '11111111-1111-4111-8111-111111111111';
test('inquiry alert escapes user text, truncates the brief and links to admin', () => {
  const inquiry = {
    name: 'Ada <!channel>',
    email: 'ada@example.test',
    company: 'R&D <https://evil.test|Bank>',
    budget: '',
    timeline: 'Q4',
    description: 'x'.repeat(400),
  };
  const { text } = formatInquiryAlert(
    { ...inquiry, service: ['saas', 'website'] },
    reference,
    'https://jonas.dev',
  );
  assert.ok(text.includes('Ada &lt;!channel&gt;'));
  assert.ok(text.includes('R&amp;D &lt;https://evil.test|Bank&gt;'));
  assert.ok(!text.includes('<!channel>'));
  assert.ok(!text.includes('<https://evil.test'));
  assert.ok(text.includes('Services: saas, website'));
  assert.ok(!text.includes('Budget'));
  assert.ok(text.includes(`> ${'x'.repeat(300)}...`));
  assert.ok(!text.includes('x'.repeat(301)));
  assert.ok(
    text.endsWith(
      `<https://jonas.dev/admin/requests/${reference}|Open in admin>`,
    ),
  );
});
