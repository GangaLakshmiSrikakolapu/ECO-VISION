import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchReports } from '../services/api';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports().then((data) => {
      setReports(data);
      setIsLoading(false);
    });
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return <span className="badge badge-completed"><CheckCircle2 size={12} /> Completed</span>;
    } else if (status === 'In Progress' || status === 'Assigned to Staff') {
      return <span className="badge badge-in-progress"><Clock size={12} /> {status}</span>;
    } else {
      return <span className="badge badge-pending"><AlertCircle size={12} /> Pending</span>;
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>My Reports</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Track the status and history of your reported waste areas.</p>
        </div>

        <button className="btn-secondary" onClick={() => fetchReports().then(setReports)}>
          <RefreshCw size={16} /> Refresh Table
        </button>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Waste Type</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#15803d' }}>{r.id}</td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>{r.wasteType}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{r.location}</td>
                <td style={{ padding: '14px 16px' }}>{getStatusBadge(r.status)}</td>
                <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.85rem' }}>{r.dateTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
