
import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, DesktopIcon } from './Icons';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  direction?: 'up' | 'down';
}

const themeOptions: { value: Theme; label: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: DesktopIcon },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme, direction = 'down' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const CurrentIcon = themeOptions.find(opt => opt.value === theme)?.icon || DesktopIcon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownPositionClass = direction === 'up'
    ? 'absolute right-0 bottom-full mb-2 w-36'
    : 'absolute right-0 mt-2 w-36';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-800"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="h-5 w-5" />
      </button>
      {isOpen && (
        <div className={`${dropdownPositionClass} bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20`}>
          <div className="py-1">
            {themeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm ${
                  theme === option.value
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <option.icon className="h-5 w-5" />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;