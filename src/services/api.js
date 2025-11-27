import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getProdutos = async () => {
  const { data } = await apiClient.get('/produtos');
  return data;
};

export const createProduto = async (payload) => {
  const { data } = await apiClient.post('/produtos', payload);
  return data;
};

export const updateProduto = async (id, payload) => {
  const { data } = await apiClient.put(`/produtos/${id}`, payload);
  return data;
};

export const deleteProduto = async (id) => {
  await apiClient.delete(`/produtos/${id}`);
};

export const validarProduto = async (payload) => {
  const { data } = await apiClient.post('/validar-produto', payload);
  return data;
};

export default apiClient;
