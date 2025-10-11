document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('is-loading');

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const revealables = document.querySelectorAll('.fade-slide');
  if (revealables.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealables.forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.fade-slide').forEach(el => el.classList.add('show'));
  }

  const page = document.body.getAttribute('data-page');
  if (page) {
    const map = { home: 'index.html', about: 'about.html', games: 'games.html', faq: 'faq.html' };
    const current = map[page];
    document.querySelectorAll('.navbar .nav-link').forEach(a => {
      if (a.getAttribute('href') === current) a.classList.add('active');
    });
  }

  const eventInput = document.getElementById('event');
  document.querySelectorAll('[data-event]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (eventInput) eventInput.value = btn.getAttribute('data-event');
    });
  });
});
