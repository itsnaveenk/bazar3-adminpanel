import http from '../utils/http';

const teamsService = {
  getAll: async () => {
    const response = await http.get('/api/teams');
    return response.data;
  },
  
  create: async (teamData) => {
    const response = await http.post('/admin/teams', teamData);
    return response.data;
  },
  
  update: async (id, teamData) => {
    const response = await http.put(`/admin/teams/${id}`, teamData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await http.delete(`/admin/teams/${id}`);
    return response.data;
  }
};

export default teamsService;
