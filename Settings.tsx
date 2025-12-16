import React, { useState } from 'react';
import { Moon, Bell, Shield, Globe, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoVerify, setAutoVerify] = useState(true);

    const handleSave = () => {
        toast.success('Settings saved successfully');
    };

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Settings</h2>

            <div className="space-y-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Appearance */}
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Moon className="w-5 h-5 mr-2 text-purple-500" /> Appearance
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Dark Mode</p>
                            <p className="text-sm text-gray-500">Use dark theme across the application</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Notifications */}
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-blue-500" /> Notifications
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Email Alerts</p>
                            <p className="text-sm text-gray-500">Receive alerts for major fake news outbreaks</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Verification */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-500" /> Detection Preferences
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Auto-Verification</p>
                            <p className="text-sm text-gray-500">Automatically analyze links in clipboard</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={autoVerify} onChange={() => setAutoVerify(!autoVerify)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
