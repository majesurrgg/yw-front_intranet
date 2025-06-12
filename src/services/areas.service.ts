import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
      const response = await axios.get<AreasResponse>(`${API_URL}/areas`);
      return response.data.areaStaff;
    } catch (error) {
      console.error('Error fetching areas:', error);
      throw error;
    }
  }
} 