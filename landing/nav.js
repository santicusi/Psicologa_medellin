/* ============================================================
   nav.js — Dra. Nataly Cano | Navegación + WhatsApp Tracking
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL ──────────────────────────────────────── */
  const nav = document.getElementById('mainNav');
  const scrollHandler = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();

/* ── MOBILE MENU ─────────────────────────────────────── */
  const hamburger   = document.getElementById('navHamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function openMobile() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileClose.focus(); // accesibilidad: foco al botón cerrar
  }

  function closeMobile() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.focus(); // devuelve el foco al hamburger
  }

  if (hamburger) hamburger.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);

  // Cierra al hacer clic en cualquier link del menú
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobile);
    });

    // Cierra si se presiona Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobile();
      }
    });
  }

  /* ── REVEAL ON SCROLL ────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ── WHATSAPP TRACKING ───────────────────────────────── */
  const WSP_NUMBER = '573242901411';
  const WSP_MSG_DEFAULT = encodeURIComponent(
    'Hola Dra. Nataly, me gustaría agendar una consulta psicológica en Medellín. ¿Cuándo hay disponibilidad?'
  );

  function buildWspUrl(msg) {
    const m = msg ? encodeURIComponent(msg) : WSP_MSG_DEFAULT;
    return `https://wa.me/${WSP_NUMBER}?text=${m}`;
  }

  function fireConversion(label) {
    // Google Ads conversion
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-XXXXXXXX/' + label,
      });
    }
    // GA4 event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', {
        event_category: 'contacto',
        event_label: label,
      });
    }
  }

  // Attach to all WhatsApp CTA buttons
  document.querySelectorAll('[data-wsp]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const label = el.getAttribute('data-wsp-label') || 'general';
      const msg   = el.getAttribute('data-wsp-msg')   || null;
      fireConversion(label);
      setTimeout(() => {
        window.open(buildWspUrl(msg), '_blank');
      }, 200);
    });
  });

  /* ── FLOATING BUTTON ─────────────────────────────────── */
  const floatBtn = document.getElementById('wspFloat');
  if (floatBtn) {
    floatBtn.addEventListener('click', () => {
      fireConversion('boton_flotante');
      window.open(buildWspUrl(null), '_blank');
    });
  }

});
