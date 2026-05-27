import api from './axios.js';

export async function getProductPageAssets() {
  const { data } = await api.get('/site-assets', { params: { group: 'product' } });

  return data.data ?? {};
}

export async function getHomePageAssets() {
  const { data } = await api.get('/site-assets', { params: { group: 'home' } });

  return data.data ?? {};
}
