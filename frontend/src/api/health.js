import api from './axios.js';

export async function checkApiHealth() {
  const { data } = await api.get('/health');

  return data;
}
