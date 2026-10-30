import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminBar } from '@/components/admin/AdminBar';
import { ProductEditor } from '@/components/admin/ProductEditor';
import { requireAdmin } from '@/lib/admin-session';
import { loadProductsFresh } from '@/lib/products-store';

export const metadata: Metadata = { title: 'Edit product' };
export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params, searchParams }: { params: { id: string }; searchParams: { created?: string } }) {
  const { products } = await loadProductsFresh(await requireAdmin());
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();
  return (
    <>
      <AdminBar />
      <main id="main" className="container-x pt-l">
        <ProductEditor key={product.id + product.slug} product={product} created={searchParams.created === '1'} />
      </main>
    </>
  );
}
