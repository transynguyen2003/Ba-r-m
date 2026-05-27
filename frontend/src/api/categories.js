import api from './axios.js';

export async function getCategories() {
  const { data } = await api.get('/categories');

  return data.data;
}
