import { useState, useRef } from 'react';
import { api } from '../../lib/api';

interface Props {
  projectId: string;
  onUploaded: () => void;
}

const PHOTO_TYPES = [
  { value: 'site_plan', label: 'Site Plan' },
  { value: 'floor_plan', label: 'Floor Plan' },
  { value: 'sprinkler_layout', label: 'Sprinkler Layout' },
  { value: 'riser_diagram', label: 'Riser Diagram' },
  { value: 'elevation', label: 'Elevation' },
  { value: 'detail', label: 'Detail Sheet' },
];

export function PhotoUploadZone({ projectId, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [photoType, setPhotoType] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      await api.uploadFile(`/projects/${projectId}/photos`, file, {
        photoType: photoType || 'detail',
      });
      onUploaded();
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div className="flex gap-1 items-center mb-1">
        <select
          value={photoType}
          onChange={(e) => setPhotoType(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-300)', fontSize: 13 }}
        >
          <option value="">Photo type...</option>
          {PHOTO_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: '2px dashed var(--gray-300)',
          borderRadius: 'var(--radius)',
          padding: 32,
          textAlign: 'center',
          cursor: 'pointer',
          background: uploading ? 'var(--gray-100)' : 'var(--white)',
          transition: 'background 0.2s',
        }}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? (
          <div>
            <div className="spinner" style={{ margin: '0 auto 8px' }} />
            <p className="text-sm text-muted">Uploading...</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--navy)' }}>
              Tap to capture or drop a photo
            </p>
            <p className="text-sm text-muted mt-1">
              iPhone camera, plan scans, or screenshots — JPEG, PNG, HEIC up to 10MB
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
