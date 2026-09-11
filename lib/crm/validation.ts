import { z } from 'zod';
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().default('');
export const inquirySchema = z
  .object({
    submissionId: z.uuid(),
    name: z.string().trim().min(2, 'Enter your name.').max(120),
    email: z
      .email('Enter a valid email address.')
      .trim()
      .toLowerCase()
      .max(254),
    company: optionalText(160),
    service: z.enum(['website', 'saas', 'web-app', 'other']),
    description: z
      .string()
      .trim()
      .min(20, 'Tell us a little more, at least 20 characters.')
      .max(5000),
    budget: optionalText(120),
    timeline: optionalText(120),
    caseStudy: z.enum(['emerald', 'violet', 'amber']).optional(),
    website: optionalText(200),
    consent: z.literal(true, {
      error: 'Please acknowledge how your details will be used.',
    }),
  })
  .strict();
export const statusSchema = z.enum([
  'new',
  'contacted',
  'qualified',
  'closed',
  'spam',
]);
export const idSchema = z.uuid();
export const requestRecordSchema = z.object({
  id: z.uuid(),
  created_at: z.string(),
  name: z.string(),
  email: z.string(),
  company: z.string().nullable(),
  service: z.string(),
  description: z.string(),
  budget: z.string().nullable(),
  timeline: z.string().nullable(),
  case_study: z.string().nullable(),
  status: statusSchema,
  read_at: z.string().nullable(),
  customer_id: z.uuid().nullable(),
});
export const customerRecordSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  company: z.string().nullable(),
  status: z.enum(['active', 'inactive']),
  created_at: z.string(),
});
export const noteRecordSchema = z.object({
  id: z.uuid(),
  request_id: z.uuid(),
  body: z.string(),
  created_at: z.string(),
});
export const activityRecordSchema = z.object({
  id: z.uuid(),
  request_id: z.uuid(),
  action: z.string(),
  created_at: z.string(),
});
export const followUpRecordSchema = z.object({
  id: z.uuid(),
  request_id: z.uuid(),
  title: z.string(),
  due_at: z.string(),
  completed_at: z.string().nullable(),
  created_at: z.string(),
});
