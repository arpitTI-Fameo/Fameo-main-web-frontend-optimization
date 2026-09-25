// lib/hooks/main/useCatalog.js
// Hooks for commerce staff operations (lib/services/main/catalog.api.js).
// Queries take the action's arguments; mutations take ONE variables object
// (see each hook) and invalidate the matching list.
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getCatalogProductsAction,
  getCatalogProductAction,
  createCatalogProductAction,
  updateCatalogProductAction,
  approveCatalogProductAction,
  rejectCatalogProductAction,
  archiveCatalogProductAction,
  getCatalogProductMarginAction,
  uploadCatalogProductImagesAction,
  deleteCatalogProductImageAction,
  setCatalogProductMainImageAction,
  getCommerceCategoriesAction,
  getCategoryAction,
  getCategoriesSchemaAction,
  getUsedCategoriesAction,
  getCategoryUsageAction,
  createCategoryAction,
  updateCategoryAction,
  deactivateCategoryFieldAction,
  getVendorsAction,
  getVendorAction,
  getExpiringVendorsAction,
  createVendorAction,
  updateVendorAction,
  getStaffUsersAction,
  updateStaffUserAction,
  getImportJobsAction,
  getImportJobAction,
  getImportTemplateAction,
  uploadImportAction,
  commitImportAction,
  cancelImportAction,
  uploadCatalogImportAction,
  getCatalogImportJobAction,
  getCommerceTicketsAction,
  getCommerceTicketAction,
  createCommerceTicketAction,
  updateCommerceTicketAction,
  getCommerceTicketStatsAction,
} from '@/lib/services';

export const catalogKeys = {
  all: () => ['catalog'],
  products: (params) => [...catalogKeys.all(), 'products', params ?? {}],
  product: (id) => [...catalogKeys.all(), 'product', id],
  categories: (params) => [...catalogKeys.all(), 'categories', params ?? {}],
  category: (id) => [...catalogKeys.all(), 'category', id],
  vendors: (params) => [...catalogKeys.all(), 'vendors', params ?? {}],
  vendor: (id) => [...catalogKeys.all(), 'vendor', id],
  staff: (params) => [...catalogKeys.all(), 'staff', params ?? {}],
  imports: (params) => [...catalogKeys.all(), 'imports', params ?? {}],
  importJob: (id) => [...catalogKeys.all(), 'import', id],
  tickets: (params) => [...catalogKeys.all(), 'tickets', params ?? {}],
  ticket: (id) => [...catalogKeys.all(), 'ticket', id],
};

/** Throw a failed action envelope; else its result. */
const resultOf = (action) => async (...args) => {
  const response = await action(...args);
  if (!response.code) throw response;
  return response.result;
};

const useCatalogQuery = (queryKey, action, args, opts, enabled = true) =>
  useQuery({ queryKey, queryFn: () => resultOf(action)(...args), enabled, ...opts });

const useCatalogMutation = (mutationFn, invalidate, opts) =>
  useApiMutation({ mutationFn, invalidate, ...opts });

export const useCatalogProducts = (params, opts = {}) =>
  useCatalogQuery(catalogKeys.products(params), getCatalogProductsAction, [params], opts);

export const useCatalogProduct = (id, opts = {}) =>
  useCatalogQuery(catalogKeys.product(id), getCatalogProductAction, [id], opts, Boolean(id));

export const useCatalogProductMargin = (id, opts = {}) =>
  useCatalogQuery([...catalogKeys.product(id), 'margin'], getCatalogProductMarginAction, [id], opts, Boolean(id));

export const useCommerceCategories = (params, opts = {}) =>
  useCatalogQuery(catalogKeys.categories(params), getCommerceCategoriesAction, [params], opts);

export const useCategory = (id, opts = {}) =>
  useCatalogQuery(catalogKeys.category(id), getCategoryAction, [id], opts, Boolean(id));

export const useCategoriesSchema = (opts = {}) =>
  useCatalogQuery([...catalogKeys.all(), 'categories', 'schema'], getCategoriesSchemaAction, [], opts);

export const useUsedCategories = (opts = {}) =>
  useCatalogQuery([...catalogKeys.all(), 'categories', 'used'], getUsedCategoriesAction, [], opts);

export const useCategoryUsage = (id, opts = {}) =>
  useCatalogQuery([...catalogKeys.category(id), 'usage'], getCategoryUsageAction, [id], opts, Boolean(id));

export const useVendors = (params, opts = {}) =>
  useCatalogQuery(catalogKeys.vendors(params), getVendorsAction, [params], opts);

export const useVendor = (id, opts = {}) =>
  useCatalogQuery(catalogKeys.vendor(id), getVendorAction, [id], opts, Boolean(id));

export const useExpiringVendors = (params, opts = {}) =>
  useCatalogQuery([...catalogKeys.vendors(params), 'expiring'], getExpiringVendorsAction, [params], opts);

export const useStaffUsers = (params, opts = {}) =>
  useCatalogQuery(catalogKeys.staff(params), getStaffUsersAction, [params], opts);

export const useImportJobs = (params, opts = {}) =>
  useCatalogQuery(catalogKeys.imports(params), getImportJobsAction, [params], opts);

export const useImportJob = (id, opts = {}) =>
  useCatalogQuery(catalogKeys.importJob(id), getImportJobAction, [id], opts, Boolean(id));

export const useImportTemplate = (params, opts = {}) =>
  useCatalogQuery([...catalogKeys.all(), 'import-template', params ?? {}], getImportTemplateAction, [params], opts);

export const useCatalogImportJob = (id, opts = {}) =>
  useCatalogQuery([...catalogKeys.importJob(id), 'catalog'], getCatalogImportJobAction, [id], opts, Boolean(id));

export const useCommerceTickets = (params, opts = {}) =>
  useCatalogQuery(catalogKeys.tickets(params), getCommerceTicketsAction, [params], opts);

export const useCommerceTicket = (id, opts = {}) =>
  useCatalogQuery(catalogKeys.ticket(id), getCommerceTicketAction, [id], opts, Boolean(id));

export const useCommerceTicketStats = (opts = {}) =>
  useCatalogQuery([...catalogKeys.all(), 'tickets', 'stats'], getCommerceTicketStatsAction, [], opts);

export const useCreateCatalogProductMutation = (opts = {}) =>
  useCatalogMutation(resultOf(createCatalogProductAction), [[...catalogKeys.all(), 'products'], [...catalogKeys.all(), 'product']], opts);

/** mutate({ id, data }). */
export const useUpdateCatalogProductMutation = (opts = {}) =>
  useCatalogMutation(({ id, data }) => resultOf(updateCatalogProductAction)(id, data), [[...catalogKeys.all(), 'products'], [...catalogKeys.all(), 'product']], opts);

/** mutate({ id, data }). */
export const useApproveCatalogProductMutation = (opts = {}) =>
  useCatalogMutation(({ id, data }) => resultOf(approveCatalogProductAction)(id, data), [[...catalogKeys.all(), 'products'], [...catalogKeys.all(), 'product']], opts);

/** mutate({ id, data }). */
export const useRejectCatalogProductMutation = (opts = {}) =>
  useCatalogMutation(({ id, data }) => resultOf(rejectCatalogProductAction)(id, data), [[...catalogKeys.all(), 'products'], [...catalogKeys.all(), 'product']], opts);

/** mutate({ id, data }). */
export const useArchiveCatalogProductMutation = (opts = {}) =>
  useCatalogMutation(({ id, data }) => resultOf(archiveCatalogProductAction)(id, data), [[...catalogKeys.all(), 'products'], [...catalogKeys.all(), 'product']], opts);

/** mutate({ id, formData }) — files in the `images` field. */
export const useUploadCatalogProductImagesMutation = (opts = {}) =>
  useCatalogMutation(({ id, formData }) => resultOf(uploadCatalogProductImagesAction)(id, formData), [[...catalogKeys.all(), 'products'], [...catalogKeys.all(), 'product']], opts);

/** mutate({ id, imageId }). */
export const useDeleteCatalogProductImageMutation = (opts = {}) =>
  useCatalogMutation(({ id, imageId }) => resultOf(deleteCatalogProductImageAction)(id, imageId), [[...catalogKeys.all(), 'products'], [...catalogKeys.all(), 'product']], opts);

/** mutate({ id, imageId }). */
export const useSetCatalogProductMainImageMutation = (opts = {}) =>
  useCatalogMutation(({ id, imageId }) => resultOf(setCatalogProductMainImageAction)(id, imageId), [[...catalogKeys.all(), 'products'], [...catalogKeys.all(), 'product']], opts);

export const useCreateCategoryMutation = (opts = {}) =>
  useCatalogMutation(resultOf(createCategoryAction), [[...catalogKeys.all(), 'categories'], [...catalogKeys.all(), 'category']], opts);

/** mutate({ id, data }). */
export const useUpdateCategoryMutation = (opts = {}) =>
  useCatalogMutation(({ id, data }) => resultOf(updateCategoryAction)(id, data), [[...catalogKeys.all(), 'categories'], [...catalogKeys.all(), 'category']], opts);

/** mutate({ id, key }). */
export const useDeactivateCategoryFieldMutation = (opts = {}) =>
  useCatalogMutation(({ id, key }) => resultOf(deactivateCategoryFieldAction)(id, key), [[...catalogKeys.all(), 'categories'], [...catalogKeys.all(), 'category']], opts);

export const useCreateVendorMutation = (opts = {}) =>
  useCatalogMutation(resultOf(createVendorAction), [[...catalogKeys.all(), 'vendors'], [...catalogKeys.all(), 'vendor']], opts);

/** mutate({ id, data }). */
export const useUpdateVendorMutation = (opts = {}) =>
  useCatalogMutation(({ id, data }) => resultOf(updateVendorAction)(id, data), [[...catalogKeys.all(), 'vendors'], [...catalogKeys.all(), 'vendor']], opts);

/** mutate({ id, data }). */
export const useUpdateStaffUserMutation = (opts = {}) =>
  useCatalogMutation(({ id, data }) => resultOf(updateStaffUserAction)(id, data), [[...catalogKeys.all(), 'staff']], opts);

export const useUploadImportMutation = (opts = {}) =>
  useCatalogMutation(resultOf(uploadImportAction), [[...catalogKeys.all(), 'imports'], [...catalogKeys.all(), 'import']], opts);

/** mutate(id). */
export const useCommitImportMutation = (opts = {}) =>
  useCatalogMutation(resultOf(commitImportAction), [[...catalogKeys.all(), 'imports'], [...catalogKeys.all(), 'import']], opts);

/** mutate(id). */
export const useCancelImportMutation = (opts = {}) =>
  useCatalogMutation(resultOf(cancelImportAction), [[...catalogKeys.all(), 'imports'], [...catalogKeys.all(), 'import']], opts);

export const useUploadCatalogImportMutation = (opts = {}) =>
  useCatalogMutation(resultOf(uploadCatalogImportAction), [[...catalogKeys.all(), 'imports'], [...catalogKeys.all(), 'import']], opts);

export const useCreateCommerceTicketMutation = (opts = {}) =>
  useCatalogMutation(resultOf(createCommerceTicketAction), [[...catalogKeys.all(), 'tickets'], [...catalogKeys.all(), 'ticket']], opts);

/** mutate({ id, data }). */
export const useUpdateCommerceTicketMutation = (opts = {}) =>
  useCatalogMutation(({ id, data }) => resultOf(updateCommerceTicketAction)(id, data), [[...catalogKeys.all(), 'tickets'], [...catalogKeys.all(), 'ticket']], opts);
