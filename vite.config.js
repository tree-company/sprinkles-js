import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: "sprinkles-js",
      entry: resolve(__dirname, "src/index.js"),
      fileName: "index",
    },
  },
});
