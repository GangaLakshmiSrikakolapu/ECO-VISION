import React, { useState, useEffect } from 'react';
import { PieChart as PieIcon, BarChart2, CheckCircle2, Clock, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { fetchReports } from '../services/api';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports().then(setReports);
  }, []);

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

        <button className="btn-secondary" onClick={() => fetchReports().then(setReports)}>
          <RefreshCw size={16} /> Sync Analytics
        </button>
      </div>

      {/* KPI Cards (Matching Diagram: Total Reports 24, Resolved 18, Pending 6) */}
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
