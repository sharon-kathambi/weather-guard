import { useState } from 'react';
import { MapPin, Trash2, RefreshCw } from 'lucide-react';

const PILL_STYLE = {
  rain:         { background: 'var(--blue-dim)',  color: 'var(--blue-light)', border: '1px solid var(--blue-glow)' },
  extreme_wind: { background: 'var(--amber-dim)', color: 'var(--amber)',      border: '1px solid #5C3A0F' },
  frost:        { background: 'var(--red-dim)',   color: 'var(--red)',        border: '1px solid #5C1A1A' },
  drought:      { background: 'var(--green-dim)', color: 'var(--green)',      border: '1px solid #1A5C30' },
};

function TriggerPill({ trigger }) {
  const pill = PILL_STYLE[trigger] ?? PILL_STYLE.rain;
  return (
    <span style={{ ...styles.pill, ...pill }}>{trigger.replace('_', ' ')}</span>
  );
}

export default function SubscriptionList({ webhooks, firedAlerts, onDelete, onCheckAll }) {
  const [checking, setChecking] = useState(false);

  const handleCheckAll = async () => {
    setChecking(true);
    await onCheckAll?.();
    setChecking(false);
  };

  return (
    <div style={styles.col}>

      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>Active subscriptions</span>
          <span style={styles.count}>{webhooks.length}</span>
        </div>

        {webhooks.length === 0 && (
          <div style={styles.empty}>No subscriptions yet</div>
        )}

        {webhooks.map(wh => (
          <div key={wh.id} style={styles.subItem}>
            <div style={styles.subTop}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.subUrl}>{wh.url}</div>
                <div style={styles.subLoc}>
                  <MapPin size={11} />
                  {wh.location || `${wh.lat}, ${wh.lon}`}
                </div>
              </div>
              <button onClick={() => onDelete?.(wh.id)} style={styles.deleteBtn}>
                <Trash2 size={13} />
              </button>
            </div>
            <div style={styles.pillRow}>
              {wh.triggers?.map(t => <TriggerPill key={t} trigger={t} />)}
            </div>
          </div>
        ))}

        <button onClick={handleCheckAll} disabled={checking} style={styles.checkBtn}>
          <RefreshCw size={13} color="var(--blue)" />
          {checking ? 'Checking...' : 'Check all now'}
        </button>
      </div>

      {firedAlerts?.length > 0 && (
        <div style={styles.firedCard}>
          <div style={styles.firedLabel}>
            <div style={styles.firedDot} />
            Last check — {firedAlerts.length} alert{firedAlerts.length > 1 ? 's' : ''} fired
          </div>

          {firedAlerts.map((alert, i) => (
            <div key={i} style={i < firedAlerts.length - 1 ? styles.firedItem : styles.firedItemLast}>
              <div style={styles.firedLoc}>
                <MapPin size={11} />
                {alert.location || alert.id}
              </div>
              <span style={styles.firedTrigger}>{alert.triggers?.join(', ')}</span>
              <div style={styles.firedMsg}>{alert.message}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

const styles = {
  col: {
    display:       'flex',
    flexDirection: 'column',
    gap:           12,
  },
  card: {
    background:   'var(--bg2)',
    border:       '1px solid var(--border)',
    borderRadius: 12,
    padding:      '18px 20px',
  },
  cardTitle: {
    display:      'flex',
    alignItems:   'center',
    justifyContent:'space-between',
    fontSize:     13,
    fontWeight:   500,
    color:        'var(--text)',
    marginBottom: 14,
  },
  count: {
    fontSize:     10,
    padding:      '2px 7px',
    background:   'var(--bg3)',
    color:        'var(--text3)',
    borderRadius: 20,
    fontFamily:   'monospace',
  },
  empty: {
    fontSize:  12,
    color:     'var(--text3)',
    textAlign: 'center',
    padding:   '16px 0',
  },
  subItem: {
    background:   'var(--bg3)',
    border:       '1px solid var(--border2)',
    borderRadius: 8,
    padding:      '12px 14px',
    marginBottom: 8,
  },
  subTop: {
    display:      'flex',
    alignItems:   'flex-start',
    gap:          8,
    marginBottom: 8,
  },
  subUrl: {
    fontSize:      12,
    fontFamily:    'monospace',
    color:         'var(--text)',
    overflow:      'hidden',
    textOverflow:  'ellipsis',
    whiteSpace:    'nowrap',
  },
  subLoc: {
    display:    'flex',
    alignItems: 'center',
    gap:        4,
    fontSize:   11,
    color:      'var(--text3)',
    marginTop:  2,
  },
  deleteBtn: {
    flexShrink:   0,
    background:   'none',
    border:       '1px solid var(--border)',
    borderRadius: 4,
    cursor:       'pointer',
    color:        'var(--text3)',
    padding:      '3px 6px',
    lineHeight:   1,
  },
  pillRow: {
    display:  'flex',
    gap:      4,
    flexWrap: 'wrap',
  },
  pill: {
    fontSize:     10,
    padding:      '3px 8px',
    borderRadius: 20,
    fontFamily:   'monospace',
  },
  checkBtn: {
    width:          '100%',
    height:         32,
    border:         '1px solid var(--border)',
    borderRadius:   6,
    background:     'var(--bg3)',
    fontSize:       12,
    color:          'var(--text2)',
    cursor:         'pointer',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            6,
    marginTop:      12,
  },
  firedCard: {
    background:   'var(--amber-dim)',
    border:       '1px solid #5C3A0F',
    borderRadius: 12,
    padding:      '16px 18px',
  },
  firedLabel: {
    display:       'flex',
    alignItems:    'center',
    gap:           8,
    fontSize:      10,
    fontFamily:    'monospace',
    color:         'var(--amber)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom:  10,
  },
  firedDot: {
    width:        6,
    height:       6,
    borderRadius: '50%',
    background:   'var(--amber)',
    animation:    'pulse 2s ease-in-out infinite',
  },
  firedItem: {
    padding:      '10px 0',
    borderBottom: '1px solid rgba(240,136,62,.2)',
  },
  firedItemLast: {
    padding: '10px 0 0',
  },
  firedLoc: {
    display:     'flex',
    alignItems:  'center',
    gap:         5,
    fontSize:    10,
    color:       'var(--amber)',
    fontFamily:  'monospace',
    marginBottom:4,
  },
  firedTrigger: {
    display:       'inline-block',
    fontSize:      10,
    padding:       '2px 7px',
    background:    'rgba(240,136,62,.2)',
    color:         'var(--amber)',
    borderRadius:  4,
    marginBottom:  6,
    fontFamily:    'monospace',
  },
  firedMsg: {
    fontSize:   13,
    color:      '#C9A87A',
    lineHeight: 1.6,
  },
};
