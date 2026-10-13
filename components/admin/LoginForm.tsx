'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { login, type LoginState } from '@/app/admin/actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      <span className="btn-fill" aria-hidden="true" />
      <span className="btn-roll">
        <span>{pending ? 'Signing in…' : 'Sign in'}</span>
        <span aria-hidden="true">{pending ? 'Signing in…' : 'Sign in'}</span>
      </span>
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useFormState<LoginState, FormData>(login, {});
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="flex flex-col gap-m">
      <input type="hidden" name="next" value={next ?? ''} />
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            autoFocus
            required
            className="field pr-[88px]"
            aria-invalid={!!state.error}
            aria-describedby={state.error ? 'login-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="label absolute right-xs top-1/2 min-h-11 -translate-y-1/2 px-xs text-stone hover:text-obsidian"
            aria-pressed={show}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {state.error && (
          <p id="login-error" role="alert" className="field-error">
            {state.error}
          </p>
        )}
      </div>
      <Submit />
    </form>
  );
}
