// Google Analytics — BLOCKATO di default, abilitato solo dopo consenso cookie.
// Estratto da uno <script> inline in client/index.html (CSP: mantenere questo
// file esterno permette a script-src di non richiedere 'unsafe-inline').
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
window.__loadGA = function () {
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-MS9CY7VC3S';
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', 'G-MS9CY7VC3S');
};
// Auto-load se l'utente ha già dato il consenso in precedenza (cookie check).
if (document.cookie.indexOf('cm_consent=accepted') !== -1) {
  window.__loadGA();
}
