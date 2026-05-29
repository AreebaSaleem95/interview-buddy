import api from './axios';

export async function startInterview(payload) {
  const { data } = await api.post('/interviews/start', payload);
  return data;
}

export async function fetchMyInterviews(params = {}) {
  const { data } = await api.get('/interviews/my-interviews', { params });
  return data;
}

export async function fetchInterview(id) {
  const { data } = await api.get(`/interviews/${id}`);
  return data;
}

export async function submitAnswer(interviewId, body) {
  const { data } = await api.post(`/interviews/${interviewId}/submit-answer`, body);
  return data;
}

export async function completeInterview(interviewId) {
  const { data } = await api.post(`/interviews/${interviewId}/complete`);
  return data;
}
