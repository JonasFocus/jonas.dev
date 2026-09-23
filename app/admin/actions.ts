'use server';

import { revalidatePath } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';
import { setNewsletterEnabled } from '@/lib/homepage-settings';
import * as crm from '@/lib/crm/mutations';

export type ActionState = { error?: string; success?: string };

function field(data: FormData, key: string) {
  const entry = data.get(key);
  return typeof entry === 'string' ? entry : '';
}

async function save(change: () => Promise<unknown>): Promise<ActionState> {
  try {
    await change();
  } catch (error) {
    unstable_rethrow(error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Could not save. Please try again.',
    };
  }
  revalidatePath('/admin', 'layout');
  return { success: 'Saved.' };
}

export async function setNewsletterAction(
  _previous: ActionState,
  data: FormData,
) {
  return save(async () => {
    await setNewsletterEnabled(field(data, 'enabled'));
    revalidatePath('/');
  });
}

export async function updateRequestStatusAction(
  _previous: ActionState,
  data: FormData,
) {
  return save(() =>
    crm.updateRequest({ id: field(data, 'id'), status: field(data, 'status') }),
  );
}

export async function markRequestReadAction(
  _previous: ActionState,
  data: FormData,
) {
  return save(() => crm.markRead(field(data, 'id')));
}

export async function addNoteAction(_previous: ActionState, data: FormData) {
  return save(() =>
    crm.addNote({ requestId: field(data, 'id'), body: field(data, 'body') }),
  );
}

export async function addFollowUpAction(
  _previous: ActionState,
  data: FormData,
) {
  return save(() =>
    crm.addFollowUp({
      requestId: field(data, 'id'),
      title: field(data, 'title'),
      dueAt: field(data, 'dueAt'),
    }),
  );
}

export async function completeFollowUpAction(
  _previous: ActionState,
  data: FormData,
) {
  return save(() => crm.completeFollowUp(field(data, 'id')));
}

export async function convertToCustomerAction(
  _previous: ActionState,
  data: FormData,
) {
  return save(() => crm.convertToCustomer(field(data, 'id')));
}

export async function updateCustomerAction(
  _previous: ActionState,
  data: FormData,
) {
  return save(() =>
    crm.updateCustomer({
      id: field(data, 'id'),
      name: field(data, 'name'),
      email: field(data, 'email'),
      company: field(data, 'company'),
      status: field(data, 'status'),
    }),
  );
}
