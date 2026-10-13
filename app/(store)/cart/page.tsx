import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CartPageView } from '@/components/cart/CartPageView';

export const metadata: Metadata = {
  title: 'Your Bag',
  description: 'Review your bag and send your order to Nine Towers Collection on WhatsApp.',
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="bg-ivory pb-3xl">
      <div className="container-x pt-l">
        <Breadcrumbs items={[{ label: 'Your Bag' }]} />
        <h1 className="mt-l font-display text-d-l md:mt-xl">Your Bag</h1>
        <div className="mt-l md:mt-xl">
          <CartPageView />
        </div>
      </div>
    </div>
  );
}
