// Ensures lat and lon are present and are valid numbers
function requireLatLon(req, res, next) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon query params are required.' });
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    return res.status(400).json({ error: 'lat and lon must be valid numbers.' });
  }

  if (latNum < -90 || latNum > 90) {
    return res.status(400).json({ error: 'lat must be between -90 and 90.' });
  }

  if (lonNum < -180 || lonNum > 180) {
    return res.status(400).json({ error: 'lon must be between -180 and 180.' });
  }

  next();
}

// Ensures required body fields exist
function requireBodyFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter(f => !req.body[f]);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}.` });
    }
    next();
  };
}

module.exports = { requireLatLon, requireBodyFields };