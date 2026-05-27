import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import BrandLogo from '../BrandLogo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Sản phẩm' },
  { to: '/admin/categories', label: 'Danh mục' },
  { to: '/admin/site-assets', label: 'Ảnh giao diện' },
  { to: '/admin/orders', label: 'Đơn hàng' },
  { to: '/admin/leads', label: 'Leads' },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Đóng menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-800 px-5 py-6">
          <Link to="/admin" className="flex flex-col items-center" onClick={() => setSidebarOpen(false)}>
            <BrandLogo size="lg" linkTo={null} className="justify-center" />
            <span className="mt-2 text-center text-xs text-slate-400">Admin Dashboard</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <Link
            to="/"
            className="block rounded-xl px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ← Xem website
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              Menu
            </button>
            <div className="flex flex-1 items-center justify-end gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 sm:inline">
                {user?.role}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
