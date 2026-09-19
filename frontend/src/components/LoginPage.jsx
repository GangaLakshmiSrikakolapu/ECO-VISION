import React, { useState } from 'react';
import { Leaf, Lock, Mail, ArrowRight, Recycle, RefreshCw, Trash2 } from 'lucide-react';

export default function LoginPage({ onLogin, onNavigateRegister, currentRole, setCurrentRole }) {
  const [email, setEmail] = useState('hemalatha@gmail.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, role: currentRole });
  };

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '960px',
      margin: '40px auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      background: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden'
    }}>
      {/* Left Column: Login Form */}
      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #15803d, #10b981)',
            padding: '10px',
            borderRadius: '12px',
            color: 'white'
          }}>
            <Leaf size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#15803d', fontWeight: '700' }}>Eco Vision</h2>
            <p style={{ fontSize: '0.75rem', color: '#047857' }}>Smart Waste Management</p>
          </div>
        </div>

        <h3 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '6px', fontWeight: '700' }}>Welcome Back!</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Sign in to manage waste reports and sanitation.</p>

        {/* Role Select Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['User', 'Staff', 'Admin'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setCurrentRole(role)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: currentRole === role ? '2px solid #16a34a' : '1px solid #cbd5e1',
                background: currentRole === role ? '#ecfdf5' : '#ffffff',
                color: currentRole === role ? '#166534' : '#64748b',
                fontWeight: '600',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Username</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '40px' }}
                placeholder="Enter email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
            Login <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <span 
            onClick={onNavigateRegister}
            style={{ color: '#16a34a', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Register
          </span>
        </p>
      </div>

      {/* Right Column: Eco Graphic Panel */}
      <div style={{
        background: 'linear-gradient(135deg, #15803d 0%, #047857 50%, #064e3b 100%)',
        padding: '40px',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: '100%',
          maxWidth: '340px'
        }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.2' }}>
            Small Actions Make a Big Impact
          </h3>
          <p style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: '24px' }}>
            Report waste, segregate smart, and help maintain a cleaner campus.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#ffffff', color: '#15803d', padding: '12px', borderRadius: '50%', marginBottom: '6px' }}>
                <Trash2 size={20} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Reduce</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#ffffff', color: '#15803d', padding: '12px', borderRadius: '50%', marginBottom: '6px' }}>
                <RefreshCw size={20} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Reuse</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#ffffff', color: '#15803d', padding: '12px', borderRadius: '50%', marginBottom: '6px' }}>
                <Recycle size={20} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Recycle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
