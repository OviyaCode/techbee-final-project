import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import pluginRewriteAll from 'vite-plugin-rewrite-all'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pluginRewriteAll(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  server: {
    host:'localhost',
    port: 3000,
    open: 'http://localhost:3000',
  }
})
