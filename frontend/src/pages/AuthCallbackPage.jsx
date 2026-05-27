import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPostLoginPath, setStoredToken } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [message, setMessage] = useState('Đang hoàn tất đăng nhập...');

  useEffect(() => {
    const error = searchParams.get('error');
    const token = searchParams.get('token');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setStoredToken(token);
    refreshUser()
      .then((loggedInUser) => {
        if (loggedInUser) {
          navigate(getPostLoginPath(loggedInUser.role), { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      })
      .catch(() => {
        setMessage('Không thể xác thực phiên đăng nhập.');
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      });
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <LoadingSpinner />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
