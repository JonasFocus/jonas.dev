'use client';

import { useActionState, useRef, type ReactNode } from 'react';
import { saveAdminAction } from './actions';

export function AdminForm({
  operation,
  id,
  children,
  label = 'Save',
  reset = false,
}: {
  operation: string;
  id: string;
  children?: ReactNode;
  label?: string;
  reset?: boolean;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    async (previous: { error?: string; success?: string }, data: FormData) => {
      if (operation === 'follow-up') {
        const dueAt = data.get('dueAt');
        const date = new Date(typeof dueAt === 'string' ? dueAt : '');
        if (!Number.isFinite(date.getTime()))
          return { error: 'Choose a valid follow-up date.' };
        data.set('dueAt', date.toISOString());
      }
      const result = await saveAdminAction(previous, data);
      if (result.success && reset) ref.current?.reset();
      return result;
    },
    {},
  );
  return (
    <form ref={ref} action={action} className="admin-form">
      <input type="hidden" name="operation" value={operation} />
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
