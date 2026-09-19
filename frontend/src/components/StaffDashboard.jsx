import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Clock, AlertTriangle, RefreshCw, UserCheck } from 'lucide-react';
import { fetchReports, updateReportStatus } from '../services/api';

export default function StaffDashboard() {
  const [reports, setReports] = useState([]);

  const loadData = () => {
    fetchReports().then(setReports);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateReportStatus(id, newStatus, "Cleaning Staff A");
    loadData();
  };

  const assignedCount = 5;
  const inProgressCount = 3;
  const completedCount = 12;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>Staff Dashboard</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Assigned tasks for sanitation staff & real-time cleanup updates.</p>
        </div>

        <button className="btn-secondary" onClick={loadData}>
          <RefreshCw size={16} /> Refresh Tasks
        </button>
      </div>

      {/* 3 Summary Metric Cards (Matching Diagram: 5 Assigned, 3 In Progress, 12 Completed) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', background: '#eff6ff', borderLeft: '5px solid #2563eb' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e40af' }}>Assigned</span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1d4ed8', marginTop: '6px' }}>{assignedCount}</h1>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', background: '#fffbeb', borderLeft: '5px solid #d97706' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#92400e' }}>In Progress</span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#b45309', marginTop: '6px' }}>{inProgressCount}</h1>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', background: '#f0fdf4', borderLeft: '5px solid #16a34a' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534' }}>Completed</span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#15803d', marginTop: '6px' }}>{completedCount}</h1>
        </div>
      </div>

      {/* Assigned Reports Table with Actions */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Assigned Reports</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Waste Type</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#15803d' }}>{r.id}</td>
                <td style={{ padding: '14px 16px', fontWeight: '600' }}>{r.wasteType}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{r.location}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge ${r.status === 'Completed' ? 'badge-completed' : r.status === 'Pending' ? 'badge-pending' : 'badge-in-progress'}`}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <select 
                    value={r.status}
                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
