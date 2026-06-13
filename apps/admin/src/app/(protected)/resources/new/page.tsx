import { createAdminPageMetadata } from '@/app/pageMetadata';
import ResourceEditor from '@/features/store/_components/resourceEditor/ResourceEditor.component';

export const metadata = createAdminPageMetadata({
  title: 'New Resource',
  description: 'Create a canonical library resource and attach its Cloudinary-backed release metadata.',
});

export default function NewResourcePage() {
  return <ResourceEditor />;
}
