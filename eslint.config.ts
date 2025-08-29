import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "*.config.*",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Basic rules that work with Next.js flat config
      "no-unused-vars": "error",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "prefer-const": "error",
      // React specific rules
      "react-hooks/exhaustive-deps": "error",
      "react/display-name": "error",
      "react/jsx-key": "error",
    },
  },
];

export default eslintConfig;
