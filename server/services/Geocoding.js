const axios = require('axios');

const geocoding = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
  timeout: 8000,
});

/**
 * Search for cities by name
 * Returns up to 5 results with lat, lon, timezone, country
 */
async function searchCities(query, count = 5) {
  if (!query || query.trim().length < 2) return [];

  const { data } = await geocoding.get('/search', {
    params: {
      name:     query.trim(),
      count,
      language: 'en',
      format:   'json',
    },
  });

  if (!data.results?.length) return [];

  return data.results.map(r => ({
    label:    r.name,
    country:  r.country,
    region:   r.admin1 || '',
    lat:      r.latitude,
    lon:      r.longitude,
    timezone: r.timezone || 'UTC',
  }));
}

module.exports = { searchCities };