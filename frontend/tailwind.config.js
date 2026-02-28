import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0F172A',
                gray: {
                    ...colors.slate,
                    900: '#1E293B',
                    950: '#0F172A',
                },
                cyan: {
                    ...colors.orange,
                    300: '#FDBA74',
                    400: '#F97316',
                    500: '#EA580C',
                    600: '#C2410C',
                    900: '#431407',
                    950: '#2A0B05'
                },
                blue: {
                    ...colors.sky,
                    400: '#38BDF8',
                    500: '#0EA5E9',
                    600: '#0284C7',
                    900: '#0C4A6E',
                },
                purple: {
                    ...colors.sky,
                    400: '#38BDF8',
                    500: '#0EA5E9',
                    900: '#0C4A6E',
                    950: '#072F4A',
                },
                white: '#E2E8F0',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'gradient-x': 'gradient-x 15s ease infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 15s linear infinite',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
            }
        },
    },
    plugins: [],
}
