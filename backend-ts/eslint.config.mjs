import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "**/node_modules/",
      // データベースの実装が未完成のため、無視する
      "src/employee/EmployeeDatabaseDynamoDB.ts",
    ],
  },
  ...compat.extends("plugin:@typescript-eslint/recommended"),
];

export default eslintConfig;
