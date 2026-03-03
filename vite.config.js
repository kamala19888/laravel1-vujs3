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
const localAppOrigins = ['http://127.0.0.1:8000', 'http://localhost:8000'];
const localViteOrigin = 'http://127.0.0.1:5173';
const viteDevOrigin = process.env.VITE_DEV_SERVER_ORIGIN || (isCodespaces ? localViteOrigin : 'http://localhost:5173');
const allowedCorsOrigins = isCodespaces
    ? [appCodespacesOrigin, ...localAppOrigins]
    : localAppOrigins;
const viteDevUrl = new URL(viteDevOrigin);
const useSecureHmr = viteDevUrl.protocol === 'https:';

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
        origin: viteDevOrigin,
        cors: {
            origin: allowedCorsOrigins,
            credentials: true,
        },
        hmr: useSecureHmr
            ? {
                  protocol: 'wss',
                  host: viteDevUrl.hostname,
                  clientPort: 443,
              }
            : undefined,
    },
    build: {
        chunkSizeWarningLimit: 650,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return;
                    }

                    if (id.includes('/vuetify/')) {
                        return 'vendor-vuetify';
                    }

                    if (id.includes('/@mdi/') || id.includes('/material-design-icons-iconfont/')) {
                        return 'vendor-icons';
                    }

                    if (id.includes('/vue-router/') || id.includes('/vue-i18n/')) {
                        return 'vendor-vue-plugins';
                    }

                    if (id.includes('/vue/') || id.includes('/@vue/')) {
                        return 'vendor-vue-core';
                    }

                    if (id.includes('/axios/') || id.includes('/vue3-toastify/') || id.includes('/vue-json-excel3/')) {
                        return 'vendor-utils';
                    }
                },
            },
        },
    },
});
