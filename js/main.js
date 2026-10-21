// Snowfall
(function () {
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d');
  let w, h, flakes = [];
  const count = 120;
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

// Cart (localStorage demo)
const cartKey = 'noelshop_cart';
function getCart() { try { return JSON.parse(localStorage.getItem(cartKey)) || []; } catch { return []; } }
function setCart(c) { localStorage.setItem(cartKey, JSON.stringify(c)); updateCartCount(); }
function updateCartCount() {
  const c = getCart();
  const n = c.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = n;
}
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2200);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const addBtn = document.getElementById('add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const qty = Math.max(1, parseInt(document.getElementById('qty').value || '1', 10));
      const cart = getCart();
      const existing = cart.find(i => i.id === 'mug-noel');
      if (existing) existing.qty += qty; else cart.push({ id: 'mug-noel', name: 'Tasse de Noël 350 ml', price: 4.09, qty });
      setCart(cart);
      showToast('Ajouté au panier 🎁');
    });
  }

  const buyNow = document.getElementById('buy-now');
  if (buyNow) {
    buyNow.addEventListener('click', (e) => {
      // smooth scroll handled by css; just focus qty
    });
  }
});
