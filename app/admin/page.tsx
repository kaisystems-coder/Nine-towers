import type { Metadata } from 'next';
import { AdminBar } from '@/components/admin/AdminBar';
import { ProductTable } from '@/components/admin/ProductTable';
import { requireAdmin } from '@/lib/admin-session';
import { loadProductsFresh } from '@/lib/products-store';

export const metadata: Metadata = { title: 'Products' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const { products, updatedAt } = await loadProductsFresh(await requireAdmin());
  return (
    <>
      <AdminBar />
      <main id="main" className="container-x pb-2xl pt-l">
        <ProductTable products={products} updatedAt={updatedAt} />
      </main>
    </>
  );
}
