import React from 'react';
import { User, UserRole } from '../types';
import ThemeSwitcher from './ThemeSwitcher';
import { 
    ShieldLogoIcon, 
    ChartBarIcon, 
    MapIcon, 
    UsersIcon, 
    ChatBubbleLeftRightIcon, 
    ArrowLeftOnRectangleIcon, 
    ChevronLeftIcon,
    CloseIcon
} from './Icons';

type Theme = 'light' | 'dark' | 'system';
type SupervisorView = 'dashboard' | 'map' | 'management' | 'chat';
type EnumeratorView = 'tasks' | 'map';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  setSupervisorView: (view: SupervisorView) => void;
  setEnumeratorView: (view: EnumeratorView) => void;
  activeSupervisorView: SupervisorView;
  activeEnumeratorView: EnumeratorView;
  isMobileOpen: boolean;
  setMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    user, 
    onLogout, 
    theme, 
    setTheme, 
    isCollapsed, 
    setIsCollapsed,
    setSupervisorView,
    setEnumeratorView,
    activeSupervisorView,
    activeEnumeratorView,
    isMobileOpen,
    setMobileOpen
}) => {
    
    const supervisorNavItems = [
        { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon, action: () => { setSupervisorView('dashboard'); setMobileOpen(false); } },
        { key: 'map', label: 'Peta Tracking', icon: MapIcon, action: () => { setSupervisorView('map'); setMobileOpen(false); } },
        { key: 'management', label: 'Manajemen', icon: UsersIcon, action: () => { setSupervisorView('management'); setMobileOpen(false); } },
        { key: 'chat', label: 'Obrolan', icon: ChatBubbleLeftRightIcon, action: () => { setSupervisorView('chat'); setMobileOpen(false); } },
    ];

    const enumeratorNavItems = [
        { key: 'tasks', label: 'Tugas Saya', icon: UsersIcon, action: () => { setEnumeratorView('tasks'); setMobileOpen(false); } },
        { key: 'map', label: 'Peta', icon: MapIcon, action: () => { setEnumeratorView('map'); setMobileOpen(false); } },
    ];

    const navItems = user.role === UserRole.Supervisor ? supervisorNavItems : enumeratorNavItems;

    return (
        <aside className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 flex flex-col z-50 transition-transform duration-300 md:transition-all border-r border-gray-200 dark:border-gray-700
            ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
            md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        `}>
            {/* Logo and Collapse Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                {(!isCollapsed || isMobileOpen) && (
                     <div className="flex items-center gap-2">
                        {/* FIX: Changed icon color to orange theme */}
                        <ShieldLogoIcon className="h-8 w-8 text-orange-600"/>
                        <span className="font-bold text-lg">SE2026</span>
                    </div>
                )}
                 {/* Show icon if collapsed and on desktop */}
                {isCollapsed && !isMobileOpen && (
                    <div className="flex items-center justify-center w-full">
                        {/* FIX: Changed icon color to orange theme */}
                        <ShieldLogoIcon className="h-8 w-8 text-orange-600"/>
                    </div>
                )}
                {/* Desktop collapse button */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    className={`p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform duration-300 ${isCollapsed ? 'mx-auto' : ''} ${!isCollapsed ? 'transform rotate-180' : ''} hidden md:block`}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <ChevronLeftIcon className="h-5 w-5"/>
                </button>
                 {/* Mobile close button */}
                <button 
                    onClick={() => setMobileOpen(false)} 
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                    aria-label="Close sidebar"
                >
                    <CloseIcon className="h-6 w-6"/>
                </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-grow px-2 py-4">
                <ul className="space-y-2">
                    {navItems.map(item => {
                        const isActive = user.role === UserRole.Supervisor
                            ? item.key === activeSupervisorView
                            : item.key === activeEnumeratorView;
                        return (
                            <li key={item.key}>
                                <button
                                    onClick={item.action}
                                    className={`w-full flex items-center p-2 text-base rounded-lg group transition-colors duration-200
                                        ${isActive
                                            ? 'bg-orange-100 dark:bg-orange-900/50 text-gray-900 dark:text-white font-semibold'
                                            : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`
                                    }
                                >
                                    <item.icon className={`h-6 w-6 transition-colors duration-200 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'} ${isCollapsed && !isMobileOpen ? 'mx-auto' : ''}`} />
                                    {(!isCollapsed || isMobileOpen) && <span className="ml-3 flex-1 whitespace-nowrap text-left">{item.label}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile and Actions */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <div className={`p-2 rounded-lg ${(!isCollapsed || isMobileOpen) ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
                    <div className="flex items-center justify-between">
                         <div className={`flex items-center ${isCollapsed && !isMobileOpen ? 'w-full justify-center' : ''}`}>
                            {/* FIX: Changed user avatar color to orange theme */}
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-lg">
                                {user.name.charAt(0)}
                            </div>
                            {(!isCollapsed || isMobileOpen) && (
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
                                </div>
                            )}
                        </div>
                        {(!isCollapsed || isMobileOpen) && <ThemeSwitcher theme={theme} setTheme={setTheme} direction="up" />}
                    </div>
                </div>

                <button onClick={onLogout} className="w-full flex items-center p-2 mt-2 text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <ArrowLeftOnRectangleIcon className={`h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200 ${isCollapsed && !isMobileOpen ? 'mx-auto' : ''}`} />
                    {(!isCollapsed || isMobileOpen) && <span className="ml-3 flex-1 whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;