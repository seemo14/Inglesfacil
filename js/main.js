```javascript
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
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
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
    initializeLanguageSystem();
});

// Initialize language system
async function initializeLanguageSystem() {
    try {
        // Load translations
        // Assume translations_en.json contains the 'en' object directly
        // and translations_es.json contains the 'es' object directly.
        const enResponse = await fetch('translations_en.json');
        const esResponse = await fetch('translations_es.json');
        
        const enData = await enResponse.json();
        const esData = await esResponse.json();
        
        translations = {
            en: enData,
            es: esData
        };
        
        // Detect user's preferred language
        detectLanguage();
        
        // Set up language selector
        setupLanguageSelector();
        
        // Initial translation of the page
        translatePage(currentLang);
        
        // Now that translations are loaded and applied, initialize other components
        initializeQuiz();
        initializeContactForm();
        
        console.log('Language system initialized successfully');
    } catch (error) {
        console.error('Error initializing language system:', error);
        
        // --- Fallback to hardcoded translations if JSON files can't be loaded ---
        translations = {
            en: {
                nav: { home: "Home", features: "Features", content: "Content", quiz: "Quiz", resources: "Resources", contact: "Contact", brand: "Easy English with Ana" },
                hero: { title: "Learn English the Easy Way", subtitle: "Join our community of over 385,000 Spanish speakers learning English through engaging, practical, and fun content.", btn_resources: "Get Learning Resources", btn_instagram: "Follow on Instagram" },
                features: { title: "Why Learn With Us", daily_life: { title: "Daily Life English", description: "Learn the most useful sentences and expressions that Spanish speakers need in everyday situations." }, movie_vocab: { title: "Movie Vocabulary", description: "Understand your favorite movies and series by learning common expressions and slang used in entertainment." }, pronunciation: { title: "Perfect Pronunciation", description: "Master the sounds that are most challenging for Spanish speakers with our targeted practice exercises." } },
                content: { title: "Our Popular Content", vocabulary: { tag: "Vocabulary", title: "How Many Words Do You Know?", description: "Test your knowledge with our popular word recognition challenges. How many English words can you remember?", button: "Watch Example" }, movies: { tag: "Movies", title: "Famous Movie Quotes", description: "Learn iconic movie quotes in English and impress your friends with your cultural knowledge and perfect pronunciation.", button: "Watch Example" }, pronunciation: { tag: "Pronunciation", title: "Perfect Pronunciation", description: "Master the most challenging English sounds for Spanish speakers with our targeted pronunciation exercises.", button: "Watch Example" } },
                quiz: { title: "Test Your Movie Quote Knowledge", intro: "How well do you know famous movie quotes in English? Take this quick quiz to test your knowledge!", questions: "6 questions", participants: "people have taken this quiz", start_button: "Start Quiz", question: "Question", prev_button: "Previous", next_button: "Next", see_results: "See Results", hint_button: "Need a hint?", your_score: "Your Score:", perfect_score: "Perfect! You're a movie quote master! Your English and movie knowledge are impressive!", good_score: "Very good! You know your movies and English quotes quite well!", average_score: "Good try! Keep watching movies in English to improve your knowledge!", low_score: "Keep practicing! Watch more movies in English with subtitles to learn these famous quotes!", participant_text: "You're participant #", participant_suffix: "to take this quiz!", share_results: "Share your results:", share_message: "I scored {score}/6 on the Easy English with Ana movie quotes quiz! Can you beat it?" },
                social: { title: "Follow Us on Social Media", tiktok: { title: "TikTok", description: "Learn English with short, fun videos. Useful phrases, pronunciation, and quick tips.", button: "Follow on TikTok" }, youtube: { title: "YouTube", description: "Full lessons, detailed explanations, and exclusive content to improve your English.", button: "Subscribe" } },
                info: { tips: { title: "Learning Tips", description: "Discover effective strategies to learn English faster, memorization techniques, and recommended study habits.", button: "View Tips" }, practice: { title: "English Practice", description: "Interactive exercises, vocabulary games, and comprehension activities to practice your English in a fun way.", button: "Practice Now" } },
                resources: { title: "Learning Resources", travel_guide: { title: "Travel English Guide", description: "Essential phrases and vocabulary for Spanish speakers traveling to English-speaking countries.", price_original: "$9.99", price_current: "Free for a limited time!", button: "Get Guide" }, movie_collection: { title: "Movie English Collection", description: "Learn 100+ expressions from popular movies and TV shows with context and examples.", price_original: "$14.99", price_current: "Free for a limited time!", button: "Get Collection" }, pronunciation_workbook: { title: "Pronunciation Workbook", description: "Targeted exercises for Spanish speakers to master challenging English sounds.", price_original: "$12.99", price_current: "Free for a limited time!", button: "Get Workbook" } },
                contact: { title: "Get in Touch", name_placeholder: "Your Name", email_placeholder: "Your Email", topic_options: { default: "Select Topic", partnership: "Business Partnership", sponsorship: "Sponsorship", resources: "Learning Resources", other: "Other" }, message_placeholder: "Your Message", submit_button: "Send Message", success_message: "Message sent successfully! We will respond to you soon.", error_message_fill: "Please fill in all fields.", error_message_email: "Please enter a valid email address.", loading_message: "Sending message..." },
                footer: { about_text: "Helping Spanish speakers learn English through engaging, practical, and fun content since 2020.", quick_links: "Quick Links", resources_title: "Resources", resources_links: { free_guides: "Free PDF Guides", premium: "Premium Materials", vip: "VIP Membership", business: "Business English", travel: "Travel English" }, copyright: "All Rights Reserved." },
                language: { en: "English", es: "Spanish" }
            },
            es: {
                nav: { home: "Inicio", features: "Características", content: "Contenido", quiz: "Cuestionario", resources: "Recursos", contact: "Contacto", brand: "Inglés Fácil con Ana" },
                hero: { title: "Aprende Inglés de Forma Fácil", subtitle: "Únete a nuestra comunidad de más de 385,000 hispanohablantes que aprenden inglés a través de contenido atractivo, práctico y divertido.", btn_resources: "Obtener Recursos de Aprendizaje", btn_instagram: "Síguenos en Instagram" },
                features: { title: "Por Qué Aprender Con Nosotros", daily_life: { title: "Inglés para la Vida Diaria", description: "Aprende las frases y expresiones más útiles que los hispanohablantes necesitan en situaciones cotidianas." }, movie_vocab: { title: "Vocabulario de Películas", description: "Comprende tus películas y series favoritas aprendiendo expresiones comunes y jerga utilizada en el entretenimiento." }, pronunciation: { title: "Pronunciación Perfecta", description: "Domina los sonidos que son más desafiantes para los hispanohablantes con nuestros ejercicios de práctica específicos." } },
                content: { title: "Nuestro Contenido Popular", vocabulary: { tag: "Vocabulario", title: "¿Cuántas Palabras Conoces?", description: "Pon a prueba tus conocimientos con nuestros populares desafíos de reconocimiento de palabras. ¿Cuántas palabras en inglés puedes recordar?", button: "Ver Ejemplo" }, movies: { tag: "Películas", title: "Frases de Películas Famosas", description: "Aprende frases icónicas de películas en inglés e impresiona a tus amigos con tu conocimiento cultural y perfecta pronunciación.", button: "Ver Ejemplo" }, pronunciation: { tag: "Pronunciación", title: "Pronunciación Perfecta", description: "Domina los sonidos más desafiantes del inglés para hispanohablantes con nuestros ejercicios de pronunciación específicos.", button: "Ver Ejemplo" } },
                quiz: { title: "Pon a Prueba Tu Conocimiento de Frases de Películas", intro: "¿Qué tan bien conoces las frases famosas de películas en inglés? ¡Haz este breve cuestionario para poner a prueba tus conocimientos!", questions: "6 preguntas", participants: "personas han realizado este cuestionario", start_button: "Comenzar Cuestionario", question: "Pregunta", prev_button: "Anterior", next_button: "Siguiente", see_results: "Ver Resultados", hint_button: "¿Necesitas una pista?", your_score: "Tu Puntuación:", perfect_score: "¡Perfecto! Eres un maestro de las frases de películas. ¡Tu inglés y conocimiento cinematográfico son impresionantes!", good_score: "¡Muy bien! Conoces tus películas y frases en inglés bastante bien.", average_score: "¡Buen intento! Sigue viendo películas en inglés para mejorar tus conocimientos.", low_score: "¡Sigue practicando! Mira más películas en inglés con subtítulos para aprender estas frases famosas.", participant_text: "Eres el participante #", participant_suffix: "en realizar este cuestionario!", share_results: "Comparte tus resultados:", share_message: "¡He obtenido {score}/6 en el cuestionario de frases de películas en inglés de Inglés Fácil con Ana! ¿Puedes superarlo?" },
                social: { title: "Síguenos en Redes Sociales", tiktok: { title: "TikTok", description: "Aprende inglés con videos cortos y divertidos. Frases útiles, pronunciación y consejos rápidos.", button: "Seguir en TikTok" }, youtube: { title: "YouTube", description: "Lecciones completas, explicaciones detalladas y contenido exclusivo para mejorar tu inglés.", button: "Suscríbete" } },
                info: { tips: { title: "Consejos de Aprendizaje", description: "Descubre estrategias efectivas para aprender inglés más rápido, técnicas de memorización y hábitos de estudio recomendados.", button: "Ver Consejos" }, practice: { title: "Práctica de Inglés", description: "Ejercicios interactivos, juegos de vocabulario y actividades de comprensión para practicar tu inglés de forma divertida.", button: "Practicar Ahora" } },
                resources: { title: "Recursos de Aprendizaje", travel_guide: { title: "Guía de Inglés para Viajes", description: "Frases esenciales y vocabulario para hispanohablantes que viajan a países de habla inglesa.", price_original: "$9.99", price_current: "¡Gratis por tiempo limitado!", button: "Obtener Guía" }, movie_collection: { title: "Colección de Inglés de Películas", description: "Aprende más de 100 expresiones de películas y programas de TV populares con contexto y ejemplos.", price_original: "$14.99", price_current: "¡Gratis por tiempo limitado!", button: "Obtener Colección" }, pronunciation_workbook: { title: "Cuaderno de Ejercicios de Pronunciación", description: "Ejercicios específicos para hispanohablantes para dominar los sonidos desafiantes del inglés.", price_original: "$12.99", price_current: "¡Gratis por tiempo limitado!", button: "Obtener Cuaderno" } },
                contact: { title: "Ponte en Contacto", name_placeholder: "Tu Nombre", email_placeholder: "Tu Email", topic_options: { default: "Seleccionar Tema", partnership: "Asociación Comercial", sponsorship: "Patrocinio", resources: "Recursos de Aprendizaje", other: "Otro" }, message_placeholder: "Tu Mensaje", submit_button: "Enviar Mensaje", success_message: "¡Mensaje enviado con éxito! Te responderemos pronto.", error_message_fill: "Por favor completa todos los campos.", error_message_email: "Por favor ingresa un email válido.", loading_message: "Enviando mensaje..." },
                footer: { about_text: "Ayudando a hispanohablantes a aprender inglés a través de contenido atractivo, práctico y divertido desde 2020.", quick_links: "Enlaces Rápidos", resources_title: "Recursos", resources_links: { free_guides: "Guías PDF Gratuitas", premium: "Materiales Premium", vip: "Membresía VIP", business: "Inglés de Negocios", travel: "Inglés para Viajes" }, copyright: "Todos los Derechos Reservados." },
                language: { en: "English", es: "Español" }
            }
        };
        
        // Continue with available translations
        detectLanguage();
        setupLanguageSelector();
        translatePage(currentLang);
        initializeQuiz(); // Initialize quiz after fallback translations are loaded
        initializeContactForm(); // Initialize contact form after fallback translations are loaded
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
    const languageSelector = document.querySelector('.language-selector');
    
    // Update current language display
    updateCurrentLanguageDisplay();
    
    // Add click event listeners to language options
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

// Update current language display
function updateCurrentLanguageDisplay() {
    const currentLangText = document.querySelector('.current-lang-text');
    const currentLangFlagContainer = document.querySelector('.current-lang'); // The parent of the flag SVG
    
    if (currentLangText && translations[currentLang] && translations[currentLang].language) {
        currentLangText.textContent = translations[currentLang].language[currentLang];
    }
    
    // Update active class for language options in the dropdown
    document.querySelectorAll('.lang-option').forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Update the displayed flag (SVG) in the current-lang div
    const englishFlagSvg = `<svg class="flag-svg current-lang-flag" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                            <rect width="60" height="30" fill="#00247d"/>
                            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" stroke-width="2"/>
                            <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" stroke-width="10"/>
                            <path d="M30,0 L30,30 M0,15 L60,15" stroke="#cf142b" stroke-width="6"/>
                        </svg>`;
    const spanishFlagSvg = `<svg class="flag-svg current-lang-flag" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                            <rect width="60" height="30" fill="#c60b1e"/>
                            <rect width="60" height="15" y="7.5" fill="#ffc400"/>
                        </svg>`;

    if (currentLangFlagContainer) {
        // Find the existing flag SVG element inside .current-lang
        const existingFlagSvg = currentLangFlagContainer.querySelector('.flag-svg.current-lang-flag');
        if (existingFlagSvg) {
            existingFlagSvg.outerHTML = currentLang === 'en' ? englishFlagSvg : spanishFlagSvg;
        }
    }
}

// Switch language
function switchLanguage(lang) {
    if (lang === currentLang) return;
    
    // Update current language
    currentLang = lang;
    
    // Store user preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update language display
    updateCurrentLanguageDisplay();
    
    // Translate page content
    translatePage(lang);
}

// Translate page content
function translatePage(lang) {
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
    
    // Translate quiz content (for static elements, dynamic ones are handled in quiz functions)
    translateQuizContent(lang);
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

// Translate quiz content (for elements not dynamically changed by quiz state)
function translateQuizContent(lang) {
    if (!translations[lang] || !translations[lang].quiz) return;
    
    // Update quiz title and intro (handled by data-i18n on respective elements)
    // const quizTitle = document.querySelector('.quiz-title');
    // if (quizTitle) { quizTitle.textContent = translations[lang].quiz.title; }
    // const quizIntro = document.querySelector('.quiz-intro p[data-i18n="quiz.intro"]');
    // if (quizIntro) { quizIntro.textContent = translations[lang].quiz.intro; }

    // Update start button (handled by data-i18n)
    // const startBtn = document.getElementById('start-quiz');
    // if (startBtn) { startBtn.textContent = translations[lang].quiz.start_button; }
    
    // Update navigation buttons (dynamic ones handled in showQuestion)
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        prevBtn.textContent = translations[lang].quiz.prev_button;
    }
    // The nextBtn text is dynamically set in `showQuestion` based on quiz progress.
    
    // Update question text in progress bar (only the "Question" part)
    const progressTextSpan = document.querySelector('.quiz-progress .progress-text span[data-i18n="quiz.question"]');
    if (progressTextSpan) {
        progressTextSpan.textContent = translations[lang].quiz.question;
    }
    
    // Update hint buttons
    document.querySelectorAll('.hint-btn').forEach(button => {
        button.textContent = translations[lang].quiz.hint_button;
    });
    
    // Update results section labels (handled by data-i18n)
    // const scoreLabel = document.querySelector('.score-label');
    // if (scoreLabel) { scoreLabel.textContent = translations[lang].quiz.your_score; }
    
    // const retryBtn = document.getElementById('retry-quiz');
    // if (retryBtn) { retryBtn.textContent = translations[lang].quiz.retry_button; }
    
    // const shareText = document.querySelector('.share-results h4');
    // if (shareText) { shareText.textContent = translations[lang].quiz.share_results; }

    // Participant text needs to be re-rendered for translation
    const quizIntroParticipantText = document.querySelector('.quiz-intro p:nth-child(2)'); // "6 questions • 110 people have taken this quiz"
    if (quizIntroParticipantText) {
        const numQuestions = quizIntroParticipantText.querySelector('span[data-i18n="quiz.questions"]').textContent.split(' ')[0]; // "6"
        const participantCount = quizIntroParticipantText.querySelector('#participant-count').textContent; // "110"
        quizIntroParticipantText.innerHTML = `<span data-i18n="quiz.questions">${numQuestions} ${translations[lang].quiz.questions.split(' ')[1]}</span> • <span id="participant-count">${participantCount}</span> <span data-i18n="quiz.participants">${translations[lang].quiz.participants}</span>`;
    }

    // This part is handled in showResults, but for the initial load, make sure data-i18n is translated
    // const participantText = document.querySelector('.competition-stats p');
    // if (participantText) {
    //     const participantNumber = document.getElementById('participant-number').textContent; // Get the number as it is
    //     participantText.innerHTML = `<span data-i18n="quiz.participant_text">${translations[lang].quiz.participant_text}</span><span id="participant-number">${participantNumber}</span> <span data-i18n="quiz.participant_suffix">${translations[lang].quiz.participant_suffix}</span>`;
    // }
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
    const participantCount = document.getElementById('participant-count'); // For intro screen
    const participantNumber = document.getElementById('participant-number'); // For results screen
    
    if (!startBtn) return; // Exit if quiz elements are not present
    
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
        
        // Update progress text and fill
        const progressTextEl = document.querySelector('.quiz-progress .progress-text');
        if (progressTextEl && translations[currentLang]?.quiz?.question) {
            progressTextEl.innerHTML = `<span data-i18n="quiz.question">${translations[currentLang].quiz.question}</span> <span id="current-question">${questionNumber}</span>/${questions.length}`;
        }
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
            if (participantCount) participantCount.textContent = participants; // Update on intro if visible
            if (participantNumber) participantNumber.textContent = participants; // Update on results screen
            localStorage.setItem('movieQuizParticipants', participants);
            quizCompleted = true;
        }

        // Update participant text with translation
        const participantTextWrapper = document.querySelector('.competition-stats p');
        if (participantTextWrapper && translations[currentLang]?.quiz) {
            const currentParticipantNumber = participantNumber.textContent; // Get the currently displayed number
            const textBefore = translations[currentLang].quiz.participant_text || "You're participant #";
            const textAfter = translations[currentLang].quiz.participant_suffix || "to take this quiz!";
            participantTextWrapper.innerHTML = `${textBefore}<span id="participant-number">${currentParticipantNumber}</span> ${textAfter}`;
        }
    }
    
    // Retry quiz
    retryBtn.addEventListener('click', function() {
        // Reset quiz state
        currentQuestion = 1;
        score = 0;
        answeredQuestions = {};
        quizCompleted = false; // Allow participant count to increment again if retried

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
            
            // Use translated share message
            const shareMessageTemplate = getNestedTranslation(translations[currentLang], 'quiz.share_message') || 
                                        "I scored {score}/6 on the Easy English with Ana movie quotes quiz! Can you beat it?";
            const message = encodeURIComponent(shareMessageTemplate.replace('{score}', score));
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
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const topic = document.getElementById('topic').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !topic || !message) {
            showFormMessage('error', 'contact.error_message_fill'); // Use translation key
            return;
        }
        
        // Email validation
        if (!validateEmail(email)) {
            showFormMessage('error', 'contact.error_message_email'); // Use translation key
            return;
        }
        
        // Simulate form submission (in a real implementation, this would send data to a server)
        showFormMessage('loading', 'contact.loading_message'); // Use translation key
        
        // Simulate server response after 1.5 seconds
        setTimeout(function() {
            // Success message
            showFormMessage('success', 'contact.success_message'); // Use translation key
            
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
    function showFormMessage(type, messageKey) { // messageKey refers to a translation key
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Get the translated message
        const message = getNestedTranslation(translations[currentLang], messageKey) || messageKey; // Fallback to key if not found
        
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
}
```

