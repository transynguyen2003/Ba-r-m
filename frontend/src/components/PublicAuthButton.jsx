import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PublicAuthButton({ className = '' }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated && isAdmin) {
    return (
      <Link
        to="/admin"
        className={`rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 ${className}`}
      >
        Vào Admin
      </Link>
    );
  }

  return (
    <Link
      to="/login"
      className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 ${className}`}
    >
      Đăng nhập
    </Link>
  );
}
