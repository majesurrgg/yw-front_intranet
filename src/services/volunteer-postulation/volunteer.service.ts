import api from '../api';

class VolunteerService {
  async getVolunteerById(id: string) {
    try {
      const response = await api.get(`/volunteer/profile-volunteer/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteer:', error);
      throw error;
    }
  }

  async updateVolunteer(id: string, data: any) {
    try {
      const response = await api.put(`/volunteer/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating volunteer:', error);
      throw error;
    }
  }

  async deleteVolunteer(id: string) {
    try {
      const response = await api.delete(`/volunteer/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      throw error;
    }
  }
}

export default new VolunteerService();
