import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup, signInWithGoogle, resetPassword } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, User as UserIcon, Chrome } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'reset';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await login(email, password);
        setUser(user);
        toast.success('Logged in successfully');
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else if (mode === 'signup') {
        if (!displayName.trim()) {
          toast.error('Please enter your name');
          return;
        }
        const user = await signup(email, password, displayName);
        setUser(user);
        toast.success('Account created successfully');
        navigate('/');
      } else if (mode === 'reset') {
        await resetPassword(email);
        toast.success('Password reset email sent');
        setMode('login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      setUser(user);
      toast.success('Signed in with Google');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <UserIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h1>
            <p className="text-gray-600 mt-2">
              {mode === 'login'
                ? 'Sign in to your account'
                : mode === 'signup'
                ? 'Join MITC today'
                : 'Enter your email to reset password'}
            </p>
          </div>

          {/* Google Sign-In */}
          {mode !== 'reset' && (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span>Continue with Google</span>
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>
            </>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-semibold"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign In'
                : mode === 'signup'
                ? 'Create Account'
                : 'Send Reset Link'}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            {mode === 'reset' ? (
              <button
                onClick={() => setMode('login')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to <span className="text-primary-600 font-medium">Sign In</span>
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>By continuing, you agree to our</p>
          <div className="mt-1 space-x-2">
            <button
              onClick={() => navigate('/terms')}
              className="text-primary-600 hover:text-primary-700"
            >
              Terms
            </button>
            <span>·</span>
            <button
              onClick={() => navigate('/privacy')}
              className="text-primary-600 hover:text-primary-700"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;