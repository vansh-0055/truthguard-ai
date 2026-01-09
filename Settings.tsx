import React, { useState } from 'react';
import { Moon, Bell, Shield, Globe, Lock, Save, Sun, User, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    const { theme, toggleTheme } = useTheme();
    const [autoVerify, setAutoVerify] = useState(true);
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || '');

    const handleSave = () => {
        toast.success('Settings saved successfully');
    };

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-8">Settings</h2>

            <div className="space-y-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Profile Settings */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" /> Profile Settings
                    </h3>
                    <div className="space-y-4">
                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Enter your display name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Mail className="w-4 h-4 mr-1" /> Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Account Info */}
                        <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" /> Account Type
                                </span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Free Plan</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 mr-2 text-purple-500" />
                        )}
                        Appearance
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme across the application</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={theme === 'dark'} onChange={toggleTheme} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Notifications */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-blue-500" /> Notifications
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for major fake news outbreaks</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Verification */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-500" /> Detection Preferences
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Auto-Verification</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Automatically analyze links in clipboard</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={autoVerify} onChange={() => setAutoVerify(!autoVerify)} />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={handleSave}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                >
                    <Save className="w-4 h-4 mr-2" /> Save Preferences
                </button>
            </div>
        </div>
    );
};

export default Settings;
