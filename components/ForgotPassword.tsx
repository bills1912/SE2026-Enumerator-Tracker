import React, { useState } from 'react';
// FIX: Corrected typos from BPS_LOGO_BASE_64 and SE2026_LOGO_BASE_64 to BPS_LOGO_BASE64 and SE2026_LOGO_BASE64
import { BPS_LOGO_BASE64, SE2026_LOGO_BASE64 } from '../constants';
import ThemeSwitcher from './ThemeSwitcher';

type Theme = 'light' | 'dark' | 'system';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, theme, setTheme }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset request for:', email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-gray-900 p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6 z-20">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl space-y-8 z-10 border border-white/20">
        <div className="text-center">
          <div className="flex justify-center items-center gap-4">
              {/* FIX: Corrected typo from BPS_LOGO_BASE_64 to BPS_LOGO_BASE64 */}
              <img src={BPS_LOGO_BASE64} alt="BPS Logo" className="h-12" />
              {/* FIX: Corrected typo from SE2026_LOGO_BASE_64 to SE2026_LOGO_BASE64 */}
              <img src={SE2026_LOGO_BASE64} alt="SE2026 Logo" className="h-12" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {submitted ? 'Periksa Email Anda' : 'Lupa Password?'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {submitted
              ? `Kami telah mengirimkan tautan untuk mereset password ke ${email}`
              : 'Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan instruksi reset.'}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email-address" className="sr-only">Alamat Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-900 focus:ring-orange-500"
                placeholder="Alamat Email"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105"
              >
                Kirim Tautan Reset
              </button>
            </div>
          </form>
        ) : null}

        <div className="text-center">
          <button
            onClick={onBackToLogin}
            className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 text-sm transition-colors"
          >
            &larr; Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
