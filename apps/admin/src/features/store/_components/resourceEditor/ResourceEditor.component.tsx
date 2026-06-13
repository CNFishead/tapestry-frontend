'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormField,
  FormGroup,
  Loader,
  Modal,
  SelectField,
  Tabs,
  TagInputField,
  TextAreaField,
  TextField,
  Upload,
  useAlert,
  useForm,
  type SelectOption,
  type UploadFile,
  type UseFormReturn,
} from '@tapestry/ui';
import {
  RESOURCE_ACCESS_POLICY_OPTIONS,
  RESOURCE_FORMAT_OPTIONS,
  RESOURCE_KIND_OPTIONS,
  RESOURCE_STATUS_OPTIONS,
  createDefaultResourceFormValues,
  formatBytes,
  formatDate,
  resourceFormValidators,
  resourceFormatAccept,
  slugifyValue,
  toResourceFormValues,
  toResourcePayload,
} from '../../resource.helpers';
import type { ResourceEditorFormValues } from '../../resource.types';
import { useCreateStoreResource, useDeleteStoreResource, useStoreResource, useUpdateStoreResource, useUploadStoreResourceFile } from '../../_hooks/useStoreResources';
import styles from './ResourceEditor.module.scss';

type ResourceEditorProps = {
  id?: string;
};

function deriveApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function createSyntheticUploadFile(values: ResourceEditorFormValues): UploadFile[] {
  if (!values.releaseAssetKey.trim()) {
    return [];
  }

  return [
    {
      uid: `existing-${values.releaseAssetKey}`,
      name: values.releaseAssetKey.split('/').pop() || values.releaseAssetKey,
      size: values.releaseSizeBytes ?? 0,
      type: values.releaseMimeType || 'application/octet-stream',
      status: 'done',
    },
  ];
}

export default function ResourceEditor({ id }: ResourceEditorProps) {
  const router = useRouter();
  const { addAlert } = useAlert();
  const isNew = !id;
  const loadedSnapshotRef = useRef<string | null>(null);

  const resourceQuery = useStoreResource(id);
  const createResource = useCreateStoreResource();
  const updateResource = useUpdateStoreResource();
  const deleteResource = useDeleteStoreResource();
  const uploadResourceFile = useUploadStoreResourceFile();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string>('');
  const [uploadResourceType, setUploadResourceType] = useState<string>('');

  const form = useForm<ResourceEditorFormValues>({
    initialValues: createDefaultResourceFormValues(),
    validators: resourceFormValidators,
    onSubmit: async (values, api) => {
      const payload = toResourcePayload(values);

      try {
        if (isNew) {
          const result = await createResource.mutateAsync(payload);
          addAlert({
            type: 'success',
            message: 'Resource created',
            description: 'The canonical library resource has been created successfully.',
          });
          router.push(`/resources/${result.payload}`);
          return;
        }

        const result = await updateResource.mutateAsync({
          id: id!,
          payload,
        });

        api.replaceValues(toResourceFormValues(result.payload));
        loadedSnapshotRef.current = `${result.payload._id}:${result.payload.updatedAt}`;

        addAlert({
          type: 'success',
          message: 'Resource saved',
          description: 'Your library resource changes have been saved successfully.',
        });
      } catch (error) {
        addAlert({
          type: 'error',
          message: isNew ? 'Create failed' : 'Save failed',
          description: deriveApiErrorMessage(error, isNew ? 'Failed to create resource.' : 'Failed to save resource.'),
        });
      }
    },
  });

  const resetToCurrentSnapshot = useCallback(() => {
    if (isNew) {
      const defaults = createDefaultResourceFormValues();
      form.replaceValues(defaults);
      setFileList([]);
      setUploadPreviewUrl('');
      setUploadResourceType('');
      return;
    }

    const resource = resourceQuery.data?.payload;
    if (!resource) {
      form.reset();
      return;
    }

    const nextValues = toResourceFormValues(resource);
    form.replaceValues(nextValues);
    setFileList(createSyntheticUploadFile(nextValues));
    setUploadPreviewUrl('');
    setUploadResourceType('');
  }, [form, isNew, resourceQuery.data?.payload]);

  useEffect(() => {
    const resource = resourceQuery.data?.payload;
    if (!resource) return;

    const nextSnapshot = `${resource._id}:${resource.updatedAt}`;
    if (loadedSnapshotRef.current === nextSnapshot) return;

    const nextValues = toResourceFormValues(resource);
    form.replaceValues(nextValues);
    setFileList(createSyntheticUploadFile(nextValues));
    setUploadPreviewUrl('');
    setUploadResourceType('');
    loadedSnapshotRef.current = nextSnapshot;
  }, [form, resourceQuery.data?.payload]);

  const disabled = createResource.isPending || updateResource.isPending || deleteResource.isPending;
  const resourceTitle = form.values.title || (isNew ? 'New Resource' : 'Edit Resource');

  const beforeUpload = useCallback(
    (file: File) => {
      const maxBytes = 100 * 1024 * 1024;
      if (file.size > maxBytes) {
        addAlert({
          type: 'error',
          message: 'File must be smaller than 100MB.',
        });
        return false;
      }

      if (form.values.format === 'pdf' && !file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        addAlert({
          type: 'error',
          message: 'PDF resources should upload a .pdf file.',
        });
        return false;
      }

      return true;
    },
    [addAlert, form.values.format]
  );

  const handleFileChange = useCallback(
    async (info: { file: UploadFile; fileList: UploadFile[] }) => {
      if (!info.file.originFile) {
        setFileList(info.fileList);
        return;
      }

      const uploadingFile: UploadFile = {
        ...info.file,
        status: 'uploading',
      };

      setFileList([uploadingFile]);

      try {
        const result = await uploadResourceFile.mutateAsync({
          file: info.file.originFile,
          type: form.values.format,
        });
        const asset = result.payload[0];

        if (!asset) {
          throw new Error('Upload completed without asset metadata.');
        }

        setFileList([
          {
            ...uploadingFile,
            status: 'done',
            name: asset.fileName,
            size: asset.bytes,
            type: asset.mimeType,
          },
        ]);
        setUploadPreviewUrl(asset.url);
        setUploadResourceType(asset.resourceType);
        form.setValues(
          {
            releaseProvider: 'cloudinary',
            releaseAssetKey: asset.assetKey,
            releaseMimeType: asset.mimeType,
            releaseSizeBytes: asset.bytes,
          },
          { validate: true, touch: true }
        );

        addAlert({
          type: 'success',
          message: 'File uploaded',
          description: 'Cloudinary metadata has been attached to the resource release.',
        });
      } catch (error) {
        const message = deriveApiErrorMessage(error, 'Failed to upload the canonical resource file.');
        setFileList([
          {
            ...uploadingFile,
            status: 'error',
            error: message,
          },
        ]);

        addAlert({
          type: 'error',
          message: 'Upload failed',
          description: message,
        });
      }
    },
    [addAlert, form, form.values, uploadResourceFile]
  );

  const tabItems = useMemo(
    () => [
      {
        key: 'basics',
        label: 'Basics',
        children: <ResourceBasicsTab form={form} disabled={disabled} />,
      },
      {
        key: 'presentation',
        label: 'Presentation',
        children: <ResourcePresentationTab form={form} disabled={disabled} />,
      },
      {
        key: 'release',
        label: 'Release',
        children: (
          <ResourceReleaseTab
            form={form}
            disabled={disabled}
            fileList={fileList}
            onFileChange={handleFileChange}
            onFileRemove={async () => {
              setFileList([]);
              setUploadPreviewUrl('');
              setUploadResourceType('');
              form.setValues(
                {
                  releaseAssetKey: '',
                  releaseMimeType: '',
                  releaseSizeBytes: undefined,
                },
                { validate: true, touch: true }
              );
              return true;
            }}
            beforeUpload={beforeUpload}
            isUploading={uploadResourceFile.isPending}
            uploadPreviewUrl={uploadPreviewUrl}
            uploadResourceType={uploadResourceType}
          />
        ),
      },
    ],
    [beforeUpload, disabled, fileList, form, handleFileChange, uploadPreviewUrl, uploadResourceFile.isPending, uploadResourceType]
  );

  if (!isNew && resourceQuery.isLoading) {
    return (
      <div className={styles.page}>
        <Card>
          <CardBody className={styles.stateCard}>
            <Loader caption="Loading resource..." />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!isNew && (resourceQuery.isError || !resourceQuery.data?.payload)) {
    return (
      <div className={styles.page}>
        <Card>
          <CardBody className={styles.stateCard}>
            <div className={styles.stateTitle}>Resource not found</div>
            <p className={styles.stateText}>This resource could not be loaded. It may have been removed or the id is invalid.</p>
            <div className={styles.stateActions}>
              <Button variant="outline" tone="neutral" onClick={() => router.push('/resources')}>
                Back to Resources
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerCopy}>
          <p className={styles.eyebrow}>Library Admin</p>
          <h1 className={styles.title}>{resourceTitle}</h1>
          <p className={styles.subtitle}>
            {isNew
              ? 'Create the canonical library resource, upload its Cloudinary-backed document, and prepare it for future commerce grants.'
              : 'Update the canonical library resource record, its delivery metadata, and the imagery used around it.'}
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="ghost" tone="neutral" onClick={() => router.push('/resources')}>
            Back to Resources
          </Button>
          <Button variant="ghost" tone="neutral" onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>

      <Form form={form} className={styles.form}>
        <Tabs items={tabItems} defaultActiveKey="basics" variant="pills" fit="equal" contentClassName={styles.tabsContent} />

        <div className={styles.footer}>
          <div className={styles.footerActions}>
            <Button type="submit" variant="solid" tone="gold" disabled={disabled || !form.isValid || uploadResourceFile.isPending}>
              {createResource.isPending ? 'Creating...' : updateResource.isPending ? 'Saving...' : isNew ? 'Create Resource' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              tone="neutral"
              onClick={resetToCurrentSnapshot}
              disabled={disabled}
            >
              Reset
            </Button>
          </div>

          {!isNew ? (
            <div className={styles.footerDanger}>
              <Button type="button" variant="outline" tone="danger" onClick={() => setDeleteModalOpen(true)} disabled={disabled}>
                Delete Resource
              </Button>
            </div>
          ) : null}
        </div>
      </Form>

      <Modal
        open={deleteModalOpen}
        title="Delete Resource"
        onCancel={() => setDeleteModalOpen(false)}
        onOk={async () => {
          if (!id) return;

          try {
            await deleteResource.mutateAsync(id);
            addAlert({
              type: 'success',
              message: 'Resource deleted',
              description: 'The library resource has been deleted successfully.',
            });
            router.push('/resources');
          } catch (error) {
            addAlert({
              type: 'error',
              message: 'Delete failed',
              description: deriveApiErrorMessage(error, 'Failed to delete resource.'),
            });
          }
        }}
        confirmLoading={deleteResource.isPending}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ tone: 'danger' }}
      >
        <p>
          Are you sure you want to delete <strong>{form.values.title || form.values.slug || form.values.key}</strong>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

function ResourceBasicsTab({ form, disabled }: { form: UseFormReturn<ResourceEditorFormValues>; disabled: boolean }) {
  return (
    <Card>
      <CardHeader className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Identity & Access</h2>
          <p className={styles.sectionSubtitle}>Describe the library resource itself and how it should be exposed to players.</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          tone="neutral"
          onClick={() => {
            const derived = slugifyValue(form.values.title);
            form.setValue('key', derived, { touch: true, validate: true });
            form.setValue('slug', derived, { touch: true, validate: true });
          }}
          disabled={disabled || !form.values.title.trim()}
        >
          Derive Key & Slug
        </Button>
      </CardHeader>
      <CardBody className={styles.formBody}>
        <FormGroup>
          <FormField name="title">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="Title"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                disabled={disabled}
              />
            )}
          </FormField>
          <FormField name="subtitle">
            {(field) => (
              <TextField floatingLabel id={field.id} label="Subtitle" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
            )}
          </FormField>
        </FormGroup>

        <FormGroup>
          <FormField name="key">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="Key"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                helpText="Slug-like identifier used across the library and store."
                disabled={disabled}
              />
            )}
          </FormField>
          <FormField name="slug">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="Slug"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                helpText="Preferred public-facing path segment."
                disabled={disabled}
              />
            )}
          </FormField>
        </FormGroup>

        <FormField name="summary">
          {(field) => (
            <TextAreaField floatingLabel id={field.id} label="Summary" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} rows={3} disabled={disabled} />
          )}
        </FormField>

        <FormField name="description">
          {(field) => (
            <TextAreaField floatingLabel id={field.id} label="Description" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} rows={6} disabled={disabled} />
          )}
        </FormField>

        <FormGroup>
          <FormField name="kind">
            {(field) => (
              <SelectField
                floatingLabel
                id={field.id}
                label="Kind"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={RESOURCE_KIND_OPTIONS as unknown as SelectOption[]}
                disabled={disabled}
              />
            )}
          </FormField>
          <FormField name="format">
            {(field) => (
              <SelectField
                floatingLabel
                id={field.id}
                label="Format"
                value={field.value as string}
                onChange={(event) => {
                  field.onChange(event);
                }}
                onBlur={field.onBlur}
                options={RESOURCE_FORMAT_OPTIONS as unknown as SelectOption[]}
                disabled={disabled}
              />
            )}
          </FormField>
        </FormGroup>

        <FormGroup>
          <FormField name="status">
            {(field) => (
              <SelectField
                floatingLabel
                id={field.id}
                label="Status"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={RESOURCE_STATUS_OPTIONS as unknown as SelectOption[]}
                disabled={disabled}
              />
            )}
          </FormField>
          <FormField name="accessPolicy">
            {(field) => (
              <SelectField
                floatingLabel
                id={field.id}
                label="Access Policy"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={RESOURCE_ACCESS_POLICY_OPTIONS as unknown as SelectOption[]}
                disabled={disabled}
              />
            )}
          </FormField>
        </FormGroup>

        <FormGroup>
          <FormField name="tags">
            {(field) => (
              <TagInputField
                floatingLabel
                id={field.id}
                label="Tags"
                value={field.value as string[]}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={disabled}
                placeholder="Type a tag and press comma or enter..."
              />
            )}
          </FormField>
          <FormField name="authors">
            {(field) => (
              <TagInputField
                floatingLabel
                id={field.id}
                label="Authors"
                value={field.value as string[]}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={disabled}
                placeholder="Type an author and press comma or enter..."
              />
            )}
          </FormField>
        </FormGroup>

        <FormField name="publishedAt">
          {(field) => (
            <TextField floatingLabel id={field.id} label="Published Date" type="date" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
          )}
        </FormField>
      </CardBody>
    </Card>
  );
}

function ResourcePresentationTab({ form, disabled }: { form: UseFormReturn<ResourceEditorFormValues>; disabled: boolean }) {
  return (
    <Card>
      <CardHeader className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Presentation</h2>
          <p className={styles.sectionSubtitle}>Optional artwork and thumbnails used to present this resource around the store and library surfaces.</p>
        </div>
      </CardHeader>
      <CardBody className={styles.formBody}>
        <FormGroup>
          <FormField name="coverImageUrl">
            {(field) => (
              <TextField floatingLabel id={field.id} label="Cover Image URL" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
            )}
          </FormField>
          <FormField name="thumbnailImageUrl">
            {(field) => (
              <TextField floatingLabel id={field.id} label="Thumbnail URL" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
            )}
          </FormField>
        </FormGroup>

        <FormGroup>
          <FormField name="spineImageUrl">
            {(field) => (
              <TextField floatingLabel id={field.id} label="Spine Image URL" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
            )}
          </FormField>
          <FormField name="bannerImageUrl">
            {(field) => (
              <TextField floatingLabel id={field.id} label="Banner Image URL" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
            )}
          </FormField>
        </FormGroup>
      </CardBody>
    </Card>
  );
}

function ResourceReleaseTab({
  form,
  disabled,
  fileList,
  onFileChange,
  onFileRemove,
  beforeUpload,
  isUploading,
  uploadPreviewUrl,
  uploadResourceType,
}: {
  form: UseFormReturn<ResourceEditorFormValues>;
  disabled: boolean;
  fileList: UploadFile[];
  onFileChange: (info: { file: UploadFile; fileList: UploadFile[] }) => Promise<void>;
  onFileRemove: (file: UploadFile) => Promise<boolean>;
  beforeUpload: (file: File, fileList: File[]) => boolean | Promise<boolean>;
  isUploading: boolean;
  uploadPreviewUrl: string;
  uploadResourceType: string;
}) {
  return (
    <Card>
      <CardHeader className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Canonical Release</h2>
          <p className={styles.sectionSubtitle}>Upload the Cloudinary-backed document first, then save the resource with the returned metadata in `currentRelease`.</p>
        </div>
      </CardHeader>
      <CardBody className={styles.formBody}>
        <FormGroup>
          <FormField name="releaseVersion">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="Release Version"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                disabled={disabled}
              />
            )}
          </FormField>
          <TextField floatingLabel label="Provider" value="cloudinary" disabled />
        </FormGroup>

        <Upload
          accept={resourceFormatAccept(form.values.format)}
          multiple={false}
          maxCount={1}
          disabled={disabled || isUploading}
          fileList={fileList}
          onChange={onFileChange}
          onRemove={onFileRemove}
          beforeUpload={beforeUpload}
          dropzoneText="Upload canonical resource file"
          dropzoneHint="This posts to `/api/v1/upload/cloudinary/file` and maps the returned metadata into the resource release."
        />

        <div className={styles.notice}>
          The library now assumes `/api/v1/library/resources` is live. Upload first so `assetKey`, `mimeType`, and `sizeBytes` are present before saving.
        </div>

        <div className={styles.metaStrip}>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Asset Key</span>
            <strong className={styles.metaValue}>{form.values.releaseAssetKey || '--'}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>MIME Type</span>
            <strong className={styles.metaValue}>{form.values.releaseMimeType || '--'}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Size</span>
            <strong className={styles.metaValue}>{formatBytes(form.values.releaseSizeBytes)}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Resource Type</span>
            <strong className={styles.metaValue}>{uploadResourceType || '--'}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Current Release Published</span>
            <strong className={styles.metaValue}>{formatDate(form.values.releasePublishedAt ? `${form.values.releasePublishedAt}T00:00:00.000Z` : undefined)}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Delivery URL</span>
            <strong className={styles.metaValue}>{uploadPreviewUrl || '--'}</strong>
          </div>
        </div>

        <FormGroup>
          <FormField name="releasePublishedAt">
            {(field) => (
              <TextField floatingLabel id={field.id} label="Release Published Date" type="date" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
            )}
          </FormField>
          <FormField name="releaseAssetKey">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="Asset Key"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                helpText="Populated automatically from the Cloudinary upload response."
                disabled
              />
            )}
          </FormField>
        </FormGroup>

        <FormGroup>
          <FormField name="releaseMimeType">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="MIME Type"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                disabled
              />
            )}
          </FormField>
          <FormField name="releaseSizeBytes">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="Size (bytes)"
                type="number"
                value={field.value as number | undefined}
                valueMode="number"
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                disabled
              />
            )}
          </FormField>
        </FormGroup>
      </CardBody>
    </Card>
  );
}
