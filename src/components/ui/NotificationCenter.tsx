import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, Package, MessageCircle, Clock, MapPinCheck, Navigation, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useAuthStore } from '../../stores/useAuthStore';
import type { Notification } from '../../types';

const notificationIcons: Record<Notification['type'], React.ReactNode> = {
  order_accepted: <CheckCircle className="w-5 h-5 text-green-600" />,
  order_status_changed: <Clock className="w-5 h-5 text-blue-600" />,
  new_message: <MessageCircle className="w-5 h-5 text-purple-600" />,
  order_completed: <Package className="w-5 h-5 text-green-600" />,
  order_cancelled: <X className="w-5 h-5 text-red-600" />,
  fixer_arrived: <MapPinCheck className="w-5 h-5 text-blue-600" />,
  fixer_en_route: <Navigation className="w-5 h-5 text-blue-600" />,
};

export const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    getNotificationsByUserId,
    getUnreadCount,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const notifications = getNotificationsByUserId(user.id);
  const unreadCount = getUnreadCount(user.id);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.orderId) {
      navigate(`/orders/${notification.orderId}`);
    }
    setIsOpen(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Benachrichtigungen</h3>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead(user.id)}
                className="text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Alle gelesen
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-500 text-center">
                  Keine Benachrichtigungen
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                      !notification.read ? 'bg-primary-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.read ? 'bg-primary-100' : 'bg-slate-100'
                      }`}>
                        {notificationIcons[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`font-medium text-sm ${
                            !notification.read ? 'text-slate-900' : 'text-slate-700'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
