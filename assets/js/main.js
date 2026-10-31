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

// Перемикач «Комп'ютер / Телефон» у демо сайтів
document.querySelectorAll('.demo-view').forEach(view => {
  const frame = view.querySelector('.browser-frame');
  view.querySelectorAll('.device-switch button').forEach(btn => {
    btn.addEventListener('click', () => {
      view.querySelectorAll('.device-switch button').forEach(b => b.classList.toggle('on', b === btn));
      frame.dataset.device = btn.dataset.device;
    });
  });
});

// Рік у футері
document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));

// Плавна поява блоків при скролі
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Демо-чат AI-агента: різні ситуації по черзі =====
// Щоб додати ситуацію — додай об'єкт у SCENARIOS (from: 'user' | 'bot' | 'system')
const SCENARIOS = [
  {
    niche: 'Стоматологія',
    steps: [
      { from: 'user', text: 'Добрий день! Хочу записатись на чистку зубів' },
      { from: 'bot', text: 'Вітаю! 😊 Коли вам зручно — цього тижня чи наступного?' },
      { from: 'user', text: 'Четвер після 17:00' },
      { from: 'bot', text: 'Вільно о 17:30 або 18:15. Як вас записати?' },
      { from: 'user', text: '17:30, Олена' },
      { from: 'bot', text: 'Готово, Олено! Четвер, 17:30. Нагадаю за день ✅' },
      { from: 'system', text: '→ Заявку додано в таблицю · адміну надіслано сповіщення' },
    ],
  },
  {
    niche: 'Квітковий магазин',
    steps: [
      { from: 'user', text: 'Потрібен букет на день народження мамі' },
      { from: 'bot', text: 'Чудовий привід! 🌷 На який бюджет орієнтуємось?' },
      { from: 'user', text: 'До 1000 грн, щось ніжне' },
      { from: 'bot', text: 'Раджу півонієві троянди з евкаліптом — 950 грн. Доставити чи самовивіз?' },
      { from: 'user', text: 'Доставка завтра до 12:00' },
      { from: 'bot', text: 'Записала! Флорист збере букет зранку, кур\'єр зателефонує 🚚' },
      { from: 'system', text: '→ Замовлення передано флористу' },
    ],
  },
  {
    niche: 'Кафе',
    steps: [
      { from: 'user', text: 'Можна забронювати столик на сьогодні?' },
      { from: 'bot', text: 'Звісно! На скільки осіб і на котру годину?' },
      { from: 'user', text: 'На 4, о 19:00' },
      { from: 'bot', text: 'Є столик біля вікна 🙌 На чиє ім\'я бронюю?' },
      { from: 'user', text: 'Андрій' },
      { from: 'bot', text: 'Готово, Андрію! Чекаємо вас о 19:00 ☕' },
      { from: 'system', text: '→ Бронь додано в таблицю' },
    ],
  },
  {
    niche: 'Інтернет-магазин',
    steps: [
      { from: 'user', text: 'Де моє замовлення? Номер 4821' },
      { from: 'bot', text: 'Секунду, перевіряю… 🔎' },
      { from: 'bot', text: 'Замовлення №4821 вже в дорозі, приїде завтра на пошту' },
      { from: 'user', text: 'А можна змінити відділення?' },
      { from: 'bot', text: 'Так, напишіть номер нового відділення — передам менеджеру' },
      { from: 'system', text: '→ Статус отримано з CRM · задачу створено' },
    ],
  },
];

const chatBody = document.getElementById('chat-body');
const chatNiche = document.getElementById('chat-niche');
const chatDots = document.getElementById('chat-dots');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function playChat() {
  if (!chatBody) return;
  if (chatDots) chatDots.innerHTML = SCENARIOS.map(() => '<i></i>').join('');
  let i = 0;
  while (true) {
    const sc = SCENARIOS[i];
    chatBody.innerHTML = '';
    chatBody.classList.remove('fade');
    if (chatNiche) chatNiche.textContent = sc.niche;
    if (chatDots) [...chatDots.children].forEach((d, k) => d.classList.toggle('on', k === i));

    for (const step of sc.steps) {
      if (step.from === 'bot') {
        const t = document.createElement('div');
        t.className = 'msg bot typing';
        t.innerHTML = '<i></i><i></i><i></i>';
        chatBody.appendChild(t);
        chatBody.scrollTop = chatBody.scrollHeight;
        await sleep(1000);
        t.remove();
      } else {
        await sleep(step.from === 'system' ? 500 : 850);
      }
      const m = document.createElement('div');
      m.className = `msg ${step.from}`;
      m.textContent = step.text;
      chatBody.appendChild(m);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    await sleep(3200);
    chatBody.classList.add('fade');
    await sleep(400);
    i = (i + 1) % SCENARIOS.length;
  }
}
playChat();
