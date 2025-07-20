import api from '../api';

class PostulantService {
  async getPostulantById(id: string) {
    try {
      const response = await api.get(`/volunteer/profile-volunteer/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching postulant:', error);
      throw error;
    }
  }

  async approvePostulant(id: string) {
    try {
      const response = await api.post(`/volunteer/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving postulant:', error);
      throw error;
    }
  }

  async rejectPostulant(id: string) {
    try {
      const response = await api.post(`/volunteer/${id}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting postulant:', error);
      throw error;
    }
  }
}

export default new PostulantService();
