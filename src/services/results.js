import http from '../utils/http';

const resultsService = {
  getByTeam: async (team) => {
    const response = await http.get(`/admin/results?team=${team}`);
    return response.data;
  },
  
  publish: async (resultData) => {
    const response = await http.post('/admin/results', resultData);
    return response.data;
  },
  
  update: async (id, resultData) => {
    const response = await http.put(`/admin/results/${id}`, resultData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await http.delete(`/admin/results/${id}`);
    return response.data;
  },
  
  getTodayResults: async () => {
    const response = await http.get('/api/today');
    return response.data;
  }
};

export default resultsService;
