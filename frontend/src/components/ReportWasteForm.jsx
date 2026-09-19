import React, { useState } from 'react';
import { Upload, MapPin, Camera, AlertTriangle, Send, Image as ImageIcon } from 'lucide-react';

export default function ReportWasteForm({ onSubmitSuccess, prefilledWasteType }) {
  const [wasteType, setWasteType] = useState(prefilledWasteType || 'Plastic');
  const [location, setLocation] = useState('College Main Gate');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1604186838347-9faaf0dc6a06?auto=format&fit=crop&w=600&q=80');
  const [isCapturingCamera, setIsCapturingCamera] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
    const reportData = {
      wasteType,
      location,
      description: description || "Waste report submitted by user.",
      imageUrl: imagePreview,
      coordinates: { lat: 16.5062, lng: 80.6480 }
    };
    onSubmitSuccess(reportData);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '20px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div style={{ background: '#ecfdf5', color: '#16a34a', padding: '10px', borderRadius: '12px' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>Report Waste / Dirty Area</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Help keep campus clean by notifying our sanitation team.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Waste Type Dropdown */}
          <div className="form-group">
            <label>Waste Type</label>
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

          {/* Upload Image Dropzone & Preview */}
          <div className="form-group">
            <label>Upload / Capture Image</label>
            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              background: '#f8fafc',
              position: 'relative'
            }}>
              {imagePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={imagePreview} 
                    alt="Waste preview" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px' }} 
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview('')}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={32} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>Choose File or Drop Image</p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>PNG, JPG or WEBP up to 10MB</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '14px' }}>
                <label className="btn-secondary" style={{ fontSize: '0.85rem', cursor: 'pointer', padding: '8px 16px' }}>
                  <ImageIcon size={16} /> Choose File
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>

                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleUseCurrentLocation}
                  style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                >
                  <Camera size={16} /> Snap Photo
                </button>
              </div>
            </div>
          </div>

          {/* Location Picker */}
          <div className="form-group">
            <label>Location</label>
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
                <MapPin size={16} /> Use Current Location
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control"
              rows="3"
              placeholder="Provide any additional details or severity notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}>
            <Send size={18} /> Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
