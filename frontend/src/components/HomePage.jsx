import React from 'react';
import { ArrowRight, Recycle, MapPin, Sparkles, ShieldCheck, Cpu, Leaf } from 'lucide-react';

export default function HomePage({ onNavigate }) {
  return (
    <div className="animate-fade-in" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Platform Banner Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '28px',
        background: 'linear-gradient(90deg, #ecfdf5 0%, #dcfce7 50%, #f0fdf4 100%)',
        padding: '16px 24px',
        borderRadius: '16px',
        border: '1px solid #bbf7d0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#14532d', fontWeight: '800' }}>Smart Waste Management System</h2>
          <p style={{ color: '#047857', fontWeight: '600', fontSize: '0.92rem' }}>
            Waste Segregation, Disposal & Improve Sanitation System
          </p>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1.5px solid #10b981',
          color: '#15803d',
          fontWeight: '700',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Leaf size={16} /> A Smart Platform for a Cleaner, Healthier and Greener Community <Leaf size={16} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="glass-card" style={{
        padding: '40px',
        borderRadius: '24px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '32px',
        alignItems: 'center',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        border: '1px solid #bbf7d0'
      }}>
        <div>
          <span style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Campus Eco Initiative
          </span>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#0f172a',
            marginTop: '16px',
            marginBottom: '14px',
            lineHeight: '1.2'
          }}>
            Smart Waste <br />
            <span style={{ color: '#15803d' }}>Management</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#475569',
            fontWeight: '500',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Report • Identify • Clean • Monitor
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              onClick={() => onNavigate('report')}
              style={{ fontSize: '1rem', padding: '14px 28px' }}
            >
              Report Waste / Dirty Area <ArrowRight size={20} />
            </button>

            <button 
              className="btn-secondary" 
              onClick={() => onNavigate('ai')}
              style={{ fontSize: '1rem', padding: '14px 24px' }}
            >
              <Cpu size={20} /> AI Classify Waste
            </button>
          </div>
        </div>

        {/* Hero Illustration / Plant Image */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 12px 24px rgba(16, 185, 129, 0.15)',
          border: '4px solid #ffffff'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" 
            alt="Smart Eco Vision Plant"
            style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '12px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#16a34a', width: '10px', height: '10px', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#15803d' }}>Live AI Monitoring</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Cleanliness Score: 96%</span>
          </div>
        </div>
      </div>

      {/* 4 Feature Cards Grid */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Key Features</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {/* Card 1: Name Segregation */}
        <div 
          className="glass-card" 
          onClick={() => onNavigate('ai')}
          style={{ padding: '24px', cursor: 'pointer', borderLeft: '4px solid #2563eb' }}
        >
          <div style={{
            background: '#dbeafe',
            color: '#2563eb',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Recycle size={26} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Name Segregation</h4>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.4' }}>
            Instant AI category recognition for Plastic, Organic, E-Waste, Paper, Metal, and Glass.
          </p>
        </div>

        {/* Card 2: Smart Disposal */}
        <div 
          className="glass-card" 
          onClick={() => onNavigate('bins')}
          style={{ padding: '24px', cursor: 'pointer', borderLeft: '4px solid #16a34a' }}
        >
          <div style={{
            background: '#dcfce7',
            color: '#16a34a',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <MapPin size={26} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Smart Disposal</h4>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.4' }}>
            Locate nearby smart bins on campus with live fill-level indicators and directions.
          </p>
        </div>

        {/* Card 3: Better Sanitation */}
        <div 
          className="glass-card" 
          onClick={() => onNavigate('staff-dashboard')}
          style={{ padding: '24px', cursor: 'pointer', borderLeft: '4px solid #d97706' }}
        >
          <div style={{
            background: '#fef3c7',
            color: '#d97706',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={26} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Better Sanitation</h4>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.4' }}>
            Automated task dispatch to cleaning staff with real-time status updates and proof photos.
          </p>
        </div>

        {/* Card 4: Cleaner Environment */}
        <div 
          className="glass-card" 
          onClick={() => onNavigate('admin-dashboard')}
          style={{ padding: '24px', cursor: 'pointer', borderLeft: '4px solid #0d9488' }}
        >
          <div style={{
            background: '#ccfbf1',
            color: '#0d9488',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Sparkles size={26} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Cleaner Environment</h4>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.4' }}>
            Track campus cleanliness stats, resolve dirty spot reports, and monitor green impact.
          </p>
        </div>
      </div>
    </div>
  );
}
