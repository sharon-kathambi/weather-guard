import axios from 'axios';

// Server — only Gemini insights and webhooks
const server = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Open-Meteo — called directly from browser
const openMeteo = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
});

// Open-Meteo Geocoding — called directly from browser
const geocoding = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
});

// ─── Simple client-side cache — 30 minutes ────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}
function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── WMO weather codes ────────────────────────────────────────────────────────
const WMO_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail',
};
const getCondition = (code) => WMO_CODES[code] || 'Unknown';

// ─── Locations ────────────────────────────────────────────────────────────────
export const LOCATIONS = [
  { label: 'Nairobi',       lat: -1.2921, lon:  36.8219, timezone: 'Africa/Nairobi'       },
  { label: 'Kisumu',        lat: -0.0917, lon:  34.7679, timezone: 'Africa/Nairobi'       },
  { label: 'Mombasa',       lat: -4.0435, lon:  39.6682, timezone: 'Africa/Nairobi'       },
  { label: 'Kampala',       lat:  0.3476, lon:  32.5825, timezone: 'Africa/Kampala'       },
  { label: 'Dar es Salaam', lat: -6.7924, lon:  39.2083, timezone: 'Africa/Dar_es_Salaam' },
  { label: 'Kigali',        lat: -1.9441, lon:  30.0619, timezone: 'Africa/Kigali'        },
  { label: 'Addis Ababa',   lat:  9.0320, lon:  38.7469, timezone: 'Africa/Addis_Ababa'   },
];

// ─── Weather API ──────────────────────────────────────────────────────────────
export const weatherAPI = {
  getForecast: async (lat, lon, timezone = 'Africa/Nairobi') => {
    const key = `forecast:${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)}`;
    const cached = getCached(key);
    if (cached) return cached;

    const { data } = await openMeteo.get('/forecast', {
      params: {
        latitude: lat, longitude: lon, timezone,
        current: [
          'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
          'weather_code', 'wind_speed_10m', 'wind_direction_10m', 'precipitation',
        ].join(','),
        daily: [
          'weather_code', 'temperature_2m_max', 'temperature_2m_min',
          'precipitation_sum', 'precipitation_probability_max',
          'wind_speed_10m_max', 'sunrise', 'sunset',
        ].join(','),
        forecast_days: 7,
      },
    });

    const result = {
      location: { lat: parseFloat(lat), lon: parseFloat(lon), timezone: data.timezone },
      current: {
        temp_c:           data.current.temperature_2m,
        feels_like_c:     data.current.apparent_temperature,
        humidity:         data.current.relative_humidity_2m,
        wind_kph:         data.current.wind_speed_10m,
        wind_direction:   data.current.wind_direction_10m,
        precipitation_mm: data.current.precipitation,
        condition:        getCondition(data.current.weather_code),
        weather_code:     data.current.weather_code,
      },
      daily: data.daily.time.map((date, i) => ({
        date,
        condition:                 getCondition(data.daily.weather_code[i]),
        weather_code:              data.daily.weather_code[i],
        temp_max:                  data.daily.temperature_2m_max[i],
        temp_min:                  data.daily.temperature_2m_min[i],
        precipitation_mm:          data.daily.precipitation_sum[i],
        precipitation_probability: data.daily.precipitation_probability_max[i],
        wind_max_kph:              data.daily.wind_speed_10m_max[i],
        sunrise:                   data.daily.sunrise[i],
        sunset:                    data.daily.sunset[i],
      })),
    };

    setCache(key, result);
    return result;
  },

  getHourly: async (lat, lon, timezone = 'Africa/Nairobi') => {
    const key = `hourly:${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)}`;
    const cached = getCached(key);
    if (cached) return cached;

    const { data } = await openMeteo.get('/forecast', {
      params: {
        latitude: lat, longitude: lon, timezone,
        hourly: [
          'temperature_2m', 'relative_humidity_2m', 'precipitation_probability',
          'precipitation', 'weather_code', 'wind_speed_10m',
        ].join(','),
        forecast_days: 3,
      },
    });

    const result = {
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      hourly: data.hourly.time.map((time, i) => ({
        time,
        temp_c:                    data.hourly.temperature_2m[i],
        humidity:                  data.hourly.relative_humidity_2m[i],
        precipitation_probability: data.hourly.precipitation_probability[i],
        precipitation_mm:          data.hourly.precipitation[i],
        condition:                 getCondition(data.hourly.weather_code[i]),
        wind_kph:                  data.hourly.wind_speed_10m[i],
      })),
    };

    setCache(key, result);
    return result;
  },

  // Insights go through server (Gemini key stays secret)
  getInsights: (forecast, location = '') =>
    server.post('/insights', { forecast, location }).then(r => r.data),
};

// ─── Geocoding ────────────────────────────────────────────────────────────────
export const geocodeAPI = {
  search: async (q) => {
    if (!q || q.trim().length < 2) return [];
    const key = `geo:${q.trim().toLowerCase()}`;
    const cached = getCached(key);
    if (cached) return cached;

    const { data } = await geocoding.get('/search', {
      params: { name: q.trim(), count: 6, language: 'en', format: 'json' },
    });

    const results = (data.results || []).map(r => ({
      label:    r.name,
      country:  r.country,
      region:   r.admin1 || '',
      lat:      r.latitude,
      lon:      r.longitude,
      timezone: r.timezone || 'UTC',
    }));

    setCache(key, results);
    return results;
  },
};

// ─── Webhooks ─────────────────────────────────────────────────────────────────
export const webhooksAPI = {
  create:   (payload) => server.post('/webhooks', payload).then(r => r.data),
  list:     ()        => server.get('/webhooks').then(r => r.data),
  remove:   (id)      => server.delete(`/webhooks/${id}`).then(r => r.data),
  checkAll: ()        => server.post('/webhooks/check').then(r => r.data),
};