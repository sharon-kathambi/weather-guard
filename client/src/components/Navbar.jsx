import { Link, useLocation } from 'react-router-dom';
import { Cloud, Bell } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',        label: 'Forecast', icon: Cloud },
  { to: '/alerts',  label: 'Alerts',   icon: Bell  },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <div style={styles.dot} />
        <span style={styles.brandName}>
          Weather<span style={{ color: 'var(--blue)' }}>Guard</span>
        </span>
        <span style={styles.version}>v1.0</span>
      </div>

      <div style={styles.links}>
        {NAV_LINKS.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={active ? styles.linkActive : styles.link}>
                <Icon size={14} />
                {label}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background:    'var(--bg2)',
    borderBottom:  '1px solid var(--border)',
    padding:       '0 24px',
    height:        52,
    display:       'flex',
    alignItems:    'center',
    justifyContent:'space-between',
  },
  brand: {
    display:    'flex',
    alignItems: 'center',
    gap:        8,
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: '50%',
    background:   'var(--blue)',
  },
  brandName: {
    fontSize:      15,
    fontWeight:    500,
    color:         'var(--text)',
    letterSpacing: '-0.01em',
  },
  version: {
    fontSize:      10,
    padding:       '2px 6px',
    background:    'var(--blue-dim)',
    color:         'var(--blue-light)',
    borderRadius:  4,
    fontFamily:    'monospace',
  },
  links: {
    display: 'flex',
    gap:     4,
  },
  link: {
    display:      'flex',
    alignItems:   'center',
    gap:          5,
    fontSize:     12,
    padding:      '5px 14px',
    borderRadius: 6,
    color:        'var(--text2)',
    cursor:       'pointer',
  },
  linkActive: {
    display:      'flex',
    alignItems:   'center',
    gap:          5,
    fontSize:     12,
    padding:      '5px 14px',
    borderRadius: 6,
    color:        'var(--blue-light)',
    background:   'var(--blue-dim)',
    border:       '0.5px solid var(--blue-glow)',
    cursor:       'pointer',
  },
};