import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**']
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            // This codebase intentionally leans on `any` for the loosely-typed
            // DIRIGERA payloads and HAP characteristic values.
            '@typescript-eslint/no-explicit-any': 'off',
            // `export namespace` is used deliberately for companion types.
            '@typescript-eslint/no-namespace': 'off',
            // settings.ts reads package.json via require under CommonJS output.
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            'no-console': 'warn'
        }
    }
];
