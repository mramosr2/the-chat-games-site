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


// Contact modal: validate + send via Formspree (no Mail app)
(() => {
  const modal  = document.getElementById('contactModal');
  if (!modal) return;

  const form   = modal.querySelector('#contactForm');
  const email  = modal.querySelector('#contactEmail');
  const subj   = modal.querySelector('#contactSubject');
  const msg    = modal.querySelector('#contactMessage');
  const submit = modal.querySelector('#contactSubmit');
  const errors = modal.querySelector('#contactErrors');
  const okBox  = modal.querySelector('#contactSuccess');
  const fields = [email, subj, msg];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showErr = (txt) => { errors.textContent = txt; errors.classList.remove('d-none'); };
  const clearErr = () => { errors.textContent = ''; errors.classList.add('d-none'); };
  const showOk = (txt) => { okBox.textContent = txt; okBox.classList.remove('d-none'); };
  const clearOk = () => { okBox.textContent = ''; okBox.classList.add('d-none'); };

  const validate = () => {
    const errs = [];
    const e = (email.value || '').trim();
    const s = (subj.value || '').trim();
    const m = (msg.value || '').trim();

    if (!e || !emailPattern.test(e)) { email.setCustomValidity('invalid'); errs.push('Enter a valid email address.'); } else email.setCustomValidity('');
    if (s.length < 5) { subj.setCustomValidity('short'); errs.push('Subject must be at least 5 characters.'); } else subj.setCustomValidity('');
    if (m.length < 5) { msg.setCustomValidity('short'); errs.push('Message must be at least 5 characters.'); } else msg.setCustomValidity('');

    if (errs.length) { submit.disabled = true; showErr(`Please fix the following: ${errs.join(' ')}`); }
    else { submit.disabled = false; clearErr(); }

    return errs.length === 0;
  };

  fields.forEach(el => {
    el.addEventListener('input', () => {
      if (el !== email) el.value = el.value.replace(/^\s+/, '');
      validate();
      if (form.classList.contains('was-validated')) form.checkValidity();
    });
    el.addEventListener('blur', validate);
  });

  modal.addEventListener('shown.bs.modal', () => {
    form.reset();
    form.classList.remove('was-validated');
    submit.disabled = true;
    clearErr(); clearOk();
    email.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearOk();
    const valid = validate();
    if (!valid) { form.classList.add('was-validated'); return; }

    submit.disabled = true;
    const original = submit.textContent;
    submit.textContent = 'Sending…';

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      showOk('Thanks! Your message was sent. We’ll get back to you soon.');
      form.reset();
      form.classList.remove('was-validated');
      setTimeout(() => { bootstrap.Modal.getInstance(modal)?.hide(); clearOk(); }, 1600);
    } catch (err) {
      showErr('Sorry, something went wrong sending your message. Please try again in a moment.');
      submit.disabled = false;
    } finally {
      submit.textContent = original;
    }
  });
})();


// Sequential fade (1s per item)
function initSequentialFades() {
  const groups = document.querySelectorAll('.fade-seq');
  if (!groups.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const group = entry.target;
      const items = Array.from(group.querySelectorAll(':scope .fade-slide'));

      items.forEach((el, i) => {
        const delaySec = i; // 1 second per item
        el.style.transitionDelay = `${delaySec}s`;
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => { el.style.transitionDelay = ''; }, (delaySec + 1) * 1000 + 50);
      });

      obs.unobserve(group);
    });
  }, { threshold: 0.2 });

  groups.forEach(g => io.observe(g));
}

document.addEventListener('DOMContentLoaded', () => {
  initSequentialFades();
});


document.addEventListener('DOMContentLoaded', () => {
  const v = document.getElementById('demoVideo');
  if (v && v.textTracks && v.textTracks[0]) v.textTracks[0].mode = 'showing';
});

// RSVP modal: validate + send to Formspree
(() => {
  const modal  = document.getElementById('signupModal');
  if (!modal) return;

  const form   = document.getElementById('signupForm');
  const nameEl = form.querySelector('#name');
  const email  = form.querySelector('#email');
  const eventI = form.querySelector('#event');
  const submit = form.querySelector('#signupSubmit');
  const errors = form.querySelector('#signupErrors');
  const okBox  = form.querySelector('#signupSuccess');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const showErr = (t) => { errors.textContent = t; errors.classList.remove('d-none'); };
  const clearErr = () => { errors.textContent=''; errors.classList.add('d-none'); };
  const showOk = (t) => { okBox.textContent = t; okBox.classList.remove('d-none'); };
  const clearOk = () => { okBox.textContent=''; okBox.classList.add('d-none'); };

  const validate = () => {
    let ok = true;
    if ((nameEl.value||'').trim().length < 2) { nameEl.setCustomValidity('x'); ok = false; } else nameEl.setCustomValidity('');
    if (!emailPattern.test((email.value||'').trim())) { email.setCustomValidity('x'); ok = false; } else email.setCustomValidity('');
    if ((eventI.value||'').trim().length < 2) { eventI.setCustomValidity('x'); ok = false; } else eventI.setCustomValidity('');
    submit.disabled = !ok;
    if (ok) clearErr();
    return ok;
  };

  [nameEl, email, eventI].forEach(el => {
    el.addEventListener('input', () => { if (el !== email) el.value = el.value.replace(/^\s+/, ''); validate(); });
    el.addEventListener('blur', validate);
  });

  modal.addEventListener('shown.bs.modal', () => {
    form.classList.remove('was-validated');
    submit.disabled = true;
    clearErr(); clearOk();
    nameEl.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) { form.classList.add('was-validated'); return; }

    const original = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    clearErr(); clearOk();

    try {
      const fd = new FormData(form);
      fd.set('_subject', `New RSVP — ${eventI.value.trim()} — ${nameEl.value.trim()}`);
      fd.set('_replyto', (email.value||'').trim());

      const res = await fetch(form.action, { method:'POST', headers:{'Accept':'application/json'}, body: fd });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      showOk('Thanks! You’re on the list. We’ll email details soon.');
      form.reset();
      form.classList.remove('was-validated');
      setTimeout(() => { bootstrap.Modal.getInstance(modal)?.hide(); clearOk(); }, 1400);
    } catch (err) {
      showErr('Sorry, we couldn’t submit your RSVP. Please try again in a moment.');
      submit.disabled = false;
    } finally {
      submit.textContent = original;
    }
  });
})();
