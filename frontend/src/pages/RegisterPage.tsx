import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/client';
import { Mail, Lock, User as UserIcon, UserPlus, AlertCircle } from 'lucide-react';
import { getApiError } from '../../utils/errorHandler';

// 1. We define our validation schema using Zod
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// We extract the TypeScript type from the schema automatically
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // 2. Initialize React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/register', data);
      const { user, token } = response.data;

      login(user, token);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(getApiError(err, "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Join our community of writers</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        {error && (
          <div className="form-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label>Full Name</label>
          <div className="input-with-icon">
            <UserIcon size={18} />
            <input
              {...register('name')}
              type="text"
              placeholder="Your Name"
              className={errors.name ? 'input-error' : ''}
            />
          </div>
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

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
          {loading ? "Creating..." : (
            <>
              <UserPlus size={20} />
              <span>Sign Up</span>
            </>
          )}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</Link>
        </p>
      </form>
    </div>
  );
}
