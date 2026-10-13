'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretDown, Check } from '@/components/ui/icons';
import { submitWeb3Form } from '@/lib/web3forms';
import { EASE } from '@/lib/motion';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name.'),
  email: z.string().trim().email('Enter an email address like name@example.com.'),
  phone: z.string().trim().optional(),
  topic: z.string().min(1, 'Choose what your message is about.'),
  message: z.string().trim().min(10, 'Tell us a little more, at least 10 characters.').max(2000),
  botcheck: z.string().optional(),
});
type Values = z.infer<typeof schema>;

const topics = ['A product question', 'An order I placed', 'Delivery or pickup', 'Returns or exchanges', 'Something else'];

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { topic: '' } });

  const onSubmit = async (v: Values) => {
    if (v.botcheck) return; // honeypot
    const res = await submitWeb3Form({
      subject: `Website enquiry: ${v.topic}`,
      name: v.name,
      email: v.email,
      phone: v.phone ?? '',
      topic: v.topic,
      message: v.message,
    });
    if (res.ok) {
      setStatus('done');
      reset();
    } else {
      setStatus('error');
      setError(
        res.reason === 'not-configured'
          ? 'The contact form isn’t connected yet. Please message us on WhatsApp instead.'
          : 'Your message didn’t send. Check your connection and try again, or message us on WhatsApp.'
      );
    }
  };

  const err = (k: keyof Values) =>
    errors[k] && (
      <p id={`c-${k}-error`} role="alert" className="field-error">
        {errors[k]?.message}
      </p>
    );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'done' ? (
        <motion.div key="done" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-obsidian text-ivory">
            <Check size={26} weight="light" aria-hidden="true" />
          </span>
          <p className="mt-m font-display text-d-s">Message sent.</p>
          <p className="mt-xs text-body text-stone">We reply within one working day, usually much sooner.</p>
          <button type="button" onClick={() => setStatus('idle')} className="link-u is-underlined mt-m min-h-11 text-body-s">
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={handleSubmit(onSubmit)} className="grid min-w-0 gap-m sm:grid-cols-2" exit={{ opacity: 0 }}>
          <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" {...register('botcheck')} />
          <div className="min-w-0">
            <label htmlFor="c-name" className="field-label">
              Name *
            </label>
            <input id="c-name" autoComplete="name" className="field" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-error' : undefined} {...register('name')} />
            {err('name')}
          </div>
          <div className="min-w-0">
            <label htmlFor="c-email" className="field-label">
              Email *
            </label>
            <input id="c-email" type="email" inputMode="email" autoComplete="email" className="field" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-email-error' : undefined} {...register('email')} />
            {err('email')}
          </div>
          <div className="min-w-0">
            <label htmlFor="c-phone" className="field-label">
              Phone <span className="normal-case tracking-normal text-stone">(optional)</span>
            </label>
            <input id="c-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="868 712 4590" className="field" {...register('phone')} />
          </div>
          <div className="min-w-0">
            <label htmlFor="c-topic" className="field-label">
              About *
            </label>
            <div className="relative min-w-0">
              <select id="c-topic" className="field min-w-0 cursor-pointer appearance-none pr-xl" aria-invalid={!!errors.topic} aria-describedby={errors.topic ? 'c-topic-error' : undefined} {...register('topic')}>
                <option value="">Choose a topic</option>
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <CaretDown size={16} weight="light" aria-hidden="true" className="pointer-events-none absolute right-s top-1/2 -translate-y-1/2" />
            </div>
            {err('topic')}
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label htmlFor="c-message" className="field-label">
              Message *
            </label>
            <textarea id="c-message" rows={5} className="field resize-y" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-message-error' : undefined} {...register('message')} />
            {err('message')}
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full sm:w-auto">
              <span className="btn-fill" aria-hidden="true" />
              <span className="btn-roll">
                <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
                <span aria-hidden="true">{isSubmitting ? 'Sending…' : 'Send message'}</span>
              </span>
            </button>
            {status === 'error' && (
              <p role="alert" className="field-error mt-s">
                {error}
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
