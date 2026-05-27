import api from './axios.js';

export async function getDashboard() {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
}

export async function getAdminProducts(params) {
  const { data } = await api.get('/admin/products', { params });
  return data;
}

export async function getAdminProduct(id) {
  const { data } = await api.get(`/admin/products/${id}`);
  return data.data;
}

export async function createAdminProduct(payload) {
  const { data } = await api.post('/admin/products', payload);
  return data.data;
}

export async function updateAdminProduct(id, payload) {
  const { data } = await api.put(`/admin/products/${id}`, payload);
  return data.data;
}

export async function deleteAdminProduct(id) {
  await api.delete(`/admin/products/${id}`);
}

export async function uploadProductImage(productId, formData) {
  const { data } = await api.post(`/admin/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateProductImageFile(imageId, formData) {
  const { data } = await api.put(`/admin/product-images/${imageId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateProductImageMeta(imageId, payload) {
  const { data } = await api.put(`/admin/product-images/${imageId}`, payload);
  return data.data;
}

export async function deleteProductImage(imageId) {
  await api.delete(`/admin/product-images/${imageId}`);
}

export async function getAdminSiteAssets() {
  const { data } = await api.get('/admin/site-assets');
  return data.data;
}

export async function updateAdminSiteAssetFile(id, formData) {
  const { data } = await api.post(`/admin/site-assets/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateAdminSiteAssetMeta(id, payload) {
  const { data } = await api.put(`/admin/site-assets/${id}`, payload);
  return data.data;
}

export async function getAdminCategories() {
  const { data } = await api.get('/admin/categories');
  return data.data;
}

export async function updateAdminCategory(id, payload) {
  const { data } = await api.put(`/admin/categories/${id}`, payload);
  return data.data;
}

export async function createAdminCategory(payload) {
  const { data } = await api.post('/admin/categories', payload);
  return data.data;
}

export async function deleteAdminCategory(id) {
  await api.delete(`/admin/categories/${id}`);
}

export async function getAdminOrders(params) {
  const { data } = await api.get('/admin/orders', { params });
  return data;
}

export async function updateAdminOrder(id, payload) {
  const { data } = await api.patch(`/admin/orders/${id}`, payload);
  return data;
}

export async function getAdminLeads(params) {
  const { data } = await api.get('/admin/leads', { params });
  return data;
}
