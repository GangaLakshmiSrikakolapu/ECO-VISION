const admin = require('firebase-admin');

let db = null;
let isFirebaseConnected = false;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    db = admin.firestore();
    isFirebaseConnected = true;
    console.log('⚡ Connected to Firebase Firestore backend successfully.');
  } else {
    console.log('ℹ️ Firebase environment credentials not detected. Running with high-speed in-memory database adapter.');
  }
} catch (error) {
  console.warn('⚠️ Firebase init warning:', error.message, '- Falling back to local store.');
}

// Pre-seeded initial state matching the UI diagram screenshot
const localDb = {
  reports: [
    {
      id: "#101",
      wasteType: "Plastic",
      location: "Main Gate - College Road",
      coordinates: { lat: 16.5062, lng: 80.6480 },
      status: "In Progress",
      assignedStaff: "Cleaning Staff A",
      dateTime: "2026-09-17 10:15 AM",
      description: "Discarded plastic bottles and wrappers near the main entrance gate.",
      imageUrl: "https://images.unsplash.com/photo-1604186838347-9faaf0dc6a06?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "#102",
      wasteType: "Organic",
      location: "Block B Canteen Area",
      coordinates: { lat: 16.5070, lng: 80.6492 },
      status: "Pending",
      assignedStaff: "Unassigned",
      dateTime: "2026-09-17 09:45 AM",
      description: "Food leftovers and organic waste accumulated near food counter.",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "#103",
      wasteType: "E-Waste",
      location: "CSE Computer Lab 3",
      coordinates: { lat: 16.5055, lng: 80.6475 },
      status: "Pending",
      assignedStaff: "Unassigned",
      dateTime: "2026-09-16 04:20 PM",
      description: "Damaged keyboard and old circuit board cables discarded near trash.",
      imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "#104",
      wasteType: "Paper",
      location: "Central Library Corridor",
      coordinates: { lat: 16.5081, lng: 80.6488 },
      status: "Completed",
      assignedStaff: "Staff Ramesh",
      dateTime: "2026-09-16 02:10 PM",
      description: "Cardboard packing materials left outside store room.",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "#105",
      wasteType: "Metal",
      location: "Hostel Ground Area",
      coordinates: { lat: 16.5048, lng: 80.6501 },
      status: "Completed",
      assignedStaff: "Staff Suresh",
      dateTime: "2026-09-15 11:00 AM",
      description: "Scrap metal beverage cans near playground.",
      imageUrl: "https://images.unsplash.com/photo-1558583082-409143c794ca?auto=format&fit=crop&w=600&q=80"
    }
  ],

  bins: [
    {
      id: "bin-1",
      name: "Organic Smart Bin 1",
      type: "Organic",
      distance: "120 m",
      location: "College Canteen Plaza",
      fillLevel: 45,
      capacity: "100 Liters",
      status: "Available",
      coordinates: { lat: 16.5065, lng: 80.6482 },
      color: "#16a34a"
    },
    {
      id: "bin-2",
      name: "Recyclable Plastic Bin 2",
      type: "Recyclable",
      distance: "250 m",
      location: "Main Auditorium Corridor",
      fillLevel: 80,
      capacity: "120 Liters",
      status: "Near Full",
      coordinates: { lat: 16.5075, lng: 80.6495 },
      color: "#2563eb"
    },
    {
      id: "bin-3",
      name: "Hazardous E-Waste Collector 3",
      type: "E-Waste / Hazardous",
      distance: "400 m",
      location: "Engineering Workshop Gate",
      fillLevel: 30,
      capacity: "80 Liters",
      status: "Available",
      coordinates: { lat: 16.5050, lng: 80.6468 },
      color: "#dc2626"
    }
  ],

  notifications: [
    {
      id: "notif-1",
      title: "New Waste Report Submitted",
      message: "Plastic waste report filed at Main Gate.",
      time: "10:15 AM",
      type: "info"
    },
    {
      id: "notif-2",
      title: "Staff Assigned",
      message: "Report #101 assigned to Cleaning Staff A.",
      time: "10:20 AM",
      type: "assignment"
    },
    {
      id: "notif-3",
      title: "Status Update",
      message: "Report #101 is now In Progress.",
      time: "10:30 AM",
      type: "update"
    },
    {
      id: "notif-4",
      title: "Report Completed",
      message: "Report #104 marked completed by Staff Ramesh.",
      time: "Yesterday 02:30 PM",
      type: "success"
    }
  ],

  profile: {
    name: "Hemalatha",
    email: "hemalatha@gmail.com",
    phone: "+91 9876543210",
    college: "Sri V S Reddy College of Engineering",
    year: "2nd Year",
    branch: "CSE",
    role: "User",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  }
};

module.exports = {
  db,
  isFirebaseConnected,
  localDb
};
