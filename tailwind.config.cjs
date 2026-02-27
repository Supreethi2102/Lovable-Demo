/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    // Disable Preflight (CSS reset) so existing custom CSS is not affected
    preflight: false,
  },
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      // lg (1024px) and above = desktop — DO NOT USE, desktop is locked
    },
    extend: {},
  },
  plugins: [],
};
