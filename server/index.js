require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const weatherRoutes  = require('./API/Weather');
const insightsRoutes = require('./API/Insights');
const webhookRoutes  = require('./API/WebHooks');
const geocodeRoutes  = require('./API/Geocode');
const { errorHandler } = require('./middleware/errorHandler');
//const { rateLimiter }  = require('./middleware/rateLimiter');

const app  = express();
app.set('trust proxy', 1); // Trust Render's proxy
const PORT = process.env.PORT || 3001;


app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());
//app.use(rateLimiter);

//Routes
app.use('/api/weather',  weatherRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/geocode',  geocodeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    service: 'WeatherGuard API',
    version: '1.0.0',
    sources: {
      weather: 'Open-Meteo — free, no key required',
      ai:      'Google Gemini 2.5 Flash',
    },
    endpoints: [
      'GET  /api/weather?lat=&lon=&timezone=',
      'GET  /api/weather/hourly?lat=&lon=',
      'GET  /api/insights?lat=&lon=&location=&timezone=',
      'GET  /api/geocode?q=',
      'POST /api/webhooks',
      'GET  /api/webhooks',
      'DELETE /api/webhooks/:id',
      'POST /api/webhooks/check',
    ],
  });
});

//404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\nWeatherGuard API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health\n`);
});