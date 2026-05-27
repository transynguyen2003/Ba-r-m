import { NavLink } from 'react-router-dom';
import BrandLogo from '../BrandLogo.jsx';
import PublicAuthButton from '../PublicAuthButton.jsx';

const links = [
  { to: '/', label: 'Trang chủ' },
  { to: '/products', label: 'Sản phẩm' },
  { to: '/blog', label: 'Tin tức' },
  { to: '/order', label: 'Đặt hàng' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandLogo size="md" />
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <PublicAuthButton />
        </div>
      </div>
    </header>
  );
}
