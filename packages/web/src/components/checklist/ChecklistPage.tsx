import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { ChecklistItemWithResponse } from '../../types';

interface Props {
  projectId: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  A_sprinkler: 'A. Sprinkler System Compliance',
  B_fire_access: 'B. Fire Access & Hydrant Compliance',
  C_fdc_standpipe: 'C. FDC & Standpipe Compliance',
  D_fire_life_safety: 'D. Fire & Life Safety General',
};

const STATUS_COLORS: Record<string, string> = {
  pass: 'var(--green)',
  fail: 'var(--red)',
  na: 'var(--gray-600)',
  pending: 'var(--gray-300)',
};

export function ChecklistPage({ projectId }: Props) {
  const [items, setItems] = useState<ChecklistItemWithResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await api.get<ChecklistItemWithResponse[]>(`/projects/${projectId}/checklist`);
      setItems(data);
    } catch (err) {
      console.error('Failed to load checklist:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [projectId]);

  async function updateStatus(itemId: string, status: string) {
    try {
      await api.put(`/projects/${projectId}/checklist/${itemId}`, { status });
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, response: { ...item.response!, checklistItemId: itemId, projectId, status: status as any, id: item.response?.id || '', notes: item.response?.notes || null, reviewedAt: new Date().toISOString() } }
            : item,
        ),
      );
    } catch (err) {
      console.error('Failed to update checklist:', err);
    }
  }

  if (loading) {
    return <div className="text-center"><div className="spinner" style={{ margin: '16px auto' }} /></div>;
  }

  const categories = ['A_sprinkler', 'B_fire_access', 'C_fdc_standpipe', 'D_fire_life_safety'];
  const totalItems = items.length;
  const passCount = items.filter((i) => i.response?.status === 'pass').length;
  const failCount = items.filter((i) => i.response?.status === 'fail').length;
  const reviewedCount = items.filter((i) => i.response && i.response.status !== 'pending').length;
  const pct = totalItems > 0 ? Math.round((reviewedCount / totalItems) * 100) : 0;

  return (
    <div>
      {/* Summary bar */}
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm">
          <strong>{reviewedCount}</strong> of <strong>{totalItems}</strong> reviewed &middot;
          <span style={{ color: 'var(--green)' }}> {passCount} pass</span> &middot;
          <span style={{ color: 'var(--red)' }}> {failCount} fail</span>
        </p>
        <span className="text-sm text-muted">{pct}%</span>
      </div>
      <div className="progress-bar mb-2">
        <div className="progress-fill" style={{ width: `${pct}%`, background: failCount > 0 ? 'var(--orange)' : 'var(--green)' }} />
      </div>

      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (catItems.length === 0) return null;
        const catReviewed = catItems.filter((i) => i.response && i.response.status !== 'pending').length;

        return (
          <div key={cat} style={{ marginBottom: 24 }}>
            <div className="flex justify-between items-center mb-1">
              <h3 style={{ fontSize: 15, color: 'var(--navy)' }}>{CATEGORY_LABELS[cat]}</h3>
              <span className="text-sm text-muted">{catReviewed}/{catItems.length}</span>
            </div>

            {catItems.map((item) => {
              const status = item.response?.status || 'pending';
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0',
                    borderBottom: '1px solid var(--gray-200)',
                  }}
                >
                  {/* Status buttons */}
                  <div className="flex gap-1" style={{ flexShrink: 0, paddingTop: 2 }}>
                    {(['pass', 'fail', 'na'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(item.id, s)}
                        style={{
                          width: 32, height: 28, border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700,
                          background: status === s ? STATUS_COLORS[s] : 'var(--gray-100)',
                          color: status === s ? 'var(--white)' : 'var(--gray-600)',
                          cursor: 'pointer',
                        }}
                      >
                        {s === 'na' ? 'N/A' : s.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14 }}>{item.description}</p>
                    {item.codeReference && (
                      <p style={{ fontSize: 11, color: 'var(--gray-600)', fontFamily: 'monospace', marginTop: 2 }}>
                        {item.codeReference}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
