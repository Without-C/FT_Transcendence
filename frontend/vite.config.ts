import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["frontend", "localhost"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})