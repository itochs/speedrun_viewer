import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: [
      "js/recommended",
      "eslint:recommended",
      "prettier",
      "plugin:react/recommended",
      "plugin:import/recommended",
    ],
    languageOptions: { globals: globals.browser },
  },
  pluginReact.configs.flat.recommended,
]);
