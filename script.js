const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileBooking = document.querySelector('.mobile-booking');
const stringDot = document.querySelector('.string-line span');

// Load the refinement layer separately so the original prototype stays easy to maintain.
const refinementStyles = document.createElement('link');
refinementStyles.rel = 'stylesheet';
refinementStyles.href = 'enhancements.css';
document.head.appendChild(refinementStyles);

// Reusable Luča mark: an abstract L/string + bow orbit with a warm accent point.
const logoMarkup = (className = 'luca-logo-mark') => `
  <span class="${className}" aria-hidden="true">
    <svg viewBox="0 0 48 48" focusable="false">
      <path class="logo-stroke" d="M18 8v26c0 4 2.6 6 6.7 6H35" />
      <path class="logo-stroke" d="M15 15c4.5-4.8 10.8-7 17.2-5.8" />
      <path class="logo-stroke" d="M20.5 31.5c6.8-1.1 12.1-5.6 14.5-12.5" />
      <ellipse class="logo-orbit" cx="24" cy="24" rx="18" ry="9.5" transform="rotate(-32 24 24)" />
      <circle class="logo-accent" cx="35.2" cy="12.7" r="2.2" />
    </svg>
  </span>`;

// Animated identity in the header and a larger mark in the hero.
const brand = document.querySelector('.brand');
if (brand) {
  brand.innerHTML = `${logoMarkup()}<span class="brand-word">Luča</span>`;
}

const heroTitle = document.querySelector('#hero-title');
if (heroTitle && !document.querySelector('.hero-logo-mark')) {
  heroTitle.insertAdjacentHTML('beforebegin', logoMarkup('hero-logo-mark'));
}

// Consistent, optically centered labels + bespoke line icons.
const icons = {
  play: `<svg viewBox="0 0 24 24"><path class="fill" d="M9 7.3 17 12l-8 4.7z"/></svg>`,
  booking: `<svg viewBox="0 0 24 24"><path d="M7 4v3M17 4v3M5 9h14M6.5 6h11A1.5 1.5 0 0 1 19 7.5v10A1.5 1.5 0 0 1 17.5 19h-11A1.5 1.5 0 0 1 5 17.5v-10A1.5 1.5 0 0 1 6.5 6Z"/><path d="m9.5 14 1.6 1.6 3.5-3.7"/></svg>`,
  send: `<svg viewBox="0 0 24 24"><path d="M4.5 12h14M14 7.5 18.5 12 14 16.5"/></svg>`
};

const styleButton = (element, label, icon) => {
  if (!element) return;
  element.innerHTML = `<span class="btn-label">${label}</span><span class="btn-icon" aria-hidden="true">${icon}</span>`;
};

styleButton(document.querySelector('.hero-actions .btn--light'), 'Poslušajte', icons.play);
styleButton(document.querySelector('.hero-actions .btn--ghost'), 'Booking', icons.booking);
styleButton(document.querySelector('#booking-form button[type="submit"]'), 'Pošaljite upit', icons.send);
styleButton(mobileBooking, 'Booking', icons.booking);

// Header + subtle string motion tied to scroll.
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);

  if (stringDot) {
    const progress = y / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    stringDot.style.top = `${Math.min(90, Math.max(10, 10 + progress * 80))}%`;
    const vibration = Math.sin(y * 0.045) * 3;
    stringDot.style.marginLeft = `${vibration}px`;
  }

  if (mobileBooking) {
    const contact = document.querySelector('#kontakt');
    const rect = contact.getBoundingClientRect();
    mobileBooking.classList.toggle('hidden', rect.top < innerHeight * .65);
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile navigation.
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  mobileMenu.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

// Intersection-based reveal animations.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
  observer.observe(el);
});

// Hero elements should appear immediately.
requestAnimationFrame(() => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'));
});

// Repertoire hover preview.
const preview = document.querySelector('.rep-preview');
const previewImage = document.querySelector('.rep-preview-image');
const previewLabel = document.querySelector('.rep-preview-label');

document.querySelectorAll('.rep-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    if (!preview) return;
    const which = row.dataset.image;
    previewImage.style.backgroundImage = `url('assets/${which}.jpg')`;
    previewLabel.textContent = row.dataset.preview;
    preview.classList.add('active');
  });
  row.addEventListener('mouseleave', () => preview?.classList.remove('active'));
});

// YouTube video modal. The iframe is injected only when a video is opened,
// which keeps the initial page lighter and stops playback when the modal closes.
const modal = document.querySelector('#video-modal');
const modalTitle = document.querySelector('#modal-title');
const modalSubtitle = document.querySelector('#modal-subtitle');
const youtubePlayer = document.querySelector('#youtube-player');
const youtubeLink = document.querySelector('#youtube-link');

const closeVideoModal = () => {
  if (!modal.open) return;
  modal.close();
  youtubePlayer.src = '';
  modal.classList.remove('is-portrait');
};

document.querySelectorAll('.video-card').forEach((card) => {
  card.addEventListener('click', () => {
    const videoId = card.dataset.youtube;
    if (!videoId) return;

    modalTitle.textContent = card.dataset.title || 'Luča';
    modalSubtitle.textContent = card.dataset.subtitle || 'Vanja & Duća';
    youtubeLink.href = card.dataset.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;
    modal.classList.toggle('is-portrait', card.dataset.orientation === 'portrait');
    youtubePlayer.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    modal.showModal();
  });
});

document.querySelector('.modal-close').addEventListener('click', closeVideoModal);
modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeVideoModal();
});
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeVideoModal();
});

// Demo form behaviour. No data leaves the browser.
const bookingForm = document.querySelector('#booking-form');
bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = bookingForm.querySelector('.form-status');
  const submit = bookingForm.querySelector('button[type="submit"]');
  status.textContent = 'Demo forma radi. Kada dobijemo pravi email/backend, povezujemo slanje upita.';
  styleButton(submit, 'Upit spreman ✓', icons.send);
  setTimeout(() => {
    styleButton(submit, 'Pošaljite upit', icons.send);
  }, 3000);
});

document.querySelector('#year').textContent = new Date().getFullYear();
