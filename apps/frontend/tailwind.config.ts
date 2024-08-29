import type { Config } from "tailwindcss";

const config: Config = {
  // darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./custom-ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./custom-loaders/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        mobile: "900px",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
      width: {
        sidebar: "72px",

        "3-4": "368px",
      },
      fontSize: {
        mini: "0.5rem",
      },
    },
  },

  plugins: [],
};
export default config;
