import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import ViteVuetifyPlugin from 'vite-plugin-vuetify';

const codespaceName = process.env.CODESPACE_NAME;
const forwardingDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
const isCodespaces = Boolean(codespaceName && forwardingDomain);
const viteCodespacesHost = isCodespaces ? `${codespaceName}-5173.${forwardingDomain}` : 'localhost';
const appCodespacesOrigin = isCodespaces ? `https://${codespaceName}-8000.${forwardingDomain}` : 'http://localhost:8000';
const viteCodespacesOrigin = isCodespaces ? `https://${viteCodespacesHost}` : 'http://localhost:5173';

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
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        origin: viteCodespacesOrigin,
        cors: {
            origin: appCodespacesOrigin,
            credentials: true,
        },
        hmr: isCodespaces
            ? {
                  protocol: 'wss',
                  host: viteCodespacesHost,
                  clientPort: 443,
              }
            : undefined,
    },
});
