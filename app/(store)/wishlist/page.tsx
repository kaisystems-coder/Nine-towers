import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { WishlistView } from '@/components/product/WishlistView';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Pieces you’ve saved at Nine Towers Collection.',
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <div className="bg-ivory pb-3xl">
      <div className="container-x pt-l">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        <h1 className="mt-l font-display text-d-l md:mt-xl">Wishlist</h1>
        <div className="mt-l md:mt-xl">
          <WishlistView />
        </div>
      </div>
    </div>
  );
}
