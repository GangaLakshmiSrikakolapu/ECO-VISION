import React, { useState } from 'react';
import { Cpu, Upload, CheckCircle, RefreshCw, AlertCircle, ArrowRight, ShieldCheck, Camera } from 'lucide-react';
import { classifyWasteImage } from '../services/api';

export default function AIClassification({ onFileReportWithCategory }) {
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1604186838347-9faaf0dc6a06?auto=format&fit=crop&w=600&q=80');
  const [filename, setFilename] = useState('plastic_bottle.jpg');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    success: true,
    category: "Plastic",
    confidence: 95,
    confidence_formatted: "95%",
    recommended_bin: "Recyclable (Blue Bin)",
    color: "#2563eb",
    description: "PET plastic material detected with high certainty. Clean and flatten before recycling.",
    tips: ["Rinse out liquid contents", "Remove cap if made of non-PET plastic", "Compress to save space in blue bin"]
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    const data = await classifyWasteImage(imagePreview, filename);
    setIsLoading(false);
    if (data && data.category) {
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
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>AI Waste Classification Result</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Deep learning image recognition model for instant waste segregation.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Image Upload & Analyze Button */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
            Upload / Snap Waste Image
          </h3>

          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '16px',
            border: '2px solid #cbd5e1',
            maxHeight: '260px',
            position: 'relative'
          }}>
            <img 
              src={imagePreview} 
              alt="Uploaded waste snippet" 
              style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <label className="btn-secondary" style={{ flex: 1, fontSize: '0.85rem', cursor: 'pointer', padding: '10px' }}>
              <Upload size={16} /> Choose Photo
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <button 
            className="btn-primary" 
            onClick={handleAnalyze} 
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Analyzing Image...
              </>
            ) : (
              <>
                <Cpu size={18} /> Analyze Waste
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Result Output */}
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
            {result.category}
          </h2>

          <div style={{
            background: '#f8fafc',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '16px'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
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
              fontWeight: '700'
            }}>
              {result.recommended_bin}
            </span>
          </div>

          {/* Quick Segregation Tips */}
          {result.tips && result.tips.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Segregation Tips:</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.82rem', color: '#64748b' }}>
                {result.tips.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <button 
            className="btn-primary" 
            onClick={() => onFileReportWithCategory(result.category)}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            File Report with this Waste Type <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
