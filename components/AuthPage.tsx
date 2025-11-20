
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useTranslation } from '../i18n';
import Logo from './Logo';

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const { actions } = useAppContext();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      actions.handleLogin(email, password);
    } else {
      actions.handleSignup(name, email, password);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setName('');
  };

  const fillCredentials = (demoEmail: string) => {
      setEmail(demoEmail);
      setPassword('password123'); // Dummy password to satisfy required field
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 animate-fadeIn">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-8">
            <Logo />
        </div>
        
        <div className="bg-surface p-8 rounded-xl shadow-2xl border border-border">
          <h2 className="text-2xl font-bold text-center text-text-primary mb-2">
            {mode === 'login' ? t('auth.loginToAccount') : t('auth.createAnAccount')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="text-sm font-medium text-text-secondary block mb-1">{t('auth.fullName')}</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 bg-secondary rounded-md border border-border focus:ring-primary focus:border-primary"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-text-secondary block mb-1">{t('auth.email')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 bg-secondary rounded-md border border-border focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="password"className="text-sm font-medium text-text-secondary block mb-1">{t('auth.password')}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 bg-secondary rounded-md border border-border focus:ring-primary focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors duration-200"
            >
              {mode === 'login' ? t('auth.login') : t('auth.signup')}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-text-secondary">
              {mode === 'login' ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}{' '}
              <button onClick={toggleMode} className="font-semibold text-primary hover:underline">
                {mode === 'login' ? t('auth.signup') : t('auth.login')}
              </button>
            </p>
          </div>
          
          {mode === 'login' && (
              <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-text-secondary mb-3 text-center uppercase font-bold tracking-wider">{t('auth.fastLogin')}</p>
                  <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => fillCredentials('alex@example.com')}
                        className="flex flex-col items-center justify-center p-3 bg-secondary hover:bg-secondary-focus border border-border rounded-lg transition-all hover:border-primary/50 group"
                      >
                          <div className="flex items-center gap-2 mb-1">
                             <span className="w-2 h-2 rounded-full bg-red-500"></span>
                             <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">App Admin</span>
                          </div>
                          <span className="text-[10px] text-text-secondary">Alex Morgan</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => fillCredentials('sarah@example.com')}
                        className="flex flex-col items-center justify-center p-3 bg-secondary hover:bg-secondary-focus border border-border rounded-lg transition-all hover:border-primary/50 group"
                      >
                           <div className="flex items-center gap-2 mb-1">
                             <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                             <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">Manager</span>
                          </div>
                          <span className="text-[10px] text-text-secondary">Sarah Jenkins</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => fillCredentials('mike@example.com')}
                        className="flex flex-col items-center justify-center p-3 bg-secondary hover:bg-secondary-focus border border-border rounded-lg transition-all hover:border-primary/50 group"
                      >
                           <div className="flex items-center gap-2 mb-1">
                             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                             <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">Member</span>
                          </div>
                          <span className="text-[10px] text-text-secondary">Mike Ross</span>
                      </button>
                       <button 
                        type="button"
                        onClick={() => fillCredentials('emily@example.com')}
                        className="flex flex-col items-center justify-center p-3 bg-secondary hover:bg-secondary-focus border border-border rounded-lg transition-all hover:border-primary/50 group"
                      >
                           <div className="flex items-center gap-2 mb-1">
                             <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                             <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">Viewer</span>
                          </div>
                          <span className="text-[10px] text-text-secondary">Emily Blunt</span>
                      </button>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
