import React, { useState, useEffect } from 'react';
import { PieChart as PieIcon, BarChart2, CheckCircle2, Clock, AlertTriangle, RefreshCw, Layers, Lock, Key, LogOut, ShieldCheck } from 'lucide-react';
import { fetchReports } from '../services/api';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports().then(setReports);
    }
  }, [isAuthenticated]);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const cleanPwd = passwordInput.trim();
    if (cleanPwd === '@ECOVISION' || cleanPwd === '@ECOVISON' || cleanPwd.toUpperCase() === '@ECOVISION' || cleanPwd.toUpperCase() === '@ECOVISON') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Password. Please enter @ECOVISION to unlock.');
    }
  };

  // Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '480px', margin: '60px auto', padding: '0 16px' }}>
        <div className="glass-card" style={{ padding: '36px 28px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ width: '64px', height: '64px', background: '#fef3c7', color: '#d97706', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
            System Admin Portal
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' }}>
            Restricted Admin Area. Please enter the System Admin password to access analytics.
          </p>

          <form onSubmit={handleAuthSubmit}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '16px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Admin Access Password</label>
              <input 
                type="password"
                className="form-control"
                placeholder="Enter @ECOVISION"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>

            {authError && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '16px' }}>
                {authError}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem', background: '#d97706' }}>
              <ShieldCheck size={18} /> Authenticate Admin Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalReports = 24;
  const resolved = 18;
  const pending = 6;

  const distribution = [
    { type: 'Plastic', count: 8, percent: '33%', color: '#2563eb' },
    { type: 'Organic', count: 6, percent: '25%', color: '#16a34a' },
    { type: 'Paper', count: 4, percent: '17%', color: '#ca8a04' },
    { type: 'Metal', count: 3, percent: '12%', color: '#6b7280' },
    { type: 'E-Waste', count: 3, percent: '13%', color: '#dc2626' }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>Admin Dashboard</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Comprehensive campus sanitation analytics & waste distribution metrics.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => fetchReports().then(setReports)}>
            <RefreshCw size={16} /> Sync Analytics
          </button>
          <button className="btn-secondary" onClick={() => setIsAuthenticated(false)} style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }}>
            <LogOut size={16} /> Lock Portal
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: '#eff6ff', borderLeft: '5px solid #2563eb' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e40af' }}>Total Reports</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1d4ed8', marginTop: '6px' }}>{totalReports}</h1>
        </div>

        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: '#f0fdf4', borderLeft: '5px solid #16a34a' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534' }}>Resolved</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#15803d', marginTop: '6px' }}>{resolved}</h1>
        </div>

        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: '#fffbeb', borderLeft: '5px solid #d97706' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#92400e' }}>Pending</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#b45309', marginTop: '6px' }}>{pending}</h1>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Reports Overview Bar Chart */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart2 size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>Reports Overview</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', paddingTop: '20px', borderBottom: '2px solid #e2e8f0' }}>
            {distribution.map((item) => (
              <div key={item.type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: item.color, marginBottom: '6px' }}>{item.count}</span>
                <div style={{
                  width: '100%',
                  height: `${item.count * 20}px`,
                  background: item.color,
                  borderRadius: '8px 8px 0 0',
                  transition: 'height 0.4s ease'
                }}></div>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', marginTop: '8px' }}>{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Distribution Donut/Pie Chart */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieIcon size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>Waste Distribution</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {distribution.map((item) => (
              <div key={item.type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: item.color }}></div>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.type}</span>
                </div>
                <span style={{ fontWeight: '700', color: '#64748b' }}>{item.percent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
