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
    <form ref={ref} action={submit} className="cs-form">
      <input type="hidden" name="id" value={id} />
      <fieldset disabled={pending}>
        {children}
        <div className="cs-form-foot">
          <button className="cs-button" type="submit">
            {pending ? 'Saving…' : label}
          </button>
          <span className="cs-feedback" aria-live="polite" aria-atomic="true">
            {state.error && (
              <span className="cx-bad" role="alert">
                {state.error}
              </span>
            )}
            {state.success && <span className="cx-ok">{state.success}</span>}
          </span>
        </div>
      </fieldset>
    </form>
  );
}
