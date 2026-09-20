import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Upload, RefreshCw, ArrowRight, Camera, XCircle, X, Lightbulb } from 'lucide-react';
import { classifyWasteImage } from '../services/api';

export default function AIClassification({ onFileReportWithCategory }) {
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1604186838347-9faaf0dc6a06?auto=format&fit=crop&w=600&q=80');
  const [filename, setFilename] = useState('plastic_bottle.jpg');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const [result, setResult] = useState({
    valid: true,
    is_waste: true,
    category: "Plastic",
    confidence: 95,
    confidence_formatted: "95%",
    recommended_bin: "Recyclable (Blue Bin)",
    color: "#2563eb",
    description: "PET plastic material detected with high certainty. Clean and flatten before recycling.",
    tips: ["Rinse out liquid contents", "Remove cap if made of non-PET plastic", "Compress to save space in blue bin"]
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
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
      setCameraError("Camera access denied or camera unavailable. Please upload an image file instead.");
      setIsCameraOpen(false);
    }
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
    const snapFilename = `camera_snap.jpg`;

    setImagePreview(dataUrl);
    setFilename(snapFilename);
    stopCamera();

    runAnalysis(dataUrl, snapFilename);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilename(file.name);
      stopCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setImagePreview(dataUrl);
        runAnalysis(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (imgData = imagePreview, fname = filename) => {
    setIsLoading(true);
    const data = await classifyWasteImage(imgData, fname);
    setIsLoading(false);
    if (data) {
      setResult(data);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#dbeafe', color: '#2563eb', padding: '10px', borderRadius: '12px' }}>
          <Cpu size={26} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>AI Waste Classifier & Detector</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time image vision model for automated waste segregation and validation.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Image Input & Camera */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
            Upload or Snap Waste Photo
          </h3>

          {cameraError && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '12px' }}>
              {cameraError}
            </div>
          )}

          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '16px',
            border: '2px solid #cbd5e1',
            minHeight: '220px',
            position: 'relative',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isCameraOpen ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '260px', objectFit: 'cover' }}
              ></video>
            ) : (
              <img 
                src={imagePreview} 
                alt="Uploaded waste preview" 
                style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>

          {/* Camera Controls */}
          {isCameraOpen ? (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button 
                type="button" 
                onClick={capturePhoto} 
                className="btn-primary" 
                style={{ flex: 1, background: '#16a34a', padding: '10px', fontSize: '0.9rem' }}
              >
                <Camera size={18} /> Capture Photo
              </button>
              <button 
                type="button" 
                onClick={stopCamera} 
                className="btn-secondary" 
                style={{ padding: '10px 16px', fontSize: '0.9rem' }}
              >
                <X size={18} /> Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={startCamera}
                style={{ flex: 1, fontSize: '0.85rem', padding: '10px' }}
              >
                <Camera size={16} /> Snap Photo
              </button>
              <label className="btn-secondary" style={{ flex: 1, fontSize: '0.85rem', cursor: 'pointer', padding: '10px', textAlign: 'center' }}>
                <Upload size={16} /> Choose File
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
          )}

          <button 
            className="btn-primary" 
            onClick={() => runAnalysis(imagePreview, filename)} 
            disabled={isLoading || isCameraOpen}
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Analyzing Image...
              </>
            ) : (
              <>
                <Cpu size={18} /> Analyze Waste Image
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Output */}
        {result && (result.valid === false || result.is_waste === false) ? (
          /* NON-WASTE REJECTION CARD */
          <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', borderLeft: '6px solid #dc2626', background: '#fef2f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <XCircle size={28} color="#dc2626" />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#991b1b', margin: 0 }}>Invalid Garbage / Waste Photo</h3>
                <span style={{ fontSize: '0.8rem', color: '#b91c1c' }}>Image Validation Failed</span>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: '1.5', marginBottom: '20px', background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #fca5a5' }}>
              {result.message || "Invalid garbage/waste photo. Please capture or upload a clear photo of waste."}
            </p>

            <p style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: '600' }}>
              Please take or upload a photo showing clear waste items (plastic bottles, organic food scraps, cardboard boxes, metal cans, glass, or e-waste).
            </p>
          </div>
        ) : (
          /* VALID WASTE DETECTION CARD */
          <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', borderLeft: `6px solid ${result.color || '#2563eb'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Prediction Result
              </span>
              <span style={{
                background: '#dcfce7',
                color: '#16a34a',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: '700'
              }}>
                Confidence: {result.confidence_formatted || `${result.confidence}%`}
              </span>
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: result.color || '#2563eb', marginBottom: '10px' }}>
              {result.category} Waste
            </h2>

            <div style={{
              background: '#f8fafc',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', margin: 0 }}>
                {result.description}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>
                Recommended Bin:
              </h4>
              <span style={{
                background: result.color || '#2563eb',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                display: 'inline-block'
              }}>
                {result.recommended_bin}
              </span>
            </div>

            {/* Clear Segregation & Handling Tips Section */}
            {result.tips && result.tips.length > 0 && (
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e40af', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb size={18} color="#2563eb" /> Clear Segregation & Action Tips:
                </h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.86rem', color: '#1e3a8a' }}>
                  {result.tips.map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: '6px', lineHeight: '1.4' }}>
                      <strong>Tip {idx + 1}:</strong> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              className="btn-primary" 
              onClick={() => onFileReportWithCategory({ category: result.category, imagePreview, result })}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              File Report with this Waste Type <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
