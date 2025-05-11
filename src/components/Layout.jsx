import { Outlet, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/useToast.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  const { Toast } = useToast();

  const PUBLIC_BASE = import.meta.env.VITE_PUBLIC_SITE_BASE;

  const getPublicSiteUrl = () => {
    if (pathname.includes('/events')) return `${PUBLIC_BASE}/events`;
    if (pathname.includes('/about')) return `${PUBLIC_BASE}/about`;
    if (pathname.includes('/menu')) return `${PUBLIC_BASE}/menu`;
    return PUBLIC_BASE;
  };

  const navLink = (to, label) => (
    <a href={to} className={`btn btn-sm ${pathname === to ? 'btn-primary' : 'btn-outline-primary'}`}>
      {label}
    </a>
  );

  return (
    <div className="container py-4">
      <header className="text-center mb-4">
        <img src="/pizza.png" alt="EdibleMami" style={{ maxWidth: '160px' }} />
        <h1 className="my-3">📋 Uploader Dashboard</h1>

        {/* Navigation Groups */}
        <div className="d-flex flex-wrap justify-content-center gap-4 mb-3">
          {/* Moments */}
          <div className="text-center">
            <h6>📸 Moments</h6>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {navLink('/moments/create', '➕ Create')}
              {navLink('/moments/view', '📂 View All')}
            </div>
          </div>

          {/* Events */}
          <div className="text-center">
            <h6>📅 Events</h6>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {navLink('/events/create', '➕ Create')}
              {navLink('/events/view', '📂 View All')}
            </div>
          </div>

          {/* Site */}
          <div className="text-center">
            <h6>🌐 Site</h6>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {navLink('/about/edit', '✏️ Edit About')}
              {navLink('/menu/edit', '✏️ Edit Menu')}
            </div>
          </div>
        </div>

        {/* View Public Site Link */}
        <div className="text-center mt-4">
          <a
            href={getPublicSiteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-dark"
          >
            🔗 View Public Site
          </a>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <Toast />
    </div>
  );
}
