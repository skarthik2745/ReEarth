/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'retro-red': '#ff004d',
        'retro-cyan': '#00eaff',
        'retro-green': '#00ff00',
        'retro-yellow': '#ffcc00',
        'retro-magenta': '#ff00aa',
        'retro-black': '#000000',
        'retro-white': '#ffffff',
        'retro-gray': '#222222',
      },
      fontFamily: {
        'pixel': ['Press Start 2P', 'monospace'],
      },
    },
  },
  plugins: [],
};
