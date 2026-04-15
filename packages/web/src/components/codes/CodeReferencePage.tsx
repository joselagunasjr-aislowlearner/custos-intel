import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import type { CodeReference } from '../../types';

const CATEGORIES = [
  { key: '', label: 'All Categories' },
  { key: 'sprinkler_spacing', label: 'Sprinkler Spacing' },
  { key: 'sprinkler_coverage', label: 'Sprinkler Coverage' },
  { key: 'sprinkler_deflector', label: 'Deflector Distances' },
  { key: 'sprinkler_density', label: 'Sprinkler Density' },
  { key: 'fire_access', label: 'Fire Access' },
  { key: 'hydrant_distance', label: 'Hydrant Distance' },
  { key: 'fdc_requirements', label: 'FDC Requirements' },
  { key: 'fdc_signage', label: 'FDC Signage' },
  { key: 'standpipe', label: 'Standpipes' },
  { key: 'fire_resistance', label: 'Fire Resistance' },
  { key: 'fire_life_safety', label: 'Fire & Life Safety' },
  { key: 'wisconsin_amendments', label: 'Wisconsin Amendments' },
  { key: 'local_ordinances', label: 'Chippewa Falls Local' },
];

const SOURCE_TAG: Record<string, string> = {
  NFPA_13_2012: 'tag-nfpa',
  NFPA_13R: 'tag-nfpa',
  NFPA_14_2010: 'tag-nfpa',
  IBC_2012: 'tag-ibc',
  IFC_2012: 'tag-ibc',
  SPS_362: 'tag-wi',
  CHIPPEWA_FALLS: 'tag-local',
};

export function CodeReferencePage() {
  const [codes, setCodes] = useState<CodeReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<{ data: CodeReference[]; total: number }>('/codes?limit=200');
      setCodes(result.data);
    } catch (err) {
      console.error('Failed to load codes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await api.get<CodeReference[]>(`/codes/search?q=${encodeURIComponent(q)}`);
      setCodes(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategory = useCallback(async (cat: string) => {
    setLoading(true);
    try {
      const data = await api.get<Array<{ section: string; title: string; content: string; codeSource: string }>>(`/codes/category/${cat}`);
      setCodes(data as unknown as CodeReference[]);
    } catch (err) {
      console.error('Category load failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCategory('');
    if (searchTimeout) clearTimeout(searchTimeout);

    if (!value.trim()) {
      loadAll();
      return;
    }

    setSearchTimeout(setTimeout(() => search(value), 400));
  }

  function handleCategoryChange(cat: string) {
    setCategory(cat);
    setSearchQuery('');
    if (!cat) {
      loadAll();
    } else {
      loadCategory(cat);
    }
  }

  return (
    <div>
      <h2 style={{ color: 'var(--navy)', fontSize: 22, marginBottom: 4 }}>Code Reference Database</h2>
      <p className="text-sm text-muted mb-2">
        NFPA 13 (2012) &middot; IBC 2012 &middot; IFC 2012 &middot; WI SPS 362 &middot; Chippewa Falls Local
      </p>

      {/* Search and filter */}
      <div className="flex gap-1 mb-2" style={{ flexWrap: 'wrap' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search codes, requirements, or keywords..."
          style={{ flex: 1, minWidth: 260, padding: '10px 14px', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', fontSize: 14 }}
        />
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', fontSize: 14 }}
        >
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center"><div className="spinner" style={{ margin: '32px auto' }} /></div>
      ) : codes.length === 0 ? (
        <p className="text-muted text-center" style={{ padding: 40 }}>No results found.</p>
      ) : (
        <div>
          {codes.map((code, i) => (
            <div
              key={code.id || i}
              style={{
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius)',
                padding: 16,
                marginBottom: 10,
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <h4 style={{ fontSize: 15, color: 'var(--navy)' }}>{code.title}</h4>
                {code.section && (
                  <span style={{ fontSize: 12, color: 'var(--gray-600)', fontFamily: 'monospace', background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 4 }}>
                    {code.codeSource?.replace(/_/g, ' ')} {code.section}
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ marginBottom: 8 }}>{code.content}</p>
              <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                {code.numericValue !== null && code.numericValue !== undefined && (
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                    {code.numericValue} {code.unit || ''}
                  </span>
                )}
                {code.codeSource && (
                  <span className={`tag ${SOURCE_TAG[code.codeSource] || ''}`}>
                    {code.codeSource.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
