import api from './axios.js';

export async function getPosts(params = {}) {
  const { data } = await api.get('/posts', { params });

  return data;
}

export async function getPost(slug) {
  const { data } = await api.get(`/posts/${slug}`);

  return data.data;
}
