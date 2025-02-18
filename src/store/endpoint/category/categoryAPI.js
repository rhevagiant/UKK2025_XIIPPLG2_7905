import api from '../../API/httpclient';

export const createCategories = async (categoryData) => {
  const response = await api.post('/category/add', categoryData);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/category/all');
  return response.data;
};

export const getCategoryTasks = async (categoryId) => {
  const response = await api.get(`/category/${categoryId}/tasks`);
  return response.data;
};

export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(`/category/${categoryId}`, categoryData);
  return response.data;
};


export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/category/${categoryId}`);
  return response.data;
};