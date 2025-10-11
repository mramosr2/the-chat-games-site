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

// --- Hero typing effect: steady, visible caret, start after hero reveal ---
(() => {
  const group = document.querySelector('[data-typing="hero"]');
  if (!group) return;

  const titleEl = document.getElementById('tgTitleText');
  const sloganEl = document.getElementById('tgSloganText');
  const afterEls = group.querySelectorAll('.after-typing');

  const typeText = (el, text, intervalMs) => new Promise(resolve => {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
      } else {
        clearInterval(timer);
        el.classList.add('done'); // hide caret after done
        resolve();
      }
    }, intervalMs);
  });

  const startTyping = () => {
    const tText = titleEl?.getAttribute('data-text') || 'The Chat Games';
    const sText = sloganEl?.getAttribute('data-text') || 'Let the Chat Games Begin';
    typeText(titleEl, tText, 170)
      .then(() => typeText(sloganEl, sText, 150))
      .then(() => {
        afterEls.forEach(el => {
          el.style.transition = 'opacity .6s ease, transform .6s ease';
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'none';
          });
        });
      });
  };

  const beginWhenVisible = () => {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            // Wait a beat for the card's fade-slide transition to finish
            setTimeout(startTyping, 400);
            io.disconnect();
          }
        });
      }, { threshold: 0.2 });
      io.observe(group);
    } else {
      startTyping();
    }
  };

  beginWhenVisible();
})();
