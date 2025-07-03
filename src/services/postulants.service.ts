import axios from 'axios';
import type { Postulant, ApiResponse } from '../interfaces/postulant.interface';

const API_BASE_URL = 'http://localhost:3000/api';

export const postulantsService = {
  async getPostulants(page: number = 1, limit: number = 10): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await axios.get(`${API_BASE_URL}/volunteer?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching postulants:', error);
      throw error;
    }
  },

  async getPostulantById(id: number): Promise<Postulant> {
    try {
      const response = await axios.get(`${API_BASE_URL}/volunteer/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching postulant:', error);
      throw error;
    }
  },

  async updatePostulantStatus(id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<Postulant> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/volunteer/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating postulant status:', error);
      throw error;
    }
  }
}; 