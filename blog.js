// ==========================================
// 1. ДАННЫЕ ВАШЕГО ДНЕВНИКА (ВЛОГОВ)
// Сюда просто добавляйте новые записи через запятую!
// ==========================================
const diaryPosts = [
  {
    date: "27.10.2026",
    mood: "💟",
    title: "Обновление блога и работа над сайтом",
    text: "Привет! Решила добавить на сайт гостевую книгу, уютный дневник и систему лайков. Наконец-то всё выглядит именно так, как я задумывала — атмосферно, лампово и с любимой музыкой!",
    image: "" // Если хотите прикрепить картинку к записи, напишите путь: "images/photo.png"
  }
];

// ==========================================
// 2. ОТРИСОВКА И ПЕРЕКЛЮЧЕНИЕ НА ДНЕВНИК
// ==========================================
function renderDiary() {
  const container = document.getElementById('diary-list');
  if (!container) return;

  container.innerHTML = diaryPosts.map(post => `
    <article style="background: var(--card-white); border: var(--stroke); border-radius: 20px; padding: 22px; margin-bottom: 20px; box-shadow: var(--shadow-block);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <span style="font-family: 'Comfortaa', cursive; font-size: 0.85rem; font-weight: 800; background: #e6f3d4; border: 1.5px solid #718954; color: #4b6133; padding: 4px 12px; border-radius: 12px;">📅 ${post.date}</span>
        <span style="font-family: 'Comfortaa', cursive; font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">${post.mood}</span>
      </div>

      <h3 style="font-family: 'DynaPuff', cursive; font-size: 1.35rem; color: #3b4d24; margin-bottom: 10px;">${post.title}</h3>
      <p style="font-family: 'Nunito', sans-serif; font-size: 1.02rem; line-height: 1.7; color: #4a5937; margin-bottom: ${post.image ? '16px' : '0'};">${post.text}</p>

      ${post.image ? `
        <div style="border-radius: 14px; overflow: hidden; border: var(--stroke); margin-top: 14px;">
          <img src="${post.image}" alt="Фото к записи" style="width: 100%; display: block; max-height: 400px; object-fit: cover;">
        </div>
      ` : ''}
    </article>
  `).join('');
}

function showDiary() {
  const catalogView = document.getElementById('catalog-view');
  const articleView = document.getElementById('article-view');
  const guestbookView = document.getElementById('guestbook-view');
  const diaryView = document.getElementById('diary-view');

  if (catalogView) catalogView.style.display = 'none';
  if (articleView) articleView.style.display = 'none';
  if (guestbookView) guestbookView.style.display = 'none';
  if (diaryView) diaryView.style.display = 'block';

  const bannerTitle = document.getElementById('banner-title');
  const bannerSubtitle = document.getElementById('banner-subtitle');
  const bannerBadge = document.getElementById('banner-badge');
  const addressUrl = document.getElementById('address-url');

  if (bannerTitle) bannerTitle.innerHTML = 'Мой Дневник 🐾';
  if (bannerSubtitle) bannerSubtitle.textContent = 'Мысли, заметки о жизни, процессах и рисунках ✨';
  if (bannerBadge) bannerBadge.innerHTML = '<div class="apple-art">📝</div>';
  if (addressUrl) addressUrl.textContent = 'my.gamelog.cafe/diary';

  renderDiary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 3. СИСТЕМА ГЛОБАЛЬНЫХ ЛАЙКОВ (ДЛЯ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ)
// ==========================================

// Уникальное пространство имён вашего сайта
const LIKES_NAMESPACE = "neucorochen_gamelog";

// Функция загрузки глобального количества лайков с сервера
async function updateLikesDisplay(reviewKey) {
  const btn = document.getElementById('like-btn-' + reviewKey);
  const hasLiked = localStorage.getItem('has_liked_' + reviewKey);

  try {
    // Запрашиваем текущее число с глобального сервера
    const response = await fetch(`https://api.counterapi.dev/v1/${LIKES_NAMESPACE}/${reviewKey}/`);
    const data = await response.json();
    const count = data.count || 0;

    if (btn) {
      btn.innerHTML = `${hasLiked ? '❤️ Понравилось!' : '🤍 Мне нравится'} (${count})`;
      if (hasLiked) btn.style.background = '#ffd9d9';
    }
  } catch (error) {
    console.log("Сервер лайков недоступен, показываем локально:", error);
  }
}

// Функция нажатия на лайк
async function likeReview(reviewKey) {
  const btn = document.getElementById('like-btn-' + reviewKey);
  const hasLiked = localStorage.getItem('has_liked_' + reviewKey);

  // Защита от накрутки: один пользователь может лайкнуть только один раз
  if (hasLiked) {
    alert("Вы уже поставили лайк этому обзору! 🐾");
    return;
  }

  // Анимация нажатия
  if (btn) {
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
  }

  try {
    // Отправляем команду «up» (+1 к глобальному счетчику)
    const response = await fetch(`https://api.counterapi.dev/v1/${LIKES_NAMESPACE}/${reviewKey}/up`);
    const data = await response.json();
    const newCount = data.count;

    // Запоминаем в браузере читателя, что он уже проголосовал
    localStorage.setItem('has_liked_' + reviewKey, 'true');

    if (btn) {
      btn.innerHTML = `❤️ Понравилось! (${newCount})`;
      btn.style.background = '#ffd9d9';
    }
  } catch (error) {
    console.error("Ошибка при отправке лайка:", error);
  }
}

// ==========================================
// 4. КОММЕНТАРИИ ПОД ОБЗОРОМ ЧЕРЕЗ GISCUS
// ==========================================
function loadReviewComments(reviewKey) {
  const slot = document.getElementById('review-comments-slot');
  if (!slot) return;
  slot.innerHTML = ''; // очищаем перед новой статьей

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'neucorochen/neucorochen.github.io');
  script.setAttribute('data-repo-id', 'R_kgDON...'); // Ваш data-repo-id
  script.setAttribute('data-category', 'General');
  script.setAttribute('data-category-id', 'DIC_kwDON...'); // Ваш data-category-id
  script.setAttribute('data-mapping', 'specific');
  script.setAttribute('data-term', 'Обзор: ' + reviewKey); // ветка создается строго под этот обзор
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', 'light');
  script.setAttribute('data-lang', 'ru');
  script.crossOrigin = 'anonymous';
  script.async = true;

  slot.appendChild(script);
}
