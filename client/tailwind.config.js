/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5', // Indigo 600 - Professional and clean
                secondary: '#14b8a6', // Teal 500 - Fresh accent
                background: '#f8fafc', // Slate 50 - Lighter, cooler background
                surface: '#ffffff',
            }
        },
    },
    plugins: [],
}
