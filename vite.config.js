import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import ViteVuetifyPlugin from 'vite-plugin-vuetify';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        ViteVuetifyPlugin({
            autoImport: true, // أضف هذا الخيار
        }),
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
            '@': '/resources/js',
        },
    },
    // أضف هذا القسم للتكيف مع Vercel
    build: {
        outDir: 'dist', // مجلد البناء الافتراضي الذي يتوقعه Vercel
        emptyOutDir: true, // تنظيف مجلد البناء قبل كل بناء
    },
});
