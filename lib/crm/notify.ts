import type { z } from 'zod';
import type { inquirySchema } from './validation';

type Inquiry = Pick<
  z.infer<typeof inquirySchema>,
  | 'name'
  | 'email'
  | 'company'
  | 'service'
  | 'budget'
  | 'timeline'
  | 'description'
>;

// Slack only treats &, < and > as control characters; escaping them blocks injected links and mentions.
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function formatInquiryAlert(
  inquiry: Inquiry,
  reference: string,
  appUrl: string | undefined,
) {
  const description =
    inquiry.description.length > 300
      ? `${inquiry.description.slice(0, 300)}...`
      : inquiry.description;
  const lines = [
    `*New inquiry from ${escape(inquiry.name)}* (${escape(inquiry.email)})`,
    inquiry.company && `Company: ${escape(inquiry.company)}`,
    `Services: ${inquiry.service.join(', ')}`,
    inquiry.budget && `Budget: ${escape(inquiry.budget)}`,
    inquiry.timeline && `Timeline: ${escape(inquiry.timeline)}`,
    `> ${escape(description).replace(/\n/g, '\n> ')}`,
    appUrl && `<${appUrl}/admin/requests/${reference}|Open in admin>`,
  ];
  return { text: lines.filter(Boolean).join('\n') };
}

export async function sendInquiryAlert(inquiry: Inquiry, reference: string) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        formatInquiryAlert(inquiry, reference, process.env.APP_URL),
      ),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok)
      console.error(
        `Slack alert for request ${reference} failed with status ${response.status}`,
      );
  } catch (error) {
    // Log only the error name: messages can include the secret webhook URL.
    console.error(
      `Slack alert for request ${reference} failed: ${error instanceof Error ? error.name : 'unknown error'}`,
    );
  }
}
