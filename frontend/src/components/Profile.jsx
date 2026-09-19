import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, GraduationCap, Calendar, BookOpen, Edit, Save, X, Image as ImageIcon } from 'lucide-react';
import { fetchProfile, updateProfile } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Hemalatha",
    email: "hemalatha@gmail.com",
    phone: "+91 9876543210",
    college: "Sri V S Reddy College of Engineering",
    year: "2nd Year",
    branch: "CSE",
    role: "User",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    fetchProfile().then((data) => {
      if (data) {
        setProfile(data);
        setEditForm(data);
      }
    });
  }, []);

  const handleSave = async () => {
    const updated = await updateProfile(editForm);
    setProfile(updated || editForm);
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '20px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '36px', borderRadius: '24px', textAlign: 'center' }}>
        {/* User Avatar */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
          <img 
            src={profile.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"}
            alt="Profile Avatar"
            style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #10b981', boxShadow: '0 8px 16px rgba(16,185,129,0.2)' }}
          />
        </div>

        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: '800' }}>{profile.name}</h2>
        <p style={{ color: '#15803d', fontWeight: '700', fontSize: '0.9rem', marginBottom: '24px' }}>{profile.email}</p>

        {/* Info Grid */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          textAlign: 'left',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <Phone size={18} color="#047857" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Phone</span>
              <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>{profile.phone}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <GraduationCap size={18} color="#047857" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>College</span>
              <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>{profile.college}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={18} color="#047857" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Year</span>
                <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>{profile.year}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={18} color="#047857" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Branch</span>
                <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>{profile.branch}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => { setEditForm(profile); setIsEditing(true); }}
          style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
        >
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '90%', maxWidth: '520px', padding: '28px', borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a' }}>Edit Profile</h3>
              <X size={20} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setIsEditing(false)} />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '38px' }}
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  className="form-control" 
                  style={{ paddingLeft: '38px' }}
                  value={editForm.email} 
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '38px' }}
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>College</label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '38px' }}
                  value={editForm.college} 
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Year</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editForm.year} 
                  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Branch</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editForm.branch} 
                  onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Profile Picture URL</label>
              <div style={{ position: 'relative' }}>
                <ImageIcon size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '38px' }}
                  placeholder="https://..."
                  value={editForm.profilePic || ''} 
                  onChange={(e) => setEditForm({ ...editForm, profilePic: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

