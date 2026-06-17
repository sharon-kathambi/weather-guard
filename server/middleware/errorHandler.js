/**
 * errorHandler.js — global Express error handler
 * Catches anything passed to next(err) across all routes
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message);

  // Upstream API error (Open-Meteo / Gemini returned a non-2xx)
  if (err.response) {
    const { status, data } = err.response;
    return res.status(status).json({
      error:  data?.error || data?.message || 'Upstream API error.',
      status,
    });
  }

  // Axios timeout
  if (err.code === 'ECONNABORTED') {
    return res.status(504).json({ error: 'Request to upstream API timed out.' });
  }

  // Network / DNS failure
  if (err.code === 'ENOTFOUND') {
    return res.status(503).json({ error: 'Could not reach upstream API. Check your network.' });
  }

  // Catch-all
  res.status(500).json({ error: err.message || 'Internal server error.' });
};

module.exports = { errorHandler };