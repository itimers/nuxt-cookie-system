// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
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
