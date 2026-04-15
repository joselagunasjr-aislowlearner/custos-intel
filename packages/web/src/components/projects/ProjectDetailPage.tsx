import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { Project } from '../../types';
import { PhotoGrid } from '../photos/PhotoGrid';
import { PhotoUploadZone } from '../photos/PhotoUploadZone';
import { ChecklistPage } from '../checklist/ChecklistPage';
import { AnalysisPage } from '../analysis/AnalysisPage';
import { ReportPreviewPage } from '../reports/ReportPreviewPage';

type Tab = 'photos' | 'checklist' | 'findings' | 'report';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('photos');

  async function loadProject() {
    if (!id) return;
    try {
      const data = await api.get<Project>(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProject(); }, [id]);

  if (loading) {
    return <div className="text-center mt-3"><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  }

  if (!project) {
    return <div className="card text-center mt-3"><p>Project not found.</p><Link to="/projects">Back to projects</Link></div>;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'photos', label: 'Photos' },
    { key: 'checklist', label: 'Checklist' },
    { key: 'findings', label: 'AI Findings' },
    { key: 'report', label: 'Report' },
  ];

  return (
    <div>
      <Link to="/projects" className="text-sm" style={{ color: 'var(--gray-600)' }}>&larr; All Projects</Link>

      <div className="flex justify-between items-center mt-1 mb-1">
        <div>
          <h2 style={{ color: 'var(--navy)', fontSize: 22 }}>{project.name}</h2>
          {project.address && <p className="text-sm text-muted">{project.address}</p>}
        </div>
        <span className={`badge badge-${project.status === 'completed' ? 'pass' : 'review'}`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex gap-1 mb-2" style={{ flexWrap: 'wrap' }}>
        {project.buildingType && <span className="tag tag-ibc">{project.buildingType}</span>}
        {project.constructionType && <span className="tag tag-nfpa">Type {project.constructionType}</span>}
        {project.occupancyGroup && <span className="tag tag-nfpa">Group {project.occupancyGroup}</span>}
        {project.sprinklerSystemType && <span className="tag tag-wi">{project.sprinklerSystemType}</span>}
        {project.hazardClassification && <span className="tag tag-local">{project.hazardClassification}</span>}
        {project.stories && <span className="tag" style={{ background: 'var(--gray-200)' }}>{project.stories} stories</span>}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: activeTab === tab.key ? 'var(--white)' : 'transparent',
              color: activeTab === tab.key ? 'var(--navy)' : 'var(--gray-600)',
              borderBottom: activeTab === tab.key ? '3px solid var(--gold)' : '3px solid transparent',
              borderRadius: '8px 8px 0 0',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ borderRadius: '0 8px 8px 8px' }}>
        {activeTab === 'photos' && (
          <div>
            <PhotoUploadZone projectId={project.id} onUploaded={loadProject} />
            <PhotoGrid projectId={project.id} />
          </div>
        )}
        {activeTab === 'checklist' && <ChecklistPage projectId={project.id} />}
        {activeTab === 'findings' && <AnalysisPage projectId={project.id} />}
        {activeTab === 'report' && <ReportPreviewPage projectId={project.id} />}
      </div>
    </div>
  );
}
