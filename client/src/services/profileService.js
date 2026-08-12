import api from '../services/api';

const getProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

const updateProfile = async (data) => {
  const response = await api.put('/profile/me', data);
  return response.data;
};

const uploadAvatar = async (formData) => {
  const response = await api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default { getProfile, updateProfile, uploadAvatar };
