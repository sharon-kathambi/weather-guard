import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { LOCATIONS, geocodeAPI } from '../services/api';

// Debounce helper — waits for user to stop typing before searching
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function LocationSearch({ onSelect, activeLabel }) {
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState([]);
  const [searching,   setSearching]   = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Check if it matches a quick location first — no network call needed
    const quickMatch = LOCATIONS.filter(l =>
      l.label.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const search = async () => {
      setSearching(true);
      try {
        const apiResults = await geocodeAPI.search(debouncedQuery);
        const merged = [
          ...quickMatch,
          ...apiResults.filter(r =>
            !quickMatch.some(q => q.label.toLowerCase() === r.label.toLowerCase())
          ),
        ];
        setResults(merged.slice(0, 6));
        setShowResults(true);
      } catch {
        setResults(quickMatch);
        setShowResults(quickMatch.length > 0);
      } finally {
        setSearching(false);
      }
    };

    search();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (loc) => {
    onSelect(loc);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      handleSelect({
        label:    'Your location',
        lat:      coords.latitude,
        lon:      coords.longitude,
        timezone: 'Africa/Nairobi',
      });
    });
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div style={styles.wrapper} ref={wrapperRef}>

      {/* Search bar */}
      <div style={styles.row}>
        <div style={styles.searchBox}>
          {searching
            ? <Loader2 size={14} color="var(--blue)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            : <Search size={14} color="var(--text3)" style={{ flexShrink: 0 }} />
          }
          <input
            style={styles.input}
            placeholder="Search any city worldwide..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
          />
          {query && (
            <button onClick={handleClear} style={styles.clearBtn}>
              <X size={13} />
            </button>
          )}
        </div>
        <button onClick={handleGPS} style={styles.gpsBtn}>
          <MapPin size={13} /> GPS
        </button>
      </div>

      {/* Dropdown results */}
      {showResults && results.length > 0 && (
        <div style={styles.dropdown}>
          {results.map((loc, i) => (
            <button
              key={i}
              onClick={() => handleSelect(loc)}
              style={styles.result}
            >
              <MapPin size={12} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={styles.resultName}>{loc.label}</div>
                <div style={styles.resultSub}>
                  {[loc.region, loc.country].filter(Boolean).join(', ') || loc.timezone}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quick location pills */}
      <div style={styles.pills}>
        {LOCATIONS.map(loc => (
          <button
            key={loc.label}
            onClick={() => handleSelect(loc)}
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
    position:      'relative',
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
    border:     'none',
    background: 'none',
    fontSize:   13,
    color:      'var(--text)',
    outline:    'none',
    flex:       1,
  },
  clearBtn: {
    background: 'none',
    border:     'none',
    cursor:     'pointer',
    color:      'var(--text3)',
    padding:    0,
    display:    'flex',
    alignItems: 'center',
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
  dropdown: {
    position:     'absolute',
    top:          46,
    left:         0,
    right:        52,
    background:   'var(--bg2)',
    border:       '1px solid var(--border)',
    borderRadius: 8,
    zIndex:       100,
    overflow:     'hidden',
    boxShadow:    '0 8px 24px rgba(0,0,0,.4)',
  },
  result: {
    width:      '100%',
    display:    'flex',
    alignItems: 'flex-start',
    gap:        10,
    padding:    '10px 14px',
    background: 'none',
    border:     'none',
    borderBottom: '1px solid var(--border2)',
    cursor:     'pointer',
    textAlign:  'left',
  },
  resultName: {
    fontSize:   13,
    color:      'var(--text)',
    fontWeight: 500,
  },
  resultSub: {
    fontSize:  11,
    color:     'var(--text3)',
    marginTop: 2,
  },
  pills: {
    display:  'flex',
    gap:      6,
    flexWrap: 'wrap',
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