// Main JavaScript for Inglés Fácil 123 with Multilingual Support

// Global variables for language system
let translations = {};
let currentLang = 'es'; // Default to Spanish
let quizData = [];
let currentQuestion = 0;
let score = 0;
let participantCount = 110; // Starting count of participants

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize language system
    initializeLanguageSystem();
    
    // Initialize quiz
    initializeQuiz();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
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
        // Fallback to hardcoded translations if files can't be loaded
        setupFallbackTranslations();
    }
}

// Fallback translations if JSON files can't be loaded
function setupFallbackTranslations() {
    translations = {
        en: {
            nav: {
                brand: "Inglés Fácil 123",
                home: "Home",
                features: "Features",
                content: "Content",
                resources: "Resources",
                contact: "Contact"
            },
            hero: {
                title: "Learn English the Easy Way",
                subtitle: "Join our community of 385,000+ Spanish speakers learning English through engaging, practical, and fun content.",
                btn_resources: "Get Learning Resources",
                btn_instagram: "Follow on Instagram"
            }
            // Add more fallback translations as needed
        },
        es: {
            nav: {
                brand: "Inglés Fácil 123",
                home: "Inicio",
                features: "Características",
                content: "Contenido",
                resources: "Recursos",
                contact: "Contacto"
            },
            hero: {
                title: "Aprende Inglés de Forma Fácil",
                subtitle: "Únete a nuestra comunidad de más de 385,000 hispanohablantes que aprenden inglés a través de contenido atractivo, práctico y divertido.",
                btn_resources: "Obtener Recursos de Aprendizaje",
                btn_instagram: "Síguenos en Instagram"
            }
            // Add more fallback translations as needed
        }
    };
    
    // Continue with language setup
    detectLanguage();
    setupLanguageSelector();
    translatePage(currentLang);
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

// Initialize quiz
function initializeQuiz() {
    console.log('Initializing quiz...');
    
    // Set up quiz data
    setupQuizData();
    
    // Add event listeners to quiz buttons
    const startQuizBtn = document.getElementById('start-quiz');
    const retryQuizBtn = document.getElementById('retry-quiz');
    
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    } else {
        console.error('Start quiz button not found');
    }
    
    if (retryQuizBtn) {
        retryQuizBtn.addEventListener('click', resetQuiz);
    } else {
        console.error('Retry quiz button not found');
    }
}

// Set up quiz data
function setupQuizData() {
    quizData = [
        {
            quote: "I'll make him an offer he can't refuse.",
            options: ["The Godfather", "Scarface", "Goodfellas", "Casino"],
            correct: 0,
            hint: "This 1972 film is about a powerful Italian-American crime family.",
            explanation: "This iconic line is spoken by Marlon Brando as Don Vito Corleone in 'The Godfather' (1972)."
        },
        {
            quote: "May the Force be with you.",
            options: ["Star Trek", "The Matrix", "Star Wars", "Interstellar"],
            correct: 2,
            hint: "This space opera franchise was created by George Lucas.",
            explanation: "This famous phrase is from 'Star Wars' and is used to wish someone good luck."
        },
        {
            quote: "You're gonna need a bigger boat.",
            options: ["Titanic", "Jaws", "The Perfect Storm", "Moby Dick"],
            correct: 1,
            hint: "This 1975 thriller is about a man-eating great white shark.",
            explanation: "This line is spoken by Roy Scheider as Martin Brody in 'Jaws' (1975) after seeing the size of the shark."
        },
        {
            quote: "Houston, we have a problem.",
            options: ["Gravity", "Interstellar", "The Martian", "Apollo 13"],
            correct: 3,
            hint: "This film is based on the true story of a NASA moon mission that went wrong.",
            explanation: "This line is from 'Apollo 13' (1995), based on the real-life Apollo 13 lunar mission."
        },
        {
            quote: "There's no place like home.",
            options: ["E.T.", "The Wizard of Oz", "Alice in Wonderland", "Home Alone"],
            correct: 1,
            hint: "This 1939 musical fantasy film features a girl from Kansas and her dog Toto.",
            explanation: "This line is spoken by Dorothy (Judy Garland) in 'The Wizard of Oz' (1939) while clicking her ruby slippers."
        },
        {
            quote: "Life is like a box of chocolates, you never know what you're gonna get.",
            options: ["The Notebook", "Forrest Gump", "Chocolat", "Sweet Home Alabama"],
            correct: 1,
            hint: "This 1994 film stars Tom Hanks as a man with a low IQ who witnesses several historical events.",
            explanation: "This famous quote is spoken by Forrest Gump (Tom Hanks) in the 1994 film of the same name."
        }
    ];
}

// Start quiz
function startQuiz() {
    console.log('Starting quiz...');
    
    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    
    // Hide intro, show questions
    document.querySelector('.quiz-intro').classList.remove('active');
    document.querySelector('.quiz-questions').classList.add('active');
    document.querySelector('.quiz-results').classList.remove('active');
    
    // Load first question
    loadQuestion();
}

// Load current question
function loadQuestion() {
    const questionData = quizData[currentQuestion];
    const questionContainer = document.querySelector('.question-container');
    
    // Update question number
    document.getElementById('current-question').textContent = currentQuestion + 1;
    
    // Set question text
    const questionText = questionContainer.querySelector('.question-text');
    questionText.innerHTML = `"${questionData.quote}" <br><span class="question-translation">${currentLang === 'es' ? '(Traducción: Pendiente)' : ''}</span>`;
    
    // Clear previous options
    const optionsContainer = questionContainer.querySelector('.options-container');
    optionsContainer.innerHTML = '';
    
    // Add options
    questionData.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.setAttribute('data-index', index);
        optionElement.addEventListener('click', checkAnswer);
        optionsContainer.appendChild(optionElement);
    });
    
    // Reset hint
    const hintButton = questionContainer.querySelector('.hint-button');
    const hintText = questionContainer.querySelector('.hint-text');
    hintText.style.display = 'none';
    hintText.textContent = questionData.hint;
    
    hintButton.addEventListener('click', function() {
        hintText.style.display = 'block';
    });
}

// Check answer
function checkAnswer() {
    const selectedIndex = parseInt(this.getAttribute('data-index'));
    const correctIndex = quizData[currentQuestion].correct;
    
    // Disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.removeEventListener('click', checkAnswer);
    });
    
    // Highlight correct and incorrect answers
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    // Update score
    if (selectedIndex === correctIndex) {
        score++;
    }
    
    // Move to next question or show results after delay
    setTimeout(() => {
        currentQuestion++;
        
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Show quiz results
function showResults() {
    // Hide questions, show results
    document.querySelector('.quiz-questions').classList.remove('active');
    document.querySelector('.quiz-results').classList.add('active');
    
    // Update score display
    document.getElementById('score').textContent = score;
    
    // Update score message
    const scoreMessage = document.getElementById('score-message');
    if (score === quizData.length) {
        scoreMessage.textContent = "Perfect! You're a movie quote expert!";
    } else if (score >= quizData.length * 0.7) {
        scoreMessage.textContent = "Great job! You really know your movies!";
    } else if (score >= quizData.length * 0.5) {
        scoreMessage.textContent = "Not bad! You know some classic movie quotes.";
    } else {
        scoreMessage.textContent = "Time to watch more movies! Keep learning!";
    }
    
    // Show explanations
    const explanationContainer = document.querySelector('.explanation-container');
    explanationContainer.innerHTML = '';
    
    quizData.forEach((item, index) => {
        const explanationItem = document.createElement('div');
        explanationItem.className = 'explanation-item';
        
        explanationItem.innerHTML = `
            <div class="explanation-quote">"${item.quote}"</div>
            <div class="explanation-movie">Movie: ${item.options[item.correct]}</div>
            <div class="explanation-text">${item.explanation}</div>
        `;
        
        explanationContainer.appendChild(explanationItem);
    });
    
    // Update participant count
    participantCount++;
    document.getElementById('quiz-participants').textContent = participantCount;
}

// Reset quiz
function resetQuiz() {
    // Hide results, show intro
    document.querySelector('.quiz-results').classList.remove('active');
    document.querySelector('.quiz-intro').classList.add('active');
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const formMessage = document.querySelector('.form-message');
            formMessage.className = 'form-message success';
            
            if (currentLang === 'en') {
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            } else {
                formMessage.textContent = '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.';
            }
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
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
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}
