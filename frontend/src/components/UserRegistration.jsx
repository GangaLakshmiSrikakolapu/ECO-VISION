import React, { useState } from 'react';
import { Leaf, User, Mail, Phone, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function UserRegistration({ onRegisterSuccess, onNavigateLogin }) {
  const [formData, setFormData] = useState({
    fullName: 'Hemalatha',
    email: 'hemalatha@gmail.com',
    phone: '+91 9876543210',
    password: 'password123',
    confirmPassword: 'password123',
    college: 'Sri V S Reddy College of Engineering',
    year: '2nd Year',
    branch: 'CSE'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onRegisterSuccess(formData);
  };

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '960px',
      margin: '40px auto',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: '24px',
      background: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden'
    }}>
      {/* Left Form */}
      <div style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: '#15803d', padding: '8px', borderRadius: '10px', color: 'white' }}>
            <Leaf size={22} />
          </div>
          <span style={{ fontWeight: '700', color: '#15803d', fontSize: '1.2rem' }}>Eco Vision</span>
        </div>

        <h3 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: '700', marginBottom: '6px' }}>Create Your Account</h3>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px' }}>Join the Eco Vision community today.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
              <input
                type="text"
                name="fullName"
                className="form-control"
                style={{ paddingLeft: '38px' }}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
            Register Account <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          Already have an account?{' '}
          <span 
            onClick={onNavigateLogin}
            style={{ color: '#16a34a', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Login
          </span>
        </p>
      </div>

      {/* Right Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #15803d 100%)',
        padding: '36px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>Together for a Cleaner Future</h3>
          <p style={{ fontSize: '0.88rem', opacity: 0.9, lineHeight: '1.5' }}>
            Be part of the campus-wide waste segregation and sanitation movement. Report issues instantly and view live status updates.
          </p>
        </div>
      </div>
    </div>
  );
}
