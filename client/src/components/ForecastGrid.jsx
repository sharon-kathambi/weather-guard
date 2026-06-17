import { CloudRain } from 'lucide-react';

const WMO_EMOJI = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️',
};

function dayLabel(dateStr, index) {
  if (index === 0) return 'Today';
  return new Date(dateStr).toLocaleDateString('en', { weekday: 'short' });
}

export default function ForecastGrid({ days = [] }) {
  if (!days.length) return null;

  return (
    <div>
      <div style={styles.sectionLabel}>7-day forecast</div>
      <div style={styles.grid}>
        {days.slice(0, 7).map((day, i) => (
          <div key={day.date} style={i === 0 ? styles.dayToday : styles.day}>
            <div style={i === 0 ? styles.dayNameToday : styles.dayName}>
              {dayLabel(day.date, i)}
            </div>
            <div style={styles.emoji}>{WMO_EMOJI[day.weather_code] ?? '🌡️'}</div>
            <div style={styles.hi}>{day.temp_max}°</div>
            <div style={styles.lo}>{day.temp_min}°</div>
            <div style={styles.rain}>
              <CloudRain size={10} />
              {day.precipitation_probability}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const base = {
  border:       '1px solid var(--border2)',
  borderRadius: 8,
  padding:      '10px 6px',
  textAlign:    'center',
};

const styles = {
  sectionLabel: {
    fontSize:      10,
    fontFamily:    'monospace',
    color:         'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom:  10,
  },
  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap:                 6,
  },
  day: {
    ...base,
    background: 'var(--bg2)',
  },
  dayToday: {
    ...base,
    background: 'var(--blue-dim)',
    border:     '1px solid var(--blue-glow)',
  },
  dayName: {
    fontSize:    10,
    color:       'var(--text3)',
    marginBottom:4,
    fontFamily:  'monospace',
  },
  dayNameToday: {
    fontSize:    10,
    color:       'var(--blue-light)',
    marginBottom:4,
    fontFamily:  'monospace',
  },
  emoji: {
    fontSize: 18,
    margin:   '4px 0',
  },
  hi: {
    fontSize:   13,
    fontWeight: 500,
    color:      'var(--text)',
  },
  lo: {
    fontSize: 11,
    color:    'var(--text3)',
  },
  rain: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            2,
    fontSize:       10,
    color:          'var(--blue)',
    marginTop:      4,
  },
};
