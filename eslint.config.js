import eslintConfig from "@tree-company/eslint-config";

export default [
  ...eslintConfig.configs.default,
  {
    ignores: ["coverage/", "dist/"],
  },
];
