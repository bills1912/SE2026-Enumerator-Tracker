
import React, { useState } from 'react';
import { ShieldLogoIcon } from './Icons';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 p-4 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl space-y-8">
        <div className="text-center">
          <ShieldLogoIcon className="h-16 w-16 mx-auto text-blue-800 dark:text-blue-500" />
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
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alamat Email"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kirim Tautan Reset
              </button>
            </div>
          </form>
        ) : null}

        <div className="text-center">
          <button
            onClick={onBackToLogin}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            &larr; Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
