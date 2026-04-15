import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { ReportData } from '../../types';

interface Props {
  projectId: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  A_sprinkler: 'A. Sprinkler System Compliance',
  B_fire_access: 'B. Fire Access & Hydrant Compliance',
  C_fdc_standpipe: 'C. FDC & Standpipe Compliance',
  D_fire_life_safety: 'D. Fire & Life Safety General',
};

export function ReportPreviewPage({ projectId }: Props) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  async function load() {
    try {
      const data = await api.get<ReportData>(`/projects/${projectId}/report/json`);
      setReport(data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [projectId]);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const blob = await api.downloadBlob(`/projects/${projectId}/report/pdf`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `custos-intel-report-${projectId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return <div className="text-center"><div className="spinner" style={{ margin: '16px auto' }} /></div>;
  }

  if (!report) {
    return <p className="text-muted text-center" style={{ padding: 40 }}>Failed to load report data.</p>;
  }

  const { project, checklistStats, findingStats } = report;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 style={{ color: 'var(--navy)', fontSize: 16 }}>Compliance Report Preview</h3>
        <button className="btn btn-primary" onClick={downloadPdf} disabled={downloading}>
          {downloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* Project Summary */}
      <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 20 }}>
        <h4 style={{ color: 'var(--navy)', marginBottom: 8 }}>Project Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
          <div><strong>Name:</strong> {project.name}</div>
          {project.address && <div><strong>Address:</strong> {project.address}</div>}
          {project.buildingType && <div><strong>Building Type:</strong> {project.buildingType}</div>}
          {project.constructionType && <div><strong>Construction:</strong> Type {project.constructionType}</div>}
          {project.occupancyGroup && <div><strong>Occupancy:</strong> Group {project.occupancyGroup}</div>}
          {project.sprinklerSystemType && <div><strong>Sprinkler:</strong> {project.sprinklerSystemType}</div>}
          {project.hazardClassification && <div><strong>Hazard:</strong> {project.hazardClassification}</div>}
          {project.stories && <div><strong>Stories:</strong> {project.stories}</div>}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <p className="text-sm text-muted">Checklist Items</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--navy)' }}>{checklistStats.total}</p>
          <div className="flex justify-between" style={{ fontSize: 12, marginTop: 4 }}>
            <span style={{ color: 'var(--green)' }}>Pass: {checklistStats.pass}</span>
            <span style={{ color: 'var(--red)' }}>Fail: {checklistStats.fail}</span>
            <span className="text-muted">Pending: {checklistStats.pending}</span>
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <p className="text-sm text-muted">AI Findings</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--navy)' }}>{findingStats.total}</p>
          <div className="flex justify-between" style={{ fontSize: 12, marginTop: 4 }}>
            <span style={{ color: 'var(--green)' }}>OK: {findingStats.compliant}</span>
            <span style={{ color: 'var(--red)' }}>Issues: {findingStats.nonCompliant}</span>
            <span style={{ color: 'var(--orange)' }}>Review: {findingStats.needsReview}</span>
          </div>
        </div>
      </div>

      {/* Checklist by Category */}
      <h4 style={{ color: 'var(--navy)', marginBottom: 12 }}>Checklist Details</h4>
      {['A_sprinkler', 'B_fire_access', 'C_fdc_standpipe', 'D_fire_life_safety'].map((cat) => {
        const items = report.checklist.filter((c) => c.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: 16 }}>
            <h5 style={{ fontSize: 14, color: 'var(--navy)', marginBottom: 6 }}>{CATEGORY_LABELS[cat]}</h5>
            {items.map((item) => {
              const status = item.response?.status || 'pending';
              return (
                <div key={item.id} className="flex items-center gap-1" style={{ padding: '4px 0', fontSize: 13, borderBottom: '1px solid var(--gray-100)' }}>
                  <span className={`badge badge-${status === 'pass' ? 'pass' : status === 'fail' ? 'fail' : 'pending'}`} style={{ minWidth: 48, textAlign: 'center' }}>
                    {status === 'na' ? 'N/A' : status.toUpperCase()}
                  </span>
                  <span style={{ flex: 1 }}>{item.description}</span>
                  {item.codeReference && <span className="text-muted" style={{ fontSize: 11, fontFamily: 'monospace' }}>{item.codeReference}</span>}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Non-compliant findings */}
      {report.findings.filter((f) => f.findingType === 'non_compliant').length > 0 && (
        <>
          <h4 style={{ color: 'var(--red)', marginTop: 20, marginBottom: 12 }}>Non-Compliant Findings</h4>
          {report.findings
            .filter((f) => f.findingType === 'non_compliant')
            .map((f) => (
              <div key={f.id} style={{ borderLeft: '4px solid var(--red)', padding: '8px 12px', marginBottom: 8, background: '#fff5f5', borderRadius: '0 var(--radius) var(--radius) 0' }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{f.title}</p>
                <p className="text-sm">{f.description}</p>
                {f.codeReferences?.length > 0 && (
                  <p className="text-sm text-muted" style={{ marginTop: 4, fontFamily: 'monospace' }}>
                    {f.codeReferences.map((r) => r.code).join(', ')}
                  </p>
                )}
              </div>
            ))}
        </>
      )}
    </div>
  );
}
