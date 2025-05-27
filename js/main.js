// main.js
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks   = document.querySelector('.nav-links');
  mobileMenu?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.querySelector('i').classList.toggle('fa-bars');
    mobileMenu.querySelector('i').classList.toggle('fa-times');
  });

  // Scroll-reveal
  const revealEls = document.querySelectorAll('.feature-card, .sample-card, .resource-card, .testimonial-card');
  function reveal() {
    const h = window.innerHeight;
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top + 50 < h) el.classList.add('active');
    });
  }
  window.addEventListener('scroll', reveal);
  reveal();

  // Inject reveal CSS
  const style = document.createElement('style');
  style.textContent = `
    .feature-card, .sample-card, .resource-card, .testimonial-card {
      opacity: 0; transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .feature-card.active, .sample-card.active, .resource-card.active, .testimonial-card.active {
      opacity: 1; transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // TRANSLATIONS
  const translations = {
    navHome:        { en:'Home',                         es:'Inicio' },
    navFeatures:    { en:'Features',                     es:'Características' },
    navContent:     { en:'Content',                      es:'Contenido' },
    navResources:   { en:'Resources',                    es:'Recursos' },
    navContact:     { en:'Contact',                      es:'Contacto' },
    heroTitle:      { en:'Learn English the Easy Way',   es:'Aprende inglés de forma fácil' },
    heroSubtitle:   { en:'Join our community of 385,000+ Spanish speakers learning English through engaging, practical, and fun content.',
                      es:'Únete a nuestra comunidad de más de 385,000 hispanohablantes aprendiendo inglés con contenido práctico, divertido y atractivo.' },
    btnGetResources:{ en:'Get Learning Resources',       es:'Obtener recursos de aprendizaje' },
    btnFollowInstagram:{ en:'Follow on Instagram',       es:'Síguenos en Instagram' },

    contactHeader:      { en:'Get in Touch',              es:'Ponte en contacto' },
    contactNamePlaceholder:{ en:'Your Name',              es:'Tu nombre' },
    contactEmailPlaceholder:{ en:'Your Email',            es:'Tu correo electrónico' },
    contactTopicOption: { en:'Select Topic',              es:'Selecciona un tema' },
    contactPartnership: { en:'Business Partnership',       es:'Colaboración empresarial' },
    contactSponsorship: { en:'Sponsorship',               es:'Patrocinio' },
    contactResources:   { en:'Learning Resources',         es:'Recursos de aprendizaje' },
    contactOther:       { en:'Other',                     es:'Otro' },
    contactMessagePlaceholder:{ en:'Your Message',        es:'Tu mensaje' },
    contactSend:        { en:'Send Message',              es:'Enviar mensaje' },

    footerBottom:       { en:'© 2025 Inglés Fácil 123. All Rights Reserved.',
                          es:'© 2025 Inglés Fácil 123. Todos los derechos reservados.' }
  };

  // LANGUAGE SWITCH
  const btnEn = document.getElementById('btnEn');
  const btnEs = document.getElementById('btnEs');

  function setActive(lang) {
    if (lang==='en') {
      btnEn.classList.add('active'); btnEs.classList.remove('active');
    } else {
      btnEs.classList.add('active'); btnEn.classList.remove('active');
    }
  }

  function setLanguage(lang) {
    // text nodes
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (translations[key]?.[lang]) el.textContent = translations[key][lang];
    });
    // placeholders
    document.querySelectorAll('[data-key-placeholder]').forEach(el => {
      const key = el.getAttribute('data-key-placeholder');
      if (translations[key]?.[lang]) el.placeholder = translations[key][lang];
    });
    localStorage.setItem('siteLang', lang);
    setActive(lang);
  }

  btnEn.addEventListener('click', () => setLanguage('en'));
  btnEs.addEventListener('click', () => setLanguage('es'));

  // init
  const saved = localStorage.getItem('siteLang') || 'en';
  setLanguage(saved);
});
