const router = require('express').Router();
const { searchCities } = require('../services/Geocoding');

/**
 * GET /api/geocode?q=Lagos
 * Returns matching city results with lat/lon/timezone
 */
router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters.' });
    }

    const results = await searchCities(q);
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;