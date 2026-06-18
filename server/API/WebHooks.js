const router  = require('express').Router();
const axios   = require('axios');
const { getForecast }     = require('../services/Openmeteo');
const { getAlertMessage } = require('../services/gemini');
const { requireBodyFields } = require('../middleware/validate');

const subscriptions = new Map();
let idCounter = 1;

// Trigger evaluation rules
const TRIGGER_RULES = {
  rain:         (current)        => current.precipitation_mm > 5,
  extreme_wind: (current)        => current.wind_kph > 60,
  frost:        (current)        => current.temp_c < 4,
  drought:      (current, daily) => daily.slice(0, 3).every(d => d.precipitation_mm < 0.5),
};

/**
 * POST /api/webhooks
 * Create a new weather alert subscription
 * Body: { url, lat, lon, triggers: [], location?, timezone? }
 */
router.post('/',
  requireBodyFields('url', 'lat', 'lon', 'triggers'),
  (req, res) => {
    const { url, lat, lon, triggers, location = '', timezone = 'Africa/Nairobi' } = req.body;

    if (!Array.isArray(triggers) || triggers.length === 0) {
      return res.status(400).json({ error: 'triggers must be a non-empty array.' });
    }

    const id  = String(idCounter++);
    const sub = { id, url, lat, lon, triggers, location, timezone, createdAt: new Date().toISOString() };
    subscriptions.set(id, sub);

    res.status(201).json({ id, subscription: sub });
  }
);

/**
 * GET /api/webhooks
 * List all active subscriptions
 */
router.get('/', (req, res) => {
  res.json({ webhooks: Array.from(subscriptions.values()) });
});

/**
 * DELETE /api/webhooks/:id
 * Remove a subscription
 */
router.delete('/:id', (req, res) => {
  if (!subscriptions.has(req.params.id)) {
    return res.status(404).json({ error: 'Subscription not found.' });
  }
  subscriptions.delete(req.params.id);
  res.json({ success: true });
});

/**
 * POST /api/webhooks/check
 * Manually trigger a check across all subscriptions.
 */
router.post('/check', async (req, res) => {
  const results = [];

  for (const sub of subscriptions.values()) {
    try {
      const forecast  = await getForecast(sub.lat, sub.lon, sub.timezone);
      const { current, daily } = forecast;

      const fired = sub.triggers.filter(trigger => {
        const rule = TRIGGER_RULES[trigger];
        return rule ? rule(current, daily) : false;
      });

      if (fired.length === 0) continue;

      const message = await getAlertMessage(fired.join(', '), forecast, sub.location);

      axios.post(sub.url, {
        subscription_id: sub.id,
        location:        sub.location,
        triggers:        fired,
        message,
        current,
      }).catch(err => console.warn(`[Webhook] Failed to deliver to ${sub.url}:`, err.message));

      results.push({ id: sub.id, location: sub.location, triggers: fired, message });

    } catch (err) {
      results.push({ id: sub.id, error: err.message });
    }
  }

  res.json({
    checked: subscriptions.size,
    fired:   results.filter(r => !r.error).length,
    results,
  });
});

module.exports = router;