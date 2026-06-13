import { createAdminPageMetadata } from '@/app/pageMetadata';
import ResourceList from '@/features/store/_components/resourceList/ResourceList.component';

export const metadata = createAdminPageMetadata({
  title: 'Resources',
  description: 'Browse and manage canonical library resources used by the store and entitlement flows.',
});

export default function ResourcesPage() {
  return <ResourceList />;
}
