'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
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
  useAlert,
  useForm,
  type SelectOption,
  type UseFormReturn,
} from '@tapestry/ui';
import type { CreateProductInput } from '@tapestry/types';
import type { ProductGrantPermission } from '@tapestry/types';
import { createLibraryResourceOptionLabel, useCreateStoreProduct, useDeleteStoreProduct, useLibraryResources, useStoreProduct, useUpdateStoreProduct } from '../../_hooks/useStoreProducts';
import {
  createDefaultProductFormValues,
  createEmptyGalleryEntry,
  createEmptyGrant,
  formatCurrencyCents,
  productFormValidators,
  slugifyValue,
  STORE_FULFILLMENT_KIND_OPTIONS,
  STORE_PRICING_TYPE_OPTIONS,
  STORE_STATUS_OPTIONS,
  STORE_VISIBILITY_OPTIONS,
  toProductFormValues,
  toProductPayload,
} from '../../store.helpers';
import type { ProductEditorFormValues } from '../../store.types';
import styles from './ProductEditor.module.scss';

type ProductEditorProps = {
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

export default function ProductEditor({ id }: ProductEditorProps) {
  const router = useRouter();
  const { addAlert } = useAlert();
  const isNew = !id;
  const loadedSnapshotRef = useRef<string | null>(null);

  const productQuery = useStoreProduct(id);
  const libraryResourcesQuery = useLibraryResources({
    pageNumber: 1,
    pageLimit: 200,
    sortOptions: 'title',
  });
  const createProduct = useCreateStoreProduct();
  const updateProduct = useUpdateStoreProduct();
  const deleteProduct = useDeleteStoreProduct();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const form = useForm<ProductEditorFormValues>({
    initialValues: createDefaultProductFormValues(),
    validators: productFormValidators,
    onSubmit: async (values, api) => {
      const payload = toProductPayload(values);

      try {
        if (isNew) {
          const result = await createProduct.mutateAsync(payload);
          addAlert({
            type: 'success',
            message: 'Product created',
            description: 'The store product has been created successfully.',
          });
          router.push(`/products/${result.payload}`);
          return;
        }

        const result = await updateProduct.mutateAsync({
          id: id!,
          payload: payload as Partial<CreateProductInput>,
        });

        api.replaceValues(toProductFormValues(result.payload));
        loadedSnapshotRef.current = `${result.payload._id}:${result.payload.updatedAt}`;

        addAlert({
          type: 'success',
          message: 'Product saved',
          description: 'Your store changes have been saved successfully.',
        });
      } catch (error) {
        addAlert({
          type: 'error',
          message: isNew ? 'Create failed' : 'Save failed',
          description: deriveApiErrorMessage(error, isNew ? 'Failed to create product.' : 'Failed to save product.'),
        });
      }
    },
  });

  useEffect(() => {
    const product = productQuery.data?.payload;
    if (!product) return;

    const nextSnapshot = `${product._id}:${product.updatedAt}`;
    if (loadedSnapshotRef.current === nextSnapshot) return;

    form.replaceValues(toProductFormValues(product));
    loadedSnapshotRef.current = nextSnapshot;
  }, [form, productQuery.data?.payload]);

  const disabled = createProduct.isPending || updateProduct.isPending || deleteProduct.isPending;
  const resourceOptions = useMemo<SelectOption[]>(
    () =>
      (libraryResourcesQuery.data?.payload ?? []).map((resource) => ({
        label: createLibraryResourceOptionLabel(resource),
        value: resource._id,
      })),
    [libraryResourcesQuery.data?.payload]
  );

  const productTitle = form.values.title || (isNew ? 'New Product' : 'Edit Product');

  const tabItems = useMemo(
    () => [
      {
        key: 'basics',
        label: 'Basics',
        children: <BasicsTab form={form} disabled={disabled} />,
      },
      {
        key: 'pricing',
        label: 'Pricing',
        children: <PricingTab form={form} disabled={disabled} />,
      },
      {
        key: 'presentation',
        label: 'Presentation',
        children: <PresentationTab form={form} disabled={disabled} />,
      },
      {
        key: 'fulfillment',
        label: 'Fulfillment',
        children: <FulfillmentTab form={form} disabled={disabled} resourceOptions={resourceOptions} resourceQueryState={libraryResourcesQuery} />,
      },
    ],
    [disabled, form, libraryResourcesQuery, resourceOptions]
  );

  if (!isNew && productQuery.isLoading) {
    return (
      <div className={styles.page}>
        <Card>
          <CardBody className={styles.stateCard}>
            <Loader caption="Loading product..." />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!isNew && (productQuery.isError || !productQuery.data?.payload)) {
    return (
      <div className={styles.page}>
        <Card>
          <CardBody className={styles.stateCard}>
            <div className={styles.stateTitle}>Product not found</div>
            <p className={styles.stateText}>This product could not be loaded. It may have been removed or the id is invalid.</p>
            <div className={styles.stateActions}>
              <Button variant="outline" tone="neutral" onClick={() => router.push('/products')}>
                Back to Store
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
          <p className={styles.eyebrow}>Commerce Admin</p>
          <h1 className={styles.title}>{productTitle}</h1>
          <p className={styles.subtitle}>
            {isNew
              ? 'Create a product record, define its pricing, and wire the fulfillment grants that unlock library access.'
              : 'Update the product catalog entry, its storefront visibility, and any downstream fulfillment grants.'}
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="ghost" tone="neutral" onClick={() => router.push('/products')}>
            Back to Store
          </Button>
        </div>
      </div>

      <Form form={form} className={styles.form}>
        <Tabs items={tabItems} defaultActiveKey="basics" variant="pills" fit="equal" contentClassName={styles.tabsContent} />

        <div className={styles.footer}>
          <div className={styles.footerActions}>
            <Button type="submit" variant="solid" tone="gold" disabled={disabled || !form.isValid}>
              {createProduct.isPending ? 'Creating...' : updateProduct.isPending ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" tone="neutral" onClick={() => form.reset()} disabled={disabled}>
              Reset
            </Button>
          </div>

          {!isNew ? (
            <div className={styles.footerDanger}>
              <Button type="button" variant="outline" tone="danger" onClick={() => setDeleteModalOpen(true)} disabled={disabled}>
                Delete Product
              </Button>
            </div>
          ) : null}
        </div>
      </Form>

      <Modal
        open={deleteModalOpen}
        title="Delete Product"
        onCancel={() => setDeleteModalOpen(false)}
        onOk={async () => {
          if (!id) return;

          try {
            await deleteProduct.mutateAsync(id);
            addAlert({
              type: 'success',
              message: 'Product deleted',
              description: 'The store product has been deleted successfully.',
            });
            router.push('/products');
          } catch (error) {
            addAlert({
              type: 'error',
              message: 'Delete failed',
              description: deriveApiErrorMessage(error, 'Failed to delete product.'),
            });
          }
        }}
        confirmLoading={deleteProduct.isPending}
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

function BasicsTab({ form, disabled }: { form: UseFormReturn<ProductEditorFormValues>; disabled: boolean }) {
  return (
    <Card>
      <CardHeader className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Identity & Visibility</h2>
          <p className={styles.sectionSubtitle}>Define how this product is identified in the catalog and how visible it should be to players.</p>
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
                helpText="Slug-like identifier used for stable product keys."
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
                helpText="Preferred storefront lookup path."
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
          <FormField name="status">
            {(field) => (
              <SelectField
                floatingLabel
                id={field.id}
                label="Status"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                options={STORE_STATUS_OPTIONS as unknown as SelectOption[]}
                disabled={disabled}
              />
            )}
          </FormField>
          <FormField name="visibility">
            {(field) => (
              <SelectField
                floatingLabel
                id={field.id}
                label="Visibility"
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                options={STORE_VISIBILITY_OPTIONS as unknown as SelectOption[]}
                disabled={disabled}
              />
            )}
          </FormField>
        </FormGroup>

        <FormField name="tags">
          {(field) => (
            <TagInputField
              floatingLabel
              id={field.id}
              label="Tags"
              value={field.value as string[]}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={field.shouldShowError ? field.error : undefined}
              disabled={disabled}
              placeholder="Type a tag and press comma or enter..."
            />
          )}
        </FormField>
      </CardBody>
    </Card>
  );
}

function PricingTab({ form, disabled }: { form: UseFormReturn<ProductEditorFormValues>; disabled: boolean }) {
  return (
    <Card>
      <CardHeader className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Pricing Rules</h2>
          <p className={styles.sectionSubtitle}>Commerce currently supports free claims and one-time pricing only. Keep all amounts in USD cents.</p>
        </div>
      </CardHeader>
      <CardBody className={styles.formBody}>
        <FormGroup>
          <FormField name="pricingType">
            {(field) => (
              <SelectField
                floatingLabel
                id={field.id}
                label="Pricing Type"
                value={field.value as string}
                onChange={(event) => {
                  const nextType = event.target.value as ProductEditorFormValues['pricingType'];
                  field.onChange(nextType);
                  if (nextType === 'free') {
                    form.setValue('amountCents', 0, { touch: true, validate: true });
                  } else if ((form.values.amountCents ?? 0) <= 0) {
                    form.setValue('amountCents', undefined, { touch: true, validate: true });
                  }
                }}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                options={STORE_PRICING_TYPE_OPTIONS as unknown as SelectOption[]}
                disabled={disabled}
              />
            )}
          </FormField>
          <TextField floatingLabel label="Currency" value="USD" disabled />
        </FormGroup>

        <FormGroup>
          <FormField name="amountCents">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="Amount (cents)"
                type="number"
                value={field.value as number | undefined}
                valueMode="number"
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                disabled={disabled || form.values.pricingType === 'free'}
                placeholder="0"
              />
            )}
          </FormField>
          <FormField name="compareAtAmountCents">
            {(field) => (
              <TextField
                floatingLabel
                id={field.id}
                label="Compare-at (cents)"
                type="number"
                value={field.value as number | undefined}
                valueMode="number"
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                disabled={disabled}
                placeholder="Optional"
              />
            )}
          </FormField>
        </FormGroup>

        <div className={styles.metaStrip}>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Current price</span>
            <strong className={styles.metaValue}>{form.values.pricingType === 'free' ? 'Free' : formatCurrencyCents(form.values.amountCents)}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Compare-at</span>
            <strong className={styles.metaValue}>{formatCurrencyCents(form.values.compareAtAmountCents)}</strong>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function PresentationTab({ form, disabled }: { form: UseFormReturn<ProductEditorFormValues>; disabled: boolean }) {
  return (
    <Card>
      <CardHeader className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Storefront Presentation</h2>
          <p className={styles.sectionSubtitle}>Configure the main imagery and any gallery entries used for richer product storytelling.</p>
        </div>
      </CardHeader>
      <CardBody className={styles.formBody}>
        <FormGroup>
          <FormField name="imageUrl">
            {(field) => (
              <TextField floatingLabel id={field.id} label="Image URL" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
            )}
          </FormField>
          <FormField name="coverImageUrl">
            {(field) => (
              <TextField floatingLabel id={field.id} label="Cover Image URL" value={field.value as string} onChange={field.onChange} onBlur={field.onBlur} disabled={disabled} />
            )}
          </FormField>
        </FormGroup>

        <FormField name="gallery">
          {(field) => (
            <div className={styles.sectionStack}>
              <div className={styles.subsectionHeader}>
                <div>
                  <h3 className={styles.subsectionTitle}>Gallery</h3>
                  <p className={styles.subsectionCopy}>Add supporting images for the storefront gallery. Empty rows are ignored on submit.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  tone="neutral"
                  onClick={() => {
                    form.setValue('gallery', [...form.values.gallery, createEmptyGalleryEntry()], { touch: true, validate: true });
                  }}
                  disabled={disabled}
                >
                  Add Image
                </Button>
              </div>

              {form.values.gallery.length === 0 ? (
                <div className={styles.emptyState}>No gallery entries yet.</div>
              ) : (
                <div className={styles.collectionStack}>
                  {form.values.gallery.map((entry, index) => (
                    <div key={`gallery-${index}`} className={styles.collectionCard}>
                      <div className={styles.collectionCardHeader}>
                        <strong>Gallery Image {index + 1}</strong>
                        <Button
                          type="button"
                          variant="ghost"
                          tone="danger"
                          onClick={() => {
                            form.setValue(
                              'gallery',
                              form.values.gallery.filter((_, galleryIndex) => galleryIndex !== index),
                              { touch: true, validate: true }
                            );
                          }}
                          disabled={disabled}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className={styles.collectionCardBody}>
                        <TextField
                          floatingLabel
                          label="URL"
                          value={entry.url}
                          onChange={(event) => {
                            const nextGallery = [...form.values.gallery];
                            nextGallery[index] = {
                              ...entry,
                              url: event.target.value,
                            };
                            form.setValue('gallery', nextGallery, { touch: true, validate: true });
                          }}
                          disabled={disabled}
                        />
                        <TextField
                          floatingLabel
                          label="Alt Text"
                          value={entry.alt}
                          onChange={(event) => {
                            const nextGallery = [...form.values.gallery];
                            nextGallery[index] = {
                              ...entry,
                              alt: event.target.value,
                            };
                            form.setValue('gallery', nextGallery, { touch: true, validate: true });
                          }}
                          disabled={disabled}
                        />
                        <TextField
                          floatingLabel
                          label="Caption"
                          value={entry.caption}
                          onChange={(event) => {
                            const nextGallery = [...form.values.gallery];
                            nextGallery[index] = {
                              ...entry,
                              caption: event.target.value,
                            };
                            form.setValue('gallery', nextGallery, { touch: true, validate: true });
                          }}
                          disabled={disabled}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {field.shouldShowError && field.error ? <p className={styles.errorText}>{field.error}</p> : null}
            </div>
          )}
        </FormField>
      </CardBody>
    </Card>
  );
}

function FulfillmentTab({
  form,
  disabled,
  resourceOptions,
  resourceQueryState,
}: {
  form: UseFormReturn<ProductEditorFormValues>;
  disabled: boolean;
  resourceOptions: SelectOption[];
  resourceQueryState: ReturnType<typeof useLibraryResources>;
}) {
  const selectedIds = form.values.grants.map((grant) => grant.resourceId);

  return (
    <Card>
      <CardHeader className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Fulfillment & Grants</h2>
          <p className={styles.sectionSubtitle}>Connect products to library resources and define whether the product has digital or shipping requirements.</p>
        </div>
      </CardHeader>
      <CardBody className={styles.formBody}>
        <FormGroup>
          <FormField name="fulfillmentKind">
            {(field) => (
              <SelectField
                floatingLabel
                id={field.id}
                label="Fulfillment Kind"
                value={field.value as string}
                onChange={(event) => {
                  const nextKind = event.target.value as ProductEditorFormValues['fulfillmentKind'];
                  field.onChange(nextKind);

                  if (nextKind === 'physical') {
                    form.setValue('grants', [], { touch: true, validate: true });
                  }

                  if (nextKind === 'digital') {
                    form.setValue('requiresShipping', false, { touch: true, validate: true });
                  }
                }}
                onBlur={field.onBlur}
                error={field.shouldShowError ? field.error : undefined}
                options={STORE_FULFILLMENT_KIND_OPTIONS as unknown as SelectOption[]}
                disabled={disabled}
              />
            )}
          </FormField>
          <FormField name="requiresShipping">
            {(field) => (
              <div className={styles.checkboxField}>
                <Checkbox id={field.id} checked={field.value as boolean} onChange={field.onChange} disabled={disabled || form.values.fulfillmentKind === 'digital'} label="Requires Shipping" />
              </div>
            )}
          </FormField>
        </FormGroup>

        <FormField name="grants">
          {(field) => (
            <div className={styles.sectionStack}>
              <div className={styles.subsectionHeader}>
                <div>
                  <h3 className={styles.subsectionTitle}>Resource Grants</h3>
                  <p className={styles.subsectionCopy}>Choose the library resources this product should unlock. Each resource can only appear once.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  tone="neutral"
                  onClick={() => {
                    form.setValue('grants', [...form.values.grants, createEmptyGrant()], { touch: true, validate: true });
                  }}
                  disabled={disabled || form.values.fulfillmentKind === 'physical'}
                >
                  Add Grant
                </Button>
              </div>

              {resourceQueryState.isError ? (
                <div className={styles.notice}>Library resources failed to load from `/api/v1/library/resources`. Once that route is mounted, this selector will populate automatically.</div>
              ) : null}

              {resourceQueryState.isLoading ? <div className={styles.notice}>Loading library resources...</div> : null}

              {form.values.fulfillmentKind === 'physical' ? (
                <div className={styles.emptyState}>Physical products cannot include digital resource grants.</div>
              ) : form.values.grants.length === 0 ? (
                <div className={styles.emptyState}>No grants configured yet.</div>
              ) : (
                <div className={styles.collectionStack}>
                  {form.values.grants.map((grant, index) => {
                    const rowOptions = resourceOptions.map((option) => ({
                      ...option,
                      disabled: option.value !== grant.resourceId && selectedIds.includes(String(option.value)),
                    }));

                    return (
                      <div key={`grant-${index}`} className={styles.collectionCard}>
                        <div className={styles.collectionCardHeader}>
                          <strong>Grant {index + 1}</strong>
                          <Button
                            type="button"
                            variant="ghost"
                            tone="danger"
                            onClick={() => {
                              form.setValue(
                                'grants',
                                form.values.grants.filter((_, grantIndex) => grantIndex !== index),
                                { touch: true, validate: true }
                              );
                            }}
                            disabled={disabled}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className={styles.collectionCardBody}>
                          <SelectField
                            floatingLabel
                            label="Library Resource"
                            value={grant.resourceId}
                            onChange={(event) => {
                              const nextGrants = [...form.values.grants];
                              nextGrants[index] = {
                                ...grant,
                                resourceId: event.target.value,
                              };
                              form.setValue('grants', nextGrants, { touch: true, validate: true });
                            }}
                            helpText="Loaded from the future `/api/v1/library/resources` mount."
                            options={[{ label: 'Select a resource...', value: '' }, ...rowOptions]}
                            disabled={disabled || resourceQueryState.isLoading}
                          />

                          <div className={styles.permissionGrid}>
                            <Checkbox
                              checked={grant.permissions.includes('view')}
                              onChange={(checked) => {
                                const permissions = checked
                                  ? ([...new Set([...grant.permissions, 'view'])] as ProductGrantPermission[])
                                  : grant.permissions.filter((permission) => permission !== 'view');
                                const nextGrants = [...form.values.grants];
                                nextGrants[index] = {
                                  ...grant,
                                  permissions,
                                };
                                form.setValue('grants', nextGrants, { touch: true, validate: true });
                              }}
                              disabled={disabled}
                              label="View"
                            />
                            <Checkbox
                              checked={grant.permissions.includes('download')}
                              onChange={(checked) => {
                                const permissions = checked
                                  ? ([...new Set([...grant.permissions, 'download'])] as ProductGrantPermission[])
                                  : grant.permissions.filter((permission) => permission !== 'download');
                                const nextGrants = [...form.values.grants];
                                nextGrants[index] = {
                                  ...grant,
                                  permissions,
                                };
                                form.setValue('grants', nextGrants, { touch: true, validate: true });
                              }}
                              disabled={disabled}
                              label="Download"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {field.shouldShowError && field.error ? <p className={styles.errorText}>{field.error}</p> : null}
            </div>
          )}
        </FormField>
      </CardBody>
    </Card>
  );
}
