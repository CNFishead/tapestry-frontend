import { createAdminPageMetadata } from '@/app/pageMetadata';
import ResourceEditor from '@/features/store/_components/resourceEditor/ResourceEditor.component';

export const metadata = createAdminPageMetadata({
  title: 'Edit Resource',
  description: 'Update a canonical library resource record, release metadata, and presentation assets.',
});

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResourceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ResourceEditor id={id} />;
}
