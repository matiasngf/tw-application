import type { Config } from "tailwindcss";
import textScalePlugin from 'tailwindcss-text-scale'
import typograpyPlugin from "@tailwindcss/typography"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/three/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      'display': ["norman-variable", "serif"],
      'serif': ["quincy-cf", "sans-serif"]
    },
    colors: {
      "red": "red", // for debug
      "foreground": {
        DEFAULT: "rgb(var(--color-foreground) / <alpha-value>)",
        300: "rgb(var(--color-foreground-300) / <alpha-value>)",
        800: "rgb(var(--color-foreground-800) / <alpha-value>)",
      },
      'link': "rgb(var(--color-link) / <alpha-value>)",
      'background': "rgb(var(--color-background) / <alpha-value>)",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    textScalePlugin({}),
    typograpyPlugin()

  ],
};
export default config;
