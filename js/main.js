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
    
    // Initialize quiz separately to ensure it works even if language system has issues
    initializeQuiz();
    
    // Initialize contact form
    initializeContactForm();
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
    const currentLangFlag = document.querySelector('.current-lang-flag');
    
    // Update text
    if (currentLangText) {
        currentLangText.textContent = translations[currentLang]?.language?.[currentLang] || (currentLang === 'en' ? 'English' : 'Español');
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
}

// Switch language
function switchLanguage(lang) {
    if (lang === currentLang || !['en', 'es'].includes(lang)) return;
    
    // Update current language
    currentLang = lang;
    
    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', currentLang);
    
    // Update display
    updateCurrentLanguageDisplay();
    
    // Translate page
    translatePage(currentLang);
}

// Translate page content
function translatePage(lang) {
    if (!translations[lang]) return;
    
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getNestedTranslation(translations[lang], key);
        
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Update document title
    const titleKey = document.querySelector('title').getAttribute('data-i18n');
    if (titleKey) {
        const titleTranslation = getNestedTranslation(translations[lang], titleKey);
        if (titleTranslation) {
            document.title = titleTranslation;
        }
    }
}

// Helper function to get nested translation
function getNestedTranslation(obj, path) {
    const keys = path.split('.');
    return keys.reduce((o, k) => (o || {})[k], obj);
}

// Initialize quiz functionality
function initializeQuiz() {
    const startQuizBtn = document.getElementById('start-quiz');
    const quizIntro = document.querySelector('.quiz-intro');
    const quizQuestions = document.querySelector('.quiz-questions');
    const quizResults = document.querySelector('.quiz-results');
    const questions = document.querySelectorAll('.question');
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('current-question');
    const prevQuestionBtn = document.getElementById('prev-question');
    const nextQuestionBtn = document.getElementById('next-question');
    const seeResultsBtn = document.getElementById('see-results');
    const restartQuizBtn = document.getElementById('restart-quiz');
    const userScoreSpan = document.getElementById('user-score');
    const scoreMessageP = document.getElementById('score-message');
    const participantNumberSpan = document.getElementById('participant-number');
    const participantCountSpan = document.getElementById('participant-count');
    
    // If any of these elements don't exist, the quiz isn't on the page
    if (!startQuizBtn || !quizIntro || !quizQuestions || !quizResults) {
        console.log('Quiz elements not found, skipping quiz initialization');
        return;
    }
    
    let currentQuestion = 1;
    let score = 0;
    let participantCount = parseInt(participantCountSpan.textContent) || 110;
    
    // Start quiz
    startQuizBtn.addEventListener('click', function() {
        quizIntro.classList.remove('active');
        quizQuestions.classList.add('active');
        showQuestion(1);
    });
    
    // Show question
    function showQuestion(questionNumber) {
        questions.forEach(question => {
            question.classList.remove('active');
        });
        
        const questionToShow = document.querySelector(`.question[data-question="${questionNumber}"]`);
        if (questionToShow) {
            questionToShow.classList.add('active');
            currentQuestionSpan.textContent = questionNumber;
            progressFill.style.width = `${(questionNumber / questions.length) * 100}%`;
        }
        
        // Update navigation buttons
        prevQuestionBtn.style.display = questionNumber === 1 ? 'none' : 'block';
        nextQuestionBtn.style.display = questionNumber < questions.length ? 'block' : 'none';
        seeResultsBtn.style.display = questionNumber === questions.length ? 'block' : 'none';
    }
    
    // Previous question
    prevQuestionBtn.addEventListener('click', function() {
        if (currentQuestion > 1) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });
    
    // Next question
    nextQuestionBtn.addEventListener('click', function() {
        if (currentQuestion < questions.length) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    });
    
    // Option selection
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const question = this.closest('.question');
            const options = question.querySelectorAll('.option');
            
            // If already answered, do nothing
            if (options[0].disabled) return;
            
            // Disable all options
            options.forEach(opt => {
                opt.disabled = true;
                opt.classList.remove('selected');
            });
            
            // Select this option
            this.classList.add('selected');
            
            // Check if correct
            const isCorrect = this.hasAttribute('data-correct');
            if (isCorrect) {
                this.classList.add('correct');
                score++;
            } else {
                this.classList.add('incorrect');
                
                // Highlight correct answer
                options.forEach(opt => {
                    if (opt.hasAttribute('data-correct')) {
                        opt.classList.add('correct');
                    }
                });
            }
            
            // Show explanation
            const explanation = question.querySelector('.explanation');
            if (explanation) {
                explanation.classList.add('active');
            }
        });
    });
    
    // Hint buttons
    document.querySelectorAll('.hint-btn').forEach(button => {
        button.addEventListener('click', function() {
            const hint = this.nextElementSibling;
            hint.classList.toggle('active');
        });
    });
    
    // See results
    seeResultsBtn.addEventListener('click', function() {
        quizQuestions.classList.remove('active');
        quizResults.classList.add('active');
        
        // Update score
        userScoreSpan.textContent = score;
        
        // Update score message
        if (score === questions.length) {
            scoreMessageP.textContent = translations[currentLang]?.quiz?.perfect_score || 'Perfect! You\'re a movie quote master! Your English and movie knowledge are impressive!';
        } else if (score >= questions.length * 0.7) {
            scoreMessageP.textContent = translations[currentLang]?.quiz?.good_score || 'Very good! You know your movies and English quotes quite well!';
        } else if (score >= questions.length * 0.5) {
            scoreMessageP.textContent = translations[currentLang]?.quiz?.average_score || 'Good try! Keep watching movies in English to improve your knowledge!';
        } else {
            scoreMessageP.textContent = translations[currentLang]?.quiz?.low_score || 'Keep practicing! Watch more movies in English with subtitles to learn these famous quotes!';
        }
        
        // Update participant number
        participantCount++;
        participantCountSpan.textContent = participantCount;
        participantNumberSpan.textContent = participantCount;
        
        // Set up share links
        const shareMessage = (translations[currentLang]?.quiz?.share_message || 'I scored {score}/6 on the Easy English with Ana movie quotes quiz! Can you beat it?').replace('{score}', score);
        const encodedMessage = encodeURIComponent(shareMessage);
        const shareUrl = encodeURIComponent(window.location.href);
        
        document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${shareUrl}`;
        document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodedMessage}`;
        document.getElementById('share-whatsapp').href = `https://wa.me/?text=${encodedMessage} ${shareUrl}`;
    });
    
    // Restart quiz
    restartQuizBtn.addEventListener('click', function() {
        // Reset score
        score = 0;
        
        // Reset questions
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
        
        // Show intro
        quizResults.classList.remove('active');
        quizIntro.classList.add('active');
        
        // Reset current question
        currentQuestion = 1;
    });
    
    console.log('Quiz initialized successfully');
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.querySelector('.form-message');
    
    if (!contactForm || !formMessage) {
        console.log('Contact form elements not found, skipping form initialization');
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const topic = document.getElementById('topic').value;
        const message = document.getElementById('message').value.trim();
        
        // Validate form
        if (!name || !email || !topic || !message) {
            formMessage.textContent = translations[currentLang]?.contact?.error_message_fill || 'Please fill in all fields.';
            formMessage.className = 'form-message error';
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formMessage.textContent = translations[currentLang]?.contact?.error_message_email || 'Please enter a valid email address.';
            formMessage.className = 'form-message error';
            return;
        }
        
        // Show loading message
        formMessage.textContent = translations[currentLang]?.contact?.loading_message || 'Sending message...';
        formMessage.className = 'form-message loading';
        
        // Simulate form submission (replace with actual form submission)
        setTimeout(function() {
            // Show success message
            formMessage.textContent = translations[currentLang]?.contact?.success_message || 'Message sent successfully! We will respond to you soon.';
            formMessage.className = 'form-message success';
            
            // Reset form
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(function() {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });
    
    console.log('Contact form initialized successfully');
}
