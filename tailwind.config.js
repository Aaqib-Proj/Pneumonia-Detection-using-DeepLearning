/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Dark Mode Overrides (Deep Slate)
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b', // Keeping 800 roughly same or slightly darker? Let's bump it down.
                    // Shifted Scale for true dark mode:
                    800: '#0f172a', // Was 900
                    900: '#020617', // Was 950 (Deepest)
                    950: '#000000', // True Black
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
    darkMode: 'class', // Enable class-based dark mode since we use 'dark' class in ThemeContext
}
