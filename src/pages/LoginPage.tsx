import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'teacher'
  });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.role);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-black starfield-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-400 border-4 border-white mb-4">
            <Leaf className="w-8 h-8 text-black" />
          </div>
          <h1 className="arcade-h1 mb-2">ReEarth</h1>
          <p className="arcade-text arcade-text-yellow">PRESS START TO ENTER</p>
        </div>

        {/* Form */}
        <div className="arcade-dialog p-6">
          <div className="text-center mb-6">
            <h2 className="arcade-h2 mb-2">
              {isLogin ? 'PLAYER LOGIN' : 'NEW PLAYER'}
            </h2>
            <p className="arcade-text arcade-text-cyan mt-2">
              {isLogin ? 'CONTINUE GAME' : 'CREATE CHARACTER'}
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="arcade-card arcade-card-magenta p-4 mb-6">
            <h3 className="arcade-text arcade-text-yellow mb-2">DEMO ACCESS:</h3>
            <div className="space-y-1 arcade-text text-xs">
              <p><span className="arcade-text-green">STUDENT:</span> student@demo.com</p>
              <p><span className="arcade-text-green">TEACHER:</span> teacher@demo.com</p>
              <p><span className="arcade-text-green">PASSWORD:</span> any password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">
                  PLAYER NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="arcade-input w-full px-3"
                  placeholder="ENTER NAME"
                  required
                />
              </div>
            )}

            <div>
              <label className="block arcade-text arcade-text-yellow mb-2">
                EMAIL ID
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="arcade-input w-full px-3"
                placeholder="ENTER EMAIL"
                required
              />
            </div>

            <div>
              <label className="block arcade-text arcade-text-yellow mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="arcade-input w-full px-3"
                placeholder="ENTER PASSWORD"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">
                  SELECT CLASS:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center arcade-text arcade-text-cyan">
                    <input
                      type="radio"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'student' | 'teacher' })}
                      className="mr-2 accent-cyan-400"
                    />
                    STUDENT
                  </label>
                  <label className="flex items-center arcade-text arcade-text-cyan">
                    <input
                      type="radio"
                      value="teacher"
                      checked={formData.role === 'teacher'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'student' | 'teacher' })}
                      className="mr-2 accent-cyan-400"
                    />
                    TEACHER
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="arcade-card arcade-card-red p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="arcade-text text-red-400">{error.toUpperCase()}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full arcade-btn ${isLogin ? 'arcade-btn-primary' : 'arcade-btn-secondary'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'LOADING...' : (isLogin ? 'START GAME' : 'CREATE PLAYER')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="arcade-text arcade-text-magenta nav-hover"
            >
              {isLogin ? "NEW PLAYER? CREATE ACCOUNT" : "EXISTING PLAYER? LOGIN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}