import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    hmr: {
      overlay: false
    },
    // Proxy sitemap requests to production API
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
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Critical: Split react-icons into separate chunks by icon family
          if (id.includes('react-icons/fa')) {
            return 'icons-fa';
          }
          if (id.includes('react-icons/md')) {
            return 'icons-md';  
          }
          if (id.includes('react-icons/')) {
            return 'icons-other';
          }
          
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@chakra-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('chart.js')) {
              return 'chart-vendor';
            }
            if (id.includes('lodash') || id.includes('axios') || id.includes('date-fns')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
          
          // Page chunks for better code splitting
          if (id.includes('/features/home/')) {
            return 'home-page';
          }
          if (id.includes('/features/customer-product/')) {
            return 'customer-pages';
          }
          if (id.includes('/features/administration/') || id.includes('/features/company/')) {
            return 'admin-pages';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@chakra-ui/react'],
    exclude: ['react-icons'] // Critical: Don't pre-bundle react-icons
  },
  // SEO Configuration
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  }
})