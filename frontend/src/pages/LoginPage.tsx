import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/client';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { getApiError } from '../../utils/errorHandler';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', data);
      const { user, token } = response.data;

      login(user, token);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(getApiError(err, "Login failed. Check your email and password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to your blog account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        {error && (
          <div className="form-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              className={errors.email ? 'input-error' : ''}
            />
          </div>
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-with-icon">
            <Lock size={18} />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={errors.password ? 'input-error' : ''}
            />
          </div>
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Signing in..." : (
            <>
              <LogIn size={20} />
              <span>Log In</span>
            </>
          )}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up here</Link>
        </p>
      </form>
    </div>
  );
}
