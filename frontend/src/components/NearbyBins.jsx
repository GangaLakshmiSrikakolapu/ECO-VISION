import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, RefreshCw, Layers } from 'lucide-react';
import { fetchBins } from '../services/api';

export default function NearbyBins() {
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [activeRouteBin, setActiveRouteBin] = useState(null);

  useEffect(() => {
    fetchBins().then((data) => {
      setBins(data);
      if (data.length > 0) setSelectedBin(data[0]);
    });
  }, []);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>Nearby Smart Bins (Map View)</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Locate waste bins around campus with live fill levels and navigation.</p>
        </div>

        <button className="btn-secondary" onClick={() => fetchBins().then(setBins)}>
          <RefreshCw size={16} /> Refresh Markers
        </button>
      </div>

      {/* Main Map View Container */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
        <div style={{
          height: '380px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #93c5fd',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Visual Campus Map Grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#0284c7 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.25
          }}></div>

          {/* Campus Map Label graphics */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#ffffff', padding: '8px 14px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', fontWeight: '700', color: '#0369a1', fontSize: '0.82rem' }}>
            <Layers size={14} style={{ display: 'inline', marginRight: '6px' }} /> Campus Location: College Road
          </div>

          {/* Map Pins Simulation */}
          {bins.map((bin, index) => {
            const positions = [
              { top: '35%', left: '30%' },
              { top: '45%', left: '55%' },
              { top: '65%', left: '75%' }
            ];
            const pos = positions[index % positions.length];

            return (
              <div 
                key={bin.id}
                onClick={() => setSelectedBin(bin)}
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -100%)',
                  cursor: 'pointer',
                  zIndex: selectedBin?.id === bin.id ? 20 : 10,
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{
                  background: bin.color || '#16a34a',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  border: selectedBin?.id === bin.id ? '3px solid #ffffff' : 'none'
                }}>
                  <MapPin size={16} /> {bin.name} ({bin.distance})
                </div>
              </div>
            );
          })}

          {/* Active Navigation Route overlay */}
          {activeRouteBin && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              background: 'rgba(15, 23, 42, 0.9)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(8px)'
            }}>
              <Navigation size={20} color="#38bdf8" />
              <div>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Navigating to {activeRouteBin.name}</span>
                <p style={{ fontSize: '0.78rem', opacity: 0.8 }}>Distance: {activeRouteBin.distance} • Follow Walkway North</p>
              </div>
              <button 
                onClick={() => setActiveRouteBin(null)}
                style={{ background: '#334155', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear Route
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3 Bin Info Cards (Matching Diagram: Organic 120m, Recyclable 250m, Hazardous 400m) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {bins.map((bin) => (
          <div 
            key={bin.id}
            className="glass-card"
            style={{
              padding: '24px',
              borderTop: `4px solid ${bin.color || '#16a34a'}`,
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{
                  background: `${bin.color}22`,
                  color: bin.color,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}>
                  {bin.type}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginTop: '8px' }}>
                  {bin.name}
                </h4>
              </div>

              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#15803d' }}>
                {bin.distance}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Location: {bin.location}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
                <span>Fill Capacity</span>
                <span>{bin.fillLevel}% Full</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${bin.fillLevel}%`,
                  height: '100%',
                  background: bin.fillLevel > 75 ? '#dc2626' : bin.color
                }}></div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => setActiveRouteBin(bin)}
              style={{ width: '100%', padding: '10px', fontSize: '0.88rem', background: bin.color }}
            >
              <Navigation size={16} /> View Route
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
