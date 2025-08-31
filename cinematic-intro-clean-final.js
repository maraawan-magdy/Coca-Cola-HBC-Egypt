// Cinematic Intro Functionality for Coca-Cola HBC
class CinematicIntro {
  constructor() {
    this.messages = [
      'Welcome to Coca-Cola Company',
      'We care deeply about your safety',
      'Health and safety test is compulsory for visitors of Coca-Cola HBC'
    ];
    
    this.currentMessageIndex = 0;
    this.animationStyle = 'fade';
    this.soundEnabled = true;
    this.hasPlayed = false;
    
    console.log("Initializing Cinematic Intro...");
    this.init();
  }

  init() {
    // Check if intro has already been played
    const introPlayed = localStorage.getItem('introPlayed') === 'true';
    
    if (introPlayed) {
      console.log("Intro already played, skipping...");
      this.hasPlayed = true;
      // Show main content immediately since intro was already played
      this.showMainContent();
      return;
    }

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

    introContainer.appendChild(logo);
    introContainer.appendChild(messageContainer);
    introContainer.appendChild(soundToggle);

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

    const messageElement = document.createElement('h1');
    messageElement.className = `intro-message ${this.animationStyle}-in`;
    messageElement.textContent = message;

    this.messageContainer.appendChild(messageElement);

    if (this.soundEnabled) {
      this.playSound();
    }

    setTimeout(() => {
      messageElement.classList.remove(`${this.animationStyle}-in`);
      messageElement.classList.add(`${this.animationStyle}-out`);
      
      setTimeout(() => {
        this.showMessage(index + 1);
      }, 1500);
    }, 2000);
  }

  playSound() {
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
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const soundToggle = document.querySelector('.sound-toggle');
    if (soundToggle) {
      soundToggle.style.opacity = this.soundEnabled ? '1' : '0.5';
    }
  }

  skipIntro() {
    this.completeIntro();
  }

  completeIntro() {
    console.log("Completing Intro..."); // Debug log
    console.log("Intro has been played, transitioning to main content."); // Debug log
    localStorage.setItem('introPlayed', 'true');
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
    const welcomeSection = document.getElementById('welcome');
    if (welcomeSection) {
      // Ensure welcome section is visible
      welcomeSection.style.display = 'block';
      welcomeSection.classList.add('active');
      
      // Hide all other sections except welcome
      document.querySelectorAll('.page-section').forEach(section => {
        if (section.id !== 'welcome') {
          section.style.display = 'none';
          section.classList.remove('active');
        }
      });
      
      console.log("Main content should now be visible");
    } else {
      console.error("Welcome section not found!");
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
