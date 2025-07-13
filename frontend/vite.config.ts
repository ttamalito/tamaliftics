import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      '@clients': path.resolve(__dirname, './src/models/clients.ts'),
      '@routes': path.resolve(__dirname, './src/routes/routes.ts'),
      '@requests': path.resolve(__dirname, './src/hooks/requests'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  server: {
    // https: {
    //   key: '/Users/jjgon/Documents/https_certs/key.pem', //uncomment to use http2 and https
    //   cert: '/Users/jjgon/Documents/https_certs/cert.pem',
    // },
    port: 3000,
    open: '/',
  },
})
