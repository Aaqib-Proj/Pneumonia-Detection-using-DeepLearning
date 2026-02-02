import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Stethoscope, Settings, ChevronLeft, History, Bell, Search, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { currentUser, logout } = useAuth();
    const { actions } = useHeader();
    const location = useLocation();

    const publicPaths = ['/', '/about', '/promts', '/events', '/terms'];
    const shouldShowNavLinks = publicPaths.includes(location.pathname);

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.legal'), path: '/terms' },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'} no-print`}>
            <div className="container mx-auto px-4">
                <div className={`transition-all duration-300 rounded-[2rem] border border-white/10 dark:border-white/5 backdrop-blur-md ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 shadow-xl py-2 px-6' : 'bg-transparent py-2 px-4 shadow-none'}`}>
                    <div className="flex items-center justify-between">
                        {/* Logo & Context Navigation */}
                        <div className="flex items-center gap-6">
                            {(location.pathname === '/dashboard' || location.pathname === '/upload' || location.pathname === '/history') && (
                                <NavLink to="/" className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all shadow-sm">
                                    <ChevronLeft size={20} />
                                </NavLink>
                            )}
                            <NavLink to="/" className="flex items-center gap-3 group">
                                <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <Stethoscope className="text-white" size={24} />
                                </div>
                                <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600">
                                    PneumaScan
                                </span>
                            </NavLink>
                        </div>

                        {/* Desktop Architecture */}
                        <div className="hidden lg:flex items-center gap-10">
                            {shouldShowNavLinks && (
                                <div className="flex items-center gap-8">
                                    {navLinks.map((link) => (
                                        <NavLink
                                            key={link.name}
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-500 ${isActive ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-4 border-l border-slate-200 dark:border-white/10 pl-10">
                                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-white/5">
                                    <ThemeToggle />
                                </div>

                                {/* Dynamic Page Actions */}
                                {actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        size="sm"
                                        onClick={action.onClick}
                                        className="hidden md:flex items-center gap-2 rounded-xl h-11 px-6 shadow-xl shadow-emerald-500/10"
                                    >
                                        {action.icon && <action.icon size={18} />}
                                        <span className="text-xs font-black uppercase tracking-wider">{action.label}</span>
                                    </Button>
                                ))}

                                {!currentUser ? (
                                    <NavLink to="/signup">
                                        <Button className="rounded-xl h-11 px-8 shadow-xl shadow-emerald-500/20">{t('nav.signup')}</Button>
                                    </NavLink>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <NavLink to="/history">
                                            <button className={`p-3 rounded-2xl transition-all ${location.pathname === '/history' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-emerald-500'}`} title="Archives">
                                                <History size={20} />
                                            </button>
                                        </NavLink>
                                        <NavLink to="/settings">
                                            <button className={`p-3 rounded-2xl transition-all ${location.pathname === '/settings' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-emerald-500'}`} title="Settings">
                                                <Settings size={20} />
                                            </button>
                                        </NavLink>

                                    </div>
                                )}

                                <LanguageSelector />
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <button className="lg:hidden p-3 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl shadow-sm" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Slide-out */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="lg:hidden mt-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-3xl overflow-hidden"
                        >
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <NavLink key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 p-2 border-b border-slate-50 dark:border-white/5">
                                        {link.name}
                                    </NavLink>
                                ))}
                                <div className="flex flex-col gap-4 mt-4">
                                    <NavLink to="/history" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-sm font-black p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-700 dark:text-slate-300">
                                        <History size={20} /> {t('nav.archives')}
                                    </NavLink>
                                    <NavLink to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-sm font-black p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-700 dark:text-slate-300">
                                        <Settings size={20} /> {t('nav.sys_config')}
                                    </NavLink>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <ThemeToggle />
                                            <LanguageSelector />
                                        </div>
                                        {currentUser ? (
                                            <Button onClick={logout} variant="outline" className="px-8 rounded-xl h-12">{t('nav.logout')}</Button>
                                        ) : (
                                            <NavLink to="/signup" onClick={() => setIsOpen(false)}><Button className="px-10 rounded-xl h-12">{t('nav.signup')}</Button></NavLink>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
