import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';

const WMO_EMOJI = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️',
};

export default function CurrentWeather({ locationName, current, coords, timezone }) {
  if (!current) return null;

  const emoji = WMO_EMOJI[current.weather_code] ?? '🌡️';

  const metrics = [
    { icon: Thermometer, label: 'Temperature', value: `${current.temp_c}°C`,     sub: `Feels like ${current.feels_like_c}°C` },
    { icon: Droplets,    label: 'Humidity',    value: `${current.humidity}%`,     sub: current.condition },
    { icon: Wind,        label: 'Wind',        value: `${current.wind_kph} km/h`, sub: `Direction ${current.wind_direction}°` },
    { icon: CloudRain,   label: 'Rain today',  value: `${current.precipitation_mm}mm`, sub: 'current' },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div>
          <div style={styles.locName}>{locationName}</div>
          <div style={styles.locMeta}>
            {coords?.lat?.toFixed(4)}, {coords?.lon?.toFixed(4)} · {timezone} · Open-Meteo
          </div>
        </div>
        <div style={styles.topRight}>
          <span style={styles.emoji}>{emoji}</span>
          <span style={styles.livePill}>live</span>
        </div>
      </div>

      <div style={styles.metrics}>
        {metrics.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} style={styles.metric}>
            <div style={styles.metricLabel}>
              <Icon size={13} color="var(--blue)" />
              {label}
            </div>
            <div style={styles.metricVal}>{value}</div>
            <div style={styles.metricSub}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background:   'var(--bg2)',
    border:       '1px solid var(--border)',
    borderRadius: 12,
    padding:      '20px 22px',
  },
  top: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    marginBottom:   18,
  },
  locName: {
    fontSize:   17,
    fontWeight: 500,
    color:      'var(--text)',
  },
  locMeta: {
    fontSize:   11,
    color:      'var(--text3)',
    marginTop:  3,
    fontFamily: 'monospace',
  },
  topRight: {
    display:    'flex',
    alignItems: 'center',
    gap:        12,
  },
  emoji: {
    fontSize:   42,
    lineHeight: 1,
  },
  livePill: {
    fontSize:     10,
    padding:      '3px 8px',
    background:   'rgba(59,139,212,.15)',
    color:        'var(--blue-light)',
    border:       '1px solid var(--blue-glow)',
    borderRadius: 20,
    fontFamily:   'monospace',
  },
  metrics: {
    display:             'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap:                 8,
  },
  metric: {
    background:   'var(--bg3)',
    border:       '1px solid var(--border2)',
    borderRadius: 8,
    padding:      '12px 14px',
  },
  metricLabel: {
    display:     'flex',
    alignItems:  'center',
    gap:         5,
    fontSize:    11,
    color:       'var(--text3)',
    marginBottom:6,
  },
  metricVal: {
    fontSize:   20,
    fontWeight: 500,
    color:      'var(--text)',
    lineHeight: 1,
  },
  metricSub: {
    fontSize:  11,
    color:     'var(--text3)',
    marginTop: 4,
  },
};
