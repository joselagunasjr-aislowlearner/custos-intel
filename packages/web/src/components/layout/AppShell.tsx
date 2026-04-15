import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function AppShell() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '20px 16px', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}
