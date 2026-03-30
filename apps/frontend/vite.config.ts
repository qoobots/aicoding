import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import * as monaco from 'monaco-editor';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages'),
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'tdesign-vue-next',
      'tdesign-icons-vue-next',
      'monaco-editor',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco-editor': ['monaco-editor'],
          'tdesign-vue-next': ['tdesign-vue-next', 'tdesign-icons-vue-next'],
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          vendor: ['axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
