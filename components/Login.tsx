import React, { useState, useEffect } from 'react';
// FIX: Import logos from constants
// FIX: Corrected typo from SE2026_LOGO_BASE_64 to SE2026_LOGO_BASE64
import { BPS_LOGO_BASE64, SE2026_LOGO_BASE64 } from '../constants';
import { EyeIcon, EyeSlashIcon, RefreshIcon, ShieldLogoIcon } from './Icons';
import ThemeSwitcher from './ThemeSwitcher';

type Theme = 'light' | 'dark' | 'system';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
  onForgotPasswordClick: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const generateCaptcha = () => {
    const chars = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPasswordClick, theme, setTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    } else {
      // Pre-fill with supervisor email for demo
      setEmail('anya.sharma@supervisor.com');
    }
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (captchaInput !== captcha) {
        setError('CAPTCHA tidak cocok. Silakan coba lagi.');
        refreshCaptcha();
        setCaptchaInput('');
        return;
    }
    
    const success = onLogin(email, password);

    if (success) {
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }
    } else {
      setError('Email atau kata sandi tidak valid. Silakan coba lagi.');
      refreshCaptcha();
      setCaptchaInput('');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="absolute top-4 right-4 z-10">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>

        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Panel */}
            <div 
              className="w-full md:w-3/5 flex flex-col justify-center items-center relative overflow-hidden bg-white dark:bg-gray-800/50 p-8 text-center"
            >
              {/*
                The 3D spline viewer has been temporarily disabled due to a persistent compilation error.
                To re-enable it, first add the following type definition to 'types.ts':
                
                import React from 'react'; // Add this import at the top of types.ts
                declare global {
                  namespace JSX {
                    interface IntrinsicElements {
                      'spline-viewer': any; // Or a more specific type
                    }
                  }
                }

                Then, uncomment the line below.
              */}
              {/* <spline-viewer url="https://prod.spline.design/V0x9uCo7n0NAb43P/scene.splinecode"></spline-viewer> */}

              {/* Placeholder content */}
              <ShieldLogoIcon className="h-48 w-48 text-orange-500" />
              <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">SE2026 Field Data Monitor</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Real-time tracking and survey management.</p>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full md:w-2/5 bg-white dark:bg-gray-900 flex items-center justify-center p-8 shadow-2xl md:shadow-none">
                <div className="w-full max-w-sm">
                    <div className="text-center">
                        <div className="flex justify-center items-center gap-4">
                            <img src={BPS_LOGO_BASE64} alt="BPS Logo" className="h-16" />
                            {/* FIX: Corrected typo from SE2026_LOGO_BASE_64 to SE2026_LOGO_BASE64 */}
                            <img src={SE2026_LOGO_BASE64} alt="SE2026 Logo" className="h-16" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Selamat Datang</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Login ke sistem Tracking Pendataan SE2026</p>
                    </div>
                
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email/Username</label>
                            <input
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 dark:focus:ring-offset-gray-900"
                            />
                        </div>
                    
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={passwordVisible ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 dark:focus:ring-offset-gray-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    aria-label={passwordVisible ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                {passwordVisible ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="captchaInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Captcha</label>
                            <div className="mt-1 flex items-center gap-3">
                                <div className="flex-grow bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center shadow-sm">
                                    <span className="text-xl font-bold tracking-[.2em] text-gray-800 dark:text-gray-200 select-none" style={{ fontFamily: 'monospace', textDecoration: 'line-through', fontStyle: 'italic' }}>
                                        {captcha}
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={refreshCaptcha} 
                                    className="flex-shrink-0 p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Refresh CAPTCHA"
                                >
                                    <RefreshIcon className="h-5 w-5"/>
                                </button>
                            </div>
                            <input
                                id="captchaInput"
                                name="captcha"
                                type="text"
                                required
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                placeholder="Masukkan captcha"
                                className="mt-2 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 dark:focus:ring-offset-gray-900"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input 
                                    id="remember-me" 
                                    name="remember-me" 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" 
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Ingat saya</label>
                            </div>
                            <div className="text-sm">
                                <button type="button" onClick={onForgotPasswordClick} className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 transition-colors">
                                    Lupa password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Login
                        </button>
                    </form>
                    <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Mode Demo:<br/>
                      Supervisor: <span className="font-medium">anya.sharma@supervisor.com</span><br/>
                      Enumerator: <span className="font-medium">john.doe@enumerator.com</span><br/>
                      Password: <span className="font-medium">password123</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;