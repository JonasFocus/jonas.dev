import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { revalidateTag } from 'next/cache';
import { requireOwner } from '@/lib/crm/auth';
import { z } from 'zod';

const settingsSchema = z.object({ newsletter_enabled: z.boolean() });
const settingsTag = 'homepage-settings';

export async function getNewsletterEnabled() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Toggles revalidate the tag; the hourly window only recovers from a failed read.
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          next: { revalidate: 3600, tags: [settingsTag] },
        }),
    },
  });
  try {
    const { data, error } = await client
      .from('homepage_settings')
      .select('newsletter_enabled')
      .eq('id', true)
      .single();
    if (error) return false;
    const parsed = settingsSchema.safeParse(data);
    return parsed.success && parsed.data.newsletter_enabled;
  } catch {
    return false;
  }
}

export async function getOwnerNewsletterEnabled() {
  const { supabase } = await requireOwner();
  const { data, error } = await supabase
    .from('homepage_settings')
    .select('newsletter_enabled')
    .eq('id', true)
    .single();
  if (error) throw new Error('Could not load homepage settings.');
  return settingsSchema.parse(data).newsletter_enabled;
}

export async function setNewsletterEnabled(value: string) {
  const { supabase } = await requireOwner();
  const enabled = z.enum(['true', 'false']).parse(value) === 'true';
  const { data, error } = await supabase
    .from('homepage_settings')
    .update({ newsletter_enabled: enabled })
    .eq('id', true)
    .select('newsletter_enabled')
    .single();
  if (error || settingsSchema.parse(data).newsletter_enabled !== enabled)
    throw new Error('Could not save newsletter visibility. Please try again.');
  revalidateTag(settingsTag, { expire: 0 });
}
