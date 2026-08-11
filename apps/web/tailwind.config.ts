import type { Config } from "tailwindcss";
import preset from "@coffee-daily/config/tailwind";

const config: Config = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
};

export default config;
