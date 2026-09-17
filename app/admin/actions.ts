'use server';

import { revalidatePath } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';
import { setNewsletterEnabled } from '@/lib/homepage-settings';
import * as crm from '@/lib/crm/mutations';

export type ActionState = { error?: string; success?: string };

export async function saveAdminAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  const value = (key: string) => {
    const entry = data.get(key);
    return typeof entry === 'string' ? entry : '';
  };
  try {
    switch (value('operation')) {
      case 'newsletter':
        await setNewsletterEnabled(value('enabled'));
        revalidatePath('/');
        break;
      case 'status':
        await crm.updateRequest({ id: value('id'), status: value('status') });
        break;
      case 'read':
        await crm.markRead(value('id'));
        break;
      case 'note':
        await crm.addNote({ requestId: value('id'), body: value('body') });
        break;
      case 'follow-up':
        await crm.addFollowUp({
          requestId: value('id'),
          title: value('title'),
          dueAt: value('dueAt'),
        });
        break;
      case 'complete':
        await crm.completeFollowUp(value('id'));
        break;
      case 'convert':
        await crm.convertToCustomer(value('id'));
        break;
      case 'customer':
        await crm.updateCustomer({
          id: value('id'),
          name: value('name'),
          email: value('email'),
          company: value('company'),
          status: value('status'),
        });
        break;
      default:
        return { error: 'This action is not available.' };
    }
    revalidatePath('/admin', 'layout');
    return { success: 'Saved.' };
  } catch (error) {
    unstable_rethrow(error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Could not save. Please try again.',
    };
  }
}
