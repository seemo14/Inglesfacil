// js/main.js
// Main JavaScript for Ingles.Facil123 Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Toggle icon between bars and times
            const icon = mobileMenu.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Scroll-Reveal Animation
    const revealElements = document.querySelectorAll('.feature-card, .sample-card, .resource-card, .testimonial-card');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top + 50;
            if (elementTop < windowHeight) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Add CSS for reveal animations
    const style = document.createElement('style');
    style.textContent = `
        .feature-card, .sample-card, .resource-card, .testimonial-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .feature-card.active, .sample-card.active, .resource-card.active, .testimonial-card.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // --- TRANSLATIONS OBJECT ---
    const translations = {
        navHome:           { en: 'Home',                          es: 'Inicio' },
        navFeatures:       { en: 'Features',                      es: 'Características' },
        navContent:        { en: 'Content',                       es: 'Contenido' },
        navResources:      { en: 'Resources',                     es: 'Recursos' },
        navContact:        { en: 'Contact',                       es: 'Contacto' },
        heroTitle:         { en: 'Learn English the Easy Way',    es: 'Aprende inglés de forma fácil' },
        heroSubtitle:      { en: 'Join our community of 385,000+ Spanish speakers learning English through engaging, practical, and fun content.',
                             es: 'Únete a nuestra comunidad de más de 385,000 hispanohablantes aprendiendo inglés con contenido práctico, divertido y atractivo.' },
        btnGetResources:   { en: 'Get Learning Resources',        es: 'Obtener recursos de aprendizaje' },
        btnFollowInstagram:{ en: 'Follow on Instagram',            es: 'Síguenos en Instagram' }
        // …add more keys as needed
    };

    // --- LANGUAGE SWITCHER ---
    const languageSwitcher = document.getElementById('languageSwitcher');

    function setLanguage(lang) {
      document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[key] && translations[key][lang]) {
          el.textContent = translations[key][lang];
        }
      });
      localStorage.setItem('siteLang', lang);
    }

    languageSwitcher.addEventListener('change', e => {
      setLanguage(e.target.value);
    });

    const savedLang = localStorage.getItem('siteLang') || 'en';
    if (languageSwitcher) {
      languageSwitcher.value = savedLang;
      setLanguage(savedLang);
    }
});
