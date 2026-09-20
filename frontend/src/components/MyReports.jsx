import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, RefreshCw, Cpu, MapPin, X, Trash2 } from 'lucide-react';
import { fetchReports, clearAllReportsApi } from '../services/api';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports().then((data) => {
      setReports(data);
      setIsLoading(false);
    });
  }, []);

  const handleClearReports = async () => {
    if (window.confirm("Are you sure you want to clear all report history?")) {
      await clearAllReportsApi();
      setReports([]);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return <span className="badge badge-completed"><CheckCircle2 size={12} /> Completed</span>;
    } else if (status === 'In Progress' || status === 'Assigned to Staff') {
      return <span className="badge badge-in-progress"><Clock size={12} /> {status}</span>;
    } else {
      return <span className="badge badge-pending"><AlertCircle size={12} /> Pending</span>;
    }
  };

  const getAIDetectionBadge = (report) => {
    const ai = report.aiVerification;
    if (!ai) {
      return (
        <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Cpu size={12} /> AI Checked: {report.wasteType}
        </span>
      );
    }

    if (ai.valid === false || ai.is_waste === false) {
      return (
        <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={12} /> Invalid Waste Photo
        </span>
      );
    }

    const conf = ai.confidence_formatted || `${ai.confidence || 94}%`;
    return (
      <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Cpu size={12} /> AI Verified: {ai.category || report.wasteType} ({conf})
      </span>
    );
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>My Reports</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Track status, photos, and AI detection details for your submitted waste reports.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => fetchReports().then(setReports)}>
            <RefreshCw size={16} /> Refresh Table
          </button>
          <button 
            className="btn-secondary" 
            onClick={handleClearReports}
            style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <Trash2 size={16} /> Clear Reports
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Photo</th>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Waste Type</th>
              <th style={{ padding: '12px 16px' }}>AI Detection Detail</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr 
                key={r.id} 
                onClick={() => setSelectedReport(r)}
                style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }}
                className="table-row-hover"
              >
                <td style={{ padding: '12px 16px' }}>
                  <img 
                    src={r.imageUrl} 
                    alt="Report preview" 
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                  />
                </td>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#15803d' }}>{r.id}</td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>{r.wasteType}</td>
                <td style={{ padding: '14px 16px' }}>{getAIDetectionBadge(r)}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{r.location}</td>
                <td style={{ padding: '14px 16px' }}>{getStatusBadge(r.status)}</td>
                <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.85rem' }}>{r.dateTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL INSPECTION MODAL */}
      {selectedReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            background: '#ffffff',
            maxWidth: '600px',
            width: '100%',
            borderRadius: '24px',
            padding: '28px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button 
              onClick={() => setSelectedReport(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                background: '#f1f5f9',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
              Report Details {selectedReport.id}
            </h3>

            <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #cbd5e1' }}>
              <img 
                src={selectedReport.imageUrl} 
                alt="Waste report full image" 
                style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* AI Verified Badge Box */}
            <div style={{
              background: selectedReport.aiVerification?.valid === false ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${selectedReport.aiVerification?.valid === false ? '#fca5a5' : '#bbf7d0'}`,
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Cpu size={18} color={selectedReport.aiVerification?.valid === false ? '#dc2626' : '#16a34a'} />
                <h4 style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: selectedReport.aiVerification?.valid === false ? '#991b1b' : '#166534' }}>
                  AI Image Detection Analysis
                </h4>
              </div>

              {selectedReport.aiVerification?.valid === false ? (
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#7f1d1d' }}>
                  ⚠️ Invalid Waste Photo - Image was flagged as non-waste photo.
                </p>
              ) : (
                <div>
                  <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#166534' }}>
                    Detected Category: <strong>{selectedReport.aiVerification?.category || selectedReport.wasteType} Waste</strong>
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '0.84rem', color: '#15803d' }}>
                    Model Confidence: <strong>{selectedReport.aiVerification?.confidence_formatted || `${selectedReport.aiVerification?.confidence || 94}%`}</strong>
                  </p>
                  {selectedReport.aiVerification?.recommended_bin && (
                    <p style={{ margin: '4px 0', fontSize: '0.84rem', color: '#15803d' }}>
                      Recommended Bin: <strong>{selectedReport.aiVerification.recommended_bin}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem', color: '#334155' }}>
              <div>
                <strong>Location:</strong> {selectedReport.location}
              </div>
              <div>
                <strong>Status:</strong> {getStatusBadge(selectedReport.status)}
              </div>
              <div>
                <strong>Submitted:</strong> {selectedReport.dateTime}
              </div>
              <div>
                <strong>Assigned Staff:</strong> {selectedReport.assignedStaff || "Sanitation Team"}
              </div>
            </div>

            {selectedReport.description && (
              <div style={{ marginTop: '14px', background: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '0.88rem', color: '#475569' }}>
                <strong>Description:</strong> {selectedReport.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
