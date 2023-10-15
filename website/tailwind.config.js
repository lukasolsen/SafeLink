/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Background Colors
        "dark-bg": "#272e3f", // Dark background color
        "dark-bg-secondary": "#313a4e", // Dark secondary background color
        "darker-bg": "#0C0C0C", // Darker background color

        // Surface Colors
        "dark-surface": "#1E1E1E", // Dark surface color
        "darker-surface": "#171717", // Darker surface color

        // Text Colors
        "text-primary": "#E5E5E5", // Primary text color
        "text-secondary": "#B0B0B0", // Secondary text color
        "text-accent": "#0077FF", // Accent text color

        // Sidebar Colors
        "sidebar-bg": "#0C0C0C", // Sidebar background color
        "sidebar-text": "#E5E5E5", // Sidebar text color

        // Button Colors
        "button-primary": "#0077FF", // Primary button color
        "button-secondary": "#555555", // Secondary button color

        // Call to Action Colors
        "cta-bg": "#FF6600", // Call to Action button background color
        "cta-text": "#FFFFFF", // Call to Action button text color
      },
    },
  },
  plugins: [],
};
