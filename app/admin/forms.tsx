'use client';

import { useActionState, useRef, type ReactNode } from 'react';
import type { ActionState } from './actions';

type AdminAction = (
  previous: ActionState,
  data: FormData,
) => Promise<ActionState>;

export function AdminForm({
  action,
  id,
  children,
  label = 'Save',
  reset = false,
}: {
  action: AdminAction;
  id: string;
  children?: ReactNode;
  label?: string;
  reset?: boolean;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, submit, pending] = useActionState(
    async (previous: ActionState, data: FormData) => {
      // datetime-local has no zone; convert on the device so the owner's local time is kept.
      for (const input of ref.current?.querySelectorAll<HTMLInputElement>(
        'input[type="datetime-local"]',
      ) ?? []) {
        const date = new Date(input.value);
        if (!Number.isFinite(date.getTime()))
          return { error: 'Choose a valid follow-up date.' };
        data.set(input.name, date.toISOString());
      }
      const result = await action(previous, data);
      if (result.success && reset) ref.current?.reset();
      return result;
    },
    {},
  );
  return (
    <form ref={ref} action={submit} className="admin-form">
      <input type="hidden" name="id" value={id} />
      <fieldset disabled={pending}>
        {children}
        <button className="admin-button" type="submit">
          {pending ? 'Saving…' : label}
        </button>
      </fieldset>
      <div aria-live="polite" aria-atomic="true">
        {state.error && (
          <p className="admin-error" role="alert">
            {state.error}
          </p>
        )}
        {state.success && <p className="admin-success">{state.success}</p>}
      </div>
    </form>
  );
}
