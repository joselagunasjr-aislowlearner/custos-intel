import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { AnalysisFinding } from '../../types';

interface Props {
  projectId: string;
}

const TYPE_BADGE: Record<string, { cls: string; label: string }> = {
  compliant: { cls: 'badge-pass', label: 'Compliant' },
  non_compliant: { cls: 'badge-fail', label: 'Non-Compliant' },
  needs_review: { cls: 'badge-review', label: 'Needs Review' },
  informational: { cls: 'badge-info', label: 'Info' },
};

const CATEGORY_LABELS: Record<string, string> = {
  sprinkler: 'Sprinkler Systems',
  fire_access: 'Fire Access & Hydrants',
  fdc_standpipe: 'FDC & Standpipes',
  fire_life_safety: 'Fire & Life Safety',
};

export function AnalysisPage({ projectId }: Props) {
  const [findings, setFindings] = useState<AnalysisFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [filter, setFilter] = useState('all');

  async function load() {
    try {
      const data = await api.get<AnalysisFinding[]>(`/projects/${projectId}/findings`);
      setFindings(data);
    } catch (err) {
      console.error('Failed to load findings:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [projectId]);

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      const newFindings = await api.post<AnalysisFinding[]>(`/projects/${projectId}/analyze`);
      setFindings((prev) => [...newFindings, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  const filtered = filter === 'all' ? findings : findings.filter((f) => f.findingType === filter);
  const nonCompliant = findings.filter((f) => f.findingType === 'non_compliant').length;
  const compliant = findings.filter((f) => f.findingType === 'compliant').length;
  const needsReview = findings.filter((f) => f.findingType === 'needs_review').length;

  if (loading) {
    return <div className="text-center"><div className="spinner" style={{ margin: '16px auto' }} /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 style={{ color: 'var(--navy)', fontSize: 16 }}>AI Compliance Analysis</h3>
          {findings.length > 0 && (
            <p className="text-sm text-muted">
              {findings.length} findings &middot;
              <span style={{ color: 'var(--green)' }}> {compliant} compliant</span> &middot;
              <span style={{ color: 'var(--red)' }}> {nonCompliant} non-compliant</span> &middot;
              <span style={{ color: 'var(--orange)' }}> {needsReview} needs review</span>
            </p>
          )}
        </div>
        <button className="btn btn-gold" onClick={runAnalysis} disabled={analyzing}>
          {analyzing ? 'Analyzing...' : 'Analyze Photos'}
        </button>
      </div>

      {analyzing && (
        <div className="info-box flex items-center gap-1">
          <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
          <span>Claude is analyzing your plan photos against fire codes. This may take a minute...</span>
        </div>
      )}

      {findings.length === 0 && !analyzing ? (
        <div className="text-center" style={{ padding: 40 }}>
          <p className="text-muted">No findings yet. Upload plan photos and click "Analyze Photos" to start.</p>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          {findings.length > 0 && (
            <div className="flex gap-1 mb-2">
              {[
                { key: 'all', label: `All (${findings.length})` },
                { key: 'non_compliant', label: `Non-Compliant (${nonCompliant})` },
                { key: 'needs_review', label: `Needs Review (${needsReview})` },
                { key: 'compliant', label: `Compliant (${compliant})` },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="btn btn-sm"
                  style={{
                    background: filter === f.key ? 'var(--navy)' : 'var(--gray-100)',
                    color: filter === f.key ? 'var(--white)' : 'var(--gray-800)',
                    border: 'none',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {filtered.map((finding) => {
            const badge = TYPE_BADGE[finding.findingType] || TYPE_BADGE.informational;
            return (
              <div
                key={finding.id}
                style={{
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius)',
                  padding: 16,
                  marginBottom: 12,
                  borderLeft: `4px solid ${finding.findingType === 'non_compliant' ? 'var(--red)' : finding.findingType === 'compliant' ? 'var(--green)' : 'var(--orange)'}`,
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 style={{ fontSize: 15, color: 'var(--navy)' }}>{finding.title}</h4>
                  <span className={`badge ${badge.cls}`}>{badge.label}</span>
                </div>
                <p className="text-sm" style={{ marginBottom: 8 }}>{finding.description}</p>
                <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                  <span className="tag" style={{ background: 'var(--gray-100)' }}>
                    {CATEGORY_LABELS[finding.category] || finding.category}
                  </span>
                  {finding.codeReferences?.map((ref, i) => (
                    <span key={i} className="tag tag-nfpa">{ref.code}</span>
                  ))}
                  {finding.confidence !== null && (
                    <span className="tag" style={{ background: 'var(--gray-100)', fontSize: 10 }}>
                      {Math.round(finding.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
