import React, { useEffect } from 'react';
import { CheckCircle2, ArrowRight, FileText, MapPin, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReportConfirmation({ reportData, onViewReports }) {
  useEffect(() => {
    // Trigger festive confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  const data = reportData || {
    id: "#101",
    wasteType: "Plastic",
    location: "College Main Gate Area",
    status: "Assigned to Staff"
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '40px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{
        padding: '40px 32px',
        textAlign: 'center',
        borderRadius: '24px',
        border: '2px solid #bbf7d0'
      }}>
        {/* Checkmark Icon Badge */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #16a34a, #10b981)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 10px 25px rgba(22, 163, 74, 0.3)',
          color: '#ffffff'
        }}>
          <CheckCircle2 size={48} />
        </div>

        <h2 style={{ fontSize: '1.8rem', color: '#14532d', fontWeight: '800', marginBottom: '8px' }}>
          Report Submitted Successfully!
        </h2>
        <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '28px' }}>
          Your report has been recorded and sent to the cleaning staff.
        </p>

        {/* Details Card */}
        <div style={{
          background: '#f0fdf4',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #bbf7d0',
          textAlign: 'left',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '0.92rem', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700', color: '#166534' }}>Waste Type</span>
            <span style={{ color: '#0f172a', fontWeight: '600' }}>: {data.wasteType}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '0.92rem', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700', color: '#166534' }}>Location</span>
            <span style={{ color: '#0f172a', fontWeight: '600' }}>: {data.location}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '0.92rem' }}>
            <span style={{ fontWeight: '700', color: '#166534' }}>Status</span>
            <span style={{ color: '#2563eb', fontWeight: '700' }}>: {data.status || "Assigned to Staff"}</span>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={onViewReports}
          style={{ padding: '14px 32px', fontSize: '1rem' }}
        >
          View Report <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
