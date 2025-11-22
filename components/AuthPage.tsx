
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
      setPassword('password123'); 
      actions.handleLogin(demoEmail, 'password123'); // Auto-submit for better UX
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 animate-fadeIn">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
            <Logo />
        </div>
        
        <div className="bg-surface p-8 rounded-xl shadow-2xl border border-border">
          <h2 className="text-2xl font-bold text-center text-text-primary mb-2">
            {mode === 'login' ? t('auth.loginToAccount') : t('auth.createAnAccount')}
          </h2>

          {mode === 'login' && (
              <div className="mb-8">
                  <p className="text-xs text-text-secondary mb-4 text-center uppercase font-bold tracking-wider opacity-70">{t('auth.fastLogin')}</p>
                  <div className="grid grid-cols-2 gap-4">
                      {/* Admin */}
                      <button 
                        type="button"
                        onClick={() => fillCredentials('edwin.alba@ceitel.com')}
                        className="relative flex flex-col items-start p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all group text-left"
                      >
                          <div className="flex items-center gap-2 mb-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
                             <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Admin</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary group-hover:text-white transition-colors">Edwin Alba</span>
                          <span className="text-[10px] text-text-secondary mt-1 leading-tight">Gerente Operativo</span>
                      </button>

                      {/* Manager (Tú) */}
                      <button 
                        type="button"
                        onClick={() => fillCredentials('diego.cardona@ceitel.com')}
                        className="relative flex flex-col items-start p-4 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all group text-left"
                      >
                           <div className="flex items-center gap-2 mb-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></span>
                             <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">Manager</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary group-hover:text-white transition-colors">Diego Cardona</span>
                          <span className="text-[10px] text-text-secondary mt-1 leading-tight">Coord. BTS y TX</span>
                      </button>

                      {/* Member */}
                      <button 
                        type="button"
                        onClick={() => fillCredentials('tecnico@ceitel.com')}
                        className="relative flex flex-col items-start p-4 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all group text-left"
                      >
                           <div className="flex items-center gap-2 mb-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                             <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Member</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary group-hover:text-white transition-colors">Técnico Campo</span>
                          <span className="text-[10px] text-text-secondary mt-1 leading-tight">Líder de Cuadrilla</span>
                      </button>

                       {/* Viewer */}
                       <button 
                        type="button"
                        onClick={() => fillCredentials('auditor@claro.com.co')}
                        className="relative flex flex-col items-start p-4 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/40 rounded-xl transition-all group text-left"
                      >
                           <div className="flex items-center gap-2 mb-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50"></span>
                             <span className="text-xs font-bold text-yellow-400 uppercase tracking-wide">Viewer</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary group-hover:text-white transition-colors">Auditor Claro</span>
                          <span className="text-[10px] text-text-secondary mt-1 leading-tight">Acceso Externo</span>
                      </button>
                  </div>
                  <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-surface text-text-secondary">Or login with email</span>
                      </div>
                  </div>
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">{t('auth.fullName')}</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-secondary rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">{t('auth.email')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2.5 bg-secondary rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="password"className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">{t('auth.password')}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2.5 bg-secondary rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-focus transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/40"
            >
              {mode === 'login' ? t('auth.login') : t('auth.signup')}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-text-secondary">
              {mode === 'login' ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}{' '}
              <button onClick={toggleMode} className="font-bold text-primary hover:underline">
                {mode === 'login' ? t('auth.signup') : t('auth.login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
