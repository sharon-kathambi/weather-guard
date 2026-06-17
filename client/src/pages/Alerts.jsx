import { useState, useEffect } from 'react';
import AlertForm        from '../components/AlertForm';
import SubscriptionList from '../components/SubscriptionList';
import { webhooksAPI } from '../services/mockAPI';

export default function Alerts() {
  const [webhooks,    setWebhooks]    = useState([]);
  const [firedAlerts, setFiredAlerts] = useState([]);

  const loadWebhooks = async () => {
    try {
      const data = await webhooksAPI.list();
      setWebhooks(data.webhooks ?? []);
    } catch {
      // Non-fatal — list stays empty
    }
  };

  useEffect(() => { loadWebhooks(); }, []);

  const handleDelete = async (id) => {
    try {
      await webhooksAPI.remove(id);
      setWebhooks(prev => prev.filter(w => w.id !== id));
    } catch {}
  };

  const handleCheckAll = async () => {
    try {
      const data = await webhooksAPI.checkAll();
      setFiredAlerts(data.results ?? []);
    } catch {}
  };

  return (
    <div style={styles.page}>

      <div>
        <div style={styles.eyebrow}>Webhook subscriptions</div>
        <div style={styles.title}>Weather alerts</div>
        <div style={styles.sub}>
          Subscribe to weather triggers. WeatherGuard POSTs to your endpoint when conditions are met.
        </div>
      </div>

      <div style={styles.twoCol}>
        <AlertForm onCreated={loadWebhooks} />
        <SubscriptionList
          webhooks={webhooks}
          firedAlerts={firedAlerts}
          onDelete={handleDelete}
          onCheckAll={handleCheckAll}
        />
      </div>

    </div>
  );
}

const styles = {
  page: {
    display:       'flex',
    flexDirection: 'column',
    gap:           20,
    padding:       24,
    maxWidth:      960,
    margin:        '0 auto',
  },
  eyebrow: {
    fontSize:      10,
    fontFamily:    'monospace',
    color:         'var(--blue)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginBottom:  4,
  },
  title: {
    fontSize:     20,
    fontWeight:   500,
    color:        'var(--text)',
    marginBottom: 4,
  },
  sub: {
    fontSize:   13,
    color:      'var(--text2)',
    lineHeight: 1.6,
  },
  twoCol: {
    display:             'grid',
    gridTemplateColumns: '1fr 1fr',
    gap:                 14,
    alignItems:          'start',
  },
};
