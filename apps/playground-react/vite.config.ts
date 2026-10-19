import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    proxy: {
      "/__noted": {
        target: "http://127.0.0.1:3737",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/__noted/, ""),
      },
    },
  },
});
