// ==========================================
// МОДУЛЬ ГОСТЕВОЙ КНИГИ (GISCUS)
// ==========================================

function initGuestbook() {
  const container = document.getElementById('guestbook-container');
  if (!container) return;

  // Очищаем и создаем оформление
  container.innerHTML = `
    <div style="background: var(--card-white); border: var(--stroke); border-radius: 20px; padding: 20px; margin-bottom: 24px; box-shadow: var(--shadow);">
      <h2 style="font-family: 'DynaPuff', cursive; color: #3b4d24; margin-bottom: 8px;">★ Гостевая книга ★</h2>
      <p style="font-family: 'Comfortaa', cursive; font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">
        Оставьте пару тёплых слов, отзыв на обзор или просто передайте привет! 🐾
      </p>
    </div>

    <div class="giscus-box" style="background: var(--card-white); border: var(--stroke); border-radius: 20px; padding: 20px; box-shadow: var(--shadow);">
      <div id="giscus-slot"></div>
    </div>
  `;

  // Подключаем сам скрипт Giscus
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'neucorochen/neucorochen.github.io');
  script.setAttribute('data-repo-id', 'R_kgDON...'); // Замените на ваш ID из giscus.app
  script.setAttribute('data-category', 'General');
  script.setAttribute('data-category-id', 'DIC_kwDON...'); // Замените на ваш ID из giscus.app
  script.setAttribute('data-mapping', 'specific');
  script.setAttribute('data-term', 'Гостевая книга');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', 'light');
  script.setAttribute('data-lang', 'ru');
  script.crossOrigin = 'anonymous';
  script.async = true;

  document.getElementById('giscus-slot').appendChild(script);
}

// Функция открытия экрана гостевой книги
function showGuestbook() {
  const catalogView = document.getElementById('catalog-view');
  const articleView = document.getElementById('article-view');
  const guestbookWrap = document.getElementById('guestbook-view');

  if (catalogView) catalogView.style.display = 'none';
  if (articleView) articleView.style.display = 'none';
  if (guestbookWrap) guestbookWrap.style.display = 'block';

  const bannerTitle = document.getElementById('banner-title');
  const bannerSubtitle = document.getElementById('banner-subtitle');
  const bannerBadge = document.getElementById('banner-badge');
  const addressUrl = document.getElementById('address-url');

  if (bannerTitle) bannerTitle.innerHTML = 'Гостевая книга 🐾';
  if (bannerSubtitle) bannerSubtitle.textContent = 'Оставляйте отзывы, приветы и мысли об играх!';
  if (bannerBadge) bannerBadge.innerHTML = '<div class="apple-art">💌</div>';
  if (addressUrl) addressUrl.textContent = 'my.gamelog.cafe/guestbook';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Загружаем виджет, если он еще не был загружен
  if (!document.getElementById('giscus-slot')) {
    initGuestbook();
  }
}
