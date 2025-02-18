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

  export const getUserProfile = async (userId) => {
    try{
      const response =await api.get(`user/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile", error);
      throw error;
    }
  };

  export const logout = async() => {
    const response = await api.post('user/logout');
    return response.data;
  };