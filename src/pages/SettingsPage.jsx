import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import Button from '../components/Button';
import Card from '../components/Card';
import { User, LogOut, Mail, Shield, Edit2, Save, X } from 'lucide-react';

const EMOJI_OPTIONS = ['👨‍⚕️', '👩‍⚕️', '🏥', '🩺', '🧪', '🦠', '🚑', '🧑‍🔬', '🦷', '🧠', '🫁', '🦴'];

const SettingsPage = () => {
    const { t } = useTranslation();
    const { currentUser, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
            const photoUrl = currentUser.photoURL || '';
            if (photoUrl.startsWith('emoji:')) {
                setSelectedEmoji(photoUrl.replace('emoji:', ''));
            }
        }
    }, [currentUser]);

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: selectedEmoji ? `emoji:${selectedEmoji}` : null
            });
            setMessage({ type: 'success', text: t('settings.profile_updated') });
            setIsEditing(false);
            // Force reload to reflect changes if context doesn't auto-update immediately
            window.location.reload();
        } catch (error) {
            setMessage({ type: 'error', text: t('settings.profile_failed') + ' ' + error.message });
        }
        setLoading(false);
    };

    const getProfileIcon = () => {
        if (selectedEmoji) { // Show currently selected emoji while editing or if saved
            return <span className="text-4xl">{selectedEmoji}</span>;
        }
        if (currentUser?.photoURL && !currentUser.photoURL.startsWith('emoji:')) {
            return <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full" />;
        }
        return <User size={32} />;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">{t('settings.title')}</h1>

                <Card className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 border-2 border-emerald-500/20 overflow-hidden">
                                {getProfileIcon()}
                            </div>
                            {isEditing && (
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                                    <Edit2 size={16} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            {!isEditing ? (
                                <>
                                    <h2 className="text-2xl font-bold">{currentUser?.displayName || t('settings.profile_user')}</h2>
                                    <p className="text-gray-500">{t('settings.account_type_standard')}</p>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1 mx-auto md:mx-0"
                                    >
                                        <Edit2 size={14} /> {t('settings.edit_profile')}
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-4 w-full">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.display_name')}</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            placeholder={t('settings.enter_name')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.select_avatar')}</label>
                                        <div className="flex flex-wrap gap-2">
                                            {EMOJI_OPTIONS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => setSelectedEmoji(emoji)}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${selectedEmoji === emoji ? 'bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500' : 'border border-transparent'}`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-center md:justify-start">
                                        <Button onClick={handleSave} disabled={loading} className="py-2 px-4 shadow-none">
                                            <Save size={16} /> {loading ? t('settings.saving') : t('settings.save_changes')}
                                        </Button>
                                        <Button variant="outline" onClick={() => { setIsEditing(false); setDisplayName(currentUser?.displayName || ''); }} className="py-2 px-4">
                                            <X size={16} /> {t('settings.cancel')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <Mail size={20} className="text-gray-400" />
                            <span className="font-medium">{t('settings.email_label')}</span>
                            <span>{currentUser?.email || t('settings.no_email')}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <Shield size={20} className="text-gray-400" />
                            <span className="font-medium">{t('settings.account_type_label')}</span>
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
                            {t('settings.sign_out')}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
