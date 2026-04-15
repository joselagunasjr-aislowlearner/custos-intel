import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { Project } from '../../types';
import { CreateProjectModal } from './CreateProjectModal';

export function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function loadProjects() {
    try {
      const data = await api.get<Project[]>('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProjects(); }, []);

  if (loading) {
    return <div className="text-center mt-3"><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 style={{ color: 'var(--navy)', fontSize: 22 }}>Projects</h2>
        <button className="btn btn-gold" onClick={() => setShowCreate(true)}>
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center" style={{ padding: 40 }}>
          <p className="text-muted">No projects yet. Create your first building plan review.</p>
          <button className="btn btn-primary mt-2" onClick={() => setShowCreate(true)}>
            Create Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
                <div className="flex justify-between items-center mb-1">
                  <h3 style={{ fontSize: 16, color: 'var(--navy)' }}>{project.name}</h3>
                  <span className={`badge badge-${project.status === 'completed' ? 'pass' : project.status === 'archived' ? 'pending' : 'review'}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                {project.address && (
                  <p className="text-sm text-muted">{project.address}</p>
                )}
                <div className="flex gap-1 mt-1" style={{ flexWrap: 'wrap' }}>
                  {project.buildingType && <span className="tag tag-ibc">{project.buildingType}</span>}
                  {project.occupancyGroup && <span className="tag tag-nfpa">{project.occupancyGroup}</span>}
                  {project.sprinklerSystemType && <span className="tag tag-wi">{project.sprinklerSystemType}</span>}
                </div>
                <p className="text-sm text-muted mt-1">
                  {project.photos?.length || 0} photos &middot; Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); loadProjects(); }}
        />
      )}
    </div>
  );
}
