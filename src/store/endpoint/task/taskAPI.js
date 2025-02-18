import api from '../../API/httpclient';

export const addTasks = async (taskData) => {
  const response = await api.post('/tasks/add', taskData);
  return response.data;
};

export const getAllTasks = async () => {
  const response = await api.get('/tasks/all');
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/tasks/status/${taskId}`, { status });
  return response.data;
};

export const editTask = async (taskId, updatedTask) => {
  await api.put(`/tasks/${taskId}`, { task: updatedTask.task });
};

export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};