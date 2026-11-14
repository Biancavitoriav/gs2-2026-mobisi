import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/mobisi": {
        target:
          "https://mobisi-qradw6w97-vicentestramantinos-projects.vercel.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mobisi/, "/api/v1"),
      },
    },
  },
});
