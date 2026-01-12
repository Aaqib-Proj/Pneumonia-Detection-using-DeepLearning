/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Integrating our custom CSS variable approach with Tailwind if needed, 
                // or just letting Tailwind use its defaults which we used in classes.
                // We used standard tailwind colors like 'emerald-500', 'slate-900' etc.
                // which are included by default.
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
    darkMode: 'class', // Enable class-based dark mode since we use 'dark' class in ThemeContext
}
