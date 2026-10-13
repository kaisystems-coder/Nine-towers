import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/shop/TextPage';
import { site } from '@/config/site';
import { formatPrice } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Delivery & Returns',
  description: 'Islandwide delivery across Trinidad & Tobago, pickup, and how exchanges work at Nine Towers Collection.',
  alternates: { canonical: '/delivery-returns' },
};

export default function DeliveryReturnsPage() {
  return (
    <TextPage title="Delivery & Returns" intro="How your order reaches you, and what to do if something isn’t right." updated="October 2026">
      <h2>Delivery</h2>
      <p>
        We deliver across Trinidad & Tobago. Once you send your bag on WhatsApp, we confirm stock, your delivery fee and a delivery window in the chat.
      </p>
      <ul>
        <li>Trinidad: usually 1–3 working days after your order is confirmed.</li>
        <li>Tobago: usually 3–5 working days.</li>
        <li>
          Orders of {formatPrice(site.freeDeliveryThreshold)} or more ship free. Below that, the fee depends on your area and is confirmed before you pay.
        </li>
        <li>Prefer to collect? Choose pickup at checkout. {site.pickupNote}</li>
      </ul>

      <h2>Payment</h2>
      <p>
        No card details are taken on this website. Payment is arranged directly with us on WhatsApp once your order is confirmed, by bank transfer or on delivery where available.
      </p>

      <h2>Exchanges and returns</h2>
      <p>
        If a piece isn’t right, message us within 7 days of delivery. Unworn items in their original packaging, with tags attached, can be exchanged or returned for store credit.
      </p>
      <ul>
        <li>For hygiene reasons, earrings can only be returned if faulty.</li>
        <li>Sale items can be exchanged but not refunded.</li>
        <li>If a piece arrives damaged or faulty, send us a photo on WhatsApp and we’ll replace it at no cost.</li>
      </ul>

      <h2>Questions</h2>
      <p>
        The quickest way to reach us is WhatsApp on {site.whatsappDisplay}, or see the <Link href="/faq">FAQ</Link>.
      </p>
    </TextPage>
  );
}
