// ---- shared config ----
// Sohail's birthday: October 9
const BIRTHDAY_MONTH = 9; // 0-indexed: October
const BIRTHDAY_DAY = 9;

function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0);
  if (target < now) {
    target = new Date(year + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0);
  }
  return target;
}

function formatUnits(diffMs) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function updateCountdown() {
  const target = getNextBirthday();
  const diff = target - new Date();
  const { days, hours, minutes, seconds } = formatUnits(diff);

  // nav pill (present on every page)
  const pill = document.getElementById('nav-countdown');
  if (pill) {
    pill.textContent = days > 0
      ? `${days}d until pookie's birthday`
      : `today is pookie's birthday 🤍`;
  }

  // big hero countdown (home page only)
  const d = document.getElementById('cd-days');
  const h = document.getElementById('cd-hours');
  const m = document.getElementById('cd-minutes');
  const s = document.getElementById('cd-seconds');
  if (d) d.textContent = String(days).padStart(2, '0');
  if (h) h.textContent = String(hours).padStart(2, '0');
  if (m) m.textContent = String(minutes).padStart(2, '0');
  if (s) s.textContent = String(seconds).padStart(2, '0');

  // moon phase: shadow shrinks as we approach the birthday (waxing toward full)
  const shadow = document.querySelector('.moon .shadow');
  if (shadow) {
    const totalWindow = 30 * 86400 * 1000; // treat last 30 days as the "waxing" window
    const progress = Math.min(1, Math.max(0, 1 - diff / totalWindow));
    const xOffset = 100 - progress * 100; // 100% covered -> 0% covered
    shadow.style.transform = `translateX(${xOffset}%)`;
  }
}

function spawnFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glyphs = ['🤍', '♡', '💗'];

  function spawnOne() {
    const heart = document.createElement('span');
    heart.className = 'fh';
    heart.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 8;
    const size = 10 + Math.random() * 14;
    const drift = (Math.random() * 80 - 40) + 'px';
    heart.style.left = left + '%';
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = duration + 's';
    heart.style.setProperty('--drift', drift);
    container.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 200);
  }

  for (let i = 0; i < 6; i++) {
    setTimeout(spawnOne, i * 900);
  }
  setInterval(spawnOne, 1600);
}

function highlightNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  highlightNav();
  spawnFloatingHearts();

  // envelope interaction (letter page)
  const envelope = document.getElementById('envelope');
  if (envelope) {
    envelope.addEventListener('click', () => {
      envelope.classList.add('open');
      const paper = document.getElementById('letter-paper');
      if (paper) {
        setTimeout(() => paper.classList.add('show'), 400);
      }
    });
  }

  // hearts interaction (reasons page)
  const hearts = document.querySelectorAll('.heart');
  const reasonText = document.getElementById('reason-text');
  hearts.forEach(heart => {
    heart.addEventListener('click', () => {
      heart.classList.add('opened');
      if (reasonText) reasonText.textContent = heart.dataset.reason;
    });
  });
});
