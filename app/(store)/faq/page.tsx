import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/shop/TextPage';
import { AccordionItem } from '@/components/ui/Accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/config/site';
import { formatPrice } from '@/lib/format';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Ordering on WhatsApp, payment, delivery across Trinidad & Tobago, returns and caring for your pieces.',
  alternates: { canonical: '/faq' },
};

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: 'Ordering & payment',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Add pieces to your bag, choose “Checkout via WhatsApp” and fill in your details. WhatsApp opens with your order written out; send it and we’ll reply to confirm.',
      },
      {
        q: 'How do I pay?',
        a: 'Payment is arranged with us on WhatsApp after we confirm your order, by bank transfer or on delivery where available. No card details are ever taken on this website.',
      },
      {
        q: 'WhatsApp didn’t open. What now?',
        a: 'Your bag stays saved. Open the bag again and tap “Open WhatsApp again”, or message us directly with your order reference.',
      },
      { q: 'Can I reserve a piece?', a: 'Yes, for 24 hours. Send the piece on WhatsApp and ask us to hold it.' },
    ],
  },
  {
    title: 'Delivery',
    items: [
      { q: 'Where do you deliver?', a: 'Everywhere in Trinidad & Tobago. Trinidad orders usually arrive in 1–3 working days and Tobago in 3–5.' },
      {
        q: 'How much is delivery?',
        a: `Free on orders of ${formatPrice(site.freeDeliveryThreshold)} or more. Otherwise the fee depends on your area and is confirmed in the chat before you pay.`,
      },
      { q: 'Can I collect my order?', a: `Yes. Choose pickup at checkout. ${site.pickupNote}` },
    ],
  },
  {
    title: 'Returns',
    items: [
      { q: 'Can I exchange a piece?', a: 'Yes, within 7 days of delivery if it’s unworn and in its original packaging. Earrings can only be returned if faulty.' },
      { q: 'Something arrived damaged.', a: 'Send us a photo on WhatsApp the day it arrives and we’ll replace it at no cost.' },
    ],
  },
  {
    title: 'Care',
    items: [
      {
        q: 'Will gold-plated jewellery tarnish?',
        a: 'Most of our jewellery is stainless steel, which stands up well to everyday wear. Keep pieces away from perfume, lotion and water, and store them separately.',
      },
      { q: 'How do I clean my luggage?', a: 'Wipe the shell with a damp cloth and mild soap. Clean the wheels after each trip so they keep turning quietly.' },
      { q: 'Do you offer gift wrapping?', a: 'Yes, complimentary on request. Add a gift message in your bag before you check out.' },
    ],
  },
];

export default function FaqPage() {
  return (
    <TextPage title="FAQ" intro="Answers to what people ask us most. Anything else, ask us on WhatsApp.">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: groups
            .flatMap((g) => g.items)
            .map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
        }}
      />
      {groups.map((g) => (
        <section key={g.title} className="mt-xl first:mt-0">
          <h2>{g.title}</h2>
          <div className="mt-s border-t border-obsidian/15">
            {g.items.map((i) => (
              <AccordionItem key={i.q} title={i.q}>
                <p>{i.a}</p>
              </AccordionItem>
            ))}
          </div>
        </section>
      ))}
      <p className="mt-xl">
        Still have a question? <Link href="/contact">Contact us</Link>.
      </p>
    </TextPage>
  );
}
