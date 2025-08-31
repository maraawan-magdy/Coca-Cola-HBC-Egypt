// ================== Global State & Configuration ==================
let currentRuleIndex = 0;
let correctAnswersCount = 0;
let currentVisitorId = null;
let videoWatched = false;
let currentLang = 'en';

const rulesAndQuestions = [
    { type: 'rule', id: 'rule1' },
    { type: 'question', id: 'question1', correctAnswer: 'b' },
    { type: 'rule', id: 'rule2' },
    { type: 'question', id: 'question2', correctAnswer: 'a' },
    // ... add all other rules and questions here following the same pattern
];

// Cache DOM elements
const mainContent = document.getElementById('main-content');
const langToggleBtn = document.getElementById('language-toggle');
const safetyVideo = document.getElementById('safety-video');

// ================== Initialization & Event Listeners ==================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language and display welcome page
    setLanguage(currentLang);
    showPage('welcome');

    // Smooth ScrollReveal animations for hero content
    if (window.ScrollReveal) {
        ScrollReveal().reveal('.fade-in-up', { distance: '60px', duration: 1200, origin: 'bottom', opacity: 0 });
    }

    // Language toggle event listener
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            setLanguage(currentLang);
            langToggleBtn.textContent = currentLang.toUpperCase();
        });
    }

    // Video end listener
    if (safetyVideo) {
        safetyVideo.addEventListener('ended', () => {
            videoWatched = true;
            const nextButton = document.getElementById('next-btn');
            if (nextButton) {
                nextButton.disabled = false;
            }
        });
    }
});

// ================== Language & Translation Logic ==================
async function setLanguage(lang) {
    try {
        const response = await fetch(`i18n/lang.json`);
        const translations = await response.json();
        
        // Update all elements with a data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = translations[lang][key];
            if (translation) {
                // Handle different types of elements (e.g., input placeholder, content)
                if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'OPTION') {
                    element.setAttribute('aria-label', translation);
                } else if (element.tagName === 'META') {
                    element.setAttribute('content', translation);
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Set HTML direction and lang attribute
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// ================== Page Navigation Logic ==================
function showPage(pageId) {
    // Hide all pages with a fade-out effect
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the target page with a fade-in effect
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = ((currentRuleIndex + 1) / rulesAndQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function nextPage() {
    currentRuleIndex++;
    if (currentRuleIndex < rulesAndQuestions.length) {
        displayCurrentRuleOrQuestion();
    } else {
        endQuiz();
    }
}

// ================== Visitor & Quiz Logic ==================
function handleVisitorRegistration() {
    const fullname = document.getElementById('fullname').value;
    // ... get other form data
    
    if (!fullname) { // Simple validation
        alert('Please fill in all fields.');
        return;
    }
    
    // Disable button to prevent multiple submissions
    const nextButton = document.querySelector('.form-submit');
    nextButton.disabled = true;

    // Simulate saving data (replace with actual Firebase logic)
    setTimeout(() => {
        // ... call your Firebase registration function here
        showPage('instructions');
        nextButton.disabled = false;
    }, 1000);
}

function startRulesQuestions() {
    if (!videoWatched) {
        alert("Please watch the safety video before proceeding.");
        return;
    }
    
    correctAnswersCount = 0;
    currentRuleIndex = 0;
    displayCurrentRuleOrQuestion();
}

function displayCurrentRuleOrQuestion() {
    if (currentRuleIndex < rulesAndQuestions.length) {
        const currentPage = rulesAndQuestions[currentRuleIndex];
        showPage(currentPage.id);
        updateProgressBar();
    } else {
        endQuiz();
    }
}

function checkAnswer(questionNumber, correctAnswer) {
    const questionPageElement = document.getElementById(`question${questionNumber}`);
    const selectedOption = questionPageElement.querySelector(`input[name="q${questionNumber}"]:checked`);
    
    if (!selectedOption) {
        const tryAgainSpan = document.getElementById(`try-again-${questionNumber}`);
        tryAgainSpan.style.display = 'block';
        return;
    }

    if (selectedOption.value === correctAnswer) {
        correctAnswersCount++;
        nextPage();
    } else {
        const tryAgainSpan = document.getElementById(`try-again-${questionNumber}`);
        tryAgainSpan.style.display = 'block';
        selectedOption.checked = false; // Reset radio button
    }
}

function endQuiz() {
    if (correctAnswersCount >= 8) { // Pass if 8 or more correct answers
        showPage('qr-success');
        // generateQRCode for success
        generateQRCode('Generated QR code content', 'qr-canvas-result'); 
    } else {
        showPage('fail');
    }
}

function generateQRCode(text, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    QRCode.toCanvas(canvas, text, { width: 250 }, (error) => {
        if (error) console.error(error);
        console.log('QR Code generated!');
    });
}

function downloadQRCode(canvasId) {
    const canvas = document.getElementById(canvasId);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `CocaCola_HBC_Visitor_Pass.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Expose functions to the global scope
window.showPage = showPage;
window.handleVisitorRegistration = handleVisitorRegistration;
window.startRulesQuestions = startRulesQuestions;
window.nextPage = nextPage;
window.checkAnswer = checkAnswer;
window.downloadQRCode = downloadQRCode;