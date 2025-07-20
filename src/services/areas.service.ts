import api from './api';

export interface Area {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface AreasResponse {
  areaStaff: Area[];
}

export class AreasService {
  static async getAreas(): Promise<Area[]> {
    try {
      const response = await api.get<AreasResponse>(`/areas`);
      return response.data.areaStaff;
    } catch (error) {
      console.error('Error fetching areas:', error);
      throw error;
    }
  }
} 