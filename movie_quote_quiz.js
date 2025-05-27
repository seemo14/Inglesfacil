// Movie Quote Quiz JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Quiz elements
    const quizIntro = document.querySelector('.quiz-intro');
    const quizQuestions = document.querySelector('.quiz-questions');
    const quizResults = document.querySelector('.quiz-results');
    const startBtn = document.getElementById('start-quiz');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const retryBtn = document.getElementById('retry-quiz');
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionEl = document.getElementById('current-question');
    const questions = document.querySelectorAll('.question');
    const scoreEl = document.getElementById('score');
    const scoreMessage = document.getElementById('score-message');
    const participantCount = document.getElementById('participant-count');
    const participantNumber = document.getElementById('participant-number');
    
    // Quiz state
    let currentQuestion = 1;
    let score = 0;
    let answeredQuestions = {};
    let quizCompleted = false;
    
    // Initialize participant count from localStorage or default to 110
    let participants = localStorage.getItem('movieQuizParticipants') ? 
        parseInt(localStorage.getItem('movieQuizParticipants')) : 110;
    participantCount.textContent = participants;
    
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
        currentQuestionEl.classList.add('active');
        
        // Update progress
        document.getElementById('current-question').textContent = questionNumber;
        progressFill.style.width = `${(questionNumber / questions.length) * 100}%`;
        
        // Update navigation buttons
        prevBtn.disabled = questionNumber === 1;
        
        if (questionNumber === questions.length) {
            nextBtn.textContent = 'See Results';
        } else {
            nextBtn.textContent = 'Next';
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
        
        // Update score message
        if (score === 6) {
            scoreMessage.textContent = "¡Perfecto! You're a movie quote master! Your English and movie knowledge are impressive!";
        } else if (score >= 4) {
            scoreMessage.textContent = "¡Muy bien! You know your movies and English quotes quite well!";
        } else if (score >= 2) {
            scoreMessage.textContent = "¡Buen intento! Keep watching movies in English to improve your knowledge!";
        } else {
            scoreMessage.textContent = "¡Sigue practicando! Watch more movies in English with subtitles to learn these famous quotes!";
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
    
    // Initialize social share buttons (simplified - would need actual implementation)
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Sharing functionality would be implemented here!');
        });
    });
});
