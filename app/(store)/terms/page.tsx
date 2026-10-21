import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/shop/TextPage';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of sale for orders placed with Nine Towers Collection.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <TextPage title="Terms" intro="The short version of how buying from us works." updated="October 2026">
      <h2>Orders</h2>
      <p>
        Sending your bag on WhatsApp is a request to order, not a completed purchase. Your order is confirmed once we reply with stock, the delivery fee and payment details, and you accept.
      </p>
      <h2>Prices</h2>
      <p>
        All prices are in Trinidad & Tobago dollars (TTD). We keep prices and stock as accurate as we can; if something has changed, we’ll tell you before you pay.
      </p>
      <h2>Product details</h2>
      <p>
        Our jewellery is fashion jewellery, not solid gold or silver; the material is listed on each product. Colours can look slightly different on different screens, and some charm bracelets vary slightly in bead colour.
      </p>
      <h2>Delivery and returns</h2>
      <p>
        See <Link href="/delivery-returns">Delivery & Returns</Link>.
      </p>
      <h2>Contact</h2>
      <p>
        {site.name}, {site.country}. WhatsApp {site.whatsappDisplay}.
      </p>
    </TextPage>
  );
}
