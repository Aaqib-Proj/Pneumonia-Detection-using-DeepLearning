import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

const SignupPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError(t('auth.password_mismatch'));
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password);
            // Mock flow or generic flow
            navigate('/upload');
        } catch (err) {
            setError(t('auth.signup_failed') + ' ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-md">
                <Card>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">{t('auth.signup_title')}</h2>
                        <p className="text-gray-500 text-sm">{t('auth.signup_subtitle')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">{t('auth.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                    placeholder="doctor@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">{t('auth.confirm_password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button disabled={loading} className="w-full mt-6">
                            {loading ? t('auth.creating_account') : t('auth.signup')}
                        </Button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">{t('auth.or')}</span>
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        </div>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    await googleSignIn();
                                    navigate('/upload');
                                } catch (err) {
                                    setError('Failed to sign in with Google: ' + err.message);
                                }
                                setLoading(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            {t('auth.google_signup')}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {t('auth.have_account')} <Link to="/login" className="text-emerald-500 hover:underline">{t('auth.login')}</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SignupPage;
