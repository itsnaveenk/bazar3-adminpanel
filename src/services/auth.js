import http from '../utils/http';

const authService = {
  login: async (accessKey, password) => {
    const response = await http.post('/admin/login', { accessKey, password });
    return response.data;
  }
};

export default authService;
