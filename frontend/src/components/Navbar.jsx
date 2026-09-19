import React from 'react';
import { Leaf, Home, FilePlus, MapPin, Cpu, ClipboardList, ShieldAlert, PieChart, Bell, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentRole, setCurrentRole, user, notificationCount }) {
  return (
    <header className="app-header">
      <div className="logo-container" onClick={() => setActiveTab('home')}>
        <div className="logo-icon">
          <Leaf size={26} color="#ffffff" />
        </div>
        <div>
          <h1 className="logo-title">Eco Vision</h1>
          <p className="logo-subtitle">Cleaner Today • Greener Tomorrow</p>
        </div>
      </div>

      <nav className="nav-links">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={18} /> Home
        </button>

        <button 
          className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <FilePlus size={18} /> Report Waste
        </button>

        <button 
          className={`nav-item ${activeTab === 'bins' ? 'active' : ''}`}
          onClick={() => setActiveTab('bins')}
        >
          <MapPin size={18} /> Nearby Bins
        </button>

        <button 
          className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Cpu size={18} /> AI Classify
        </button>

        <button 
          className={`nav-item ${activeTab === 'my-reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-reports')}
        >
          <ClipboardList size={18} /> My Reports
        </button>

        {currentRole === 'Staff' && (
          <button 
            className={`nav-item ${activeTab === 'staff-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff-dashboard')}
          >
            <ShieldAlert size={18} /> Staff Dashboard
          </button>
        )}

        {currentRole === 'Admin' && (
          <button 
            className={`nav-item ${activeTab === 'admin-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-dashboard')}
          >
            <PieChart size={18} /> Admin Dashboard
          </button>
        )}

        <button 
          className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
          style={{ position: 'relative' }}
        >
          <Bell size={18} /> Notifications
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#ef4444',
              color: '#ffffff',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {notificationCount}
            </span>
          )}
        </button>

        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} /> Profile
        </button>
      </nav>

      {/* Role Switcher & Auth Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#e2e8f0',
          borderRadius: '20px',
          padding: '2px 6px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          <span style={{ marginRight: '6px', color: '#475569', fontSize: '0.75rem', paddingLeft: '4px' }}>Role:</span>
          <select 
            value={currentRole} 
            onChange={(e) => {
              setCurrentRole(e.target.value);
              if (e.target.value === 'Staff') setActiveTab('staff-dashboard');
              if (e.target.value === 'Admin') setActiveTab('admin-dashboard');
            }}
            style={{
              border: 'none',
              background: 'transparent',
              fontWeight: 'bold',
              color: '#166534',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="User">User</option>
            <option value="Staff">Cleaning Staff</option>
            <option value="Admin">System Admin</option>
          </select>
        </div>

        <button 
          onClick={() => setActiveTab('login')} 
          title="Login / Logout"
          style={{
            background: '#fee2e2',
            border: 'none',
            color: '#dc2626',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.82rem',
            fontWeight: '600'
          }}
        >
          <LogOut size={14} /> Exit
        </button>
      </div>
    </header>
  );
}
