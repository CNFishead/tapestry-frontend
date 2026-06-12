export type LibraryResourceKind = 'guide' | 'module' | 'dial' | 'quickstart' | 'reference' | 'map' | 'printable' | 'other';
export type LibraryResourceFormat = 'pdf' | 'web' | 'audio' | 'video' | 'archive' | 'external';
export type LibraryResourceAccessPolicy = 'public' | 'entitlement';
export type LibraryResourceStatus = 'draft' | 'published' | 'archived';

export interface LibraryResourceSummary {
  _id: string;
  key: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  kind: LibraryResourceKind;
  format: LibraryResourceFormat;
  status: LibraryResourceStatus;
  accessPolicy: LibraryResourceAccessPolicy;
  createdAt: string;
  updatedAt: string;
}
