import api from './api';

export const userService = {
  async resetPassword(token: string, newPassword: string) {
    const response = await api.post('/user/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
  async sendResetPasswordEmail() {
    const response = await api.post('/user/send-reset-password');
    return response.data;
  },
  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }) {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

};
