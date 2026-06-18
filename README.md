# WeatherGuard

> Real-time weather intelligence and AI-powered agricultural advisories for East Africa — built for developers who want to ship farming tools without building a weather layer from scratch.

**Live demo:** `https://weather-guard-orpin.vercel.app`  
**API:** `https://weather-guard.onrender.com/api/health`

---

## What it does

WeatherGuard turns raw weather data into farming decisions, delivered via API.

A developer in Kisumu can call one endpoint and get back not just temperature and rain probability, but a plain-language advisory: *"Moderate rain expected Thursday through Saturday, delay any new planting until Sunday when soil drainage improves. Consider harvesting mature crops before Thursday."*

**Three things WeatherGuard does:**

1. **Real-time forecasts** — 7-day weather for any location in East Africa (or anywhere). Temperature, humidity, wind, rain probability, sunrise/sunset.
2. **AI agricultural advisory** — forecast data fed into Gemini 2.5 Flash to generate a plain-language farming recommendation. Not "30% chance of rain" — instead: "delay planting, irrigate now before the dry spell hits."
3. **Webhook alert subscriptions** — developers register a URL and a trigger rule (rain, frost, extreme wind, drought). When conditions are met, WeatherGuard POSTs a Gemini-generated alert to their endpoint. They pipe it to SMS, Slack, or any downstream system.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · Vite · Tailwind CSS |
| Backend | Node.js · Express |
| Weather data | Open-Meteo (free, no key required) |
| Geocoding | Open-Meteo Geocoding (free, no key required) |
| AI advisory | Google Gemini 2.5 Flash |
| Frontend hosting | Vercel |
| Backend hosting | Render |

---

## Architecture

```
Browser
  │
  ├── Open-Meteo API ────────────────── forecast data (direct, no server)
  ├── Open-Meteo Geocoding API ──────── city search (direct, no server)
  │
  └── Render (Express server)
        │
        ├── POST /api/insights ─────── Gemini 2.5 Flash (AI advisory)
        ├── POST/GET/DELETE /api/webhooks ── alert subscriptions
        └── POST /api/webhooks/check ── trigger evaluation + Gemini alerts
```

### Key architectural decisions

**Weather data goes browser → Open-Meteo directly**

Open-Meteo is a public API with no authentication. Running it through Express added a hop, introduced rate limiting issues (Render's shared IPs got blocked by Open-Meteo in production), and created unnecessary latency. Moving it to the client means each user's own IP makes the request — zero rate limiting, faster responses, no server cost.

**AI advisory goes browser → Express → Gemini**

The Gemini API key must stay server-side. The client POSTs the forecast data it already fetched to Express, which builds the Gemini prompt and returns the advisory. The server never calls Open-Meteo — it only ever calls Gemini. Clean separation of concerns, no double-fetching.

**Forecast-first, advisory-after loading pattern**

Forecast and AI advisory load in two independent calls. Forecast renders immediately. The advisory slots into the UI when ready. Users never stare at a blank screen waiting for Gemini.

**Day-level caching on Gemini responses**

Advisories are cached by lat/lon/date on the server. The same location clicked multiple times in a day returns the cached advisory instantly — no repeat Gemini calls, no quota burn.

**Webhook subscriptions use in-memory storage**

Subscriptions are stored in a `Map` rather than a database. For this stage that's appropriate — zero setup, no external dependency. The swap to Redis or Postgres is a one-file change in `webhooks.js`.

---

## Getting started

### Prerequisites
- Node.js 18+
- Gemini API key — free at https://aistudio.google.com/app/apikey

### Local development

```bash
# Clone and install
git clone https://github.com/smkathambi/weatherguard.git
cd weatherguard
npm install

# Configure
cp server/.env.example server/.env
# Add your key → GEMINI_API_KEY=your_key_here

# Run both server and client
npm run dev
# Client → http://localhost:5173
# Server → http://localhost:3001
```

### Environment variables

**Server (`server/.env`):**
```
PORT=3001
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_key_here
NODE_ENV=development
```

**Client (`client/.env`):**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Deployment

### Backend → Render
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment: `GEMINI_API_KEY`, `CLIENT_URL` (no trailing slash), `NODE_ENV=production`

### Frontend → Vercel
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_API_URL=https://your-backend.onrender.com/api`

### Keeping Render alive
I set up a cron job at https://cron-job.org to ping `GET /api/health` every 10 minutes. Prevents Render from spinning down and losing the Gemini advisory cache.

---

## Adding SMS alerts

When ready to add Africa's Talking SMS:

```bash
npm install africastalking --workspace=server
```

In `server/src/routes/webhooks.js`, add to the `/check` route after generating the alert message:

```js
const AT = require('africastalking')({ apiKey: process.env.AT_API_KEY, username: process.env.AT_USERNAME });
await AT.SMS.send({ to: [subscriberPhone], message });
```
---
##Screenshots

#Dashboard
<img width="1470" height="796" alt="Screenshot 2026-06-18 at 07 42 37" src="https://github.com/user-attachments/assets/ec7111af-8b4f-4c0a-ba88-e38866105281" />

#Search
<img width="1470" height="796" alt="Screenshot 2026-06-18 at 07 43 12" src="https://github.com/user-attachments/assets/5e649498-2c5f-4daa-a253-d78d3e39d331" />


# Alerts Page
<img width="1470" height="796" alt="Screenshot 2026-06-18 at 07 45 48" src="https://github.com/user-attachments/assets/fdbbcea2-cc06-46fb-a7a8-4778ba9ba864" />


## Author

**Sharon Mwenda**
