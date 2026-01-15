import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Stethoscope, Settings, ChevronLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Button from './Button';

import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const { actions } = useHeader();
    const location = useLocation();

    // Define pages where nav links should be visible
    const publicPaths = ['/', '/about', '/promts', '/events'];
    const shouldShowNavLinks = publicPaths.includes(location.pathname);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Terms', path: '/terms' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo & Back Button */}
                <div className="flex items-center gap-4">
                    {location.pathname === '/dashboard' && (
                        <NavLink to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                            <ChevronLeft size={24} />
                        </NavLink>
                    )}
                    <NavLink to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                            <Stethoscope className="text-emerald-500" size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500">
                            PneumaScan
                        </span>
                    </NavLink>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {shouldShowNavLinks && (
                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors hover:text-emerald-500 ${isActive ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {/* Dynamic Header Actions */}
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                onClick={action.onClick}
                                className="hidden md:flex items-center gap-2"
                            >
                                {action.icon && <action.icon size={18} />}
                                {action.label}
                            </Button>
                        ))}

                        {!currentUser ? (
                            <NavLink to="/signup">
                                <Button>Sign Up</Button>
                            </NavLink>
                        ) : (
                            <NavLink to="/settings">
                                <Button variant="ghost" size="icon" title="Settings">
                                    <Settings size={20} />
                                </Button>
                            </NavLink>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-500 dark:text-gray-300"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-panel border-t border-white/10 p-4 absolute w-full left-0">
                    <div className="flex flex-col gap-4">
                        {shouldShowNavLinks && navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-500 dark:text-gray-300 hover:text-emerald-500 p-2"
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <ThemeToggle />
                            {!currentUser ? (
                                <NavLink to="/signup" onClick={() => setIsOpen(false)}>
                                    <Button>Sign Up</Button>
                                </NavLink>
                            ) : (
                                <div className="flex flex-col gap-2 w-full">
                                    {/* Mobile Actions */}
                                    {actions.map((action, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => { action.onClick(); setIsOpen(false); }}
                                        >
                                            {action.icon && <action.icon size={18} className="mr-2" />}
                                            {action.label}
                                        </Button>
                                    ))}
                                    <NavLink to="/settings" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center gap-2">
                                            <Settings size={18} /> Settings
                                        </Button>
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
