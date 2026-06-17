const axios = require('axios');
const { withRetry } = require('../utils/retry');

const openMeteo = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
});

// Cache forecasts for 30 minutes
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

function getCacheKey(lat, lon, timezone) {
  return `${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)},${timezone}`;
}

function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

const WMO_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
  80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
};

const getCondition = (code) => WMO_CODES[code] || 'Unknown';

async function getForecast(lat, lon, timezone = 'Africa/Nairobi') {
  const key = getCacheKey(lat, lon, timezone);
  const cached = getFromCache(key);
  if (cached) {
    console.log(`[Open-Meteo] Cache hit for ${key}`);
    return cached;
  }

  const { data } = await withRetry(() => openMeteo.get('/forecast', {
    params: {
      latitude:  lat,
      longitude: lon,
      timezone,
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
  }));

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
  console.log(`[Open-Meteo] Fetched and cached for ${key}`);
  return result;
}

async function getHourly(lat, lon, timezone = 'Africa/Nairobi') {
  const key = getCacheKey(lat, lon, `${timezone}-hourly`);
  const cached = getFromCache(key);
  if (cached) return cached;

  const { data } = await withRetry(() => openMeteo.get('/forecast', {
    params: {
      latitude:  lat,
      longitude: lon,
      timezone,
      hourly: [
        'temperature_2m', 'relative_humidity_2m', 'precipitation_probability',
        'precipitation', 'weather_code', 'wind_speed_10m',
      ].join(','),
      forecast_days: 3,
    },
  }));

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
}

module.exports = { getForecast, getHourly, getCondition };