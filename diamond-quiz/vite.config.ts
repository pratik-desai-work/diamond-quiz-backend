import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        outDir: '../public/apps/diamond-quiz',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: 'index.js',
                chunkFileNames: 'chunk-[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    },
    // server: {
    //     watch: {
    //         usePolling: true,
    //     },
    //     hmr: {
    //         host: 'localhost',
    //         port: 3000,
    //     },
    // },
});
