const axios = require('axios');
const { withRetry } = require('../utils/retry');

const gemini = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  timeout: 30000,
});

// Cache advisories for the full day — keyed by lat/lon/date
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

  const prompt = `You are an agricultural weather advisor for East African farmers.
Given the following weather forecast${location ? ` for ${location}` : ''}, provide a concise, practical advisory (3-4 sentences) covering:
1. Current conditions and what they mean for farming activity today
2. Key weather risks or opportunities in the next 3 days
3. One specific planting, irrigation, or harvesting recommendation

Current conditions:
- Temperature: ${current.temp_c}°C (feels like ${current.feels_like_c}°C)
- Humidity: ${current.humidity}%
- Wind: ${current.wind_kph} km/h
- Condition: ${current.condition}
- Precipitation today: ${current.precipitation_mm}mm

Next 3 days:
${next3Days.map(d => `- ${d.date}: ${d.condition}, ${d.temp_min}–${d.temp_max}°C, ${d.precipitation_mm}mm rain, ${d.precipitation_probability}% rain chance`).join('\n')}

Be direct and practical. Write for a farmer, not a meteorologist.`;

  // Retry up to 3 times with 2s base delay — handles Gemini's per-minute quota bursts
  const { data } = await withRetry(
    () => gemini.post(`/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
    }),
    3,   // retries
    2000 // 2s base delay (becomes 2s, 4s, 6s)
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

  const prompt = `Write a brief, urgent SMS-style weather alert (max 2 sentences) for a farmer.
Trigger: ${trigger}
Location: ${location || 'East Africa'}
Current: ${forecastData.current.condition}, ${forecastData.current.temp_c}°C, ${forecastData.current.precipitation_mm}mm rain
Be specific and actionable.`;

  try {
    const { data } = await withRetry(
      () => gemini.post(`/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 100 },
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