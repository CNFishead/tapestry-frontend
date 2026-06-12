import { createAdminPageMetadata } from '@/app/pageMetadata';
import StoreList from '@/features/store/_components/storeList/StoreList.component';

export const metadata = createAdminPageMetadata({
  title: 'Store',
  description: 'Browse and manage commerce products, storefront visibility, and fulfillment grants from the admin workspace.',
});

export default function ProductsPage() {
  return <StoreList />;
}
