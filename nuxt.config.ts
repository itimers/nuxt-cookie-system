// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    prerender: {
      routes: [
        '/',
      ],
      crawlLinks: false,
    },
    routeRules: {
      '/**': {
        headers: {
          'Content-Language': 'sr',
        },
      },
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
          vary: 'Accept-Encoding',
        },
      },
    },
    publicAssets: [
      {
        dir: 'static/img',
        maxAge: 60 * 60 * 24 * 365,
      },
      {
        dir: 'public/fonts',
        maxAge: 60 * 60 * 24 * 365,
      },
    ],
    minify: true,
    preset: 'github-pages',
  },
  app: {
    baseURL: import.meta.env.PROD ? '/nuxt-cookie-system/' : '/',
    head: {
      script: [
        {
          innerHTML: `
            (function() {
              var cookies = document.cookie.split(';');
              var cookieAccepted = cookies.find(function(c) { return c.trim().startsWith('cookie-accepted='); });
              var status = cookieAccepted ? cookieAccepted.split('=')[1] : 'waiting';
              
              var style = document.createElement('style');
              if (status === 'accepted') {
                style.innerHTML = '.page-loader { display: flex; }';
              } else {
                style.innerHTML = '.page-loader { display: none; }';
              }
              document.head.appendChild(style);
            })();
          `,
          type: 'text/javascript',
        }
      ]
    }
  }
})
