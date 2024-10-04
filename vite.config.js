import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import babel from 'vite-plugin-babel';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react(), babel()],

  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
