// Snowfall (lightweight, disabled for reduced motion)
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('snow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, flakes = [];
  const count = window.matchMedia('(max-width: 768px)').matches ? 50 : 110;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function init() {
    flakes = [];
    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        d: Math.random() * count,
        vy: Math.random() * 0.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.4
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    for (const f of flakes) {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }
    ctx.fill();
    update();
    requestAnimationFrame(draw);
  }
  function update() {
    for (const f of flakes) {
      f.y += f.vy;
      f.x += f.vx;
      if (f.y > h) { f.y = -5; f.x = Math.random() * w; }
      if (f.x > w) f.x = 0;
      if (f.x < 0) f.x = w;
    }
  }
  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

// Shopify redirect (no cart)
const SHOP_URL = 'https://s5q00i-m7.myshopify.com';

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2200);
}

function clampQuantity(value) {
  let qty = parseInt(value, 10);
  if (!Number.isInteger(qty) || qty < 1) qty = 1;
  if (qty > 99) qty = 99;
  return qty;
}

function redirectToShopify() {
  const input = document.getElementById('qty');
  const qty = clampQuantity(input ? input.value : 1);
  if (input) input.value = String(qty);
  try {
    const url = new URL(SHOP_URL);
    url.searchParams.set('quantity', String(qty));
    window.location.assign(url.toString());
  } catch (e) {
    window.location.assign(SHOP_URL);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const buyBtn = document.getElementById('buy-btn');
  if (buyBtn) buyBtn.addEventListener('click', redirectToShopify);

  const buyNow = document.getElementById('buy-now');
  if (buyNow) {
    buyNow.addEventListener('click', (e) => {
      // smooth scroll to buy section is handled by CSS; keep default
    });
  }

  const qtyInput = document.getElementById('qty');
  if (qtyInput) {
    qtyInput.addEventListener('change', () => {
      qtyInput.value = String(clampQuantity(qtyInput.value));
    });
    qtyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        redirectToShopify();
      }
    });
  }

  // Mobile menu
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.textContent = open ? '✕' : '☰';
    });
    siteNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });
  }

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const onScroll = () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});