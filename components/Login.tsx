import React, { useState, useEffect } from 'react';
// FIX: Import logos from constants
import { BPS_LOGO_BASE64, SE2026_LOGO_BASE64 } from '../constants';
import { EyeIcon, EyeSlashIcon, RefreshIcon, CheckCircleIcon } from './Icons';
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
    if (savedEmail) {
      setEmail(savedEmail);
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
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    } else {
      setError('Email atau kata sandi tidak valid. Silakan coba lagi.');
      refreshCaptcha();
      setCaptchaInput('');
    }
  };

  return (
    // FIX: Changed background gradient to orange theme
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
        <div className="absolute top-4 right-4 z-10">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>

        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Panel */}
            <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center bg-left-bottom bg-no-repeat">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
                        Sistem Tracking Monitoring <br />
                        {/* FIX: Changed text color to orange theme */}
                        <span className="text-orange-600 dark:text-orange-400">Pendataan SE2026</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        platform mutakhir dengan fitur tracking dan monitoring pendataan untuk menjaga kualitas data yang dihasilkan di lapangan dalam kegiatan SE2026.
                    </p>
                    <ul className="mt-8 space-y-4">
                        <li className="flex items-start">
                            {/* FIX: Changed icon color to orange theme */}
                            <CheckCircleIcon className="h-6 w-6 text-orange-500 flex-shrink-0 mr-3 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Real-Time Tracking</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time memonitor proses pendataan dan progress pendataan.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            {/* FIX: Changed icon color to orange theme */}
                            <CheckCircleIcon className="h-6 w-6 text-orange-500 flex-shrink-0 mr-3 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Dashboard yang Komprehensif</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Monitoring yang lebih terasa profesional, dilengkapi dengan grafik pemantauan hasil pendataan yang membantu dalam monitoring progres di lapangan.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            {/* FIX: Changed icon color to orange theme */}
                            <CheckCircleIcon className="h-6 w-6 text-orange-500 flex-shrink-0 mr-3 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Layanan Chat dengan AI atau Supervisor</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Chat secara langsung dengan AI assistant atau dengan supervisor kegiatan.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full md:w-2/5 bg-white dark:bg-gray-900/50 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <div className="text-center">
                        {/* FIX: Replaced ShieldLogoIcon with BPS and SE2026 logos */}
                        <div className="flex justify-center items-center gap-4">
                            <img src={BPS_LOGO_BASE64} alt="BPS Logo" className="h-16" />
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
                            // FIX: Changed focus ring color to orange theme
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                                    // FIX: Changed focus ring color to orange theme
                                    className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                                    className="flex-shrink-0 p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                                // FIX: Changed focus ring color to orange theme
                                className="mt-2 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                                    // FIX: Changed checkbox color to orange theme
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" 
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Ingat saya</label>
                            </div>
                            <div className="text-sm">
                                {/* FIX: Changed link color to orange theme */}
                                <button type="button" onClick={onForgotPasswordClick} className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300">
                                    Lupa password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            // FIX: Changed button color to orange theme
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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