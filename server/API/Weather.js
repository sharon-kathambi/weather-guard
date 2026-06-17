const router = require('express').Router();
const { getForecast, getHourly } = require('../services/openMeteo');
const { requireLatLon } = require('../middleware/validate');

/**
 * GET /api/weather
 * Returns 7-day forecast + current conditions
 * Query: lat, lon, timezone (optional, default Africa/Nairobi)
 */
router.get('/', requireLatLon, async (req, res, next) => {
  try {
    const { lat, lon, timezone = 'Africa/Nairobi' } = req.query;
    const data = await getForecast(lat, lon, timezone);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/weather/hourly
 * Returns hourly forecast for next 3 days
 * Query: lat, lon, timezone (optional)
 */
router.get('/hourly', requireLatLon, async (req, res, next) => {
  try {
    const { lat, lon, timezone = 'Africa/Nairobi' } = req.query;
    const data = await getHourly(lat, lon, timezone);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;