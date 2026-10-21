'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from '@/components/ui/icons';
import { submitWeb3Form } from '@/lib/web3forms';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'sending' | 'done' | 'error';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({
  tone = 'dark',
  source,
  onDone,
  className,
}: {
  tone?: 'dark' | 'light';
  source: string;
  onDone?: () => void;
  className?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const dark = tone === 'dark';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setStatus('error');
      setError('Enter an email address like name@example.com.');
      return;
    }
    setStatus('sending');
    const res = await submitWeb3Form({
      subject: 'New newsletter sign-up',
      email: email.trim(),
      source,
    });
    if (res.ok) {
      setStatus('done');
      onDone?.();
    } else {
      setStatus('error');
      setError(
        res.reason === 'not-configured'
          ? 'Sign-up isn’t connected yet. Message us on WhatsApp to hear about new arrivals.'
          : 'That didn’t go through. Check your connection and try again.'
      );
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'done' ? (
          <motion.p
            key="done"
            role="status"
            className={cn('flex items-start gap-s text-body', dark ? 'text-ivory' : 'text-obsidian')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Check size={20} weight="light" className="mt-[3px] shrink-0 text-champagne" aria-hidden="true" />
            You’re on the list. We’ll email you when new pieces arrive.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={submit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <label htmlFor={id} className={cn('label block', dark ? 'text-mist' : 'text-stone')}>
              Email address
            </label>
            <div
              className={cn(
                'mt-xs flex items-center border-b transition-colors duration-fast ease-brand',
                dark ? 'border-ivory/40 focus-within:border-ivory' : 'border-obsidian/30 focus-within:border-obsidian'
              )}
            >
              <input
                id={id}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? `${id}-err` : undefined}
                placeholder="name@example.com"
                className={cn(
                  'min-h-[52px] min-w-0 flex-1 bg-transparent py-s text-body outline-none focus-visible:outline-none',
                  dark ? 'text-ivory placeholder:text-mist' : 'text-obsidian placeholder:text-stone'
                )}
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className={cn(
                  'label group inline-flex min-h-11 shrink-0 items-center gap-xs pl-s transition-opacity duration-fast disabled:opacity-60',
                  dark ? 'text-ivory' : 'text-obsidian'
                )}
              >
                {status === 'sending' ? 'Joining…' : 'Subscribe'}
                <ArrowRight size={16} weight="light" className="transition-transform duration-base ease-brand group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>
            {status === 'error' && (
              <p id={`${id}-err`} role="alert" className={cn('mt-xs text-body-s', dark ? 'text-ivory' : 'text-error')}>
                {error}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
