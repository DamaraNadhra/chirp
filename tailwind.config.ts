import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        segoe: ['"Segoe UI"', 'sans-serif'],
        royal: ['WL Royal Flutter', 'serif'],
      },
      colors: {
        customGray: "#70767b", // Add your custom color
        twitterBlue: '#1DA1F2',
      },
    },
  },
  plugins: [],
} satisfies Config;
