import api from '../../API/httpclient';


export const register = async (credentials) => {
  const response = await api.post('/user/register', credentials);
  return response.data;
};

export const login = async (credentials) => {
    try {
      const response = await api.post('/user/login', credentials);
      const { userId } = response.data; 
  
      if (userId) {
        localStorage.setItem('userId', userId); 
      }
  
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };