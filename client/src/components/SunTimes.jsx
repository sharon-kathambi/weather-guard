import { Sunrise, Sunset } from 'lucide-react';

function parseTime(isoString) {
  return isoString?.split('T')[1]?.slice(0, 5) ?? '--';
}

export default function SunTimes({ sunrise, sunset }) {
  return (
    <div style={styles.row}>
      <div style={styles.card}>
        <Sunrise size={20} color="var(--amber)" />
        <div>
          <div style={styles.label}>Sunrise</div>
          <div style={styles.value}>{parseTime(sunrise)}</div>
        </div>
      </div>
      <div style={styles.card}>
        <Sunset size={20} color="var(--amber)" />
        <div>
          <div style={styles.label}>Sunset</div>
          <div style={styles.value}>{parseTime(sunset)}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  row: {
    display:             'grid',
    gridTemplateColumns: '1fr 1fr',
    gap:                 8,
  },
  card: {
    display:      'flex',
    alignItems:   'center',
    gap:          12,
    background:   'var(--bg2)',
    border:       '1px solid var(--border2)',
    borderRadius: 8,
    padding:      '12px 16px',
  },
  label: {
    fontSize: 11,
    color:    'var(--text3)',
  },
  value: {
    fontSize:   15,
    fontWeight: 500,
    color:      'var(--text)',
  },
};
