import api from './axios';

// LOGIN
export const loginUser = (data) => {
  return api.post('/auth/login', data);
};

// REGISTER
export const registerUser = (data) => {
  return api.post('/auth/register', data);
};

export async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logoutRequest() {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
