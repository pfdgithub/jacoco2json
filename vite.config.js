import cProcess from "child_process";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";
import { library, name, version } from "./package.json";

export default defineConfig(() => {
  const time = new Date().toISOString();
  const commit = cProcess
    .execSync("git rev-parse HEAD || echo UNKNOWN")
    .toString()
    .trim();

  return {
    clearScreen: false,
    resolve: {
      alias: {
        "@/": fileURLToPath(new URL("./src/", import.meta.url)),
      },
    },
    build: {
      lib: {
        name: library,
        formats: ["es", "cjs"],
        entry: [fileURLToPath(new URL("./src/index.ts", import.meta.url))],
      },
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          banner: `/*!\n * APP_NAME: ${name}\n * APP_LIBRARY: ${library}\n * APP_VERSION: ${version}\n * BUILD_TIME: ${time}\n * BUILD_COMMIT: ${commit}\n */\n`,
        },
      },
    },
    plugins: [
      react(),
      checker({
        enableBuild: false,
        typescript: true,
        eslint: {
          lintCommand: "eslint './src/**/*.{ts,tsx,js,jsx}'",
        },
      }),
    ],
  };
});
