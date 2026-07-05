import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // In local dev, the client calls /api/... and Vite forwards it to the Express server.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
