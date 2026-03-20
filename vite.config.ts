import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import type { Plugin } from "vite";

const figmaAssetsPlugin: Plugin = {
  name: "figma-assets",
  resolveId(id) {
    if (id.startsWith("figma:asset/")) return "\0" + id;
  },
  load(id) {
    if (id.startsWith("\0figma:asset/")) {
      return `export default "https://placehold.co/42x42/e2e8f0/94a3b8?text=img"`;
    }
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), figmaAssetsPlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
