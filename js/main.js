// Main JavaScript for Inglés Fácil con Ana Website

// Global variables for language system
let translations = {};
let currentLang = 'es'; // Default to Spanish

// --- Enhanced Logging Function ---
function log(message, data = null) {
    console.log(`[InglesFacil] ${message}`, data !== null ? data : '');
}

// Main DOM Content Loaded listener
document.addEventListener('DOMContentLoaded', function() {
    log('DOM Content Loaded. Initializing...');
    
    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            log('Mobile menu toggled.');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu') && !event.target.closest('.nav-links')) {
            if (navLinks && navLinks.classList.contains('active')) {
                log('Closing mobile menu due to outside click.');
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            log('Anchor link clicked:', targetId);
            // Allow default behavior for non-anchor links or placeholder '#'
            if (!targetId || targetId === '#' || !targetId.startsWith('#')) {
                log('Allowing default behavior for link.');
                return;
            }
            
            e.preventDefault(); // Prevent default only for valid internal anchors
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                log('Scrolling to target element:', targetId);
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    log('Closing mobile menu before scroll.');
                    navLinks.classList.remove('active');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            } else {
                log('Target element not found for scroll:', targetId);
            }
        });
    });
    
    // Initialize language system first, then other components
    log('Initializing language system...');
    initializeLanguageSystem().then(() => {
        log('Language system initialized successfully. Initializing dependent components...');
        // Initialize components that depend on translations being loaded
        initializeModals(); 
        initializeQuiz();
        initializeContactForm();
        initializeScrollAnimations(); 
        initializeClickableCards(); 
        updateResourceLinks(); 
        log('Dependent components initialized.');
    }).catch(error => {
        console.error("[InglesFacil] Failed to initialize language system or dependent components:", error);
        log('Attempting to initialize non-language dependent features anyway...');
        // Attempt to initialize non-language dependent features anyway
        initializeQuiz();
        initializeContactForm();
        initializeScrollAnimations();
        initializeClickableCards();
        updateResourceLinks();
        log('Non-language dependent features initialization attempted.');
    });
});

// Initialize language system
async function initializeLanguageSystem() {
    log('Starting initializeLanguageSystem...');
    try {
        log('Fetching translation files...');
        const [enResponse, esResponse] = await Promise.all([
            fetch('translations_en.json'),
            fetch('translations_es.json')
        ]);
        log('Translation files fetch status:', { en: enResponse.ok, es: esResponse.ok });
        
        if (!enResponse.ok || !esResponse.ok) {
            throw new Error(`HTTP error fetching translations! status: EN=${enResponse.status}, ES=${esResponse.status}`);
        }

        log('Parsing translation JSON...');
        const [enData, esData] = await Promise.all([
            enResponse.json(),
            esResponse.json()
        ]);
        log('Translation JSON parsed successfully.');
        
        translations = {
            en: enData,
            es: esData
        };
        log('Translations object created:', translations);
        
        detectLanguage();
        setupLanguageSelector();
        log('Translating page initially...');
        await translatePage(currentLang); // Ensure translation completes before resolving
        log('Initial page translation complete.');
    } catch (error) {
        console.error('[InglesFacil] Error initializing language system:', error);
        throw error; // Re-throw error to be caught by the caller
    }
}

// Detect user's preferred language
function detectLanguage() {
    log('Detecting language...');
    const storedLang = localStorage.getItem('preferredLanguage');
    log('Stored language:', storedLang);
    if (storedLang && ['en', 'es'].includes(storedLang)) {
        currentLang = storedLang;
        log('Using stored language:', currentLang);
        return;
    }
    const browserLang = navigator.language.split('-')[0];
    log('Browser language:', browserLang);
    currentLang = (browserLang === 'en') ? 'en' : 'es';
    log('Using detected browser language (defaulting to es):', currentLang);
}

// Set up language selector dropdown
function setupLanguageSelector() {
    log('Setting up language selector...');
    const languageSelector = document.querySelector('.language-selector');
    if (!languageSelector) {
        log('Language selector element not found.');
        return;
    }

    updateCurrentLanguageDisplay();
    
    const langOptions = document.querySelectorAll('.lang-option');
    log('Found language options:', langOptions.length);
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            log('Language option clicked:', lang);
            switchLanguage(lang);
            // Close dropdown after selection (optional)
            const dropdown = languageSelector.querySelector('.lang-options');
            if (dropdown) {
                 log('Closing language dropdown.');
                 dropdown.style.display = 'none';
                 setTimeout(() => { dropdown.style.display = ''; }, 100); // Reset display property after a short delay
            }
        });
    });
    log('Language selector setup complete.');
}

// Update current language display in the selector
function updateCurrentLanguageDisplay() {
    log('Updating current language display for:', currentLang);
    const currentLangText = document.querySelector('.current-lang-text');
    const currentLangFlag = document.querySelector('.current-lang-flag');
    const langOptions = document.querySelectorAll('.lang-option');

    if (currentLangText) {
        const text = translations[currentLang]?.language?.[currentLang] || (currentLang === 'en' ? 'English' : 'Español');
        log('Setting current language text:', text);
        currentLangText.textContent = text;
        currentLangText.setAttribute('data-i18n', `language.${currentLang}`);
    } else {
        log('Current language text element not found.');
    }

    if (currentLangFlag) {
        const flagSvgContent = getFlagSvg(currentLang);
        if (flagSvgContent) {
            log('Setting current language flag SVG.');
            currentLangFlag.innerHTML = flagSvgContent;
        } else {
            log('Could not get SVG for current flag:', currentLang);
        }
    } else {
        log('Current language flag element not found.');
    }

    // Update active state in dropdown
    langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    log('Current language display update complete.');
}

// Helper function to get SVG content for flags
function getFlagSvg(lang) {
    // log('Getting flag SVG for:', lang); // This might be too noisy
    if (lang === 'en') {
        return `<rect width="60" height="30" fill="#00247d"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" stroke-width="2"/><path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" stroke-width="10"/><path d="M30,0 L30,30 M0,15 L60,15" stroke="#cf142b" stroke-width="6"/>`;
    } else if (lang === 'es') {
        return `<rect width="60" height="30" fill="#c60b1e"/><rect width="60" height="15" y="7.5" fill="#ffc400"/>`;
    }
    return ''; // Return empty string for unknown languages
}

// Switch language
function switchLanguage(lang) {
    log('Attempting to switch language to:', lang);
    if (lang === currentLang || !['en', 'es'].includes(lang)) {
        log('Switch language aborted: Same language or invalid language.');
        return;
    }
    
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    log('Language set to:', currentLang, 'and saved to localStorage.');
    
    log('Adding translating class to body.');
    document.body.classList.add('translating');
    
    log('Starting page translation for new language...');
    translatePage(currentLang).then(() => {
        log('Page translation complete. Updating display and re-initializing components...');
        updateCurrentLanguageDisplay();
        // Re-initialize components that might need re-translation or depend on language
        initializeQuiz(); // Re-initialize quiz to update button texts etc.
        initializeContactForm(); // Update placeholders
        // Re-translate any open modals
        const openModalElement = document.querySelector(".modal[style*='display: block']");
        if (openModalElement) {
            log('Re-translating open modal.');
            translateElement(openModalElement, lang);
        }
        log('Removing translating class from body.');
        document.body.classList.remove('translating');
        log(`Language switch to ${lang} successful.`);
    }).catch(error => {
        console.error("[InglesFacil] Error during language switch translation:", error);
        log('Removing translating class from body due to error.');
        document.body.classList.remove('translating');
    });
}

// Translate a specific element and its children
function translateElement(element, lang) {
    // log('Translating element and children:', element.tagName, element.id || element.className); // Potentially noisy
    element.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        // log(`Found element with key: ${key}`); // Potentially noisy
        const translation = getTranslation(key, lang);
        if (translation !== key) {
            // log(`Applying translation for key ${key}:`, translation); // Potentially noisy
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type !== 'submit' && el.type !== 'button') { // Don't change placeholder for buttons
                     el.placeholder = translation;
                }
            } else if (el.tagName === 'TITLE') {
                document.title = translation;
            } else {
                // Use innerHTML carefully, assuming translations are trusted
                el.innerHTML = translation;
            }
        } else {
            // Warning already logged in getTranslation
        }
    });
    // Also translate the element itself if it has data-i18n
    if (element.hasAttribute('data-i18n')) {
         const key = element.getAttribute('data-i18n');
         // log(`Found element itself with key: ${key}`); // Potentially noisy
         const translation = getTranslation(key, lang);
         if (translation !== key) {
             // log(`Applying translation for key ${key} to element itself:`, translation); // Potentially noisy
             if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                 if (element.type !== 'submit' && element.type !== 'button') {
                     element.placeholder = translation;
                 }
             } else if (element.tagName === 'TITLE') {
                 document.title = translation;
             } else {
                 element.innerHTML = translation;
             }
         } else {
             // Warning already logged in getTranslation
         }
    }
}

// Translate page content
async function translatePage(lang) {
    log('Starting translatePage for language:', lang);
    if (!translations[lang]) {
        console.error(`[InglesFacil] Translations not available for language: ${lang}`);
        return;
    }
    log('Translating document body...');
    translateElement(document.body, lang); // Translate the whole body
    log('Updating dynamic text elements...');
    updateDynamicText(lang);
    log('Updating resource links...');
    updateResourceLinks();
    log('translatePage finished for language:', lang);
}

// Get translation from nested key
function getTranslation(key, lang) {
    // log('Getting translation for key:', key, 'in lang:', lang); // Potentially noisy
    const keys = key.split('.');
    let result = translations[lang];
    
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            console.warn(`[InglesFacil] Translation key not found: ${key} (failed at '${k}') for language ${lang}`);
            return key; // Return the key itself if not found
        }
    }
    
    // Handle escaped newlines for descriptions
    if (typeof result === 'string') {
        result = result.replace(/\n/g, '<br>');
    }
    
    // log('Translation found:', result); // Potentially noisy
    return result || key; // Return key if result is null or empty string
}

// Update dynamic text elements not covered by data-i18n
function updateDynamicText(lang) {
    log('Updating dynamic text...');
    const participantSpan = document.getElementById('participant-count');
    if (participantSpan) {
        const count = participantSpan.textContent; // Keep the number
        const textKey = 'quiz.participants';
        const translatedText = getTranslation(textKey, lang);
        // Reconstruct the string if translation found
        if (translatedText !== textKey && participantSpan.nextSibling && participantSpan.nextSibling.nodeType === Node.TEXT_NODE) {
             log('Updating participant count text.');
             participantSpan.nextSibling.textContent = ` ${translatedText}`; 
        } else {
            log('Could not update participant count text (element or translation missing).');
        }
    } else {
        log('Participant count span not found.');
    }
    // Add other dynamic text updates here if needed
}

// Update resource links to point to actual files
function updateResourceLinks() {
    log('Updating resource links...');
    const resourceSection = document.getElementById('resources');
    if (!resourceSection) {
        log('Resource section not found.');
        return;
    }

    const links = {
        'resources.travel_guide.button': 'resources/travel_guide.pdf',
        'resources.movie_collection.button': 'resources/movie_collection.pdf',
        'resources.pronunciation_workbook.button': 'resources/pronunciation_workbook.pdf'
    };

    Object.keys(links).forEach(key => {
        const button = resourceSection.querySelector(`[data-i18n="${key}"]`);
        if (button && button.tagName === 'A') {
            log('Updating link for:', key);
            button.href = links[key];
            button.setAttribute('download', links[key].split('/').pop()); // Add download attribute
            button.removeAttribute('target'); // Remove target=_blank if it exists
        } else {
            log('Button not found or not an anchor for key:', key);
        }
    });
    log('Resource links update complete.');
}

// --- Modal Functionality ---
function initializeModals() {
    log('Initializing modals...');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTitleEl = document.getElementById('modal-title');
    const modalBodyEl = document.getElementById('modal-body');
    const openModalButtons = document.querySelectorAll('[data-modal-target]');

    if (!modalOverlay || !modalContainer || !modalCloseBtn || !modalTitleEl || !modalBodyEl) {
        console.error('[InglesFacil] Modal elements missing from the DOM. Cannot initialize modals.');
        return;
    }

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalType = button.getAttribute('data-modal-target');
            log('Open modal button clicked for type:', modalType);
            const modalContentKey = `modals.${modalType}_example`; // Assuming structure like modals.vocabulary_example
            const titleKey = `${modalContentKey}.title`;
            const textKey = `${modalContentKey}.text`;
            const challengeKey = `${modalContentKey}.challenge`;
            const practiceKey = `${modalContentKey}.practice`;
            const tipKey = `${modalContentKey}.tip`;

            const title = getTranslation(titleKey, currentLang);
            const text = getTranslation(textKey, currentLang);
            const challenge = getTranslation(challengeKey, currentLang);
            const practice = getTranslation(practiceKey, currentLang);
            const tip = getTranslation(tipKey, currentLang);

            if (title !== titleKey) {
                modalTitleEl.innerHTML = title;
            } else {
                modalTitleEl.innerHTML = 'Information'; // Default title
                log('Modal title translation not found for key:', titleKey);
            }

            let bodyContent = '';
            if (text !== textKey) {
                bodyContent += `<p>${text}</p>`;
            } else {
                log('Modal text translation not found for key:', textKey);
            }
            if (practice !== practiceKey) {
                bodyContent += `<div class="modal-practice"><h4>Practice:</h4><p>${practice}</p></div>`;
            }
            if (challenge !== challengeKey) {
                bodyContent += `<p class="modal-challenge"><strong>Challenge:</strong> ${challenge}</p>`;
            }
            if (tip !== tipKey) {
                bodyContent += `<p class="modal-tip"><strong>Tip:</strong> ${tip}</p>`;
            }
            
            modalBodyEl.innerHTML = bodyContent || '<p>Content not available.</p>';

            openModal();
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal() {
        log('Opening modal.');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        log('Closing modal.');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    log('Modal initialization complete.');
}
// --- End Modal Functionality ---


// --- Scroll Animation Functionality ---
function initializeScrollAnimations() {
    log('Initializing scroll animations...');
    const animatedElements = document.querySelectorAll('.animate-on-scroll'); 

    if (!("IntersectionObserver" in window)) {
        log("IntersectionObserver not supported, scroll animations disabled.");
        animatedElements.forEach(el => el.classList.add('is-visible')); // Make all visible if no observer
        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // log('Element intersecting, adding is-visible:', entry.target.id || entry.target.className); // Noisy
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
        // log('Observing element for scroll animation:', el.id || el.className); // Noisy
        observer.observe(el);
    });
    log('Scroll animation initialization complete.');
}
// --- End Scroll Animation Functionality ---


// --- Clickable Cards Functionality ---
function initializeClickableCards() {
    log('Initializing clickable cards...');
    const clickableCards = document.querySelectorAll('.clickable-card'); 

    clickableCards.forEach(card => {
        const link = card.querySelector('a.btn, button.btn, a.platform-link'); // Find the button or link inside
        if (link) {
            // log('Making card clickable:', card.className); // Noisy
            card.style.cursor = 'pointer';
            card.addEventListener('click', (event) => {
                // Prevent triggering card click if the button/link itself or an inner interactive element was clicked
                if (event.target.closest('a, button, input, select, textarea')) {
                    // log('Click target is interactive, ignoring card click.'); // Noisy
                    return;
                }
                log('Card clicked, simulating link/button click.');
                link.click(); // Simulate a click on the link/button
            });
        } else {
            // log('No link/button found in card, not making clickable:', card.className); // Noisy
        }
    });
    log('Clickable cards initialization complete.');
}
// --- End Clickable Cards Functionality ---


// --- Quiz Functionality ---
function initializeQuiz() {
    log('Initializing quiz...');
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) {
        log('Quiz container not found.');
        return;
    }

    const startBtn = document.getElementById('start-quiz');
    const quizIntro = quizContainer.querySelector('.quiz-intro');
    const quizQuestions = quizContainer.querySelector('.quiz-questions');
    const quizResults = quizContainer.querySelector('.quiz-results');
    const questions = quizQuestions.querySelectorAll('.question');
    const progressBarFill = quizQuestions.querySelector('.progress-fill');
    const progressText = quizQuestions.querySelector('.progress-text #current-question');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let participantNumber = parseInt(localStorage.getItem('quizParticipantNumber') || '110');
    const participantCountSpan = document.getElementById('participant-count');
    if (participantCountSpan) participantCountSpan.textContent = participantNumber;

    if (startBtn) {
        startBtn.addEventListener('click', startQuiz);
    }

    function startQuiz() {
        log('Starting quiz...');
        participantNumber++;
        localStorage.setItem('quizParticipantNumber', participantNumber);
        if (participantCountSpan) participantCountSpan.textContent = participantNumber;
        
        quizIntro.classList.remove('active');
        quizQuestions.classList.add('active');
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        showQuestion(currentQuestionIndex);
    }

    function showQuestion(index) {
        log('Showing question index:', index);
        questions.forEach((q, i) => {
            q.classList.toggle('active', i === index);
        });
        updateProgress(index + 1, questions.length);
        setupQuestionListeners(questions[index]);
    }

    function updateProgress(current, total) {
        log('Updating progress:', { current, total });
        const percentage = (current / total) * 100;
        if (progressBarFill) progressBarFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = current;
    }

    function setupQuestionListeners(questionElement) {
        const options = questionElement.querySelectorAll('.option');
        const hintBtn = questionElement.querySelector('.hint-btn');
        const hint = questionElement.querySelector('.hint');
        const explanation = questionElement.querySelector('.explanation');

        // Reset previous state
        options.forEach(opt => {
            opt.disabled = false;
            opt.classList.remove('selected', 'correct', 'incorrect');
            // Remove previous listeners to avoid duplicates
            const newOpt = opt.cloneNode(true);
            opt.parentNode.replaceChild(newOpt, opt);
        });
        if (hint) hint.classList.remove('active');
        if (explanation) explanation.classList.remove('active');

        // Add new listeners
        const currentOptions = questionElement.querySelectorAll('.option');
        currentOptions.forEach(option => {
            option.addEventListener('click', handleAnswer);
        });

        if (hintBtn && hint) {
            // Remove previous listener
            const newHintBtn = hintBtn.cloneNode(true);
            hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);
            newHintBtn.addEventListener('click', () => {
                log('Hint button clicked.');
                hint.classList.toggle('active');
            });
        }
    }

    function handleAnswer(event) {
        const selectedOption = event.target;
        const questionElement = selectedOption.closest('.question');
        const options = questionElement.querySelectorAll('.option');
        const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
        const explanation = questionElement.querySelector('.explanation');

        log('Answer selected. Correct:', isCorrect);
        userAnswers[currentQuestionIndex] = isCorrect;
        
        options.forEach(opt => {
            opt.disabled = true; // Disable all options
            if (opt === selectedOption) {
                opt.classList.add('selected');
                opt.classList.toggle('correct', isCorrect);
                opt.classList.toggle('incorrect', !isCorrect);
            } else if (opt.getAttribute('data-correct') === 'true') {
                // Highlight the correct answer if the selected one was wrong
                if (!isCorrect) {
                    opt.classList.add('correct');
                }
            }
        });

        if (isCorrect) {
            score++;
        }

        if (explanation) {
            explanation.classList.add('active');
        }

        // Automatically move to the next question or show results
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            } else {
                showResults();
            }
        }, 1500); // Delay before moving on
    }

    function showResults() {
        log('Showing quiz results. Score:', score);
        quizQuestions.classList.remove('active');
        quizResults.classList.add('active');

        let resultMessageKey;
        let iconClass = 'fas fa-check-circle'; // Default icon

        if (score === questions.length) {
            resultMessageKey = 'quiz.perfect_score';
            iconClass = 'fas fa-trophy';
        } else if (score >= questions.length * 0.7) {
            resultMessageKey = 'quiz.good_score';
            iconClass = 'fas fa-smile-beam';
        } else if (score >= questions.length * 0.4) {
            resultMessageKey = 'quiz.average_score';
            iconClass = 'fas fa-meh';
        } else {
            resultMessageKey = 'quiz.low_score';
            iconClass = 'fas fa-sad-tear';
        }

        const resultMessage = getTranslation(resultMessageKey, currentLang);
        const participantText = getTranslation('quiz.participant_text', currentLang);
        const participantSuffix = getTranslation('quiz.participant_suffix', currentLang);
        const shareResultsText = getTranslation('quiz.share_results', currentLang);
        const shareMessageTemplate = getTranslation('quiz.share_message', currentLang);
        const yourScoreText = getTranslation('quiz.your_score', currentLang);

        const shareMessage = shareMessageTemplate.replace('{score}', score);
        const encodedShareMessage = encodeURIComponent(shareMessage);
        const currentUrl = encodeURIComponent(window.location.href);

        quizResults.innerHTML = `
            <div class="results-icon"><i class="${iconClass}"></i></div>
            <h3>${yourScoreText} ${score}/${questions.length}</h3>
            <p>${resultMessage}</p>
            <div class="competition-stats">
                <p>${participantText} ${participantNumber}${participantSuffix}</p>
            </div>
            <div class="share-results">
                <p>${shareResultsText}</p>
                <div class="social-share">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedShareMessage}" target="_blank" class="share-btn facebook" aria-label="Share on Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodedShareMessage}" target="_blank" class="share-btn twitter" aria-label="Share on Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://wa.me/?text=${encodedShareMessage}%20${currentUrl}" target="_blank" class="share-btn whatsapp" aria-label="Share on WhatsApp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
            <button id="restart-quiz" class="btn btn-secondary">Volver a Intentar</button> 
        `; // Note: Restart button needs translation

        // Add listener for the restart button
        const restartBtn = document.getElementById('restart-quiz');
        if (restartBtn) {
            // Translate restart button
            restartBtn.textContent = getTranslation('quiz.restart_button', currentLang) || 'Try Again'; // Add 'quiz.restart_button' to JSON
            restartBtn.addEventListener('click', () => {
                log('Restarting quiz...');
                quizResults.classList.remove('active');
                quizIntro.classList.add('active'); // Go back to intro
            });
        }
    }
    log('Quiz initialization complete.');
}
// --- End Quiz Functionality ---


// --- Contact Form Functionality ---
function initializeContactForm() {
    log('Initializing contact form...');
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const formLoading = document.getElementById('form-loading');

    if (!form || !formMessage || !formLoading) {
        log('Contact form elements not found.');
        return;
    }

    // Update placeholders initially
    form.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key, currentLang);
        if (translation !== key && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
            el.placeholder = translation;
        }
        // Also update select options if needed (though usually handled by innerHTML)
        if (el.tagName === 'OPTION' && el.hasAttribute('data-i18n')) {
             el.textContent = translation;
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        log('Contact form submitted.');
        formMessage.textContent = '';
        formMessage.className = 'form-message'; // Reset class
        formLoading.style.display = 'flex'; // Show loading indicator
        form.querySelector('button[type="submit"]').disabled = true;

        // Basic validation
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const topic = form.elements['topic'].value;
        const message = form.elements['message'].value.trim();
        const emailRegex = /^[^"]+@[^"]+\.[a-zA-Z]{2,}$/;

        if (!name || !email || !topic || !message) {
            showFormMessage(getTranslation('contact.error_message_fill', currentLang), 'error');
            return;
        }
        if (!emailRegex.test(email)) {
            showFormMessage(getTranslation('contact.error_message_email', currentLang), 'error');
            return;
        }

        // Simulate form submission (replace with actual submission logic)
        log('Simulating form submission with data:', { name, email, topic, message });
        setTimeout(() => {
            showFormMessage(getTranslation('contact.success_message', currentLang), 'success');
            form.reset(); // Clear the form
        }, 1500); // Simulate network delay
    });

    function showFormMessage(message, type) {
        log(`Showing form message (${type}):`, message);
        formLoading.style.display = 'none'; // Hide loading indicator
        form.querySelector('button[type="submit"]').disabled = false;
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
    }
    log('Contact form initialization complete.');
}
// --- End Contact Form Functionality ---

