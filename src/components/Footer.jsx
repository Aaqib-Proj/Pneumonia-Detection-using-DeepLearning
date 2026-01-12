import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 py-8 mt-auto transition-colors">
            <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} PneumaScan. All rights reserved.</p>
                <div className="mt-2 flex justify-center gap-4 text-sm">
                    <a href="#" className="hover:text-emerald-500">Privacy Policy</a>
                    <a href="#" className="hover:text-emerald-500">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
