// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: false },

  app: {
    head: {
      title: 'Operation: NEXUS - Digital Investigation Agency',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Experience realistic digital investigations in NEXUS - an immersive laptop simulation game. Analyze emails, decode messages, examine files, and solve complex cyber crimes as a digital detective. Play the DEMO now!'
        },
        {
          name: 'keywords',
          content: 'nexus game, digital investigation, laptop simulation, cyber detective, email analysis, chat forensics, file exploration, digital evidence, investigation game, mystery solving, FBI simulation, cybercrime investigation, digital forensics game, interactive investigation, nexus agency, demo game, browser game, detective simulation'
        },
        { name: 'author', content: 'ranzak' },
        { name: 'robots', content: 'index, follow' },
        { name: 'language', content: 'en' },
        { name: 'theme-color', content: '#007acc' },

        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Operation: NEXUS - Digital Investigation Agency' },
        {
          property: 'og:description',
          content: 'Immersive laptop simulation game for digital investigations. Analyze emails, decode messages, solve cyber crimes. Experience realistic detective work in the NEXUS universe.'
        },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:url', content: 'https://opnexus.netlify.app' },
        { property: 'og:site_name', content: 'Operation: NEXUS' },
        { property: 'og:locale', content: 'en_US' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Operation: NEXUS - Digital Investigation Agency' },
        {
          name: 'twitter:description',
          content: 'Play the ultimate laptop simulation for digital investigations. Solve cyber crimes, analyze evidence, decode messages in realistic cases.'
        },
        { name: 'twitter:image', content: '/twitter-card.png' },
        { name: 'twitter:creator', content: '@NexusAgency' },

        { name: 'application-name', content: 'Operation: NEXUS - Digital Investigation Agency' },
        { name: 'apple-mobile-web-app-title', content: 'Operation: NEXUS' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'msapplication-TileColor', content: '#007acc' },
        { name: 'msapplication-config', content: '/browserconfig.xml' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'shortcut icon', type: 'image/png', href: '/logo.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logo.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/logo.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://opnexus.netlify.app' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            'name': 'Operation: NEXUS - Digital Investigation Agency',
            'alternateName': 'Operation: NEXUS',
            'description': 'An immersive laptop simulation game where players become digital detectives. Analyze emails, decode encrypted messages, examine files, and solve complex cyber crimes through realistic investigation tools and techniques.',
            'genre': ['Investigation', 'Mystery', 'Simulation', 'Detective', 'Puzzle'],
            'gameLocation': 'Online',
            'operatingSystem': ['Windows', 'macOS', 'Linux', 'Chrome OS'],
            'applicationCategory': 'Game',
            'gamePlatform': 'Web Browser',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Operation: NEXUS - Digital Investigation Agency'
            },
            'keywords': 'digital investigation, laptop simulation, cyber detective, email forensics, chat analysis, file exploration, mystery solving, interactive investigation',
            'inLanguage': 'en',
            'isAccessibleForFree': true
          })
        }
      ]
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts'
  ],

  css: [
    '@/assets/scss/main.scss'
  ],

  googleFonts: {
    families: {
      'Inter': [400, 500, 600, 700],
      'JetBrains Mono': [400, 500, 600, 700]
    },
    display: 'swap',
    preload: true,
    prefetch: false,
    preconnect: false,
  },

  imports: {
    dirs: [
      '../shared/utils/**',
      '../shared/types/**',
      'composables/**'
    ]
  },

  nitro: {
    imports: {
      dirs: [
        'shared/utils/**',
        'shared/types/**'
      ]
    }
  },

  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url)),
    '@@': fileURLToPath(new URL('.', import.meta.url)),
    '#shared': fileURLToPath(new URL('./shared', import.meta.url))
  },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url)),
        '@@': fileURLToPath(new URL('.', import.meta.url)),
        '#shared': fileURLToPath(new URL('./shared', import.meta.url))
      }
    },
    define: {
      global: 'globalThis'
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/variables.scss" as *;'
        }
      }
    },
    build: {
      rollupOptions: {
        external: [],
        output: {
          manualChunks: undefined
        }
      }
    }
  },

  typescript: {
    typeCheck: true,
    strict: true,
  }
});