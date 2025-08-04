import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",   // Escucha en todas las interfaces de red
    port: 5173,        // Puerto fijo
    strictPort: true,  // No cambia el puerto si está ocupado
  },
});
