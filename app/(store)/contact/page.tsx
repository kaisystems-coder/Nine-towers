import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MaskText } from '@/components/motion/MaskText';
import { Reveal } from '@/components/motion/Reveal';
import { ContactForm } from '@/components/forms/ContactForm';
import { InstagramLogo, WhatsappLogo } from '@/components/ui/icons';
import { site } from '@/config/site';
import { buildGeneralMessage, whatsappUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Message Nine Towers Collection on WhatsApp or Instagram. Based in Trinidad & Tobago.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const channels = [
    { Icon: WhatsappLogo, label: 'WhatsApp', value: site.whatsappDisplay, href: whatsappUrl(buildGeneralMessage()), note: 'Fastest. Orders, stock and delivery.' },
    { Icon: InstagramLogo, label: 'Instagram', value: site.socials.instagramHandle, href: site.socials.instagram, note: 'New arrivals and styling.' },
  ];
  return (
    <div className="bg-ivory">
      <header className="bg-cream">
        <div className="container-x pb-xl pt-l md:pb-2xl">
          <Breadcrumbs items={[{ label: 'Contact' }]} />
          <MaskText as="h1" lines={['We’re a message', { text: 'away.', italic: true }]} className="mt-xl font-display text-d-xl" />
          <Reveal delay={0.1}>
            <p className="mt-m max-w-[50ch] text-body-l text-stone">
              Ask about a piece, a colour or a delivery. We reply on WhatsApp the same day, Monday to Saturday.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="container-x grid gap-2xl py-2xl md:grid-cols-12 md:gap-m md:py-3xl">
        <ul className="flex flex-col md:col-span-4">
          {channels.map(({ Icon, label, value, href, note }) => (
            <li key={label} className="border-b border-obsidian/15 first:border-t">
              <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-s py-m">
                <Icon size={24} weight="light" aria-hidden="true" className="mt-[2px] shrink-0" />
                <span className="min-w-0">
                  <span className="label block">{label}</span>
                  <span className="mt-[2px] block break-words font-display text-d-xs transition-transform duration-base ease-brand group-hover:translate-x-1">{value}</span>
                  <span className="mt-[2px] block text-caption text-stone">{note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <section aria-labelledby="form-title" className="md:col-span-7 md:col-start-6">
          <h2 id="form-title" className="font-display text-d-s">
            Send a message
          </h2>
          <p className="mt-xs text-body text-stone">We reply within one working day.</p>
          <div className="mt-l">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
