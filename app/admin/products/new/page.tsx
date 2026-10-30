import type { Metadata } from 'next';
import { AdminBar } from '@/components/admin/AdminBar';
import { ProductEditor } from '@/components/admin/ProductEditor';
import { requireAdmin } from '@/lib/admin-session';

export const metadata: Metadata = { title: 'Add product' };
export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <AdminBar />
      <main id="main" className="container-x pt-l">
        <ProductEditor />
      </main>
    </>
  );
}
