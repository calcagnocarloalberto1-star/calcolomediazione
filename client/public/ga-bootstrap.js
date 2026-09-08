// Google Analytics — BLOCKATO di default, abilitato solo dopo consenso cookie.
// Estratto da uno <script> inline in client/index.html (CSP: mantenere questo
// file esterno permette a script-src di non richiedere 'unsafe-inline').
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
window.__loadGA = function () {
  window['ga-disable-G-MS9CY7VC3S'] = false;
  gtag('consent', 'update', { analytics_storage: 'granted' });
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-MS9CY7VC3S';
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', 'G-MS9CY7VC3S', {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
};
window.__disableGA = function () {
  window['ga-disable-G-MS9CY7VC3S'] = true;
  gtag('consent', 'update', { analytics_storage: 'denied' });
  document.cookie.split(';').forEach(function (part) {
    var name = part.split('=')[0].trim();
    if (name === '_ga' || name.indexOf('_ga_') === 0) {
      document.cookie = name + '=; path=/; max-age=0; SameSite=Lax' +
        (window.location.protocol === 'https:' ? '; Secure' : '');
    }
  });
};
// Auto-load se l'utente ha già dato il consenso in precedenza (cookie check).
if (document.cookie.indexOf('cm_consent=accepted') !== -1) {
  window.__loadGA();
}
