export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr:true,
  modules: [
    'nuxt-svgo',
    '@primevue/nuxt-module',
    '@vee-validate/nuxt',
    "@nuxt/image",
    '@pinia/nuxt',
    '@nuxt/ui',
    'nuxt-lucide-icons',
    'nuxt-aos',
  ],

  svgo: {
    defaultImport: 'component',
  },
  
  imports: {
    
  },
  experimental: {
    viewTransition: true,
    renderJsonPayloads: true
  },
  nitro: {
    compressPublicAssets: true,
    devProxy: {
      '/_nuxt/': 'http://localhost:3000'
    }
  },

  css: ['@/assets/scss/main.scss', '~/assets/css/main.css', 'primeicons/primeicons.css'],
  aos: {
    // Global settings
    disable: false,
    startEvent: 'DOMContentLoaded',
    initClassName: 'aos-init',
    animatedClassName: 'aos-animate',
    useClassNames: false,
    disableMutationObserver: false,
    debounceDelay: 50,
    throttleDelay: 99,
    
    // Settings that can be overridden per element
    offset: 120,
    delay: 0,
    duration: 800,
    easing: 'ease',
    once: false,
    mirror: false,
    anchorPlacement: 'top-bottom'
  },
  runtimeConfig:{
    public:{
      baseUrl: process.env.BASE_URL,
      countryKey:process.env.COUNTRY_API_KEY
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },  
  },

  primevue:{
    importTheme:{from:'~/presets/noirPreset.ts'}
  },

  vite: {
    
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/assets/scss/variables/index.scss";',
            },
        },
    },
},

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  compatibilityDate: '2025-01-24',
})