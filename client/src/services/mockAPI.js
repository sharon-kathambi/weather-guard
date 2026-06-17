import {
  mockWeather,
  mockInsights,
  mockWebhooks,
  mockFiredAlerts,
  mockLocations,
} from './mockData';

// Simulates network delay so loading states are visible
const delay = (ms = 800) => new Promise(res => setTimeout(res, ms));

export const LOCATIONS = mockLocations;

export const weatherAPI = {
  getForecast: async (lat, lon, timezone) => {
    await delay(600);
    return { ...mockWeather, location: { lat, lon, timezone } };
  },

  getHourly: async () => {
    await delay(500);
    return { hourly: [] };
  },

  getInsights: async (lat, lon, location) => {
    await delay(1400); // slightly slower — mimics Gemini latency
    return { ...mockInsights, location: { lat, lon } };
  },
};

export const webhooksAPI = {
  list: async () => {
    await delay(400);
    return { webhooks: mockWebhooks };
  },

  create: async (payload) => {
    await delay(600);
    return {
      id:          String(Date.now()),
      ...payload,
      createdAt:   new Date().toISOString(),
    };
  },

  remove: async (id) => {
    await delay(300);
    return { success: true };
  },

  checkAll: async () => {
    await delay(1200);
    return { checked: mockWebhooks.length, fired: mockFiredAlerts.length, results: mockFiredAlerts };
  },
};