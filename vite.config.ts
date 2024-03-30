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
        },
    },
});
