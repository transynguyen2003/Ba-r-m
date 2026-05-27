import api from './axios.js';

export async function getFeaturedProducts() {
  const { data } = await api.get('/products/featured');

  return data.data;
}

export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params });

  return data;
}

export async function getProductPriceRange() {
  const { data } = await api.get('/products/price-range');
  return data.data;
}

export async function getProduct(slug) {
  const { data } = await api.get(`/products/${slug}`);

  return data.data;
}
