import type { Metadata } from 'next';
import { AdminBar } from '@/components/admin/AdminBar';
import { ProductTable } from '@/components/admin/ProductTable';
import { loadProductsFresh } from '@/lib/products-store';

export const metadata: Metadata = { title: 'Products' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const { products, updatedAt, source } = await loadProductsFresh();
  return (
    <>
      <AdminBar />
      <main id="main" className="container-x pb-2xl pt-l">
        <ProductTable products={products} updatedAt={updatedAt} source={source} />
      </main>
    </>
  );
}
