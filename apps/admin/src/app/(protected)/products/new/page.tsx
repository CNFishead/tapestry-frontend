import { createAdminPageMetadata } from '@/app/pageMetadata';
import ProductEditor from '@/features/store/_components/productEditor/ProductEditor.component';

export const metadata = createAdminPageMetadata({
  title: 'New Product',
  description: 'Create a new commerce product and prepare its pricing, presentation, and fulfillment rules.',
});

export default function NewProductPage() {
  return <ProductEditor />;
}
