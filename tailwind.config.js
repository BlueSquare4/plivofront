// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",       // if you’re using the /app router
      "./pages/**/*.{js,ts,jsx,tsx}",     // if you also have a /pages directory
      "./components/**/*.{js,ts,jsx,tsx}",// wherever your components live
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  