/*!
 * Alpha Pet Spa · Call Bar widget v1.0
 * Single self-contained file: no CSS file, no icon font, no library needed.
 *
 * Add before </body> on any page:
 *   <script src="https://YOUR-ZONE.b-cdn.net/callbar.js" defer></script>
 *
 * Optional data-* attributes on that script tag:
 *   data-phone="+61499770418"     number to call
 *   data-book="contact.html#book" Book button link ("none" = Call button only)
 *   data-call-text="Call"         Call button label
 *   data-book-text="Book Now"     Book button label
 *   data-breakpoint="640"         show up to this screen width (px); "all" = every screen
 *   data-color="#7B4FC9"          Book button colour
 *   data-call-color="#1F3F7A"     Call button text colour
 *   data-spacer="true"            add space at page bottom so the bar never hides content
 */
(function () {
  'use strict';
  if (window.__apsCallbar) return;
  window.__apsCallbar = true;

  var me = document.currentScript || document.querySelector('script[src*="callbar"]');

  function opt(name, fallback) {
    var v = me && me.getAttribute('data-' + name);
    return v == null || v.trim() === '' ? fallback : v.trim();
  }
  function safeColor(v, fallback) {
    return /^[#\w(),.%\s-]+$/.test(v) ? v : fallback;
  }

  var phone = opt('phone', '+61499770418');
  var book = opt('book', 'contact.html#book');
  var callText = opt('call-text', 'Call');
  var bookText = opt('book-text', 'Book Now');
  var bp = opt('breakpoint', '640');
  var accent = safeColor(opt('color', '#7B4FC9'), '#7B4FC9');
  var callColor = safeColor(opt('call-color', '#1F3F7A'), '#1F3F7A');
  var useSpacer = opt('spacer', 'true') !== 'false';
  var showBook = book.toLowerCase() !== 'none';
  var always = bp.toLowerCase() === 'all';
  var bpPx = parseInt(bp, 10) || 640;

  var SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var ICON_PHONE = SVG + '<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/></svg>';
  var ICON_BOOK = SVG + '<path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M4 11h16"/><path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296z"/></svg>';

  var show = '.aps-bar{display:grid}.aps-sp{display:block}';
  var css =
    '.aps-bar{all:initial;display:none;position:fixed;left:12px;right:12px;' +
      'bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147483000;' +
      'grid-template-columns:1fr 1fr;gap:10px;' +
      'font-family:"Figtree",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;' +
      '-webkit-font-smoothing:antialiased}' +
    '.aps-bar.aps-one{grid-template-columns:1fr}' +
    '.aps-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;' +
      'box-sizing:border-box;min-height:48px;margin:0;padding:15px 26px;border:0;border-radius:999px;' +
      'font-family:inherit;font-size:16px;font-weight:700;line-height:1.2;letter-spacing:normal;' +
      'text-transform:none;text-decoration:none;white-space:nowrap;cursor:pointer;' +
      'box-shadow:0 8px 24px rgba(20,40,79,.25);' +
      'transition:transform .15s,background-color .15s,filter .15s;-webkit-tap-highlight-color:transparent}' +
    '.aps-btn:hover{transform:translateY(-2px)}' +
    '.aps-btn:focus-visible{outline:3px solid ' + accent + ';outline-offset:3px}' +
    '.aps-btn svg{width:18px;height:18px;flex:none}' +
    '.aps-call,.aps-call:hover{background:#fff;color:' + callColor + '}' +
    '.aps-call:hover{background:#EAF4FC}' +
    '.aps-book,.aps-book:hover{background:' + accent + ';color:#fff}' +
    '.aps-book:hover{filter:brightness(.88)}' +
    '.aps-sp{display:none;height:84px}' +
    (always ? show : '@media (max-width:' + bpPx + 'px){' + show + '}') +
    '@media print{.aps-bar,.aps-sp{display:none}}';

  function link(cls, href, icon, text, label) {
    var a = document.createElement('a');
    a.className = 'aps-btn ' + cls;
    a.setAttribute('href', href);
    if (label) a.setAttribute('aria-label', label);
    a.innerHTML = icon;
    a.appendChild(document.createTextNode(text));
    return a;
  }

  function mount() {
    var host = document.createElement('div');
    host.id = 'aps-callbar';
    host.style.cssText = 'display:block;margin:0;padding:0;border:0';
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    var style = document.createElement('style');
    style.textContent = css;
    root.appendChild(style);

    var bar = document.createElement('div');
    bar.className = 'aps-bar' + (showBook ? '' : ' aps-one');
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Quick contact');
    bar.appendChild(link('aps-call', 'tel:' + phone.replace(/[^\d+]/g, ''), ICON_PHONE, callText, callText + ' ' + phone));
    if (showBook) bar.appendChild(link('aps-book', book, ICON_BOOK, bookText));
    root.appendChild(bar);

    if (useSpacer) {
      var sp = document.createElement('div');
      sp.className = 'aps-sp';
      root.appendChild(sp);
    }

    document.body.appendChild(host);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
