import { Swords, Settings, Zap } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/auth';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [error, setError] = useState('');

  
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await AuthService.login(username, password);
        onLoginSuccess();
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem.");
        }
        await AuthService.register(username, email, password);
        onLoginSuccess();
      } else if (mode === 'forgot') {
        await AuthService.requestPasswordReset(email);
        setSuccessMsg('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Nome de usuário ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado.');
      } else if (err.code === 'auth/username-already-in-use') {
        setError('Este nome de usuário já está em uso.');
      } else if (err.code === 'auth/invalid-username') {
        setError(err.message);
      } else if (err.code === 'auth/email-already-has-username') {
        setError(err.message);
      } else if (err.code === 'auth/wrong-password-for-existing') {
        setError(err.message);
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(err.message || 'Falha na autenticação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await AuthService.loginWithGoogle();
      if (user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full h-full bg-black relative overflow-hidden">
      <div className="sparks-container">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="spark" style={{
            left: `${Math.random() * 100}%`,
            top: `${50 + Math.random() * 50}%`,
            animationDuration: `${2 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 3}s`
          }} />
        ))}
      </div>
      <main className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-md md:max-w-lg bg-transparent border-x border-slate-800/40 p-6 overflow-y-auto">
        {/* LOGO */}
        <div className="mb-8 text-center shrink-0 relative z-10 w-full">
          <div className="relative w-36 h-36 mx-auto mb-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#fce803] rounded-full blur-[40px] opacity-20 animate-pulse"></div>
            <img src="/logo-rw-dark.png" alt="The Rolling Wars" className="relative z-10 w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h1 className="text-2xl font-black font-display tracking-wider uppercase mt-4">
            <span className="text-white">THE ROLLING </span>
            <span className="text-[#fce803]">WARS</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest uppercase font-mono-stat">
            Identidade de Jogador
          </p>
        </div>

        {/* FORMS */}
        <form onSubmit={handleAuth} className="w-full max-w-sm flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold text-center">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 rounded-xl bg-[#fce803]/10 border border-[#fce803]/30 text-[#fce803] text-xs font-bold text-center">
              {successMsg}
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">NOME DE USUÁRIO</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seu_apelido"
                className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#fce803]/50 transition-colors"
              />
            </div>
          )}

          {(mode === 'register' || mode === 'forgot') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">E-MAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#fce803]/50 transition-colors"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">SENHA</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#fce803]/50 transition-colors"
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">CONFIRMAR SENHA</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#fce803]/50 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-[#fce803] to-[#eab308] text-black font-black font-display uppercase tracking-widest text-sm py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(252,232,3,0.15)] disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
            ) : (
              mode === 'login' ? 'ENTRAR' :
              mode === 'register' ? 'CRIAR IDENTIDADE' :
              'ENVIAR CÓDIGO'
            )}
          </button>
        </form>

        {(mode === 'login' || mode === 'register') && (
          <div className="w-full max-w-sm mt-4">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="shrink-0 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">OU</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full mt-2 bg-white text-black font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
               <svg className="w-4 h-4" viewBox="0 0 24 24">
                 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               </svg>
              <span>Continuar com Google</span>
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          {mode !== 'login' && (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className="text-xs font-medium text-slate-400 hover:text-[#fce803] transition-colors underline underline-offset-4"
            >
              Voltar para o Login
            </button>
          )}

          {mode === 'login' && (
            <>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                className="text-[10px] font-bold text-slate-500 hover:text-[#fce803] transition-colors"
              >
                ESQUECI MINHA SENHA
              </button>

              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                className="text-xs font-medium text-slate-400 hover:text-[#fce803] transition-colors underline underline-offset-4 mt-2"
              >
                Ainda não possui uma conta? Criar nova conta
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
