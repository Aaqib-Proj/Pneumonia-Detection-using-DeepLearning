import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { User, LogOut, Mail, Shield } from 'lucide-react';

const SettingsPage = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                <Card className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">User Profile</h2>
                            <p className="text-gray-500">Manage your account settings</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <Mail size={20} className="text-gray-400" />
                            <span className="font-medium">Email:</span>
                            <span>{currentUser?.email || 'No email detected'}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <Shield size={20} className="text-gray-400" />
                            <span className="font-medium">Account Type:</span>
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-full">
                                Standard User
                            </span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="outline"
                            className="w-full justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border-red-200 dark:border-red-900/30"
                            onClick={logout}
                        >
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
