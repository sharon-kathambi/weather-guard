import { Loader2 } from 'lucide-react';

export default function AIAdvisory({ summary, loading }) {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={loading ? styles.dotPulse : styles.dot} />
        <span style={styles.label}>Gemini AI · Agricultural advisory</span>
        {loading && <Loader2 size={12} color="var(--blue-light)" style={{ marginLeft: 'auto', animation: 'spin 1s linear infinite' }} />}
      </div>

      {loading && !summary && (
        <div style={styles.placeholder}>Generating advisory...</div>
      )}

      {summary && (
        <div style={styles.text}>{summary}</div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background:   'linear-gradient(135deg, var(--bg3) 0%, var(--blue-dim) 100%)',
    border:       '1px solid var(--blue-glow)',
    borderRadius: 12,
    padding:      '16px 18px',
  },
  top: {
    display:     'flex',
    alignItems:  'center',
    gap:         8,
    marginBottom:10,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: '50%',
    background:   'var(--blue)',
    flexShrink:   0,
  },
  dotPulse: {
    width:        6,
    height:       6,
    borderRadius: '50%',
    background:   'var(--blue)',
    flexShrink:   0,
    animation:    'pulse 2s ease-in-out infinite',
  },
  label: {
    fontSize:      10,
    color:         'var(--blue-light)',
    fontFamily:    'monospace',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  text: {
    fontSize:   13,
    color:      '#C9D1D9',
    lineHeight: 1.7,
  },
  placeholder: {
    fontSize: 13,
    color:    'var(--text3)',
  },
};