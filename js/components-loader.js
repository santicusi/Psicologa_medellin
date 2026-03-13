/* ============================================
   COMPONENTS LOADER — Inyección modular
   Carga navbar, footer, WhatsApp float, mapa, info
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const componentes = [
    { id: 'navbar-placeholder',         archivo: 'components/navbar.html' },
    { id: 'footer-placeholder',         archivo: 'components/footer.html' },
    { id: 'whatsapp-float-placeholder', archivo: 'components/whatsapp-float.html' },
    { id: 'mapa-placeholder',           archivo: 'components/mapa-section.html' },
    { id: 'info-placeholder',           archivo: 'components/info-section.html' }
  ];

  componentes.forEach(({ id, archivo }) => {
    const slot = document.getElementById(id);
    if (slot) {
      fetch(archivo)
        .then(res => {
          if (!res.ok) throw new Error(`No se pudo cargar ${archivo}`);
          return res.text();
        })
        .then(html => {
          slot.innerHTML = html;
          /* Si es el navbar, inicializar menú mobile */
          if (id === 'navbar-placeholder') initNavbar();
          /* Si es whatsapp float, inicializar animación */
          if (id === 'whatsapp-float-placeholder') initWhatsAppFloat();
        })
        .catch(err => console.warn(err.message));
    }
  });

  /* Observador para animaciones fade-in */
  initFadeIn();
});

/* ---------- Navbar Mobile Toggle ---------- */
function initNavbar() {
  const toggler = document.querySelector('.navbar__toggler');
  const menu    = document.querySelector('.navbar__menu');
  const overlay = document.querySelector('.navbar__overlay');

  if (!toggler || !menu) return;

  toggler.addEventListener('click', () => {
    menu.classList.toggle('navbar__menu--open');
    toggler.classList.toggle('navbar__toggler--active');
    if (overlay) overlay.classList.toggle('navbar__overlay--visible');
    document.body.style.overflow = menu.classList.contains('navbar__menu--open') ? 'hidden' : '';
  });

  /* Cerrar menú al hacer clic en un enlace */
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('navbar__menu--open');
      toggler.classList.remove('navbar__toggler--active');
      if (overlay) overlay.classList.remove('navbar__overlay--visible');
      document.body.style.overflow = '';
    });
  });

  /* Cerrar menú al hacer clic en overlay */
  if (overlay) {
    overlay.addEventListener('click', () => {
      menu.classList.remove('navbar__menu--open');
      toggler.classList.remove('navbar__toggler--active');
      overlay.classList.remove('navbar__overlay--visible');
      document.body.style.overflow = '';
    });
  }

  /* Dropdown en móvil */
  document.querySelectorAll('.navbar__dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('navbar__item--dropdown-open');
      }
    });
  });

  /* Navbar scroll effect */
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
      nav.classList.toggle('navbar--scrolled', window.scrollY > 60);
    }
  });
}

/* ---------- WhatsApp Float Pulse ---------- */
function initWhatsAppFloat() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;
  /* Mostrar con delay */
  setTimeout(() => {
    btn.classList.add('whatsapp-float--visible');
  }, 1500);
}

/* ---------- Intersection Observer para fade-in ---------- */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}
