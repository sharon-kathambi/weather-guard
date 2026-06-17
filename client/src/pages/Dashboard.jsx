import { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import LocationSearch from '../components/LocationSearch';
import StatBar        from '../components/StatBar';
import CurrentWeather from '../components/CurrentWeather';
import AIAdvisory     from '../components/AIAdvisory';
import ForecastGrid   from '../components/ForecastGrid';
import SunTimes       from '../components/SunTimes';

export default function Dashboard() {
  const [activeLocation, setActiveLocation] = useState(null);
  const { weather, insights, loading, loadingInsights, error, fetchByLocation } = useWeather();

  const handleSelect = (loc) => {
    setActiveLocation(loc);
    fetchByLocation(loc);
  };

  const today = weather?.daily?.[0];

  return (
    <div style={styles.page}>

      <LocationSearch
        onSelect={handleSelect}
        activeLabel={activeLocation?.label}
      />

      {loading && (
        <div style={styles.loadingMsg}>Fetching forecast...</div>
      )}

      {error && (
        <div style={styles.error}>{error}</div>
      )}

      {weather && !loading && (
        <>
          <StatBar
            temp={weather.current.temp_c}
            humidity={weather.current.humidity}
            wind={weather.current.wind_kph}
          />

          <CurrentWeather
            locationName={activeLocation?.label}
            current={weather.current}
            coords={weather.location}
            timezone={weather.location.timezone}
          />

          <AIAdvisory
            summary={insights?.summary}
            loading={loadingInsights}
          />

          <ForecastGrid days={weather.daily} />

          {today && (
            <SunTimes
              sunrise={today.sunrise}
              sunset={today.sunset}
            />
          )}
        </>
      )}

      {!weather && !loading && (
        <div style={styles.empty}>
          Select a location to get started
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    display:       'flex',
    flexDirection: 'column',
    gap:           16,
    padding:       24,
    maxWidth:      960,
    margin:        '0 auto',
  },
  loadingMsg: {
    textAlign: 'center',
    color:     'var(--text3)',
    fontSize:  13,
    padding:   '40px 0',
  },
  error: {
    background:   'rgba(248,81,73,.1)',
    border:       '1px solid rgba(248,81,73,.3)',
    borderRadius: 8,
    padding:      '10px 14px',
    fontSize:     13,
    color:        'var(--red)',
  },
  empty: {
    textAlign: 'center',
    color:     'var(--text3)',
    fontSize:  13,
    padding:   '80px 0',
  },
};
