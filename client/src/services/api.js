import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

// Named locations with timezones for East Africa
export const LOCATIONS = [
  { label: 'Nairobi', lat: -1.2921, lon: 36.8219, timezone: 'Africa/Nairobi' },
  { label: 'Kisumu', lat: -0.0917, lon: 34.7679, timezone: 'Africa/Nairobi' },
  { label: 'Mombasa', lat: -4.0435, lon: 39.6682, timezone: 'Africa/Nairobi' },
  { label: 'Kampala', lat: 0.3476, lon: 32.5825, timezone: 'Africa/Kampala' },
  { label: 'Dar es Salaam', lat: -6.7924, lon: 39.2083, timezone: 'Africa/Dar_es_Salaam' },
  { label: 'Kigali', lat: -1.9441, lon: 30.0619, timezone: 'Africa/Kigali' },
  { label: 'Addis Ababa', lat: 9.0320, lon: 38.7469, timezone: 'Africa/Addis_Ababa' },
];

export const weatherAPI = {
  getForecast: (lat, lon, timezone = 'Africa/Nairobi') =>
    api.get('/weather', { params: { lat, lon, timezone } }).then(r => r.data),

  getHourly: (lat, lon, timezone = 'Africa/Nairobi') =>
    api.get('/weather/hourly', { params: { lat, lon, timezone } }).then(r => r.data),

  getInsights: (lat, lon, location = '', timezone = 'Africa/Nairobi') =>
    api.get('/insights', { params: { lat, lon, location, timezone } }).then(r => r.data),
};

export const webhooksAPI = {
  create: (payload) => api.post('/webhooks', payload).then(r => r.data),
  list: () => api.get('/webhooks').then(r => r.data),
  remove: (id) => api.delete(`/webhooks/${id}`).then(r => r.data),
  checkAll: () => api.post('/webhooks/check').then(r => r.data),
};