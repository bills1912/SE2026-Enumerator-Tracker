import React, { useState, useEffect } from 'react';
import { ShieldLogoIcon, EyeIcon, EyeSlashIcon, RefreshIcon, CheckCircleIcon } from './Icons';
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

const PartnerLogos = () => (
    <div className="mt-12">
        <p className="text-sm font-semibold text-center text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lembaga Partner</p>
        <div className="flex justify-center items-center gap-4 md:gap-6 mt-4 flex-wrap">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Lambang_Komisi_Aparatur_Sipil_Negara.png/240px-Lambang_Komisi_Aparatur_Sipil_Negara.png" alt="KASN Logo" className="h-12" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Logo_LAN_RI.png" alt="LAN RI Logo" className="h-12" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/LOGO_BPS_2021.svg/240px-LOGO_BPS_2021.svg.png" alt="BPS Logo" className="h-10" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Logo_Kementerian_Pendayagunaan_Aparatur_Negara_dan_Reformasi_Birokrasi_RI.png" alt="PANRB Logo" className="h-12" />
            <img src="https://upload.wikimedia.org/wikipedia/id/thumb/d/d4/Badan_Kepegawaian_Negara.png/240px-Badan_Kepegawaian_Negara.png" alt="BKN Logo" className="h-12" />
        </div>
    </div>
);


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

    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
        <div className="absolute top-4 right-4 z-10">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>

        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Panel */}
            <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center bg-left-bottom bg-no-repeat">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
                        Sistem AI untuk <br />
                        <span className="text-blue-600 dark:text-blue-400">Manajemen ASN</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Platform terintegrasi untuk analisis talenta dan penilaian kinerja ASN berbasis Artificial Intelligence.
                    </p>
                    <ul className="mt-8 space-y-4">
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Analisis Talenta Komprehensif</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pemetaan kompetensi dan potensi ASN menggunakan AI.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Penilaian Kinerja Real-time</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Evaluasi kinerja berbasis data dan rekomendasi AI.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Dashboard Analytics</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Visualisasi data dan insights untuk pengambilan keputusan.</p>
                            </div>
                        </li>
                    </ul>
                    <PartnerLogos />
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full md:w-2/5 bg-white dark:bg-gray-900/50 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <div className="text-center">
                        <ShieldLogoIcon className="h-16 w-16 mx-auto" />
                        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Selamat Datang</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Login ke sistem ASN Talent AI</p>
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
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                    className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-2 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Ingat saya</label>
                            </div>
                            <div className="text-sm">
                                <button type="button" onClick={onForgotPasswordClick} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                    Lupa password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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