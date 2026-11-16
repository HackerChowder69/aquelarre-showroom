import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En desarrollo, /api se redirige al BackEnd (Express en el puerto 4000)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": process.env.API_PROXY ?? "http://localhost:4000" },
  },
});
