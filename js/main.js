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

// --- RSVP: event-driven date options ---
(function () {
  const EVENT_DATES = {
    CSUN: [
      { label: 'November 5th, 2025', value: 'November 5th, 2025' },
      { label: 'November 19th, 2025', value: 'November 19th, 2025' }
    ],
    CSULA: [
      { label: 'November 20th, 2025', value: 'November 20th, 2025' }
    ]
  };

  const modal = document.getElementById('signupModal');
  if (!modal) return;

  const form = modal.querySelector('#signupForm');
  const eventInput = form.querySelector('#event');
  const dateSelect  = form.querySelector('#eventDate');
  const submitBtn   = form.querySelector('#signupSubmit');

  function normalizeCampus(str) {
    if (!str) return '';
    const s = String(str).trim().toUpperCase();
    // accept common variations
    if (s.startsWith('CSUN')) return 'CSUN';
    if (s.startsWith('CSULA') || s.includes('LA')) return 'CSULA';
    return s;
  }

  function populateDates(campus) {
    const key = normalizeCampus(campus);
    const options = EVENT_DATES[key];

    dateSelect.innerHTML = '';
    if (!options) {
      dateSelect.disabled = true;
      dateSelect.innerHTML = `<option value="" selected>Select an event first</option>`;
      return;
    }
    // build options
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a date…';
    placeholder.selected = true;
    placeholder.disabled = true;
    dateSelect.appendChild(placeholder);

    options.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      dateSelect.appendChild(opt);
    });

    dateSelect.disabled = false;
  }

  // When the modal opens from a button, use its data-event to set campus & dates.
  modal.addEventListener('show.bs.modal', (ev) => {
    const trigger = ev.relatedTarget;
    if (trigger && trigger.dataset && trigger.dataset.event) {
      eventInput.value = trigger.dataset.event;
    }
    populateDates(eventInput.value);
    // reset selection each time modal opens
    if (!dateSelect.disabled) dateSelect.value = '';
    submitBtn.disabled = true;
  });

  // If the user types/edits the campus manually, update dates live.
  eventInput.addEventListener('input', () => {
    populateDates(eventInput.value);
    if (!dateSelect.disabled) dateSelect.value = '';
  });

  // Basic enable/disable of submit based on required fields
  form.addEventListener('input', () => {
    const valid = form.checkValidity();
    submitBtn.disabled = !valid;
  });
})();
