// lib/services/main/catalog.api.js
// Commerce staff operations on products-server (PRODUCTS_* roles): catalog
// products, categories, vendors, staff accounts, Excel imports and the
// commerce support queue. Every call goes through the products BFF and
// resolves to the action envelope ({ code, status, error, result }).
//
// GET params are passed as `body` — the request layer turns them into the
// query string. Uploads take a FormData (field names noted per action).

import { createServerAction } from '@/lib/api/action';
import { BFF_PRODUCTS_BASE } from '@/lib/api/config';
import {
  catalogEndpoints as c,
  importEndpoints as imports,
  commerceSupportEndpoints as support,
} from '@/lib/api/endpoints';

const call = (method, url, body) =>
  createServerAction({ url, method, base: BFF_PRODUCTS_BASE, ...(body !== undefined ? { body } : {}) });

// ── Products ─────────────────────────────────────────────────────────────────
export const getCatalogProductsAction = async (params) => call('GET', c.products(), params);
export const getCatalogProductAction = async (id) => call('GET', c.product(id));
export const createCatalogProductAction = async (data) => call('POST', c.products(), data);
export const updateCatalogProductAction = async (id, data) => call('PATCH', c.product(id), data);
export const approveCatalogProductAction = async (id, data) => call('POST', c.productApprove(id), data);
export const rejectCatalogProductAction = async (id, data) => call('POST', c.productReject(id), data);
export const archiveCatalogProductAction = async (id, data) => call('POST', c.productArchive(id), data);
/** Admin-only margin read-out. */
export const getCatalogProductMarginAction = async (id) => call('GET', c.productMargin(id));
/** FormData with up to 5 files in the `images` field. */
export const uploadCatalogProductImagesAction = async (id, formData) =>
  call('POST', c.productImages(id), formData);
export const deleteCatalogProductImageAction = async (id, imageId) =>
  call('DELETE', c.productImage(id, imageId));
export const setCatalogProductMainImageAction = async (id, imageId) =>
  call('PATCH', c.productImageMain(id, imageId));

// ── Categories ───────────────────────────────────────────────────────────────
export const getCommerceCategoriesAction = async (params) => call('GET', c.categories(), params);
export const getCategoryAction = async (id) => call('GET', c.category(id));
export const getCategoriesSchemaAction = async () => call('GET', c.categoriesSchema());
export const getUsedCategoriesAction = async () => call('GET', c.categoriesUsed());
export const getCategoryUsageAction = async (id) => call('GET', c.categoryUsage(id));
export const createCategoryAction = async (data) => call('POST', c.categories(), data);
export const updateCategoryAction = async (id, data) => call('PATCH', c.category(id), data);
export const deactivateCategoryFieldAction = async (id, key) =>
  call('POST', c.categoryFieldDeactivate(id, key));

// ── Vendors ──────────────────────────────────────────────────────────────────
export const getVendorsAction = async (params) => call('GET', c.vendors(), params);
export const getVendorAction = async (id) => call('GET', c.vendor(id));
export const getExpiringVendorsAction = async (params) => call('GET', c.vendorsExpiring(), params);
export const createVendorAction = async (data) => call('POST', c.vendors(), data);
export const updateVendorAction = async (id, data) => call('PATCH', c.vendor(id), data);

// ── Staff accounts (local commerce staff) ────────────────────────────────────
export const getStaffUsersAction = async (params) => call('GET', c.staffUsers(), params);
export const updateStaffUserAction = async (id, data) => call('PATCH', c.staffUser(id), data);

// ── Imports ──────────────────────────────────────────────────────────────────
export const getImportJobsAction = async (params) => call('GET', imports.jobs(), params);
export const getImportJobAction = async (id) => call('GET', imports.job(id));
export const getImportTemplateAction = async (params) => call('GET', imports.template(), params);
/** FormData with the sheet in the `file` field (+ the fields uploadSchema needs). */
export const uploadImportAction = async (formData) => call('POST', imports.jobs(), formData);
export const commitImportAction = async (id) => call('POST', imports.commit(id));
export const cancelImportAction = async (id) => call('POST', imports.cancel(id));
/** Catalog sheet: FormData with the sheet in the `file` field. */
export const uploadCatalogImportAction = async (formData) => call('POST', imports.catalog(), formData);
export const getCatalogImportJobAction = async (jobId) => call('GET', imports.catalogJob(jobId));

// ── Commerce support tickets ─────────────────────────────────────────────────
export const getCommerceTicketsAction = async (params) => call('GET', support.tickets(), params);
export const getCommerceTicketAction = async (id) => call('GET', support.ticket(id));
export const createCommerceTicketAction = async (data) => call('POST', support.tickets(), data);
export const updateCommerceTicketAction = async (id, data) => call('PATCH', support.ticket(id), data);
export const getCommerceTicketStatsAction = async () => call('GET', support.stats());
