// Main JavaScript for Inglés Fácil con Ana Website

// Global variables for language system
let translations = {};
let currentLang = 'es'; // Default to Spanish

// Main DOM Content Loaded listener
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu') && !event.target.closest('.nav-links')) {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Allow default behavior for non-anchor links or placeholder '#'
            if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;
            
            e.preventDefault(); // Prevent default only for valid internal anchors
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize language system first, then other components
    initializeLanguageSystem().then(() => {
        // Initialize components that depend on translations being loaded
        initializeModals(); 
        initializeQuiz();
        initializeContactForm();
        initializeScrollAnimations(); // Initialize after language system to ensure elements exist
        initializeClickableCards(); // Initialize after language system
        updateResourceLinks(); // Update resource links initially
    }).catch(error => {
        console.error("Failed to initialize language system or dependent components:", error);
        // Attempt to initialize non-language dependent features anyway
        initializeQuiz();
        initializeContactForm();
        initializeScrollAnimations();
        initializeClickableCards();
        updateResourceLinks();
    });
});

// Initialize language system
async function initializeLanguageSystem() {
    try {
        const enResponse = await fetch('translations_en.json');
        const esResponse = await fetch('translations_es.json');
        
        if (!enResponse.ok || !esResponse.ok) {
            throw new Error(`HTTP error! status: ${enResponse.status}, ${esResponse.status}`);
        }

        const enData = await enResponse.json();
        const esData = await esResponse.json();
        
        translations = {
            en: enData,
            es: esData
        };
        
        detectLanguage();
        setupLanguageSelector();
        await translatePage(currentLang); // Ensure translation completes before resolving
        console.log('Language system initialized successfully');
    } catch (error) {
        console.error('Error initializing language system:', error);
        // Fallback can be added here if needed, or just let it fail gracefully
        throw error; // Re-throw error to be caught by the caller
    }
}

// Detect user's preferred language
function detectLanguage() {
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && ['en', 'es'].includes(storedLang)) {
        currentLang = storedLang;
        return;
    }
    const browserLang = navigator.language.split('-')[0];
    currentLang = (browserLang === 'en') ? 'en' : 'es';
}

// Set up language selector dropdown
function setupLanguageSelector() {
    const languageSelector = document.querySelector('.language-selector');
    if (!languageSelector) return;

    updateCurrentLanguageDisplay();
    
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
            // Close dropdown after selection (optional)
            const dropdown = languageSelector.querySelector('.lang-options');
            if (dropdown) {
                 dropdown.style.display = 'none';
                 setTimeout(() => { dropdown.style.display = ''; }, 100); // Reset display property after a short delay
            }
        });
    });
}

// Update current language display in the selector
function updateCurrentLanguageDisplay() {
    const currentLangText = document.querySelector('.current-lang-text');
    const currentLangFlag = document.querySelector('.current-lang-flag');
    const langOptions = document.querySelectorAll('.lang-option');

    if (currentLangText) {
        currentLangText.textContent = translations[currentLang]?.language?.[currentLang] || (currentLang === 'en' ? 'English' : 'Español');
        currentLangText.setAttribute('data-i18n', `language.${currentLang}`);
    }

    if (currentLangFlag) {
        // Update the SVG content for the current flag
        const flagSvgContent = getFlagSvg(currentLang);
        if (flagSvgContent) {
            currentLangFlag.innerHTML = flagSvgContent;
        }
    }

    // Update active state in dropdown
    langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Helper function to get SVG content for flags
function getFlagSvg(lang) {
    if (lang === 'en') {
        return `<rect width="60" height="30" fill="#00247d"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" stroke-width="2"/><path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" stroke-width="10"/><path d="M30,0 L30,30 M0,15 L60,15" stroke="#cf142b" stroke-width="6"/>`;
    } else if (lang === 'es') {
        return `<rect width="60" height="30" fill="#c60b1e"/><rect width="60" height="15" y="7.5" fill="#ffc400"/>`;
    }
    return ''; // Return empty string for unknown languages
}

// Switch language
function switchLanguage(lang) {
    if (lang === currentLang || !['en', 'es'].includes(lang)) return;
    
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Add visual feedback during translation
    document.body.classList.add('translating');
    
    translatePage(currentLang).then(() => {
        updateCurrentLanguageDisplay();
        // Re-initialize components that might need re-translation or depend on language
        initializeQuiz(); // Re-initialize quiz to update button texts etc.
        initializeContactForm(); // Update placeholders
        // Re-translate any open modals
        const openModalElement = document.querySelector(".modal[style*='display: block']");
        if (openModalElement) {
            translateElement(openModalElement, lang);
        }
        document.body.classList.remove('translating');
        console.log(`Language switched to ${lang}`);
    }).catch(error => {
        console.error("Error during language switch translation:", error);
        document.body.classList.remove('translating');
    });
}

// Translate a specific element and its children
function translateElement(element, lang) {
    element.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key, lang);
        if (translation !== key) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else if (el.tagName === 'TITLE') {
                document.title = translation;
            } else {
                el.innerHTML = translation;
            }
        } else {
            console.warn(`Translation key not found: ${key} for language ${lang}`);
        }
    });
    // Also translate the element itself if it has data-i18n
    if (element.hasAttribute('data-i18n')) {
         const key = element.getAttribute('data-i18n');
         const translation = getTranslation(key, lang);
         if (translation !== key) {
             if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                 element.placeholder = translation;
             } else if (element.tagName === 'TITLE') {
                 document.title = translation;
             } else {
                 element.innerHTML = translation;
             }
         } else {
             console.warn(`Translation key not found: ${key} for language ${lang}`);
         }
    }
}

// Translate page content
async function translatePage(lang) {
    if (!translations[lang]) {
        console.error(`Translations not available for language: ${lang}`);
        return;
    }
    translateElement(document.body, lang); // Translate the whole body
    // Update elements that might not use data-i18n, like quiz participant count text
    updateDynamicText(lang);
    // Update resource links (they don't change language, but good practice)
    updateResourceLinks();
}

// Get translation from nested key
function getTranslation(key, lang) {
    const keys = key.split('.');
    let result = translations[lang];
    
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            // Return the key itself if not found, making it obvious in the UI
            return key; 
        }
    }
    
    // Handle escaped newlines for descriptions
    if (typeof result === 'string') {
        result = result.replace(/\n/g, '<br>');
    }
    
    return result || key; // Return key if result is null or empty string
}

// Update dynamic text elements not covered by data-i18n
function updateDynamicText(lang) {
    const participantSpan = document.getElementById('participant-count');
    if (participantSpan) {
        const count = participantSpan.textContent; // Keep the number
        const textKey = 'quiz.participants';
        const translatedText = getTranslation(textKey, lang);
        // Reconstruct the string if translation found
        if (translatedText !== textKey && participantSpan.nextSibling) {
             participantSpan.nextSibling.textContent = ` ${translatedText}`; 
        }
    }
    // Add other dynamic text updates here if needed
}

// Update resource links to point to actual files
function updateResourceLinks() {
    const resourceSection = document.getElementById('resources');
    if (!resourceSection) return;

    const links = {
        'resources.travel_guide.button': 'resources/travel_english_guide.pdf',
        'resources.movie_collection.button': 'resources/movie_english_collection.pdf',
        'resources.pronunciation_workbook.button': 'resources/pronunciation_workbook.pdf'
    };

    Object.keys(links).forEach(key => {
        const button = resourceSection.querySelector(`[data-i18n="${key}"]`);
        if (button && button.tagName === 'A') {
            button.href = links[key];
            button.setAttribute('download', links[key].split('/').pop()); // Add download attribute
            button.removeAttribute('target'); // Remove target=_blank if it exists
        }
    });
}

// --- Modal Functionality ---
function initializeModals() {
    const modalBtns = document.querySelectorAll(".open-modal-btn");
    const modals = document.querySelectorAll(".modal");
    const closeBtns = document.querySelectorAll(".close-btn");

    modalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal-target");
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal if background is clicked
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const openModalElement = document.querySelector(".modal[style*='display: block']");
            if (openModalElement) {
                closeModal(openModalElement);
            }
        }
    });
}

function openModal(modal) {
    modal.style.display = "block";
    // Trigger translation for the newly displayed modal content
    translateElement(modal, currentLang);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal(modal) {
    modal.classList.add('closing');
    // Wait for animation to finish before hiding
    modal.addEventListener('animationend', () => {
        modal.style.display = "none";
        modal.classList.remove('closing');
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }, { once: true });
}
// --- End Modal Functionality ---


// --- Scroll Animation Functionality ---
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section, .feature-card, .sample-card, .info-button, .resource-card, .social-platform'); // Add more selectors as needed

    if (!("IntersectionObserver" in window)) {
        console.log("IntersectionObserver not supported, scroll animations disabled.");
        animatedElements.forEach(el => el.classList.add('is-visible')); // Make all visible if no observer
        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            } else {
                 // Optional: Remove class if you want animation to repeat on scroll up/down
                 // entry.target.classList.remove('is-visible');
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll'); // Ensure base class is present for initial state
        observer.observe(el);
    });
}
// --- End Scroll Animation Functionality ---


// --- Clickable Cards Functionality ---
function initializeClickableCards() {
    const clickableCards = document.querySelectorAll('.sample-card, .resource-card, .info-button'); // Add other card selectors if needed

    clickableCards.forEach(card => {
        const link = card.querySelector('a.btn, button.btn'); // Find the button or link inside
        if (link) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (event) => {
                // Prevent triggering card click if the button itself or an inner link was clicked
                if (event.target.closest('a, button')) {
                    return;
                }
                link.click(); // Simulate a click on the button/link
            });
        }
    });
}
// --- End Clickable Cards Functionality ---


// --- Quiz Functionality (Enhanced) ---
function initializeQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;

    const startBtn = document.getElementById('start-quiz');
    const quizIntro = quizContainer.querySelector('.quiz-intro');
    const quizQuestionsContainer = quizContainer.querySelector('.quiz-questions');
    const quizResultsContainer = quizContainer.querySelector('.quiz-results');
    const questions = quizContainer.querySelectorAll('.question');
    const progressBarFill = quizContainer.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('current-question');
    const participantCountSpan = document.getElementById('participant-count');

    let currentQuestionIndex = 0;
    let score = 0;
    let participantNumber = parseInt(participantCountSpan?.textContent || '110', 10);

    // Reset quiz state
    quizIntro?.classList.add('active');
    quizQuestionsContainer?.classList.remove('active');
    quizResultsContainer?.classList.remove('active');
    questions.forEach(q => q.classList.remove('active'));
    currentQuestionIndex = 0;
    score = 0;
    updateProgressBar();

    // Remove previous event listeners to avoid duplicates if re-initializing
    startBtn?.replaceWith(startBtn.cloneNode(true));
    document.getElementById('start-quiz')?.addEventListener('click', startQuiz);

    quizContainer.querySelectorAll('.option').forEach(option => {
        option.replaceWith(option.cloneNode(true)); // Clone to remove old listeners
    });
    quizContainer.querySelectorAll('.hint-btn').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    quizContainer.querySelectorAll('.quiz-navigation button').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });

    // Add new event listeners
    quizContainer.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', handleOptionClick);
    });
    quizContainer.querySelectorAll('.hint-btn').forEach(btn => {
        btn.addEventListener('click', handleHintClick);
    });
    quizContainer.querySelector('.prev-btn')?.addEventListener('click', () => navigateQuestion(-1));
    quizContainer.querySelector('.next-btn')?.addEventListener('click', () => navigateQuestion(1));
    quizContainer.querySelector('.results-btn')?.addEventListener('click', showResults);

    function startQuiz() {
        quizIntro?.classList.remove('active');
        quizQuestionsContainer?.classList.add('active');
        showQuestion(currentQuestionIndex);
    }

    function handleOptionClick(event) {
        const selectedOption = event.target;
        const questionElement = selectedOption.closest('.question');
        const options = questionElement.querySelectorAll('.option');
        const explanation = questionElement.querySelector('.explanation');

        // Prevent selecting multiple options or changing after selection
        if (questionElement.classList.contains('answered')) return;
        questionElement.classList.add('answered');

        options.forEach(opt => opt.disabled = true); // Disable all options

        const isCorrect = selectedOption.getAttribute('data-correct') === 'true';

        if (isCorrect) {
            score++;
            selectedOption.classList.add('correct', 'pulse-correct'); // Add pulse animation
        } else {
            selectedOption.classList.add('incorrect', 'shake-incorrect'); // Add shake animation
            // Highlight the correct answer
            const correctOption = questionElement.querySelector('.option[data-correct="true"]');
            correctOption?.classList.add('correct');
        }

        // Show explanation
        if (explanation) {
            explanation.classList.add('active');
        }
        
        // Automatically move to next question after a short delay
        // setTimeout(() => {
        //     navigateQuestion(1);
        // }, 1500); // Adjust delay as needed
    }

    function handleHintClick(event) {
        const hintBtn = event.target;
        const hintElement = hintBtn.nextElementSibling;
        if (hintElement && hintElement.classList.contains('hint')) {
            hintElement.classList.toggle('active');
        }
    }

    function navigateQuestion(direction) {
        const nextIndex = currentQuestionIndex + direction;
        if (nextIndex >= 0 && nextIndex < questions.length) {
            showQuestion(nextIndex);
        } else if (nextIndex >= questions.length) {
            showResults();
        }
    }

    function showQuestion(index) {
        questions.forEach((q, i) => {
            q.classList.toggle('active', i === index);
        });
        currentQuestionIndex = index;
        updateProgressBar();
        updateNavigationButtons();
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        if (progressBarFill) progressBarFill.style.width = `${progress}%`;
        if (currentQuestionSpan) currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }

    function updateNavigationButtons() {
        const prevBtn = quizContainer.querySelector('.prev-btn');
        const nextBtn = quizContainer.querySelector('.next-btn');
        const resultsBtn = quizContainer.querySelector('.results-btn');

        if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if (nextBtn) nextBtn.style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
        if (resultsBtn) resultsBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'inline-block' : 'none';
    }

    function showResults() {
        quizQuestionsContainer?.classList.remove('active');
        quizResultsContainer?.classList.add('active');

        const scoreSpan = quizResultsContainer.querySelector('#score');
        const totalSpan = quizResultsContainer.querySelector('#total-questions');
        const messageSpan = quizResultsContainer.querySelector('#results-message');
        const participantNumSpan = quizResultsContainer.querySelector('#participant-number');
        const resultsIcon = quizResultsContainer.querySelector('.results-icon i');

        if (scoreSpan) scoreSpan.textContent = score;
        if (totalSpan) totalSpan.textContent = questions.length;
        
        participantNumber++; // Increment participant number
        if (participantNumSpan) participantNumSpan.textContent = participantNumber;
        if (participantCountSpan) participantCountSpan.textContent = participantNumber; // Update intro count too

        let messageKey = '';
        let iconClass = 'fa-solid fa-check'; // Default icon

        const percentage = (score / questions.length) * 100;
        if (percentage === 100) {
            messageKey = 'quiz.perfect_score';
            iconClass = 'fa-solid fa-trophy';
            triggerConfetti(); // Add confetti for perfect score
        } else if (percentage >= 70) {
            messageKey = 'quiz.good_score';
            iconClass = 'fa-solid fa-thumbs-up';
        } else if (percentage >= 40) {
            messageKey = 'quiz.average_score';
            iconClass = 'fa-solid fa-face-meh';
        } else {
            messageKey = 'quiz.low_score';
            iconClass = 'fa-solid fa-book-open';
        }

        if (messageSpan) messageSpan.textContent = getTranslation(messageKey, currentLang);
        if (resultsIcon) resultsIcon.className = iconClass; // Update icon

        // Setup share buttons
        setupShareButtons(score, questions.length);
    }
    
    function setupShareButtons(userScore, totalQuestions) {
        const shareMessageTemplate = getTranslation('quiz.share_message', currentLang);
        const shareMessage = shareMessageTemplate.replace('{score}', userScore);
        const pageUrl = window.location.href;

        const twitterBtn = quizResultsContainer.querySelector('.share-twitter');
        const facebookBtn = quizResultsContainer.querySelector('.share-facebook');
        const whatsappBtn = quizResultsContainer.querySelector('.share-whatsapp');

        if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(pageUrl)}`;
        if (facebookBtn) facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareMessage)}`;
        if (whatsappBtn) whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + ' ' + pageUrl)}`;
    }
    
    // Initial setup
    showQuestion(currentQuestionIndex);
    updateNavigationButtons();
}

// Simple Confetti Effect
function triggerConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = `${Math.random() * 8 + 4}px`;
        confetti.style.height = confetti.style.width;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${-Math.random() * 20}%`; // Start above screen
        confetti.style.opacity = `${Math.random() * 0.5 + 0.5}`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 1}s infinite`;
        confettiContainer.appendChild(confetti);
    }

    // Remove confetti after animation duration
    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 5000); // Adjust time as needed
}

// Add keyframes for confetti animation in CSS or here via JS
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes fall {
    to {
        transform: translateY(110vh) rotate(720deg);
        opacity: 0;
    }
}
`, styleSheet.cssRules.length);
// --- End Quiz Functionality ---


// --- Contact Form Functionality (Enhanced) ---
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const formMessage = document.getElementById('form-message');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';

    // Update placeholders on init/language change
    contactForm.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key, currentLang);
        if (translation !== key) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation; // For button text
            }
        }
    });
    if (submitButton) submitButton.textContent = getTranslation('contact.submit_button', currentLang);

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const topic = contactForm.querySelector('#topic').value;
        const message = contactForm.querySelector('#message').value.trim();

        // Basic Validation
        if (!name || !email || topic === "" || !message) {
            displayFormMessage(getTranslation('contact.error_message_fill', currentLang), 'error');
            return;
        }

        if (!validateEmail(email)) {
            displayFormMessage(getTranslation('contact.error_message_email', currentLang), 'error');
            return;
        }

        // Simulate sending message
        displayFormMessage(getTranslation('contact.loading_message', currentLang), 'loading');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = getTranslation('contact.loading_message', currentLang);
        }

        setTimeout(() => {
            // Simulate success
            displayFormMessage(getTranslation('contact.success_message', currentLang), 'success');
            contactForm.reset(); // Clear the form
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = getTranslation('contact.submit_button', currentLang);
            }
        }, 1500); // Simulate network delay
    });

    function displayFormMessage(message, type) {
        if (!formMessage) return;
        formMessage.textContent = message;
        formMessage.className = `form-message ${type} active`; // Add 'active' class to show it
        
        // Optionally hide the message after some time, except for loading
        if (type !== 'loading') {
            setTimeout(() => {
                formMessage.classList.remove('active');
            }, 5000); // Hide after 5 seconds
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
// --- End Contact Form Functionality ---

