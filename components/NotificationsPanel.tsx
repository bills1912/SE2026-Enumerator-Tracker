import React from 'react';
import { Notification, NotificationType } from '../types';
import { CloseIcon, BellIcon, LocationMarkerIcon, CheckCircleIcon, ExclamationTriangleIcon, ChatBubbleLeftRightIcon, InformationCircleIcon } from './Icons';
import { formatTimeAgo } from '../utils';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onClearAll: () => void;
}

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const baseClasses = "h-6 w-6";
    switch (type) {
        case NotificationType.Proximity:
            return <LocationMarkerIcon className={`${baseClasses} text-blue-500`} />;
        case NotificationType.Completion:
            return <CheckCircleIcon className={`${baseClasses} text-green-500`} />;
        case NotificationType.Issue:
            return <ExclamationTriangleIcon className={`${baseClasses} text-yellow-500`} />;
        case NotificationType.SupervisorReply:
            return <ChatBubbleLeftRightIcon className={`${baseClasses} text-purple-500`} />;
        case NotificationType.SystemUpdate:
            return <InformationCircleIcon className={`${baseClasses} text-cyan-500`} />;
        default:
            return <BellIcon className={`${baseClasses} text-gray-500`} />;
    }
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, notifications, onClearAll }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 transition-opacity animate-in fade-in" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out animate-in slide-in-from-right-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <BellIcon className="h-6 w-6 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close notifications">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {notifications.length > 0 ? (
          <div className="flex-grow overflow-y-auto">
            <ul>
              {notifications.map((notif, index) => (
                <li key={notif.id} className={`flex items-start gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
                  <div className="mt-1">
                    <NotificationIcon type={notif.type} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                    {notif.senderName && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">From: <span className="font-medium">{notif.senderName}</span></p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTimeAgo(notif.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-gray-500 dark:text-gray-400">
            <BellIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">No New Notifications</h3>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button 
              onClick={onClearAll} 
              className="w-full text-center py-2 px-4 text-sm font-medium text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsPanel;