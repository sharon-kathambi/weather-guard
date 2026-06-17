export default function StatBar({ temp, humidity, wind }) {
  const stats = [
    { label: 'Current temp',  value: temp     ? `${temp}°C`    : '--' },
    { label: 'Humidity',      value: humidity  ? `${humidity}%` : '--' },
    { label: 'Wind speed',    value: wind      ? `${wind} km/h` : '--' },
  ];

  return (
    <div style={styles.row}>
      {stats.map(({ label, value }) => (
        <div key={label} style={styles.stat}>
          <div style={styles.value}>{value}</div>
          <div style={styles.label}>{label}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: {
    display:             'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap:                 8,
  },
  stat: {
    background:   'var(--bg3)',
    border:       '1px solid var(--border2)',
    borderRadius: 8,
    padding:      '10px 14px',
    textAlign:    'center',
  },
  value: {
    fontSize:   22,
    fontWeight: 500,
    color:      'var(--blue-light)',
  },
  label: {
    fontSize:  11,
    color:     'var(--text3)',
    marginTop: 2,
  },
};
