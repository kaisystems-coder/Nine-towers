import type { Metadata } from 'next';
import { TextPage } from '@/components/shop/TextPage';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Nine Towers Collection handles your information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy" intro="We collect as little as we need to deliver your order, and we never sell it." updated="October 2026">
      <h2>What we collect</h2>
      <ul>
        <li>When you order: your name, phone number, delivery area and address, sent by you in a WhatsApp message.</li>
        <li>When you join the list or use the contact form: your email address and anything you write to us.</li>
        <li>On this website: your bag, wishlist and recently viewed pieces are stored in your own browser, not on our servers.</li>
        <li>Anonymous visit statistics (pages viewed, device type) through Vercel Analytics. No cookies are used for this.</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        To confirm and deliver your order, to reply to your messages and, if you joined the list, to send occasional emails about new arrivals. You can unsubscribe at any time.
      </p>
      <h2>Who we share it with</h2>
      <p>
        Only the services that make this possible: WhatsApp for orders, Web3Forms for website forms, and our delivery partners for your address. We do not sell or rent your information.
      </p>
      <h2>Your choices</h2>
      <p>Ask us to see, correct or delete your details at any time by messaging us on WhatsApp at {site.whatsappDisplay}.</p>
    </TextPage>
  );
}
