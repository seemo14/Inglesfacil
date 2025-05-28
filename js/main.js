// Targeted Language Switching JavaScript for Inglés Fácil 123
// This version preserves the original website layout while adding language functionality

// Global variables for language system
let translations = {};
let currentLang = 'es'; // Default to Spanish

// Initialize language system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize language system
    initializeLanguageSystem();
    
    // Initialize other functionality
    initializeOtherFunctionality();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

// Initialize language system
async function initializeLanguageSystem() {
    try {
        console.log('Initializing language system...');
        
        // Load translations
        const enResponse = await fetch('translations_en.json');
        const esResponse = await fetch('translations_es.json');
        
        if (!enResponse.ok || !esResponse.ok) {
            throw new Error('Failed to load translation files');
        }
        
        const enData = await enResponse.json();
        const esData = await esResponse.json();
        
        translations = {
            en: enData.en,
            es: esData.es
        };
        
        console.log('Translations loaded successfully');
        
        // Detect user's preferred language
        detectLanguage();
        
        // Set up language selector
        setupLanguageSelector();
        
        // Initial translation
        translatePage(currentLang);
        
        console.log('Language system initialized with language:', currentLang);
    } catch (error) {
        console.error('Error initializing language system:', error);
    }
}

// Detect user's preferred language
function detectLanguage() {
    // Check localStorage first
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && ['en', 'es'].includes(storedLang)) {
        currentLang = storedLang;
        return;
    }
    
    // Default to Spanish
    currentLang = 'es';
}

// Set up language selector dropdown
function setupLanguageSelector() {
    // Create language selector if it doesn't exist
    if (!document.querySelector('.language-selector')) {
        createLanguageSelector();
    }
    
    // Add click event listeners to language options
    const langOptions = document.querySelectorAll('.lang-option');
    
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const lang = this.getAttribute('data-lang');
            console.log('Language option clicked:', lang);
            
            if (lang && lang !== currentLang) {
                switchLanguage(lang);
            }
        });
    });
    
    // Update current language display
    updateCurrentLanguageDisplay();
}

// Create language selector
function createLanguageSelector() {
    // Create language selector HTML
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks) {
        const langSelector = document.createElement('li');
        langSelector.className = 'language-selector';
        
        langSelector.innerHTML = `
            <div class="current-lang">
                <svg class="flag-svg current-lang-flag" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                    <rect width="60" height="30" fill="#c60b1e"/>
                    <rect width="60" height="15" y="7.5" fill="#ffc400"/>
                </svg>
                <span class="current-lang-text">Español</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="lang-options">
                <div class="lang-option" data-lang="en">
                    <svg class="flag-svg" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                        <rect width="60" height="30" fill="#00247d"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" stroke-width="2"/>
                        <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" stroke-width="10"/>
                        <path d="M30,0 L30,30 M0,15 L60,15" stroke="#cf142b" stroke-width="6"/>
                    </svg>
                    <span>English</span>
                </div>
                <div class="lang-option active" data-lang="es">
                    <svg class="flag-svg" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                        <rect width="60" height="30" fill="#c60b1e"/>
                        <rect width="60" height="15" y="7.5" fill="#ffc400"/>
                    </svg>
                    <span>Español</span>
                </div>
            </div>
        `;
        
        navLinks.appendChild(langSelector);
        
        // Add language selector styles if not already added
        if (!document.getElementById('language-selector-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'language-selector-styles';
            styleEl.textContent = `
                .language-selector {
                    position: relative;
                    margin-left: 1rem;
                    z-index: 100;
                }
                
                .current-lang {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 4px;
                    background-color: rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }
                
                .current-lang:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                
                .flag-svg {
                    width: 24px;
                    height: 16px;
                    margin-right: 0.5rem;
                    border-radius: 2px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }
                
                .current-lang-text {
                    margin-right: 0.5rem;
                    font-weight: 500;
                }
                
                .lang-options {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    display: none;
                    min-width: 120px;
                    margin-top: 5px;
                }
                
                .language-selector:hover .lang-options {
                    display: block;
                }
                
                .lang-option {
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                
                .lang-option:hover {
                    background-color: #f5f5f5;
                }
                
                .lang-option.active {
                    background-color: #f0f0f0;
                    font-weight: 600;
                }
                
                @media (max-width: 768px) {
                    .language-selector {
                        margin-top: 1rem;
                        margin-left: 0;
                    }
                    
                    .current-lang {
                        justify-content: center;
                    }
                }
            `;
            document.head.appendChild(styleEl);
        }
    }
}

// Update current language display
function updateCurrentLanguageDisplay() {
    const currentLangText = document.querySelector('.current-lang-text');
    
    if (currentLangText) {
        // Set the text based on the current language
        if (currentLang === 'en') {
            currentLangText.textContent = 'English';
        } else {
            currentLangText.textContent = 'Español';
        }
    }
    
    // Update active state in dropdown
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
}

// Switch language
function switchLanguage(lang) {
    if (lang === currentLang) return;
    
    console.log('Switching language from', currentLang, 'to', lang);
    
    // Update current language
    currentLang = lang;
    
    // Store user preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update language display
    updateCurrentLanguageDisplay();
    
    // Translate page content
    translatePage(lang);
    
    console.log('Language switched to:', lang);
}

// Translate page content
function translatePage(lang) {
    console.log('Translating page to:', lang);
    
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        translateElement(element, key, lang);
    });
    
    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            element.setAttribute('placeholder', translation);
        }
    });
    
    console.log('Page translation complete');
}

// Translate a specific element
function translateElement(element, key, lang) {
    if (!key || !translations[lang]) return;
    
    const translation = getNestedTranslation(translations[lang], key);
    if (translation) {
        element.textContent = translation;
    }
}

// Get nested translation using dot notation
function getNestedTranslation(obj, path) {
    if (!obj || !path) return null;
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

// Initialize other functionality
function initializeOtherFunctionality() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add logo enhancement
function enhanceLogo() {
    const logo = document.querySelector('.logo');
    if (logo) {
        // Check if logo image exists
        if (!logo.querySelector('img')) {
            // Create logo image element
            const logoImg = document.createElement('img');
            logoImg.src = 'images/logo_ing_transparent.png';
            logoImg.alt = 'Inglés Fácil 123 Logo';
            logoImg.className = 'logo-img';
            
            // Insert before the h1
            const logoTitle = logo.querySelector('h1');
            if (logoTitle) {
                logo.insertBefore(logoImg, logoTitle);
            }
        }
        
        // Add logo styles if not already added
        if (!document.getElementById('logo-enhancement-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'logo-enhancement-styles';
            styleEl.textContent = `
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .logo img {
                    height: 40px;
                    width: auto;
                    transition: transform 0.3s ease;
                }
                
                .logo:hover img {
                    transform: scale(1.05);
                }
                
                @media (max-width: 768px) {
                    .logo img {
                        height: 32px;
                    }
                }
            `;
            document.head.appendChild(styleEl);
        }
    }
}

// Call logo enhancement after DOM is loaded
document.addEventListener('DOMContentLoaded', enhanceLogo);
