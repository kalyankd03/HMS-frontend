'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getStoredToken } from '@hms/core';
import type { ServiceCatalogItem } from '@hms/core';
import { servicesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Pencil, Plus, RefreshCw, Trash2, Star } from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const formatPrice = (value: number) => currencyFormatter.format(Number.isFinite(value) ? value : 0);

const normalizeService = (service: ServiceCatalogItem): ServiceCatalogItem => ({
  ...service,
  default_price: Number(service.default_price ?? 0),
});

const serviceFormSchema = z.object({
  service_code: z
    .string()
    .min(1, 'Service code is required')
    .max(50, 'Service code must be 50 characters or less'),
  service_name: z
    .string()
    .min(1, 'Service name is required')
    .max(150, 'Service name must be 150 characters or less'),
  default_price: z
    .coerce
    .number({
      required_error: 'Default price is required',
      invalid_type_error: 'Default price must be a number',
    })
    .min(0, 'Default price must be zero or greater'),
  category: z
    .string()
    .max(100, 'Category must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  readonly mode: 'create' | 'edit';
  readonly onSubmit: (values: ServiceFormValues) => Promise<void>;
  readonly onCancel: () => void;
  readonly isSubmitting: boolean;
  readonly initialValues?: ServiceFormValues;
  readonly disableCodeField?: boolean;
}

function ServiceForm({
  mode,
  onSubmit,
  onCancel,
  isSubmitting,
  initialValues,
  disableCodeField = false,
}: ServiceFormProps) {
  const defaultValues = useMemo<ServiceFormValues>(
    () =>
      initialValues ?? {
        service_code: '',
        service_name: '',
        default_price: 0,
        category: '',
        description: '',
      },
    [initialValues],
  );

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ServiceFormValues) => {
    await onSubmit({
      ...values,
      category: values.category?.trim() || undefined,
      description: values.description?.trim() || undefined,
    });
    form.reset(defaultValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 rounded-lg border border-border/60 bg-muted/10 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="service_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Code *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. OPD001"
                    {...field}
                    disabled={disableCodeField || isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="General Consultation"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="default_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="500"
                    value={Number.isNaN(field.value) ? '' : field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Consultation"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide additional details about this service"
                  className="min-h-[90px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Saving...'}
              </>
            ) : (
              <>{mode === 'create' ? 'Create Service' : 'Save Changes'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ServiceCatalogManager() {
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCatalogItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingServiceId, setSubmittingServiceId] = useState<number | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);
  const [defaultingServiceId, setDefaultingServiceId] = useState<number | null>(null);

  const fetchServices = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const data = await servicesApi.listServices(token);
      setServices(data.map(normalizeService));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load services';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchServices();
  }, [fetchServices]);

  const handleCreate = async (values: ServiceFormValues) => {
    const token = getStoredToken();
    if (!token) {
      setActionError('Authentication token missing. Please log in again.');
      return;
    }
    try {
      setIsSubmitting(true);
      setActionError(null);
      const payload = {
        service_code: values.service_code.trim(),
        service_name: values.service_name.trim(),
        default_price: Number(values.default_price),
        category: values.category?.trim() || undefined,
        description: values.description?.trim() || undefined,
      };
      const created = await servicesApi.createService(payload, token);
      const normalized = normalizeService(created);
      setServices((prev) => [normalized, ...prev]);
      setIsAdding(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create service';
      setActionError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (service: ServiceCatalogItem, values: ServiceFormValues) => {
    const token = getStoredToken();
    if (!token) {
      setActionError('Authentication token missing. Please log in again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmittingServiceId(service.id);
      setActionError(null);
      const payload = {
        service_name: values.service_name.trim(),
        default_price: Number(values.default_price),
        category: values.category?.trim() || undefined,
        description: values.description?.trim() || undefined,
      };
      const updated = await servicesApi.updateService(service.id, payload, token);
      const normalized = normalizeService(updated);
      setServices((prev) =>
        prev.map((item) => (item.id === service.id ? normalized : item)),
      );
      setEditingService(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update service';
      setActionError(message);
    } finally {
      setIsSubmitting(false);
      setSubmittingServiceId(null);
    }
  };

  const handleDelete = async (service: ServiceCatalogItem) => {
    if (!window.confirm(`Delete service "${service.service_name}"? This will deactivate the service.`)) {
      return;
    }

    const token = getStoredToken();
    if (!token) {
      setActionError('Authentication token missing. Please log in again.');
      return;
    }

    try {
      setDeletingServiceId(service.id);
      setActionError(null);
      await servicesApi.deleteService(service.id, token);
      setServices((prev) => prev.filter((item) => item.id !== service.id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete service';
      setActionError(message);
    } finally {
      setDeletingServiceId(null);
    }
  };

  const handleSetDefault = async (service: ServiceCatalogItem) => {
    const token = getStoredToken();
    if (!token) {
      setActionError('Authentication token missing. Please log in again.');
      return;
    }

    try {
      setDefaultingServiceId(service.id);
      setActionError(null);
      await servicesApi.setDefaultService(service.id, token);
      setServices((prev) =>
        prev.map((item) => ({
          ...item,
          is_default_opd_service: item.id === service.id,
        })),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to set default service';
      setActionError(message);
    } finally {
      setDefaultingServiceId(null);
    }
  };

  const activeServices = services.filter((svc) => svc.is_active);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Service Catalog</CardTitle>
          <CardDescription>
            Manage consultation and billing services available to your hospital staff when creating OP tickets.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => void fetchServices()}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button
            onClick={() => {
              setIsAdding((prev) => !prev);
              setEditingService(null);
              setActionError(null);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isAdding ? 'Close Form' : 'Add Service'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {actionError && (
          <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
            {actionError}
          </div>
        )}

        {isAdding && (
          <ServiceForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => {
              setIsAdding(false);
              setActionError(null);
            }}
            isSubmitting={isSubmitting && submittingServiceId === null}
          />
        )}

        {loading && activeServices.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading services...
          </div>
        ) : null}

        {!loading && activeServices.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            No services found. Create your first service to make it available during OP ticket creation.
          </div>
        ) : (
          <div className="space-y-4">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="rounded-lg border border-border/60 bg-card p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{service.service_name}</h3>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {service.service_code}
                      </span>
                      {service.is_default_opd_service ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />
                          Default OPD
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(service.default_price ?? 0)}{' '}
                      {service.category ? `• ${service.category}` : null}
                    </p>
                    {service.description ? (
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!service.is_default_opd_service ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleSetDefault(service)}
                        disabled={defaultingServiceId === service.id}
                      >
                        {defaultingServiceId === service.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Setting...
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            Set Default
                          </>
                        )}
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingService(service);
                        setIsAdding(false);
                        setActionError(null);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleDelete(service)}
                      disabled={deletingServiceId === service.id}
                    >
                      {deletingServiceId === service.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {editingService?.id === service.id ? (
                  <div className="mt-4 border-t border-border/40 pt-4">
                    <ServiceForm
                      mode="edit"
                      initialValues={{
                        service_code: service.service_code,
                        service_name: service.service_name,
                        default_price: service.default_price,
                        category: service.category ?? '',
                        description: service.description ?? '',
                      }}
                      disableCodeField
                      onSubmit={(values) => handleUpdate(service, values)}
                      onCancel={() => setEditingService(null)}
                      isSubmitting={
                        isSubmitting && submittingServiceId === service.id
                      }
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
