import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Clock, ShieldAlert, Info } from 'lucide-react';
import { fetchNotifications } from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#16a34a" />;
      case 'assignment':
        return <ShieldAlert size={20} color="#2563eb" />;
      case 'update':
        return <Clock size={20} color="#d97706" />;
      default:
        return <Info size={20} color="#0d9488" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#dcfce7', color: '#15803d', padding: '10px', borderRadius: '12px' }}>
          <Bell size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>Notifications</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time updates regarding your reports and sanitation status.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
        {notifications.map((n) => (
          <div 
            key={n.id} 
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '16px',
              borderBottom: '1px solid #f1f5f9',
              transition: 'background 0.2s'
            }}
          >
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', marginTop: '2px' }}>
              {getIcon(n.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>{n.title}</h4>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '500' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.4' }}>{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
