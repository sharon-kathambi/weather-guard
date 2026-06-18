import { useState, useCallback } from 'react';
import { weatherAPI } from '../services/api';

export function useWeather() {
  const [weather,         setWeather]         = useState(null);
  const [insights,        setInsights]        = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error,           setError]           = useState(null);

  const fetchByLocation = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    setInsights(null);

    let forecast = null;
    try {
      forecast = await weatherAPI.getForecast(loc.lat, loc.lon, loc.timezone);
      setWeather(forecast);
    } catch (err) {
      setError('Failed to fetch weather data.');
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }

    setLoadingInsights(true);
    try {
      const data = await weatherAPI.getInsights(forecast, loc.label);
      setInsights(data);
    } catch {
      setInsights({ summary: null, advisory_unavailable: true });
    } finally {
      setLoadingInsights(false);
    }
  }, []);

  const fetchByCoords = useCallback((lat, lon, label = '', timezone = 'Africa/Nairobi') => {
    fetchByLocation({ lat, lon, label, timezone });
  }, [fetchByLocation]);

  return {
    weather,
    insights,
    loading,
    loadingInsights,
    error,
    fetchByLocation,
    fetchByCoords,
  };
}