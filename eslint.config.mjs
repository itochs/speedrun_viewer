import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat["jsx-runtime"],
      prettier,
    ],
    languageOptions: { globals: globals.browser },
    rules: { "react/prop-types": "off" },
    settings: { react: { version: "detect" } },
  },
]);
