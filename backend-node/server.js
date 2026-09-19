const express = require('express');
const cors = require('cors');
const { localDb, isFirebaseConnected, db } = require('./firebase-config');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    firebaseConnected: isFirebaseConnected,
    timestamp: new Date().toISOString()
  });
});

// 1. GET ALL REPORTS
app.get('/api/reports', async (req, res) => {
  try {
    if (isFirebaseConnected && db) {
      const snapshot = await db.collection('reports').get();
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, source: 'firebase', data: reports });
    }
    return res.json({ success: true, source: 'local', data: localDb.reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. CREATE NEW REPORT
app.post('/api/reports', async (req, res) => {
  try {
    const { wasteType, location, description, imageUrl, coordinates } = req.body;
    
    const newReportId = `#${100 + localDb.reports.length + 1}`;
    const newReport = {
      id: newReportId,
      wasteType: wasteType || "Plastic",
      location: location || "Campus Grounds",
      coordinates: coordinates || { lat: 16.5062, lng: 80.6480 },
      status: "Assigned to Staff",
      assignedStaff: "Cleaning Staff Team",
      dateTime: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      description: description || "Reported dirty waste area requiring collection.",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1604186838347-9faaf0dc6a06?auto=format&fit=crop&w=600&q=80"
    };

    if (isFirebaseConnected && db) {
      await db.collection('reports').doc(newReportId).set(newReport);
    } else {
      localDb.reports.unshift(newReport);
      
      // Auto push notification
      localDb.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: "New Waste Report Submitted",
        message: `${newReport.wasteType} report at ${newReport.location}`,
        time: "Just now",
        type: "info"
      });
    }

    res.status(201).json({
      success: true,
      message: "Report submitted successfully!",
      data: newReport
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. UPDATE REPORT STATUS (Staff & Admin action)
app.patch('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedStaff } = req.body;

    if (isFirebaseConnected && db) {
      const reportRef = db.collection('reports').doc(id);
      const updateData = {};
      if (status) updateData.status = status;
      if (assignedStaff) updateData.assignedStaff = assignedStaff;
      await reportRef.update(updateData);
    } else {
      const idx = localDb.reports.findIndex(r => r.id.toString() === id.toString());
      if (idx !== -1) {
        if (status) localDb.reports[idx].status = status;
        if (assignedStaff) localDb.reports[idx].assignedStaff = assignedStaff;
        
        // Add notification event
        localDb.notifications.unshift({
          id: `notif-${Date.now()}`,
          title: "Report Status Changed",
          message: `Report ${id} updated to status: ${status}`,
          time: "Just now",
          type: status === "Completed" ? "success" : "update"
        });
      }
    }

    res.json({ success: true, message: `Report ${id} updated.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET NEARBY BINS
app.get('/api/bins', async (req, res) => {
  try {
    if (isFirebaseConnected && db) {
      const snapshot = await db.collection('bins').get();
      const bins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, source: 'firebase', data: bins });
    }
    return res.json({ success: true, source: 'local', data: localDb.bins });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. GET NOTIFICATIONS
app.get('/api/notifications', async (req, res) => {
  try {
    if (isFirebaseConnected && db) {
      const snapshot = await db.collection('notifications').orderBy('time', 'desc').get();
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, source: 'firebase', data: notifs });
    }
    return res.json({ success: true, source: 'local', data: localDb.notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. GET ADMIN & DASHBOARD STATS
app.get('/api/stats', (req, res) => {
  const reports = localDb.reports;
  const total = reports.length;
  const pending = reports.filter(r => r.status === 'Pending').length;
  const inProgress = reports.filter(r => r.status === 'In Progress' || r.status === 'Assigned to Staff').length;
  const completed = reports.filter(r => r.status === 'Completed').length;

  // Breakdown by waste type
  const typeCounts = {
    Plastic: 0,
    Organic: 0,
    Paper: 0,
    Metal: 0,
    "E-Waste": 0,
    Glass: 0
  };

  reports.forEach(r => {
    if (typeCounts[r.wasteType] !== undefined) {
      typeCounts[r.wasteType]++;
    } else {
      typeCounts[r.wasteType] = 1;
    }
  });

  res.json({
    success: true,
    data: {
      total,
      pending,
      inProgress,
      completed,
      typeCounts
    }
  });
});

// 7. GET PROFILE & UPDATE PROFILE
app.get('/api/profile', (req, res) => {
  res.json({ success: true, data: localDb.profile });
});

app.put('/api/profile', (req, res) => {
  localDb.profile = { ...localDb.profile, ...req.body };
  res.json({ success: true, message: "Profile updated", data: localDb.profile });
});

// 8. AUTH SIMULATION
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  res.json({
    success: true,
    user: {
      email,
      role: role || "User",
      name: email ? email.split('@')[0] : "User",
      token: "demo-jwt-token-123"
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, phone, college, year, branch } = req.body;
  localDb.profile = {
    ...localDb.profile,
    name: fullName || localDb.profile.name,
    email: email || localDb.profile.email,
    phone: phone || localDb.profile.phone,
    college: college || localDb.profile.college,
    year: year || localDb.profile.year,
    branch: branch || localDb.profile.branch
  };
  res.json({
    success: true,
    message: "Registration successful!",
    user: localDb.profile
  });
});

app.listen(PORT, () => {
  console.log(`🟢 Eco Vision Node Backend running on port ${PORT}`);
});
