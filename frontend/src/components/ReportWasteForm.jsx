import React, { useState, useRef, useEffect } from 'react';
import { Upload, MapPin, Camera, AlertTriangle, Send, Image as ImageIcon, RefreshCw, CheckCircle2, XCircle, RotateCcw, X } from 'lucide-react';
import { classifyWasteImage } from '../services/api';

export default function ReportWasteForm({ onSubmitSuccess, prefilledWasteType }) {
  const [wasteType, setWasteType] = useState(prefilledWasteType || 'Plastic');
  const [location, setLocation] = useState('College Main Gate');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [filename, setFilename] = useState('');
  
  // Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  // AI Validation States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [validationError, setValidationError] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera tracks on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    setValidationError('');
    setAiResult(null);
    setImagePreview('');
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      }).catch(() => navigator.mediaDevices.getUserMedia({ video: true }));

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or camera not available. Please upload an image file instead.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const snapFilename = `camera_snap_${Date.now()}.jpg`;
    
    setImagePreview(dataUrl);
    setFilename(snapFilename);
    stopCamera();

    // Trigger AI analysis on captured photo
    runAIAnalysis(dataUrl, snapFilename);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilename(file.name);
      stopCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setImagePreview(dataUrl);
        runAIAnalysis(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAIAnalysis = async (imgData, fname) => {
    setIsAnalyzing(true);
    setValidationError('');
    setAiResult(null);

    const data = await classifyWasteImage(imgData, fname);
    setIsAnalyzing(false);

    if (data && (data.valid === false || data.is_waste === false)) {
      setAiResult(data);
      setValidationError(data.message || "Invalid garbage/waste photo. Please capture or upload a clear photo of waste.");
    } else if (data && data.category) {
      setAiResult(data);
      setWasteType(data.category); // Auto pre-select waste type!
    } else {
      setValidationError("Unable to confidently identify waste. Please capture or upload a clearer photo.");
    }
  };

  const handleRetake = () => {
    setImagePreview('');
    setAiResult(null);
    setValidationError('');
    stopCamera();
    startCamera();
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`College Campus (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          setLocation("College Main Gate Area (GPS Default)");
        }
      );
    } else {
      setLocation("College Main Gate Area");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imagePreview) {
      alert("Please upload or capture a photo of waste first.");
      return;
    }

    if (aiResult && (aiResult.valid === false || aiResult.is_waste === false)) {
      alert("Invalid garbage/waste photo. Please upload a clear photo of waste to submit a report.");
      return;
    }

    const reportData = {
      wasteType,
      location,
      description: description || `Reported ${wasteType} waste area requiring collection.`,
      imageUrl: imagePreview,
      coordinates: { lat: 16.5062, lng: 80.6480 },
      aiVerification: aiResult
    };

    onSubmitSuccess(reportData);
  };

  const isSubmitDisabled = !imagePreview || isAnalyzing || Boolean(validationError) || (aiResult && aiResult.valid === false);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '20px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div style={{ background: '#ecfdf5', color: '#16a34a', padding: '10px', borderRadius: '12px' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>Report Waste / Dirty Area</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Snap or upload a photo of garbage to report it to sanitation staff.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Image Capture / Upload Area */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ fontWeight: '700', color: '#334155', display: 'block', marginBottom: '8px' }}>
              Waste Image (Camera or Upload)
            </label>

            {cameraError && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={18} /> {cameraError}
              </div>
            )}

            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              background: '#f8fafc',
              position: 'relative'
            }}>
              
              {/* LIVE CAMERA VIEW */}
              {isCameraOpen ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', background: '#000' }}
                  ></video>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
                    <button 
                      type="button" 
                      onClick={capturePhoto} 
                      className="btn-primary" 
                      style={{ background: '#16a34a', padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      <Camera size={18} /> Capture Photo
                    </button>
                    <button 
                      type="button" 
                      onClick={stopCamera} 
                      className="btn-secondary" 
                      style={{ padding: '10px 18px', fontSize: '0.9rem' }}
                    >
                      <X size={18} /> Cancel
                    </button>
                  </div>
                </div>
              ) : imagePreview ? (
                /* CAPTURED / UPLOADED IMAGE PREVIEW */
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '450px' }}>
                  <img 
                    src={imagePreview} 
                    alt="Captured waste preview" 
                    style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #cbd5e1' }} 
                  />
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                    >
                      <RotateCcw size={16} /> Retake / Clear
                    </button>
                  </div>
                </div>
              ) : (
                /* DEFAULT PLACEHOLDER */
                <div>
                  <Upload size={36} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.92rem', color: '#475569', fontWeight: '600' }}>Snap live photo or upload from device</p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>PNG, JPG or WEBP up to 10MB</p>
                </div>
              )}

              {/* ACTION BUTTONS: SNAP & CHOOSE FILE */}
              {!isCameraOpen && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={startCamera}
                    style={{ fontSize: '0.88rem', padding: '10px 18px', background: '#2563eb' }}
                  >
                    <Camera size={18} /> Snap Photo
                  </button>

                  <label className="btn-secondary" style={{ fontSize: '0.88rem', cursor: 'pointer', padding: '10px 18px' }}>
                    <ImageIcon size={18} /> Choose File
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                </div>
              )}
            </div>

            {/* AI ANALYSIS STATUS & VALIDATION RESULTS */}
            {isAnalyzing && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '14px', borderRadius: '12px', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px', color: '#1d4ed8' }}>
                <RefreshCw size={20} className="animate-spin" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Analyzing photo with AI vision classifier...</span>
              </div>
            )}

            {/* REJECTED NON-WASTE IMAGE BANNER */}
            {validationError && !isAnalyzing && (
              <div style={{
                background: '#fef2f2',
                border: '2px solid #ef4444',
                borderRadius: '14px',
                padding: '16px',
                marginTop: '14px',
                color: '#991b1b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <XCircle size={22} color="#dc2626" />
                  <h4 style={{ fontWeight: '700', fontSize: '1rem', margin: 0 }}>Invalid Garbage / Waste Photo</h4>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#7f1d1d', margin: '4px 0 12px 32px' }}>
                  {validationError}
                </p>
                <div style={{ marginLeft: '32px' }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={handleRetake}
                    style={{ fontSize: '0.82rem', padding: '6px 14px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
                  >
                    <RotateCcw size={14} /> Try Again
                  </button>
                </div>
              </div>
            )}

            {/* VALIDATED WASTE RESULT BANNER */}
            {aiResult && aiResult.valid && !isAnalyzing && (
              <div style={{
                background: '#f0fdf4',
                border: `2px solid ${aiResult.color || '#16a34a'}`,
                borderRadius: '14px',
                padding: '16px',
                marginTop: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={22} color={aiResult.color || '#16a34a'} />
                    <h4 style={{ fontWeight: '700', fontSize: '1rem', color: '#14532d', margin: 0 }}>Waste Detected Successfully</h4>
                  </div>
                  <span style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}>
                    Confidence: {aiResult.confidence_formatted || `${aiResult.confidence}%`}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.88rem', color: '#166534', margin: '4px 0 10px 30px' }}>
                  Detected Category: <strong style={{ color: aiResult.color || '#16a34a' }}>{aiResult.category} Waste</strong>
                </p>

                <div style={{ marginLeft: '30px' }}>
                  <span style={{
                    background: aiResult.color || '#2563eb',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    Recommended Bin: {aiResult.recommended_bin}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Waste Type Select Dropdown */}
          <div className="form-group">
            <label style={{ fontWeight: '600' }}>Waste Type Category</label>
            <select 
              className="form-control"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              style={{ fontWeight: '600', color: '#1e293b' }}
            >
              <option value="Plastic">Plastic Waste (Bottles, Wrappers, Bags)</option>
              <option value="Organic">Organic Waste (Food scraps, Leaves)</option>
              <option value="E-Waste">E-Waste / Electronic (Batteries, Cables)</option>
              <option value="Paper">Paper & Cardboard (Boxes, Sheets)</option>
              <option value="Metal">Metal Waste (Cans, Foil)</option>
              <option value="Glass">Glass Containers (Bottles, Jars)</option>
            </select>
          </div>

          {/* Location Picker */}
          <div className="form-group">
            <label style={{ fontWeight: '600' }}>Location</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="form-control" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. College Main Gate / Library Ground"
                required
              />
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleUseCurrentLocation}
                style={{ whiteSpace: 'nowrap', padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <MapPin size={16} /> GPS Location
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label style={{ fontWeight: '600' }}>Description & Additional Notes</label>
            <textarea 
              className="form-control"
              rows="3"
              placeholder="Provide any additional details or severity notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* SUBMIT BUTTON - GATED BY AI WASTE VALIDATION */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitDisabled}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              marginTop: '8px',
              opacity: isSubmitDisabled ? 0.5 : 1,
              cursor: isSubmitDisabled ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={18} /> Submit Waste Report
          </button>

          {isSubmitDisabled && !imagePreview && (
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
              Please snap or upload a photo of waste to enable report submission.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
