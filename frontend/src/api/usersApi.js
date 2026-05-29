import api from './axios';

export async function updateProfile(body) {
  const { data } = await api.put('/users/profile', body);
  return data;
}

export async function fetchUserStats() {
  const { data } = await api.get('/users/stats');
  return data;
}
