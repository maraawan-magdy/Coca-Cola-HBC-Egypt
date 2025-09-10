// Enhanced Cinematic Intro Functionality for Coca-Cola HBC
class CinematicIntro {
  constructor() {
    this.messages = [
      {
        english: 'Welcome to Coca-Cola Company',
        arabic: 'مرحباً بكم في شركة كوكا كولا'
      },
      {
        english: 'We care deeply about your safety',
        arabic: 'نحن نهتم بعمق بسلامتكم'
      },
      {
        english: 'Health and safety test is compulsory for visitors of Coca-Cola ',
        arabic: 'اختبار السلامة إلزامي لزوار كوكا كولا '
      }
    ];

    this.currentMessageIndex = 0;
    this.animationStyle = 'fade';
    this.soundEnabled = true;
    this.hasPlayed = false;
    this.isPlaying = false;

    console.log("Initializing Enhanced Cinematic Intro...");
    this.init();
  }

  init() {
    // Always play the intro on page load
    console.log("Starting cinematic intro...");

    // First hide the welcome section to prevent it from showing behind the intro
    const welcomeSection = document.getElementById('welcome');
    if (welcomeSection) {
      welcomeSection.style.display = 'none';
    }

    console.log("Creating intro elements...");
    this.createIntroElements();
    this.bindEvents();
    this.startIntro();
  }

  createIntroElements() {
    console.log("Creating intro elements...");
    const introContainer = document.createElement('div');
    introContainer.className = 'cinematic-intro';
    introContainer.id = 'cinematicIntro';
    
    // Add some inline styles for debugging
    introContainer.style.border = '2px solid yellow'; // Debug border
    introContainer.style.backgroundColor = '#e4002b'; // Ensure background color

    const logo = document.createElement('div');
    logo.className = 'coca-logo-watermark';
    logo.innerHTML = 'Coca-Cola';
    logo.style.cssText = 'font-family: "Montserrat", sans-serif; font-weight: 700; font-size: 24px; color: rgba(255,255,255,0.2);';

    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    messageContainer.innerHTML = '<div style="color: white; font-size: 20px;">Intro Loading...</div>'; // Debug message

    const soundToggle = document.createElement('button');
    soundToggle.className = 'sound-toggle';
    soundToggle.innerHTML = '🔊';
    soundToggle.addEventListener('click', () => this.toggleSound());

    // Add a skip button
    // const skipButton = document.createElement('button');
    // skipButton.innerHTML = 'Skip Intro';
    // skipButton.className = 'skip-intro';
    // skipButton.style.cssText = 'position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer;';
    // skipButton.addEventListener('click', () => this.skipIntro());

    introContainer.appendChild(logo);
    introContainer.appendChild(messageContainer);
    introContainer.appendChild(soundToggle);
    // introContainer.appendChild(skipButton);

    document.body.appendChild(introContainer);
    this.messageContainer = messageContainer;

    console.log("Intro elements created and added to the DOM.");
    console.log("Intro container:", introContainer);
    console.log("Intro container style:", window.getComputedStyle(introContainer));
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.skipIntro();
      }
    });
  }

  startIntro() {
    console.log("Starting Intro...");
    this.isPlaying = true;
    this.showMessage(0);
  }

  showMessage(index) {
    if (index >= this.messages.length) {
      this.completeIntro();
      return;
    }

    console.log(`Showing message ${index}: ${this.messages[index]}`);
    this.currentMessageIndex = index;
    const message = this.messages[index];

    this.messageContainer.innerHTML = '';

    // Create container for both languages
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `intro-message-wrapper ${this.animationStyle}-in`;
    messageWrapper.style.cssText = 'text-align: center; margin: 0; padding: 20px;';

    // English message
    const englishElement = document.createElement('div');
    englishElement.className = 'intro-message-english';
    englishElement.textContent = message.english;
    englishElement.style.cssText = 'color: white; font-size: 24px; font-family: "Montserrat", sans-serif; margin-bottom: 10px;';

    // Arabic message
    const arabicElement = document.createElement('div');
    arabicElement.className = 'intro-message-arabic';
    arabicElement.textContent = message.arabic;
    arabicElement.style.cssText = 'color: white; font-size: 24px; font-family: "Cairo", sans-serif; direction: rtl;';

    messageWrapper.appendChild(englishElement);
    messageWrapper.appendChild(arabicElement);

    this.messageContainer.appendChild(messageWrapper);

    if (this.soundEnabled) {
      this.playSound();
    }

    setTimeout(() => {
      messageWrapper.classList.remove(`${this.animationStyle}-in`);
      messageWrapper.classList.add(`${this.animationStyle}-out`);

      setTimeout(() => {
        this.showMessage(index + 1);
      }, 1500);
    }, 2000);
  }

  playSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio not available:", error.message);
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const soundToggle = document.querySelector('.sound-toggle');
    if (soundToggle) {
      soundToggle.style.opacity = this.soundEnabled ? '1' : '0.5';
    }
  }

  skipIntro() {
    console.log("Skipping intro...");
    this.isPlaying = false;
    this.completeIntro();
  }

  completeIntro() {
    console.log("Completing Intro...");
    console.log("Intro has been played, transitioning to main content.");
    this.hideIntro(() => {
      this.showMainContent();
    });
  }

  hideIntro(callback) {
    console.log("Hiding Intro...");
    const intro = document.getElementById('cinematicIntro');
    if (intro) {
      // First hide it visually
      intro.style.opacity = '0';
      intro.style.transition = 'opacity 0.5s ease';
      
      // Then remove it from DOM after transition completes and call callback
      setTimeout(() => {
        if (intro.parentNode) {
          intro.parentNode.removeChild(intro);
          console.log("Intro removed from DOM");
          if (callback) callback();
        }
      }, 500);
    } else if (callback) {
      // If no intro element exists, just call the callback
      callback();
    }
  }

  showMainContent() {
    console.log("Showing Main Content...");
    
    // Show the visitor form directly instead of welcome section
    const visitorFormSection = document.getElementById('visitor-form');
    if (visitorFormSection) {
      console.log("Visitor form section found:", visitorFormSection);
      
      // Remove inline display style and use CSS class
      visitorFormSection.style.display = '';
      visitorFormSection.classList.add('active');
      
      console.log("Visitor form section should now be visible");
      console.log("Computed display:", window.getComputedStyle(visitorFormSection).display);
      
      // Check if other sections are hidden
      document.querySelectorAll('.page-section').forEach(section => {
        console.log(`Section ID: ${section.id}, Display: ${window.getComputedStyle(section).display}`);
      });
    } else {
      console.error("Visitor form section not found!");
    }
  }

  setAnimationStyle(style) {
    const validStyles = ['fade', 'slide', 'typewriter'];
    if (validStyles.includes(style)) {
      this.animationStyle = style;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new CinematicIntro();
});
