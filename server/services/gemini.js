const axios = require('axios');
const { withRetry } = require('../utils/retry');

const gemini = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  timeout: 30000,
});

// Cache advisories for the full day
const cache = new Map();

function getCacheKey(lat, lon) {
  const today = new Date().toISOString().slice(0, 10);
  return `${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)},${today}`;
}

async function getAgriInsight(forecastData, location = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const { current, daily, location: loc } = forecastData;

  const cacheKey = getCacheKey(loc.lat, loc.lon);
  if (cache.has(cacheKey)) {
    console.log(`[Gemini] Cache hit for ${location || cacheKey}`);
    return cache.get(cacheKey);
  }

  const next3Days = daily.slice(0, 3);

  const prompt = `Agricultural weather advisory for ${location || 'East Africa'}.

Current: ${current.condition}, ${current.temp_c}°C, humidity ${current.humidity}%, wind ${current.wind_kph}km/h, rain today ${current.precipitation_mm}mm.
Next 3 days: ${next3Days.map(d => `${d.date}: ${d.condition}, high ${d.temp_max}°C, ${d.precipitation_probability}% rain chance`).join(' | ')}

Write exactly 3 complete sentences in English for a farmer covering: today conditions, upcoming risks, one specific action. Every sentence must be fully completed.`;

  const { data } = await withRetry(
    () => gemini.post(`/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
    }),
    3,
    2000
  );

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');

  const summary = text.trim();
  cache.set(cacheKey, summary);
  console.log(`[Gemini] Advisory cached for ${location || cacheKey}`);
  return summary;
}

async function getAlertMessage(trigger, forecastData, location = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return `Weather alert: ${trigger} detected${location ? ` in ${location}` : ''}.`;

  const prompt = `Write a 2-sentence SMS weather alert for a farmer. Trigger: ${trigger}. Location: ${location || 'East Africa'}. Current: ${forecastData.current.condition}, ${forecastData.current.temp_c}°C. Be specific and actionable.`;

  try {
    const { data } = await withRetry(
      () => gemini.post(`/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 150 },
      }),
      3,
      2000
    );
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || `Weather alert: ${trigger} detected.`;
  } catch {
    return `Weather alert: ${trigger} conditions detected${location ? ` in ${location}` : ''}. Please take necessary precautions.`;
  }
}

module.exports = { getAgriInsight, getAlertMessage };