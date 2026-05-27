import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getAuthProviders, getPostLoginPath, getSocialAuthUrl, isAdminRole } from '../api/auth.js';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200';

export default function LoginPage() {
  const { login, register, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState('login');
  const [providers, setProviders] = useState({ google: false, facebook: false });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(searchParams.get('error') ?? '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAuthProviders().then(setProviders).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedInUser =
        mode === 'login'
          ? await login(email, password)
          : await register({
              name,
              email,
              password,
              password_confirmation: passwordConfirmation,
            });
      navigate(getPostLoginPath(loggedInUser.role), { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message
          || err.response?.data?.errors?.email?.[0]
          || err.message
          || (mode === 'login' ? 'Đăng nhập thất bại.' : 'Đăng ký thất bại.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startSocial = (provider) => {
    window.location.href = getSocialAuthUrl(provider);
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/40 p-12 lg:flex">
        <BrandLogo size="xl" />
        <p className="mt-4 text-slate-400">Bán Rèm — rèm cửa chất lượng</p>
        <div>
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white">
            Đăng nhập để xem sản phẩm & đặt hàng
          </h1>
          <p className="mt-4 max-w-sm text-slate-300">
            Khách hàng đăng ký tài khoản mới để mua sắm. Chỉ tài khoản quản trị mới vào được khu admin.
          </p>
        </div>
        <p className="text-sm text-slate-500">© Bán Rèm</p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center p-6 lg:max-w-xl">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/10 bg-white p-8 shadow-2xl sm:p-10">
          <div className="mb-6 flex justify-center lg:hidden">
            <BrandLogo size="lg" linkTo={null} />
          </div>

          {isAuthenticated && user && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p>
                Bạn đang đăng nhập là <strong>{user.name}</strong>
                {isAdminRole(user.role) ? ' (quản trị)' : ' (khách hàng)'}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={getPostLoginPath(user.role)}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
                >
                  {isAdminRole(user.role) ? 'Vào Admin' : 'Xem sản phẩm'}
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setError('');
                  }}
                  className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === 'login' ? 'bg-white text-amber-700 shadow' : 'text-slate-600'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === 'register' ? 'bg-white text-amber-700 shadow' : 'text-slate-600'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {(providers.google || providers.facebook) && (
            <div className="space-y-3">
              {providers.google && (
                <button
                  type="button"
                  onClick={() => startSocial('google')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span className="text-lg">G</span>
                  Tiếp tục với Google
                </button>
              )}
              {providers.facebook && (
                <button
                  type="button"
                  onClick={() => startSocial('facebook')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-medium text-blue-800 hover:bg-blue-100"
                >
                  <span className="text-lg font-bold">f</span>
                  Tiếp tục với Facebook
                </button>
              )}
              <div className="relative py-2 text-center text-xs text-slate-400">
                <span className="bg-white px-2">hoặc dùng email</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Họ tên
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="password_confirmation" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {mode === 'register' && (
              <p className="text-xs text-slate-500">
                Tài khoản đăng ký mới là khách hàng — sau khi đăng ký bạn sẽ được chuyển tới trang sản phẩm.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-amber-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/25 hover:bg-amber-700 disabled:opacity-60"
            >
              {submitting
                ? 'Đang xử lý...'
                : mode === 'login'
                  ? 'Đăng nhập'
                  : 'Đăng ký'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/" className="text-amber-700 hover:text-amber-800">
              ← Về trang chủ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
