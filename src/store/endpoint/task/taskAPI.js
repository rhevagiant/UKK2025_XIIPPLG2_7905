import api from '../../API/httpclient';

export const getAllTasks = async () => {
    const response = await api.get('/tasks/all');
    return response.data;
};