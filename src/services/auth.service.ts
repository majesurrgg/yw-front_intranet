import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static logout(): void {
    localStorage.removeItem('user');
  }

  static getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  private static handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Error en el servidor';
      return new Error(message);
    }
    return new Error('Error inesperado');
  }
} 