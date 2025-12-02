// https://nuxt.com/docs/api/configuration/nuxt-config
//@ts-ignore
const isProd = process.env.NODE_ENV === 'production'
const base = isProd ? '/nuxt-cookie-system/' : '/'

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
    baseURL: base,
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `${base}favicon.ico`,
        },
      ],
      style: [
        {
          innerHTML: `.loader-spinner{position:relative;width:50px;height:50px;margin:0 auto 15px}.loader-spinner::before,.loader-spinner::after{content:'';position:absolute;top:0;left:0;width:50px;height:50px;border-radius:50%;box-sizing:border-box}.loader-spinner::before{border:3px solid rgba(59,187,201,0.2)}.loader-spinner::after{border:3px solid transparent;border-top-color:#3bbbc9;border-right-color:#3bbbc9;animation:1s linear infinite spin}.page-loader.active{opacity:1;visibility:visible}.page-loader{opacity:0;pointer-events:none;position:absolute;inset:0;background:var(--loader-bg);display:flex;justify-content:center;align-items:center;z-index:9000;visibility:hidden;transition:opacity .3s,visibility .3s;overflow:hidden}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`,
          key: 'critical-loader-css',
        },
      ],
      script: [
        {
          innerHTML: `
            (function() {
              function getCookie(name) {
                var value = '; ' + document.cookie;
                var parts = value.split('; ' + name + '=');
                if (parts.length === 2) return parts.pop().split(';').shift();
                return undefined;
              }

              function initLoader() {
                var shouldShow = getCookie('cookie-accepted') === 'accepted';
                if (shouldShow && !document.querySelector('.page-loader')) {
                  var loader = document.createElement('div');
                  loader.className = 'page-loader active';
                  loader.innerHTML = '<div class="loader-overlay"></div><div class="loader-content"><div class="loader-spinner"></div></div>';
                  document.body.appendChild(loader);
                }
              }

              // Pokreni nakon hydration-a
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initLoader);
              } else {
                // Ako je već učitan, koristi requestAnimationFrame da sačeka hydration
                requestAnimationFrame(function() {
                  requestAnimationFrame(initLoader);
                });
              }
            })();
          `,
          type: 'text/javascript',
          tagPosition: 'bodyOpen',
        },
      ]
    }
  }
})
