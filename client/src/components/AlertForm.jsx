import { useState } from 'react';
import { Bell, Link, MapPin } from 'lucide-react';
import { LOCATIONS } from '../services/api';

const TRIGGERS = [
  { key: 'rain',         label: 'Rain',         icon: '🌧️' },
  { key: 'extreme_wind', label: 'Extreme wind',  icon: '💨' },
  { key: 'frost',        label: 'Frost',         icon: '❄️' },
  { key: 'drought',      label: 'Drought',       icon: '☀️' },
];

export default function AlertForm({ onCreated }) {
  const [url,      setUrl]      = useState('');
  const [location, setLocation] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const toggleTrigger = (key) => {
    setTriggers(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    const loc = LOCATIONS.find(l => l.label === location);
    if (!url || !loc || !triggers.length) {
      setError('Fill in all fields and select at least one trigger.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/webhooks', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url, lat: loc.lat, lon: loc.lon, triggers, location: loc.label }),
      });
      if (!res.ok) throw new Error('Failed to create subscription.');
      setUrl('');
      setLocation('');
      setTriggers([]);
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.title}>
        <Bell size={15} color="var(--blue)" />
        New subscription
      </div>

      <div style={styles.field}>
        <div style={styles.fieldLabel}>Webhook URL</div>
        <div style={styles.inputRow}>
          <Link size={13} color="var(--text3)" />
          <input
            style={styles.input}
            placeholder="https://yourapp.co/webhook"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.field}>
        <div style={styles.fieldLabel}>Location</div>
        <div style={styles.inputRow}>
          <MapPin size={13} color="var(--text3)" />
          <select
            style={styles.select}
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            <option value="">Select a city</option>
            {LOCATIONS.map(l => (
              <option key={l.label} value={l.label}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.field}>
        <div style={styles.fieldLabel}>Triggers</div>
        <div style={styles.triggersGrid}>
          {TRIGGERS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => toggleTrigger(key)}
              style={triggers.includes(key) ? styles.triggerOn : styles.trigger}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button onClick={handleSubmit} disabled={loading} style={styles.submitBtn}>
        <Bell size={14} />
        {loading ? 'Creating...' : 'Create alert'}
      </button>
    </div>
  );
}

const baseInput = {
  flex:        1,
  border:      'none',
  background:  'none',
  fontSize:    13,
  color:       'var(--text)',
  outline:     'none',
};

const baseTrigger = {
  display:      'flex',
  alignItems:   'center',
  gap:          7,
  fontSize:     12,
  padding:      '8px 10px',
  border:       '1px solid var(--border)',
  borderRadius: 6,
  cursor:       'pointer',
};

const styles = {
  card: {
    background:   'var(--bg2)',
    border:       '1px solid var(--border)',
    borderRadius: 12,
    padding:      '18px 20px',
  },
  title: {
    display:      'flex',
    alignItems:   'center',
    gap:          7,
    fontSize:     13,
    fontWeight:   500,
    color:        'var(--text)',
    marginBottom: 14,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize:      10,
    color:         'var(--text3)',
    marginBottom:  5,
    fontFamily:    'monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  inputRow: {
    display:      'flex',
    alignItems:   'center',
    gap:          8,
    background:   'var(--bg3)',
    border:       '1px solid var(--border)',
    borderRadius: 6,
    padding:      '0 12px',
    height:       34,
  },
  input:  { ...baseInput },
  select: { ...baseInput, cursor: 'pointer' },
  triggersGrid: {
    display:             'grid',
    gridTemplateColumns: '1fr 1fr',
    gap:                 6,
  },
  trigger: {
    ...baseTrigger,
    background: 'var(--bg3)',
    color:      'var(--text2)',
  },
  triggerOn: {
    ...baseTrigger,
    background: 'var(--blue-dim)',
    border:     '1px solid var(--blue-glow)',
    color:      'var(--blue-light)',
  },
  error: {
    fontSize:     12,
    color:        'var(--red)',
    background:   'var(--red-dim)',
    border:       '1px solid rgba(248,81,73,.3)',
    borderRadius: 6,
    padding:      '8px 12px',
    marginBottom: 10,
  },
  submitBtn: {
    width:        '100%',
    height:       36,
    background:   'var(--blue)',
    border:       'none',
    borderRadius: 6,
    color:        '#fff',
    fontSize:     13,
    fontWeight:   500,
    cursor:       'pointer',
    display:      'flex',
    alignItems:   'center',
    justifyContent:'center',
    gap:          6,
    marginTop:    14,
  },
};
