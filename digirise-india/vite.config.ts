// @ts-nocheck
import { defineConfig } from 'vite';
import { resolve } from 'path';
import htmlPlugin from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import sitemap from 'vite-plugin-sitemap';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        blog: resolve(__dirname, 'src/pages/blog/index.html'),
        notFound: resolve(__dirname, 'src/pages/404.html'),
        ecommerce: resolve(__dirname, 'src/pages/industries/ecommerce.html'),
        realEstate: resolve(__dirname, 'src/pages/industries/real-estate.html'),
        healthcare: resolve(__dirname, 'src/pages/industries/healthcare.html'),
        education: resolve(__dirname, 'src/pages/industries/education.html'),
        saas: resolve(__dirname, 'src/pages/industries/saas.html'),
        finance: resolve(__dirname, 'src/pages/industries/finance.html'),
        hospitality: resolve(__dirname, 'src/pages/industries/hospitality.html'),
        travel: resolve(__dirname, 'src/pages/industries/travel.html'),
        localBusiness: resolve(__dirname, 'src/pages/industries/local-business.html'),
        delhi: resolve(__dirname, 'src/pages/locations/delhi.html'),
        mumbai: resolve(__dirname, 'src/pages/locations/mumbai.html'),
        bangalore: resolve(__dirname, 'src/pages/locations/bangalore.html'),
        hyderabad: resolve(__dirname, 'src/pages/locations/hyderabad.html'),
        pune: resolve(__dirname, 'src/pages/locations/pune.html'),
        compare: resolve(__dirname, 'src/pages/compare/index.html'),
        glossary: resolve(__dirname, 'src/pages/glossary/index.html'),
        audit: resolve(__dirname, 'src/pages/audit/index.html'),
        leads: resolve(__dirname, 'src/pages/leads/index.html'),
        growth: resolve(__dirname, 'src/pages/growth-partner-program/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    sourcemap: true,
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: { chrome: 100, firefox: 100, safari: 15 },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@types': resolve(__dirname, 'src/types'),
      '@data': resolve(__dirname, 'data'),
      '@content': resolve(__dirname, 'content'),
    },
  },
  plugins: [
    htmlPlugin(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      manifest: {
        name: 'DigiRise India — Digital Growth Partner',
        short_name: 'DigiRise',
        id: '/',
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        background_color: '#080604',
        theme_color: '#080604',
        orientation: 'portrait',
        lang: 'en-IN',
        dir: 'ltr',
        categories: ['business', 'marketing', 'productivity'],
        description: 'DigiRise India — Digital Marketing Agency in Kolkata. Meta Ads, SEO, Web Design, Branding, AI Automation.',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          { src: '/assets/screenshots/desktop-1.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide' },
          { src: '/assets/screenshots/mobile-1.png', sizes: '390x844', type: 'image/png', form_factor: 'narrow' },
          { src: '/assets/screenshots/mobile-2.png', sizes: '390x844', type: 'image/png', form_factor: 'narrow' },
        ],
        shortcuts: [
          { name: 'Free Audit', short_name: 'Audit', url: '/audit/?shortcut=audit', icons: [{ src: '/assets/shortcuts/audit.png', sizes: '96x96' }] },
          { name: 'Packages', short_name: 'Pricing', url: '/#packages?shortcut=packages', icons: [{ src: '/assets/shortcuts/packages.png', sizes: '96x96' }] },
          { name: 'Email Us', short_name: 'Contact', url: 'mailto:digiriseindia@gmail.com?subject=PWA%20Contact', icons: [{ src: '/assets/shortcuts/contact.png', sizes: '96x96' }] },
          { name: 'Blog', short_name: 'Blog', url: '/blog/?shortcut=blog', icons: [{ src: '/assets/shortcuts/blog.png', sizes: '96x96' }] },
          { name: 'Tools Hub', short_name: 'Tools', url: '/tools/?shortcut=tools', icons: [{ src: '/assets/shortcuts/tools.png', sizes: '96x96' }] },
        ],
        share_target: {
          action: '/share',
          method: 'GET',
          params: { title: 'title', text: 'text', url: 'url' },
        },
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,woff,woff2}'],
        additionalManifestEntries: [
          { url: '/icon-192.png', revision: null },
          { url: '/icon-512.png', revision: null },
          { url: '/icon-192-maskable.png', revision: null },
          { url: '/icon-512-maskable.png', revision: null },
          { url: '/og-image.png', revision: null },
          { url: '/assets/screenshots/desktop-1.png', revision: null },
          { url: '/assets/screenshots/mobile-1.png', revision: null },
          { url: '/assets/screenshots/mobile-2.png', revision: null },
          { url: '/assets/shortcuts/audit.png', revision: null },
          { url: '/assets/shortcuts/packages.png', revision: null },
          { url: '/assets/shortcuts/contact.png', revision: null },
          { url: '/assets/shortcuts/blog.png', revision: null },
          { url: '/assets/shortcuts/tools.png', revision: null },
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
    sitemap({
      hostname: 'https://digiriseindia.tech',
      dynamicRoutes: [],
      exclude: ['/404', '/share', '/offline', '/admin/*'],
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    visualizer({
      filename: 'bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.NEXT_PUBLIC_SITE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SITE_URL || 'https://digiriseindia.tech'),
    'process.env.NEXT_PUBLIC_POSTHOG_KEY': JSON.stringify(process.env.NEXT_PUBLIC_POSTHOG_KEY || ''),
    'process.env.NEXT_PUBLIC_POSTHOG_HOST': JSON.stringify(process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'),
  },
});
