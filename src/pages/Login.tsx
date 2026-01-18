import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!username || !password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    // Mock SSO login - create user from TU-ID
    const newUser = {
      id: `user-${Date.now()}`,
      name: username.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: username.includes('@') ? username : `${username}@stud.tu-darmstadt.de`,
      isVerified: true,
      role: 'both' as const,
      createdAt: new Date().toISOString(),
    };

    login(newUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* CampusFix Logo and Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-4xl">CF</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              CampusFix
            </h1>
            <p className="text-slate-600">Peer-to-Peer Reparaturen für Studierende</p>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
            Login mit TU-ID
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                Benutzername
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                placeholder="tu-id oder max.mustermann@stud.tu-darmstadt.de"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mt-1 w-4 h-4 border-2 border-slate-400 rounded"
              />
              <label htmlFor="remember" className="text-sm text-slate-700">
                Anmeldung nicht speichern
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="dataTransfer"
                type="checkbox"
                className="mt-1 w-4 h-4 border-2 border-slate-400 rounded"
              />
              <label htmlFor="dataTransfer" className="text-sm text-slate-700">
                Die zu übermittelnden Informationen anzeigen, damit ich die Weitergabe gegebenenfalls ablehnen kann.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Anmelden
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-center items-center gap-6 text-sm">
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Passwort vergessen?
            </a>
            <span className="text-slate-300">•</span>
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Hilfe
            </a>
            <span className="text-slate-300">•</span>
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Über CampusFix
            </a>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-primary-50 border border-primary-200 rounded-xl px-6 py-4">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">💡 Demo-Version:</span> Nutze deine TU-ID zum Login
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Beliebiger Username funktioniert (z.B. "max.mustermann" / "test")
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>© 2025 CampusFix • TU Darmstadt</p>
          <p className="mt-1">Peer-to-Peer Reparaturen für Studierende</p>
        </div>
      </div>
    </div>
  );
};
