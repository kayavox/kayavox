import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/unit/**/*.test.js'],
        coverage: {
            provider: 'v8',
            include: ['lib/modules/**/*.js'],
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80
            }
        }
    }
});
