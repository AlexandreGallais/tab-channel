import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'esnext',
        lib: {
            entry: './src/index.ts',
            fileName: 'index',
            formats: ['es'],
        },
    },
    test: {
        environment: 'jsdom',
        coverage: {
            enabled: true,
            provider: 'istanbul',
            include: ['src'],
            all: true,
            thresholds: {
                lines: 100,
                branches: 100,
                functions: 100,
                statements: 100,
            },
        },
    },
});
