import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import UserRegistration from './components/UserRegistration';
import HomePage from './components/HomePage';
import ReportWasteForm from './components/ReportWasteForm';
import ReportConfirmation from './components/ReportConfirmation';
import NearbyBins from './components/NearbyBins';
import AIClassification from './components/AIClassification';
import MyReports from './components/MyReports';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import { submitReport } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentRole, setCurrentRole] = useState('User');
  const [submittedReportData, setSubmittedReportData] = useState(null);
  const [prefilledWasteType, setPrefilledWasteType] = useState('Plastic');

  // Handle Form Submission
  const handleReportSubmit = async (reportData) => {
    const res = await submitReport(reportData);
    if (res && res.data) {
      setSubmittedReportData(res.data);
    } else {
      setSubmittedReportData(reportData);
    }
    setActiveTab('confirmation');
  };

  // AI Classification -> Direct File Report Trigger
  const handleFileReportWithCategory = (category) => {
    setPrefilledWasteType(category);
    setActiveTab('report');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hide Top Navbar on full-screen Login & Registration if desired, or keep sticky navigation */}
      {activeTab !== 'login' && activeTab !== 'register' && (
        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          notificationCount={3}
        />
      )}

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'login' && (
          <LoginPage 
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            onLogin={(user) => setActiveTab('home')}
            onNavigateRegister={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'register' && (
          <UserRegistration 
            onRegisterSuccess={(data) => setActiveTab('home')}
            onNavigateLogin={() => setActiveTab('login')}
          />
        )}

        {activeTab === 'home' && (
          <HomePage onNavigate={setActiveTab} />
        )}

        {activeTab === 'report' && (
          <ReportWasteForm 
            prefilledWasteType={prefilledWasteType}
            onSubmitSuccess={handleReportSubmit} 
          />
        )}

        {activeTab === 'confirmation' && (
          <ReportConfirmation 
            reportData={submittedReportData}
            onViewReports={() => setActiveTab('my-reports')}
          />
        )}

        {activeTab === 'bins' && (
          <NearbyBins />
        )}

        {activeTab === 'ai' && (
          <AIClassification 
            onFileReportWithCategory={handleFileReportWithCategory}
          />
        )}

        {activeTab === 'my-reports' && (
          <MyReports />
        )}

        {activeTab === 'staff-dashboard' && (
          <StaffDashboard />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {activeTab === 'notifications' && (
          <Notifications />
        )}

        {activeTab === 'profile' && (
          <Profile />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #bbf7d0',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#047857',
        fontWeight: '600'
      }}>
        Eco Vision © 2026 • Smart Waste Management & Sanitation System
      </footer>
    </div>
  );
}
