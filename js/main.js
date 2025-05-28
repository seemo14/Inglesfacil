// Fixed and Enhanced Language Switching JavaScript for Inglés Fácil con Ana

// Global variables for language system
let translations = {};
let currentLang = 'es'; // Default to Spanish

// Initialize language system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize language system
    initializeLanguageSystem();
    
    // Initialize quiz
    initializeQuiz();
    
    // Initialize contact form
    initializeContactForm();
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
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu') && !event.target.closest('.nav-links')) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
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
        
        console.log('Translations loaded:', translations);
        
        // Detect user's preferred language
        detectLanguage();
        
        // Set up language selector
        setupLanguageSelector();
        
        // Initial translation
        translatePage(currentLang);
        
        console.log('Language system initialized successfully with language:', currentLang);
    } catch (error) {
        console.error('Error initializing language system:', error);
        
        // Fallback to hardcoded translations if JSON files can't be loaded
        translations = {
            en: {
                nav: {
                    brand: "English with Ana",
                    home: "Home",
                    features: "Features",
                    content: "Content",
                    quiz: "Quiz",
                    resources: "Resources",
                    contact: "Contact"
                },
                language: {
                    en: "English",
                    es: "Spanish"
                }
                // Add more fallback translations as needed
            },
            es: {
                nav: {
                    brand: "Inglés Fácil con Ana",
                    home: "Inicio",
                    features: "Características",
                    content: "Contenido",
                    quiz: "Cuestionario",
                    resources: "Recursos",
                    contact: "Contacto"
                },
                language: {
                    en: "Inglés",
                    es: "Español"
                }
                // Add more fallback translations as needed
            }
        };
        
        // Continue with available translations
        detectLanguage();
        setupLanguageSelector();
        translatePage(currentLang);
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
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') {
        currentLang = 'en';
    } else {
        // Default to Spanish for all other languages
        currentLang = 'es';
    }
}

// Set up language selector dropdown
function setupLanguageSelector() {
    console.log('Setting up language selector...');
    
    // Update current language display
    updateCurrentLanguageDisplay();
    
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
    
    // Make sure the language selector is visible
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        languageSelector.style.display = 'block';
    }
    
    console.log('Language selector setup complete');
}

// Update current language display
function updateCurrentLanguageDisplay() {
    const currentLangText = document.querySelector('.current-lang-text');
    const currentLangFlag = document.querySelector('.current-lang-flag');
    
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
    
    console.log('Current language display updated to:', currentLang);
}

// Switch language
function switchLanguage(lang) {
    if (lang === currentLang) return;
    
    console.log('Switching language from', currentLang, 'to', lang);
    
    // Add translating class to body for visual feedback
    document.body.classList.add('translating');
    
    // Update current language
    currentLang = lang;
    
    // Store user preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update language display
    updateCurrentLanguageDisplay();
    
    // Translate page content
    translatePage(lang);
    
    // Remove translating class after a short delay
    setTimeout(() => {
        document.body.classList.remove('translating');
    }, 500);
    
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
    
    // Translate select options
    document.querySelectorAll('select').forEach(select => {
        Array.from(select.options).forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (key) {
                translateElement(option, key, lang);
            }
        });
    });
    
    // Translate quiz content
    translateQuizContent(lang);
    
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

// Translate quiz content
function translateQuizContent(lang) {
    if (!translations[lang] || !translations[lang].quiz) return;
    
    // Update quiz title and intro
    const quizTitle = document.querySelector('.quiz-title');
    if (quizTitle) {
        quizTitle.textContent = translations[lang].quiz.title;
    }
    
    const quizIntro = document.querySelector('.quiz-intro p');
    if (quizIntro) {
        quizIntro.textContent = translations[lang].quiz.intro;
    }
    
    // Update start button
    const startBtn = document.getElementById('start-quiz');
    if (startBtn) {
        startBtn.textContent = translations[lang].quiz.start_button;
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        prevBtn.textContent = translations[lang].quiz.prev_button;
    }
    
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn && nextBtn.textContent !== translations[lang].quiz.see_results) {
        nextBtn.textContent = translations[lang].quiz.next_button;
    }
    
    // Update question text
    document.querySelectorAll('.progress-text').forEach(element => {
        const questionNumber = element.querySelector('#current-question').textContent;
        element.innerHTML = `<span data-i18n="quiz.question">${translations[lang].quiz.question}</span> <span id="current-question">${questionNumber}</span>/6`;
    });
    
    // Update hint buttons
    document.querySelectorAll('.hint-btn').forEach(button => {
        button.textContent = translations[lang].quiz.hint_button;
    });
    
    // Update results section
    const scoreLabel = document.querySelector('.score-label');
    if (scoreLabel) {
        scoreLabel.textContent = translations[lang].quiz.your_score;
    }
    
    const retryBtn = document.getElementById('retry-quiz');
    if (retryBtn) {
        retryBtn.textContent = translations[lang].quiz.retry_button;
    }
    
    const shareText = document.querySelector('.share-results h4');
    if (shareText) {
        shareText.textContent = translations[lang].quiz.share_results;
    }
    
    // Update participant text
    const participantText = document.querySelector('.competition-stats p');
    if (participantText) {
        const participantNumber = document.getElementById('participant-number').textContent;
        participantText.innerHTML = `<span data-i18n="quiz.participant_text">${translations[lang].quiz.participant_text}</span><span id="participant-number">${participantNumber}</span> <span data-i18n="quiz.participant_suffix">${translations[lang].quiz.participant_suffix}</span>`;
    }
}

// Quiz functionality
function initializeQuiz() {
    // Quiz elements
    const quizIntro = document.querySelector('.quiz-intro');
    const quizQuestions = document.querySelector('.quiz-questions');
    const quizResults = document.querySelector('.quiz-results');
    const startBtn = document.getElementById('start-quiz');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const retryBtn = document.getElementById('retry-quiz');
    const progressFill = document.querySelector('.progress-fill');
    const questions = document.querySelectorAll('.question');
    const scoreEl = document.getElementById('score');
    const scoreMessage = document.getElementById('score-message');
    const participantCount = document.getElementById('participant-count');
    const participantNumber = document.getElementById('participant-number');
    
    if (!startBtn) {
        console.log('Quiz not found on page');
        return;
    }
    
    console.log('Initializing quiz...');
    
    // Quiz state
    let currentQuestion = 1;
    let score = 0;
    let answeredQuestions = {};
    let quizCompleted = false;
    
    // Initialize participant count from localStorage or default to 110
    let participants = localStorage.getItem('movieQuizParticipants') ? 
        parseInt(localStorage.getItem('movieQuizParticipants')) : 110;
    
    if (participantCount) {
        participantCount.textContent = participants;
    }
    
    // Start quiz
    startBtn.addEventListener('click', function() {
        quizIntro.classList.remove('active');
        quizQuestions.classList.add('active');
        showQuestion(currentQuestion);
    });
    
    // Show a specific question
    function showQuestion(questionNumber) {
        // Hide all questions
        questions.forEach(question => {
            question.classList.remove('active');
        });
        
        // Show current question
        const currentQuestionEl = document.querySelector(`.question[data-question="${questionNumber}"]`);
        if (currentQuestionEl) {
            currentQuestionEl.classList.add('active');
        }
        
        // Update progress
        document.getElementById('current-question').textContent = questionNumber;
        progressFill.style.width = `${(questionNumber / questions.length) * 100}%`;
        
        // Update navigation buttons
        prevBtn.disabled = questionNumber === 1;
        
        if (questionNumber === questions.length) {
            nextBtn.textContent = translations[currentLang]?.quiz?.see_results || 'See Results';
        } else {
            nextBtn.textContent = translations[currentLang]?.quiz?.next_button || 'Next';
        }
    }
    
    // Handle option selection
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const questionEl = this.closest('.question');
            const questionNumber = parseInt(questionEl.dataset.question);
            
            // If already answered, do nothing
            if (answeredQuestions[questionNumber]) return;
            
            // Mark question as answered
            answeredQuestions[questionNumber] = true;
            
            // Disable all options in this question
            questionEl.querySelectorAll('.option').forEach(opt => {
                opt.disabled = true;
                opt.classList.remove('selected');
            });
            
            // Mark selected option
            this.classList.add('selected');
            
            // Check if correct
            if (this.dataset.correct === 'true') {
                this.classList.add('correct');
                score++;
            } else {
                this.classList.add('incorrect');
                // Find and highlight correct answer
                questionEl.querySelector('.option[data-correct="true"]').classList.add('correct');
            }
            
            // Show explanation
            questionEl.querySelector('.explanation').classList.add('active');
        });
    });
    
    // Handle hint buttons
    document.querySelectorAll('.hint-btn').forEach(button => {
        button.addEventListener('click', function() {
            const hint = this.nextElementSibling;
            hint.classList.add('active');
            this.style.display = 'none';
        });
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 1) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentQuestion < questions.length) {
            currentQuestion++;
            showQuestion(currentQuestion);
        } else {
            // Show results
            showResults();
        }
    });
    
    // Show results
    function showResults() {
        quizQuestions.classList.remove('active');
        quizResults.classList.add('active');
        
        // Update score
        scoreEl.textContent = score;
        
        // Update score message based on current language
        if (score === 6) {
            scoreMessage.textContent = translations[currentLang]?.quiz?.perfect_score || 
                "¡Perfecto! You're a movie quote master! Your English and movie knowledge are impressive!";
        } else if (score >= 4) {
            scoreMessage.textContent = translations[currentLang]?.quiz?.good_score || 
                "¡Muy bien! You know your movies and English quotes quite well!";
        } else if (score >= 2) {
            scoreMessage.textContent = translations[currentLang]?.quiz?.average_score || 
                "¡Buen intento! Keep watching movies in English to improve your knowledge!";
        } else {
            scoreMessage.textContent = translations[currentLang]?.quiz?.low_score || 
                "¡Sigue practicando! Watch more movies in English with subtitles to learn these famous quotes!";
        }
        
        // Update participant count if quiz wasn't completed before
        if (!quizCompleted) {
            participants++;
            participantCount.textContent = participants;
            participantNumber.textContent = participants;
            localStorage.setItem('movieQuizParticipants', participants);
            quizCompleted = true;
        }
    }
    
    // Retry quiz
    retryBtn.addEventListener('click', function() {
        // Reset quiz state
        currentQuestion = 1;
        score = 0;
        answeredQuestions = {};
        
        // Reset UI
        document.querySelectorAll('.option').forEach(option => {
            option.disabled = false;
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        document.querySelectorAll('.explanation').forEach(explanation => {
            explanation.classList.remove('active');
        });
        
        document.querySelectorAll('.hint').forEach(hint => {
            hint.classList.remove('active');
        });
        
        document.querySelectorAll('.hint-btn').forEach(button => {
            button.style.display = 'block';
        });
        
        // Show first question
        quizResults.classList.remove('active');
        quizQuestions.classList.add('active');
        showQuestion(currentQuestion);
    });
    
    // Initialize social share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.querySelector('i').className;
            const score = document.getElementById('score').textContent;
            const message = encodeURIComponent(`¡He obtenido ${score}/6 en el cuestionario de frases de películas en inglés de Inglés Fácil con Ana! ¿Puedes superarlo?`);
            const url = encodeURIComponent(window.location.href);
            
            let shareUrl = '';
            
            if (platform.includes('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
            } else if (platform.includes('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
            } else if (platform.includes('whatsapp')) {
                shareUrl = `https://api.whatsapp.com/send?text=${message} ${url}`;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    console.log('Quiz initialized successfully');
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.log('Contact form not found on page');
        return;
    }
    
    console.log('Initializing contact form...');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const topic = document.getElementById('topic').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !topic || !message) {
            showFormMessage('error', currentLang === 'es' ? 
                'Por favor completa todos los campos.' : 
                'Please fill in all fields.');
            return;
        }
        
        // Email validation
        if (!validateEmail(email)) {
            showFormMessage('error', currentLang === 'es' ? 
                'Por favor ingresa un email válido.' : 
                'Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission (in a real implementation, this would send data to a server)
        showFormMessage('loading', currentLang === 'es' ? 
            'Enviando mensaje...' : 
            'Sending message...');
        
        // Simulate server response after 1.5 seconds
        setTimeout(function() {
            // Success message
            showFormMessage('success', currentLang === 'es' ? 
                '¡Mensaje enviado con éxito! Te responderemos pronto.' : 
                'Message sent successfully! We will respond to you soon.');
            
            // Reset form
            contactForm.reset();
            
            // Remove success message after 5 seconds
            setTimeout(function() {
                const messageElement = document.querySelector('.form-message');
                if (messageElement) {
                    messageElement.remove();
                }
            }, 5000);
        }, 1500);
    });
    
    // Function to validate email format
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Function to show form messages
    function showFormMessage(type, message) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        
        // Set message content based on type
        if (type === 'loading') {
            messageElement.innerHTML = `
                <div class="spinner"></div>
                <p>${message}</p>
            `;
        } else {
            messageElement.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            `;
        }
        
        // Insert message after form
        contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
    }
    
    console.log('Contact form initialized successfully');
}

// Debug function to help troubleshoot language switching
function debugLanguageSystem() {
    console.log('=== Language System Debug ===');
    console.log('Current language:', currentLang);
    console.log('Available translations:', Object.keys(translations));
    console.log('Language selector elements:', document.querySelectorAll('.lang-option').length);
    console.log('Translatable elements:', document.querySelectorAll('[data-i18n]').length);
    console.log('=== End Debug ===');
}

// Call debug function after initialization
setTimeout(debugLanguageSystem, 2000);
