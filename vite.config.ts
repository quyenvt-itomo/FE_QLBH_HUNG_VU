import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react({ fastRefresh: true }),
    tsconfigPaths(), // 👈 quan trọng
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      overlay: true,
    },
    watch: {
      // These are legacy/reference trees and must not invalidate the running app.
      ignored: ["**/example/**", "**/other/**", "**/design/**", "**/dist/**"],
    },
  },
});
