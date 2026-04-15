import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header style={{
      background: 'var(--navy)',
      color: 'var(--white)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      <div>
        <Link to="/projects" style={{ color: 'inherit', textDecoration: 'none' }}>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>
            <span style={{ color: 'var(--gold)' }}>Custos Intel</span>
            {' '}&mdash; Fire & Life Safety
          </h1>
        </Link>
        <div style={{ fontSize: 11, color: 'var(--gray-300)', marginTop: 2 }}>
          Multifamily & Commercial | Chippewa Falls, WI
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/codes" style={{ color: 'var(--gray-300)', fontSize: 13, textDecoration: 'none' }}>
          Code Reference
        </Link>
        {user && (
          <>
            <span style={{ fontSize: 12, color: 'var(--gray-300)' }}>{user.email}</span>
            <button
              onClick={signOut}
              style={{
                background: 'transparent',
                border: '1px solid var(--gray-600)',
                color: 'var(--gray-300)',
                padding: '4px 12px',
                borderRadius: 'var(--radius)',
                fontSize: 12,
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
