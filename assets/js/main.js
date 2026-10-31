// Мобільне меню
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
if (burger) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

// Перемикач світлої / темної теми (вибір запам'ятовується)
const themeBtn = document.querySelector('.theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = isDark ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

// Рік у футері
document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));

// Плавна поява блоків при скролі
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Демо-чат агента (сценарій можна міняти тут) =====
const chatBody = document.getElementById('chat-body');
const SCRIPT = [
  { from: 'user', text: 'Добрий день! Хочу записатись на чистку зубів' },
  { from: 'bot',  text: 'Вітаю! 😊 На який день вам зручно — цей тиждень чи наступний?' },
  { from: 'user', text: 'Четвер після 17:00' },
  { from: 'bot',  text: 'У четвер вільно о 17:30 та 18:15. Що обираєте?' },
  { from: 'user', text: '17:30, Олена, 093 123 45 67' },
  { from: 'bot',  text: 'Готово, Олено! Записала вас на четвер, 17:30. Нагадаю за день ✅' },
  { from: 'system', text: '→ Заявку додано в Google Sheets · адміну надіслано сповіщення' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function playChat() {
  if (!chatBody) return;
  while (true) {
    chatBody.innerHTML = '';
    for (const step of SCRIPT) {
      if (step.from === 'bot') {
        const t = document.createElement('div');
        t.className = 'msg bot typing';
        t.innerHTML = '<i></i><i></i><i></i>';
        chatBody.appendChild(t);
        await sleep(1100);
        t.remove();
      } else {
        await sleep(step.from === 'system' ? 500 : 900);
      }
      const m = document.createElement('div');
      m.className = `msg ${step.from}`;
      m.textContent = step.text;
      chatBody.appendChild(m);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    await sleep(4500);
  }
}
playChat();
