import { createAdminPageMetadata } from '@/app/pageMetadata';
import ProductEditor from '@/features/store/_components/productEditor/ProductEditor.component';

export const metadata = createAdminPageMetadata({
  title: 'Edit Product',
  description: 'Update a commerce product record, its storefront visibility, and the connected fulfillment grants.',
});

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductEditor id={id} />;
}
