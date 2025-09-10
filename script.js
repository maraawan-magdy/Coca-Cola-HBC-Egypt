// Coca-Cola HBC Safety Briefing - Fixed Page Management
// ScrollReveal for entrance animations
// QRCode.js already loaded via CDN

// Global state variables
let currentRuleIndex = 0;
let correctAnswersCount = 0;
let currentVisitorId = null;
let videoWatched = false;

const rulesAndQuestions = [
  { type: 'rule', id: 'rule1' },
  { type: 'question', id: 'question1', correctAnswer: 'b' },
  { type: 'rule', id: 'rule2' },
  { type: 'question', id: 'question2', correctAnswer: 'a' },
  { type: 'rule', id: 'rule3' },
  { type: 'question', id: 'question3', correctAnswer: 'b' },
  { type: 'rule', id: 'rule4' },
  { type: 'question', id: 'question4', correctAnswer: 'a' },
  { type: 'rule', id: 'rule5' },
  { type: 'question', id: 'question5', correctAnswer: 'a' },
  { type: 'rule', id: 'rule6' },
  { type: 'question', id: 'question6', correctAnswer: 'b' },
  { type: 'rule', id: 'rule7' },
  { type: 'question', id: 'question7', correctAnswer: 'b' },
  { type: 'rule', id: 'rule8' },
  { type: 'question', id: 'question8', correctAnswer: 'b' },
  { type: 'rule', id: 'rule9' },
  { type: 'question', id: 'question9', correctAnswer: 'b' },
  { type: 'rule', id: 'rule10' },
  { type: 'question', id: 'question10', correctAnswer: 'a' },
  { type: 'game', id: 'recycling-game' },
  { type: 'game', id: 'ppe-game' },
  { type: 'rule', id: 'rule11' }
];

// --- Utility Functions for UI Control ---
function showPage(pageId) {
  console.log("showPage called with:", pageId);
  // Hide all page sections
  const allSections = document.querySelectorAll('.page-section');
  console.log("Found sections:", allSections.length);
  allSections.forEach(section => {
    console.log("Hiding section:", section.id);
    section.classList.remove('active');
  });

  // Show only the target section
  const targetSection = document.getElementById(pageId);
  if (targetSection) {
    console.log("Showing section:", targetSection.id);
    targetSection.classList.add('active');
    window.scrollTo(0, 0);
  } else {
    console.error("Target section not found:", pageId);
  }
}

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const progress = ((currentRuleIndex + 1) / rulesAndQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

// --- App Logic ---
window.addEventListener('DOMContentLoaded', function () {
  console.log("DOMContentLoaded event fired in script.js");

  // Check if intro is currently running
  const introRunning = localStorage.getItem('introRunning') === 'true';
  console.log("Intro running status from localStorage:", introRunning);

  if (introRunning) {
    // Intro is running, let it handle the page display
    console.log("Intro is running, letting it handle page display");
    return;
  }

  // Check if intro has been played before
  const introPlayed = localStorage.getItem('introPlayed') === 'true';
  console.log("Intro played status from localStorage:", introPlayed);

  if (introPlayed) {
    // Intro already played, show welcome page
    console.log("Showing welcome page directly");
    showPage('welcome');
  } else {
    // First time, but intro should be running - fallback to visitor form
    console.log("First time visit, showing visitor form as fallback");
    showPage('visitor-form');
  }

  if (window.ScrollReveal) {
    ScrollReveal().reveal('.hero', { distance: '60px', duration: 1200, origin: 'top', opacity: 0, delay: 100 });
  }

  // Nav link click handlers
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      showPage(sectionId);
      
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Video overlay and mandatory video functionality
  const startVideoBtn = document.getElementById('start-video-btn');
  const videoOverlay = document.getElementById('video-overlay');
  const safetyVideo = document.getElementById('safety-video');
  const nextButton = document.getElementById('next-btn');

  if (startVideoBtn && videoOverlay && safetyVideo) {
    // Start video button click handler
    startVideoBtn.addEventListener('click', function() {
      console.log('Start video button clicked');
      videoOverlay.style.display = 'none';
      safetyVideo.muted = false;
      safetyVideo.play().then(() => {
        console.log('Video started playing');
      }).catch(error => {
        console.error('Error starting video:', error);
      });
    });

    // Disable right-click context menu on video
    safetyVideo.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Disable spacebar, arrow keys, and other common video controls
      if (e.keyCode === 32 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
        return false;
      }
    });

    // Video ended handler
    safetyVideo.addEventListener('ended', function() {
      console.log('Video ended');
      videoWatched = true;
      if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = '1';
        nextButton.style.display = 'inline-block';
      }
    });
  }

  // Add event listeners to radio inputs to toggle 'selected' class on labels
  const radioOptions = document.querySelectorAll('.radio-option input[type="radio"]');
  radioOptions.forEach(radio => {
    radio.addEventListener('change', () => {
      const name = radio.name;
      // Remove 'selected' class from all labels with the same name
      document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
        if (input.parentElement.classList.contains('selected')) {
          input.parentElement.classList.remove('selected');
        }
      });
      // Add 'selected' class to the checked radio's label
      if (radio.checked) {
        radio.parentElement.classList.add('selected');
      }
    });
  });
});

function showVisitorForm() {
  showPage('visitor-form');
}

function handleVisitorRegistration() {
  const fullname = document.getElementById('fullname').value;
  const nationalid = document.getElementById('nationalid').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const bloodtype = document.getElementById('bloodtype').value;

  if (!fullname || !nationalid || !email || !phone || !bloodtype) {
    alert('Please fill in all visitor information fields.');
    return;
  }

  const nextButton = event.target;
  nextButton.disabled = true;
  nextButton.textContent = 'Saving...';

  registerVisitor()
    .then(success => {
      if (success) {
        showInstructions();
      } else {
        alert("Registration failed. Please try again.");
      }
    })
    .catch(error => {
      console.error('Registration failed:', error);
      alert("An error occurred while saving your information. Please try again.");
    })
    .finally(() => {
      nextButton.disabled = false;
      nextButton.textContent = 'Next';
    });
}

function registerVisitor() {
  const fullname = document.getElementById('fullname').value;
  const nationalid = document.getElementById('nationalid').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const bloodtype = document.getElementById('bloodtype').value;

  if (typeof database === 'undefined') {
    alert('Firebase database not initialized. Please refresh and try again.');
    return Promise.resolve(false);
  }

  const visitorData = {
    fullname,
    nationalid,
    email,
    phone,
    bloodtype,
    timestamp: new Date().toISOString()
  };

  try {
    const newVisitorRef = database.ref('visitors').push();
    currentVisitorId = newVisitorRef.key;
    
    return newVisitorRef.set(visitorData)
      .then(() => {
        console.log("Visitor data saved successfully with ID:", currentVisitorId);
        return true;
      })
      .catch(error => {
        console.error("Error saving visitor data:", error);
        if (error.code === 'PERMISSION_DENIED') {
          alert("Permission denied. Please check Firebase database rules.");
        } else if (error.code === 'NETWORK_ERROR') {
          alert("Network error. Please check your internet connection.");
        } else {
          alert("Error saving data: " + error.message + ". Please try again.");
        }
        return false;
      });
  } catch (error) {
    console.error('Exception in registerVisitor:', error);
    alert('Unexpected error: ' + error.message);
    return Promise.resolve(false);
  }
}

function showInstructions() {
  showPage('instructions');
  videoWatched = false;
  const nextButton = document.querySelector('#next-btn');
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.style.opacity = '0.5';
  }
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
    const currentPageData = rulesAndQuestions[currentRuleIndex];
    
    showPage(currentPageData.id);
      
    // Reset radio buttons for questions
    if (currentPageData.type === 'question') {
      const currentPageElement = document.getElementById(currentPageData.id);
      const form = currentPageElement.querySelector('form');
      if (form) form.reset();
      const tryAgainSpan = currentPageElement.querySelector('.try-again');
      if (tryAgainSpan) tryAgainSpan.style.display = 'none';
    }
      
    // Generate QR code for rule11
    if (currentPageData.id === 'rule11') {
      if (currentVisitorId) {
        const fullURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}scan.html?id=${currentVisitorId}`;
        generateQRCode(fullURL, 'rule11-qrcanvas');
      } else {
        console.error("No visitor ID found for QR code generation.");
        generateQRCode("Error: Visitor ID missing.", 'rule11-qrcanvas');
      }
    }
      
    updateProgressBar();
  } else {
    endQuiz();
  }
}

function nextPage() {
  currentRuleIndex++;
  if (currentRuleIndex >= rulesAndQuestions.length) {
    endQuiz();
  } else {
    displayCurrentRuleOrQuestion();
  }
}

function checkAnswer(questionNumber, correctAnswer) {
  const questionPageElement = document.getElementById(`question${questionNumber}`);
  const selectedOption = questionPageElement.querySelector(`input[name="q${questionNumber}"]:checked`);
  const tryAgainSpan = questionPageElement.querySelector(`#try-again-${questionNumber}`);

  if (!selectedOption) {
    tryAgainSpan.textContent = 'Please select an answer.';
    tryAgainSpan.style.display = 'block';
    return;
  }

  if (selectedOption.value === correctAnswer) {
    correctAnswersCount++;
    tryAgainSpan.style.display = 'none';
    nextPage();
  } else {
    tryAgainSpan.textContent = 'Try again';
    tryAgainSpan.style.display = 'block';
    selectedOption.checked = false;
  }
}

function endQuiz() {
  if (correctAnswersCount >= 8) {
    showPage('result');
    if (currentVisitorId) {
      const fullURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}scan.html?id=${currentVisitorId}`;
      generateQRCode(fullURL, 'result-qrcanvas');
    } else {
      console.error("No visitor ID found for QR code generation.");
      generateQRCode("Error: Visitor ID missing.", 'result-qrcanvas');
    }
  } else {
    showPage('fail');
  }
}

function generateQRCode(text, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Target canvas with ID '${canvasId}' not found for QR code generation.`);
    return;
  }

  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (window.QRCode) {
    QRCode.toCanvas(canvas, text, { width: 200, height: 200 }, function (error) {
      if (error) {
        console.error("Error generating QR code:", error);
      } else {
        console.log("QR code generated successfully.");
      }
    });
  } else {
    console.error("QRCode.js library not loaded.");
  }
}

function downloadQRCode() {
  const resultCanvas = document.getElementById("result-qrcanvas");
  const rule11Canvas = document.getElementById("rule11-qrcanvas");
  
  let canvas = null;
  if (resultCanvas && resultCanvas.parentElement.closest('.page-section.active')) {
    canvas = resultCanvas;
  } else if (rule11Canvas && rule11Canvas.parentElement.closest('.page-section.active')) {
    canvas = rule11Canvas;
  }

  if (canvas) {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `CocaCola_HBC_Visitor_Pass_${currentVisitorId || 'unknown'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("No visible QR code canvas found to download.");
  }
}

// --- Recycling Game Logic ---
let draggedItem = null;
let gameCompleted = false;

function initializeRecyclingGame() {
  console.log("Initializing recycling game");

  // Always reset the game for fresh start - remove the localStorage check
  gameCompleted = false;
  localStorage.removeItem('recyclingGameCompleted'); // Clear any previous completion

  const gameSection = document.getElementById('recycling-game');

  // Reset game state
  resetGameItems();

  // Add drag and drop event listeners
  const draggableItems = gameSection.querySelectorAll('.draggable-item');
  const dropZones = gameSection.querySelectorAll('.bin-drop-zone');

  // Remove existing event listeners to avoid duplicates
  draggableItems.forEach(item => {
    item.removeEventListener('dragstart', handleDragStart);
    item.removeEventListener('dragend', handleDragEnd);
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });

  dropZones.forEach(zone => {
    zone.removeEventListener('dragover', handleDragOver);
    zone.removeEventListener('drop', handleDrop);
    zone.removeEventListener('dragenter', handleDragEnter);
    zone.removeEventListener('dragleave', handleDragLeave);
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
  });

  // Hide success message initially
  const successMessage = document.getElementById('success-message');
  if (successMessage) {
    successMessage.style.display = 'none';
  }

  console.log("Recycling game initialized with", draggableItems.length, "items and", dropZones.length, "drop zones");
}

function resetGameItems() {
  const items = document.querySelectorAll('.draggable-item');
  const itemsContainer = document.querySelector('.items-container');

  items.forEach(item => {
    item.style.display = 'block';
    item.classList.remove('correct', 'incorrect');
    itemsContainer.appendChild(item);
  });
}

function handleDragStart(e) {
  draggedItem = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.outerHTML);
  e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
  e.target.style.opacity = '1';
  draggedItem = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
  e.preventDefault();
  if (e.target.classList.contains('bin-drop-zone')) {
    e.target.parentElement.classList.add('highlight');
  }
}

function handleDragLeave(e) {
  if (e.target.classList.contains('bin-drop-zone')) {
    e.target.parentElement.classList.remove('highlight');
  }
}

function handleDrop(e) {
  e.preventDefault();

  const dropZone = e.target;
  const bin = dropZone.parentElement;
  bin.classList.remove('highlight');

  if (!draggedItem || !dropZone.classList.contains('bin-drop-zone')) {
    return;
  }

  // Get item type directly from data-type attribute
  const itemType = draggedItem.dataset.type;
  const binType = dropZone.dataset.type;

  console.log("Drop attempt:", itemType, "->", binType);

  if (itemType === binType) {
    // Correct drop
    draggedItem.classList.add('correct');
    dropZone.appendChild(draggedItem);
    draggedItem.style.display = 'block';
    draggedItem.draggable = false;

    console.log("Correct drop!");
    checkGameCompletion();
  } else {
    // Incorrect drop - show error animation
    draggedItem.classList.add('incorrect');
    setTimeout(() => {
      draggedItem.classList.remove('incorrect');
    }, 1000);

    // Shake animation
    draggedItem.style.animation = 'shake 0.5s';
    setTimeout(() => {
      draggedItem.style.animation = '';
    }, 500);

    console.log("Incorrect drop!");
  }
}

function checkGameCompletion() {
  const draggableItems = document.querySelectorAll('.draggable-item');
  const correctItems = document.querySelectorAll('.draggable-item.correct');

  if (correctItems.length === draggableItems.length) {
    gameCompleted = true;
    localStorage.setItem('recyclingGameCompleted', 'true');
    showGameSuccess();
  }
}

function showGameSuccess() {
  const successMessage = document.getElementById('success-message');
  const continueBtn = document.getElementById('continue-btn');

  if (successMessage) {
    successMessage.style.display = 'block';
  }

  if (continueBtn) {
    continueBtn.style.display = 'inline-block';
  }
}

function completeRecyclingGame() {
  if (gameCompleted) {
    nextPage();
  }
}

// Update displayCurrentRuleOrQuestion to handle game initialization
const originalDisplayCurrentRuleOrQuestion = displayCurrentRuleOrQuestion;
displayCurrentRuleOrQuestion = function() {
  if (currentRuleIndex < rulesAndQuestions.length) {
    const currentPageData = rulesAndQuestions[currentRuleIndex];

    showPage(currentPageData.id);

    // Reset radio buttons for questions
    if (currentPageData.type === 'question') {
      const currentPageElement = document.getElementById(currentPageData.id);
      const form = currentPageElement.querySelector('form');
      if (form) form.reset();
      const tryAgainSpan = currentPageElement.querySelector('.try-again');
      if (tryAgainSpan) tryAgainSpan.style.display = 'none';
    }

    // Initialize recycling game
    if (currentPageData.type === 'game' && currentPageData.id === 'recycling-game') {
      initializeRecyclingGame();
    }

    // Initialize PPE game
    if (currentPageData.type === 'game' && currentPageData.id === 'ppe-game') {
      initializePPEGame();
    }

    // Generate QR code for rule11
    if (currentPageData.id === 'rule11') {
      if (currentVisitorId) {
        const fullURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}scan.html?id=${currentVisitorId}`;
        generateQRCode(fullURL, 'rule11-qrcanvas');
      } else {
        console.error("No visitor ID found for QR code generation.");
        generateQRCode("Error: Visitor ID missing.", 'rule11-qrcanvas');
      }
    }

    updateProgressBar();
  } else {
    endQuiz();
  }
};

  
// PPE Selection Game Logic
let ppeSelections = {
  hair: null,
  ear: null,
  body: null,
  foot: null
};

function initializePPEGame() {
  console.log("Initializing PPE game");

  // Reset game state
  ppeSelections = {
    hair: null,
    ear: null,
    body: null,
    foot: null
  };

  // Clear all PPE from figure
  document.getElementById('hair-cover').innerHTML = '';
  document.getElementById('ear-protection').innerHTML = '';
  document.getElementById('body-protection').innerHTML = '';
  document.getElementById('foot-protection').innerHTML = '';

  // Reset all options
  const ppeOptions = document.querySelectorAll('.ppe-option');
  console.log("Found PPE options:", ppeOptions.length);

  ppeOptions.forEach((option, index) => {
    console.log(`Resetting PPE option ${index}:`, option.dataset.category, option.dataset.item);
    option.classList.remove('selected', 'incorrect', 'correct');
    // Remove existing event listeners to avoid duplicates
    option.removeEventListener('click', handlePPEOptionClick);
    // Add fresh event listeners
    option.addEventListener('click', handlePPEOptionClick);
    console.log(`Event listener attached to PPE option ${index}`);
  });

  // Hide success message
  const successMessage = document.getElementById('ppe-success-message');
  const continueBtn = document.getElementById('ppe-continue-btn');
  if (successMessage) successMessage.style.display = 'none';
  if (continueBtn) continueBtn.style.display = 'none';

  console.log("PPE game initialized successfully");
}

function resetPPEGame() {
  ppeSelections = {
    hair: null,
    ear: null,
    body: null,
    foot: null
  };
  document.querySelectorAll('.ppe-option').forEach(option => {
    option.classList.remove('selected', 'incorrect', 'correct');
    // Re-attach event listeners to ensure they work
    option.removeEventListener('click', handlePPEOptionClick);
    option.addEventListener('click', handlePPEOptionClick);
  });
  document.getElementById('hair-cover').innerHTML = '';
  document.getElementById('ear-protection').innerHTML = '';
  document.getElementById('body-protection').innerHTML = '';
  document.getElementById('foot-protection').innerHTML = '';
  document.getElementById('ppe-success-message').style.display = 'none';
  document.getElementById('ppe-continue-btn').style.display = 'none';
}

function completePPEGame() {
  nextPage();
}

function handlePPEOptionClick(event) {
  console.log("PPE option clicked!", event.currentTarget);
  console.log("Event target:", event.target);
  console.log("Event currentTarget:", event.currentTarget);
  console.log("CurrentTarget classes:", event.currentTarget.classList);
  console.log("CurrentTarget dataset:", event.currentTarget.dataset);

  // Use closest to ensure we get the .ppe-option element even if clicked on child elements
  const option = event.target.closest('.ppe-option');
  console.log("Closest .ppe-option:", option);

  if (!option) {
    console.log("No .ppe-option element found");
    return;
  }

  const category = option.dataset.category;
  const item = option.dataset.item;
  const isCorrect = option.classList.contains('correct');

  console.log(`Clicked PPE option: category=${category}, item=${item}, isCorrect=${isCorrect}`);
  console.log("Option element:", option);
  console.log("Option classList:", option.classList.toString());

  // Deselect previous selection in category
  document.querySelectorAll(`.ppe-option[data-category="${category}"]`).forEach(opt => {
    opt.classList.remove('selected', 'incorrect');
  });

  if (isCorrect) {
    console.log("Correct PPE option selected");
    option.classList.add('selected', 'correct');
    ppeSelections[category] = option.dataset.item;
    showPPEOnFigure(category, option.dataset.item);
    checkPPEGameCompletion();
  } else {
    console.log("Incorrect PPE option selected");
    option.classList.add('incorrect');
    // Shake animation
    option.style.animation = 'shake 0.5s';
    setTimeout(() => {
      option.style.animation = '';
      option.classList.remove('incorrect');
    }, 500);
  }
}

function showPPEOnFigure(category, item) {
  const containerIdMap = {
    hair: 'hair-cover',
    ear: 'ear-protection',
    body: 'body-protection',
    foot: 'foot-protection'
  };
  const container = document.getElementById(containerIdMap[category]);
  if (!container) return;

  // Clear previous
  container.innerHTML = '';

  // Add emoji or icon representing the PPE item
  let emoji = '';
  switch (item) {
    case 'hairnet': emoji = '👒'; break;
    case 'viking-helmet': emoji = '⛑️'; break;
    case 'party-hat': emoji = '🎩'; break;
    case 'earmuffs': emoji = '🎧'; break;
    case 'headphones': emoji = '🎵'; break;
    case 'earrings': emoji = '💍'; break;
    case 'lab-coat': emoji = '🥼'; break;
    case 'superman-cape': emoji = '🦸‍♂️'; break;
    case 'tuxedo': emoji = '🤵'; break;
    case 'safety-shoes': emoji = '👢'; break;
    case 'flip-flops': emoji = '🩴'; break;
    case 'high-heels': emoji = '👠'; break;
    default: emoji = '';
  }

  const span = document.createElement('span');
  span.className = 'ppe-figure-emoji';
  span.textContent = emoji;
  container.appendChild(span);
}

function checkPPEGameCompletion() {
  if (ppeSelections.hair && ppeSelections.ear && ppeSelections.body && ppeSelections.foot) {
    // All categories selected correctly
    document.getElementById('ppe-success-message').style.display = 'block';
    document.getElementById('ppe-continue-btn').style.display = 'inline-block';
  }
}

// PPE event listeners are handled in initializePPEGame() and resetPPEGame()

// Expose functions globally
window.showPage = showPage;
window.showVisitorForm = showVisitorForm;
window.handleVisitorRegistration = handleVisitorRegistration;
window.registerVisitor = registerVisitor;
window.showInstructions = showInstructions;
window.startRulesQuestions = startRulesQuestions;
window.nextPage = nextPage;
window.checkAnswer = checkAnswer;
window.downloadQRCode = downloadQRCode;
window.completeRecyclingGame = completeRecyclingGame;
window.resetPPEGame = resetPPEGame;
window.completePPEGame = completePPEGame;
