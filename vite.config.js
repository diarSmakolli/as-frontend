import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  cacheDir: 'node_modules/.vite_cache',
  server: {
    port: 5174,
    hmr: { overlay: false },
    proxy: {
      '/sitemap.xml': {
        target: 'https://api.assolutionsfournitures.fr',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      },
      '/sitemap-products.xml': {
        target: 'https://api.assolutionsfournitures.fr',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      },
      '/sitemap-categories.xml': {
        target: 'https://api.assolutionsfournitures.fr',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      },
      '/sitemap-index.xml': {
        target: 'https://api.assolutionsfournitures.fr',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    target: 'esnext', // Use 'esnext' for smallest, fastest output (if your hosting supports it)
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline assets <4kb for fewer requests
    brotliSize: true, // Analyze brotli size for better CDN performance
    chunkSizeWarningLimit: 800, // Warn earlier for large chunks
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 3, // More passes for better compression
        ecma: 2020,
        module: true,
        toplevel: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_undefined: true,
      },
      mangle: {
        safari10: true,
        toplevel: true,
      },
      output: {
        comments: false,
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react-icons/fa')) return 'icons-fa';
          if (id.includes('react-icons/md')) return 'icons-md';
          if (id.includes('react-icons/')) return 'icons-other';
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('@chakra-ui')) return 'ui-vendor';
            if (id.includes('@emotion')) return 'emotion-vendor';
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('react-router')) return 'router-vendor';
            if (id.includes('chart.js')) return 'chart-vendor';
            if (id.includes('lodash') || id.includes('axios') || id.includes('date-fns')) return 'utils-vendor';
            return 'vendor';
          }
          if (id.includes('/features/home/')) return 'home-page';
          if (id.includes('/features/customer-product/')) return 'customer-pages';
          if (id.includes('/features/administration/') || id.includes('/features/company/')) return 'admin-pages';
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion'
    ],
    exclude: ['react-icons']
  },
  ssr: {
    noExternal: [
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion'
    ]
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  }
})