import api from './api';

export const authService = {
  async resetPassword(token: string, newPassword: string) {
    const response = await api.post('/user/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};
