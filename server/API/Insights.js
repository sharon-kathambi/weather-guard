const router = require('express').Router();
const { getForecast } = require('../services/Openmeteo')
const { getAgriInsight } = require('../services/gemini');
const { requireLatLon } = require('../middleware/validate');

/**
 * GET /api/insights
 * Returns 7-day forecast + Gemini AI agricultural advisory
 * Query: lat, lon, location (optional display name), timezone (optional)
 */
router.get('/', requireLatLon, async (req, res, next) => {
  try {
    const { lat, lon, location = '', timezone = 'Africa/Nairobi' } = req.query;

    // Fetch forecast first — Gemini needs this data to build the prompt
    const forecast = await getForecast(lat, lon, timezone);
    const summary  = await getAgriInsight(forecast, location);

    res.json({ ...forecast, summary });
  } catch (err) {
    next(err);
  }
});

module.exports = router;