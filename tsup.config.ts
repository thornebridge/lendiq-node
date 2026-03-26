import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/webhooks.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: true,
});
