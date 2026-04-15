import { useState, FormEvent } from 'react';
import { api } from '../../lib/api';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateProjectModal({ onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    address: '',
    buildingType: '',
    constructionType: '',
    occupancyGroup: '',
    stories: '',
    squareFootage: '',
    sprinklerSystemType: '',
    hazardClassification: '',
    notes: '',
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/projects', {
        name: form.name,
        address: form.address || undefined,
        buildingType: form.buildingType || undefined,
        constructionType: form.constructionType || undefined,
        occupancyGroup: form.occupancyGroup || undefined,
        stories: form.stories ? parseInt(form.stories, 10) : undefined,
        squareFootage: form.squareFootage ? parseInt(form.squareFootage, 10) : undefined,
        sprinklerSystemType: form.sprinklerSystemType || undefined,
        hazardClassification: form.hazardClassification || undefined,
        notes: form.notes || undefined,
      });
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16,
    }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 520, width: '100%', maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: 'var(--navy)', marginBottom: 16 }}>New Project</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="e.g. 123 Main St — 12-Unit Apartment" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Street address, Chippewa Falls, WI" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Building Type</label>
              <select value={form.buildingType} onChange={(e) => update('buildingType', e.target.value)}>
                <option value="">Select...</option>
                <option>Multifamily Residential</option>
                <option>Commercial</option>
                <option>Mixed-Use</option>
                <option>Industrial</option>
                <option>Assembly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Construction Type</label>
              <select value={form.constructionType} onChange={(e) => update('constructionType', e.target.value)}>
                <option value="">Select...</option>
                <option>I-A</option><option>I-B</option>
                <option>II-A</option><option>II-B</option>
                <option>III-A</option><option>III-B</option>
                <option>V-A</option><option>V-B</option>
              </select>
            </div>
            <div className="form-group">
              <label>Occupancy Group</label>
              <input value={form.occupancyGroup} onChange={(e) => update('occupancyGroup', e.target.value)} placeholder="e.g. R-2, B, A-2" />
            </div>
            <div className="form-group">
              <label>Stories</label>
              <input type="number" value={form.stories} onChange={(e) => update('stories', e.target.value)} min="1" />
            </div>
            <div className="form-group">
              <label>Sprinkler System</label>
              <select value={form.sprinklerSystemType} onChange={(e) => update('sprinklerSystemType', e.target.value)}>
                <option value="">Select...</option>
                <option>NFPA 13</option><option>NFPA 13R</option>
                <option>NFPA 13D</option><option>None</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hazard Classification</label>
              <select value={form.hazardClassification} onChange={(e) => update('hazardClassification', e.target.value)}>
                <option value="">Select...</option>
                <option>Light Hazard</option><option>OH1</option>
                <option>OH2</option><option>EH1</option><option>EH2</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Square Footage</label>
            <input type="number" value={form.squareFootage} onChange={(e) => update('squareFootage', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Any additional details..." />
          </div>
          {error && <p className="error-text mb-1">{error}</p>}
          <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
