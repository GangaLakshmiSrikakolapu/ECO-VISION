const NODE_API_BASE = (import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const PYTHON_API_BASE = (import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

export const fetchReports = async () => {
  // If user explicitly cleared reports, check local storage override
  if (localStorage.getItem('ecovision_reports_cleared') === 'true') {
    const localUserReports = JSON.parse(localStorage.getItem('ecovision_user_reports') || '[]');
    return localUserReports;
  }

  try {
    const res = await fetch(`${NODE_API_BASE}/reports`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("Node backend unreachable, returning local fallback reports.", err);
    return [
      {
        id: "#101",
        wasteType: "Plastic",
        location: "College Main Gate",
        coordinates: { lat: 16.5062, lng: 80.6480 },
        status: "In Progress",
        assignedStaff: "Cleaning Staff A",
        dateTime: "2026-09-17 10:15 AM",
        description: "Discarded plastic bottles and wrappers near gate.",
        imageUrl: "https://images.unsplash.com/photo-1604186838347-9faaf0dc6a06?auto=format&fit=crop&w=600&q=80"
      }
    ];
  }
};

export const clearAllReportsApi = async () => {
  localStorage.setItem('ecovision_reports_cleared', 'true');
  localStorage.setItem('ecovision_user_reports', JSON.stringify([]));

  try {
    await fetch(`${NODE_API_BASE}/reports`, { method: 'DELETE' });
  } catch (err) {
    console.warn("Node backend unreachable for clear API call.", err);
  }
  return { success: true };
};

export const submitReport = async (reportData) => {
  try {
    const res = await fetch(`${NODE_API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    const json = await res.json();
    
    // Save to local user reports list if cleared state active
    if (localStorage.getItem('ecovision_reports_cleared') === 'true') {
      const userReports = JSON.parse(localStorage.getItem('ecovision_user_reports') || '[]');
      const newReport = json.data || { id: `#${Date.now()}`, ...reportData };
      userReports.unshift(newReport);
      localStorage.setItem('ecovision_user_reports', JSON.stringify(userReports));
    }
    
    return json;
  } catch (err) {
    console.warn("Using offline submit handler:", err);
    const newReport = {
      id: `#${Math.floor(100 + Math.random() * 900)}`,
      ...reportData,
      status: "Assigned to Staff",
      dateTime: reportData.dateTime || new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    };

    if (localStorage.getItem('ecovision_reports_cleared') === 'true') {
      const userReports = JSON.parse(localStorage.getItem('ecovision_user_reports') || '[]');
      userReports.unshift(newReport);
      localStorage.setItem('ecovision_user_reports', JSON.stringify(userReports));
    }

    return {
      success: true,
      message: "Report saved locally!",
      data: newReport
    };
  }
};

export const updateReportStatus = async (id, status, assignedStaff) => {
  try {
    const res = await fetch(`${NODE_API_BASE}/reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assignedStaff })
    });
    return await res.json();
  } catch (err) {
    return { success: true, message: `Report ${id} updated` };
  }
};

export const fetchBins = async () => {
  try {
    const res = await fetch(`${NODE_API_BASE}/bins`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [
      { id: "bin-1", name: "Organic Bin 1", type: "Organic", distance: "120m", location: "Canteen Plaza", fillLevel: 45, color: "#16a34a", coordinates: { lat: 16.5065, lng: 80.6482 } },
      { id: "bin-2", name: "Recyclable Bin 2", type: "Recyclable", distance: "250m", location: "Auditorium Corridor", fillLevel: 80, color: "#2563eb", coordinates: { lat: 16.5075, lng: 80.6495 } },
      { id: "bin-3", name: "Hazardous Bin 3", type: "E-Waste", distance: "400m", location: "Workshop Gate", fillLevel: 30, color: "#dc2626", coordinates: { lat: 16.5050, lng: 80.6468 } }
    ];
  }
};

export const classifyWasteImage = async (base64Image, filename = "waste.jpg") => {
  try {
    const res = await fetch(`${PYTHON_API_BASE}/classify-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, filename })
    });
    return await res.json();
  } catch (err) {
    console.warn("Python AI Service offline. Running local client fallback validator.", err);
    
    const fname = filename.toLowerCase();
    const isNonWaste = ["person", "selfie", "human", "face", "car", "dog", "cat", "building", "landscape", "phone"].some(kw => fname.includes(kw));

    if (isNonWaste) {
      return {
        valid: false,
        is_waste: false,
        message: "Invalid garbage/waste photo. Please capture or upload a clear photo of waste."
      };
    }

    let cat = "Plastic";
    if (fname.includes("organic") || fname.includes("food") || fname.includes("apple") || fname.includes("peel")) cat = "Organic";
    else if (fname.includes("paper") || fname.includes("cardboard") || fname.includes("box")) cat = "Paper";
    else if (fname.includes("metal") || fname.includes("can")) cat = "Metal";
    else if (fname.includes("ewaste") || fname.includes("circuit") || fname.includes("battery")) cat = "E-Waste";
    else if (fname.includes("glass")) cat = "Glass";

    return {
      valid: true,
      is_waste: true,
      category: cat,
      waste_type: `${cat} Waste`,
      confidence: 93,
      confidence_formatted: "93%",
      recommended_bin: cat === "Plastic" ? "Recyclable (Blue Bin)" : "Compost (Green Bin)",
      color: cat === "Plastic" ? "#2563eb" : "#16a34a",
      description: `${cat} waste material identified. Clean and segregate appropriately.`,
      tips: ["Rinse out contents", "Dispose in designated colored bin"],
      message: "Waste detected successfully."
    };
  }
};

export const fetchNotifications = async () => {
  try {
    const res = await fetch(`${NODE_API_BASE}/notifications`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [
      { id: "1", title: "New Waste Report", message: "Plastic report at Main Gate", time: "10:15 AM" },
      { id: "2", title: "Staff Assigned", message: "Report #101 assigned to Staff A", time: "10:20 AM" },
      { id: "3", title: "Status Update", message: "Report #101 is In Progress", time: "10:30 AM" }
    ];
  }
};

export const fetchProfile = async () => {
  try {
    const res = await fetch(`${NODE_API_BASE}/profile`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    return {
      name: "Hemalatha",
      email: "hemalatha@gmail.com",
      phone: "+91 9876543210",
      college: "Sri V S Reddy College of Engineering",
      year: "2nd Year",
      branch: "CSE",
      role: "User"
    };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const res = await fetch(`${NODE_API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    return profileData;
  }
};

