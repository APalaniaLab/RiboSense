// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],
  css: [
    '@/assets/css/input.css',
  ],
  colorMode: {
    classSuffix: ''
  },
  pages: true,
  ssr: false,
  app: {
    baseURL: '/riboswitch/',
    head: {
      script: [
        {
          src: 'https://unpkg.com/seqviz'
        }
      ]
    }
  }
})
