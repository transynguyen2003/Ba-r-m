import api from './axios.js';

export async function submitOrder(payload) {
  const { data } = await api.post('/orders', payload);

  return data;
}
