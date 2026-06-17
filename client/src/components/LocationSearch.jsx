import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { LOCATIONS } from '../services/mockAPI';

export default function LocationSearch({ onSelect, activeLabel }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const match = LOCATIONS.find(l =>
      l.label.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      onSelect(match);
      setQuery('');
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      onSelect({
        label:    'Your location',
        lat:      coords.latitude,
        lon:      coords.longitude,
        timezone: 'Africa/Nairobi',
      });
    });
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSearch} style={styles.row}>
        <div style={styles.searchBox}>
          <Search size={14} color="var(--text3)" />
          <input
            style={styles.input}
            placeholder="Search city (e.g. Kampala, Kigali)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleGPS} style={styles.gpsBtn}>
          <MapPin size={13} />
          GPS
        </button>
      </form>

      <div style={styles.pills}>
        {LOCATIONS.map(loc => (
          <button
            key={loc.label}
            onClick={() => onSelect(loc)}
            style={loc.label === activeLabel ? styles.pillActive : styles.pill}
          >
            {loc.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const basePill = {
  fontSize:     11,
  padding:      '4px 12px',
  border:       '1px solid var(--border)',
  borderRadius: 20,
  cursor:       'pointer',
  background:   'var(--bg2)',
  fontFamily:   'monospace',
};

const styles = {
  wrapper: {
    display:       'flex',
    flexDirection: 'column',
    gap:           10,
  },
  row: {
    display: 'flex',
    gap:     8,
  },
  searchBox: {
    flex:         1,
    display:      'flex',
    alignItems:   'center',
    gap:          10,
    background:   'var(--bg2)',
    border:       '1px solid var(--border)',
    borderRadius: 8,
    padding:      '0 14px',
    height:       38,
  },
  input: {
    border:      'none',
    background:  'none',
    fontSize:    13,
    color:       'var(--text)',
    outline:     'none',
    flex:        1,
  },
  gpsBtn: {
    height:       38,
    padding:      '0 14px',
    background:   'var(--bg2)',
    border:       '1px solid var(--border)',
    borderRadius: 8,
    fontSize:     12,
    color:        'var(--text2)',
    cursor:       'pointer',
    display:      'flex',
    alignItems:   'center',
    gap:          6,
  },
  pills: {
    display:   'flex',
    gap:       6,
    flexWrap:  'wrap',
  },
  pill: {
    ...basePill,
    color: 'var(--text2)',
  },
  pillActive: {
    ...basePill,
    color:      'var(--blue-light)',
    background: 'var(--blue-dim)',
    border:     '1px solid var(--blue-glow)',
  },
};