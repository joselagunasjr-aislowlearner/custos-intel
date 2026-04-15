import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { PlanPhoto } from '../../types';

interface Props {
  projectId: string;
}

export function PhotoGrid({ projectId }: Props) {
  const [photos, setPhotos] = useState<PlanPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewPhoto, setViewPhoto] = useState<PlanPhoto | null>(null);

  async function load() {
    try {
      const data = await api.get<PlanPhoto[]>(`/projects/${projectId}/photos`);
      setPhotos(data);
    } catch (err) {
      console.error('Failed to load photos:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [projectId]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo?')) return;
    try {
      await api.delete(`/photos/${id}`);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setViewPhoto(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  if (loading) {
    return <div className="text-center"><div className="spinner" style={{ margin: '16px auto' }} /></div>;
  }

  if (photos.length === 0) {
    return <p className="text-muted text-sm text-center" style={{ padding: 20 }}>No photos uploaded yet. Use the area above to add plan photos.</p>;
  }

  const typeLabels: Record<string, string> = {
    site_plan: 'Site Plan', floor_plan: 'Floor Plan', sprinkler_layout: 'Sprinkler Layout',
    riser_diagram: 'Riser Diagram', elevation: 'Elevation', detail: 'Detail Sheet',
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--gray-200)', cursor: 'pointer' }}
            onClick={() => setViewPhoto(photo)}
          >
            {photo.storageUrl ? (
              <img src={photo.storageUrl} alt={photo.originalFilename || 'Plan photo'} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: 140, background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="text-muted text-sm">No preview</span>
              </div>
            )}
            <div style={{ padding: 8 }}>
              <p className="text-sm" style={{ fontWeight: 600, color: 'var(--navy)' }}>
                {photo.photoType ? typeLabels[photo.photoType] || photo.photoType : 'Photo'}
              </p>
              <p className="text-sm text-muted" style={{ fontSize: 11 }}>
                {photo.originalFilename || 'Untitled'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {viewPhoto && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setViewPhoto(null)}
        >
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            {viewPhoto.storageUrl && (
              <img src={viewPhoto.storageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }} />
            )}
            <div className="flex justify-between items-center mt-1">
              <p style={{ color: 'var(--white)', fontSize: 13 }}>
                {viewPhoto.photoType ? typeLabels[viewPhoto.photoType] || viewPhoto.photoType : ''} &middot; {viewPhoto.originalFilename}
              </p>
              <div className="flex gap-1">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(viewPhoto.id)}>Delete</button>
                <button className="btn btn-outline btn-sm" style={{ color: 'var(--white)', borderColor: 'var(--gray-600)' }} onClick={() => setViewPhoto(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
