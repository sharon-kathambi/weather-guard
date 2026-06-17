const router = require('express').Router();
const { getAgriInsight } = require('../services/gemini');
 
router.post('/', async (req, res) => {
  const { forecast, location = '' } = req.body;
 
  if (!forecast?.current || !forecast?.daily) {
    return res.status(400).json({ error: 'forecast data is required in request body.' });
  }
 
  try {
    const summary = await getAgriInsight(forecast, location);
    res.json({ summary });
  } catch (err) {
    console.warn('[Insights] Gemini error:', err.response?.status, err.message);
    res.json({ summary: null, advisory_unavailable: true });
  }
});
 
module.exports = router;