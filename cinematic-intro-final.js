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
    if (this.hasPlayed) {
      this.hideIntro();
      return;
    }

    this.createIntroElements();
    this.bindEvents();
    this.startIntro();
  }

  createIntroElements() {
    const introContainer = document.createElement('div');
    introContainer.className = 'cinematic-intro';
    introContainer.id = 'cinematicIntro';

    const logo = document.createElement('div');
    logo.className = 'coca-logo-watermark';
    logo.innerHTML = 'Coca-Cola';
    logo.style.cssText = 'font-family: "Montserrat", sans-serif; font-weight: 700; font-size: 24px; color: rgba(255,255,255,0.2);';

    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';

    const soundToggle = document.createElement('button');
    soundToggle.className = 'sound-toggle';
    soundToggle.innerHTML = '🔊';
    soundToggle.addEventListener('click', () => this.toggleSound());

    introContainer.appendChild(logo);
    introContainer.appendChild(messageContainer);
    introContainer.appendChild(soundToggle);

    document.body.appendChild(introContainer);
    this.messageContainer = messageContainer;
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

    this.message极Container.appendChild(messageElement);

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
    console.log("Completing Intro...");
    localStorage.setItem('introPlayed', 'true');
    this.hideIntro();
    this.showMainContent();
  }

  hideIntro() {
    console.log("Hiding Intro...");
    const intro = document.getElementById('cinematicIntro');
    if (intro) {
      intro.classList.add('hidden');
      setTimeout(() => {
        if (intro.parentNode) {
          intro.parentNode.removeChild(intro);
        }
      }, 500);
    }
  }

  showMainContent() {
    console.log("Showing Main Content...");
    const welcomeSection = document.getElementById('welcome');
    if (welcomeSection) {
      welcomeSection.classList.add('active');
      
      document.querySelectorAll('.page-section').forEach(section => {
        if (section.id !== 'welcome') {
          section.classList.remove('active');
        }
      });
    } else {
      console.error("Welcome section not found!");
    }
  }

  setAnimationStyle(style) {
    const validStyles = ['极fade', 'slide', 'typewriter'];
    if (validStyles.includes(style)) {
      this.animationStyle = style;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new CinematicIntro();
});
