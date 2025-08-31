// quiz-qr.js
// Requires: https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js, https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js, firebase-config.js, qrcode.min.js

/**
 * Saves visitor information and quiz score to Firebase Realtime Database.
 * Uses Firebase's push() to generate a unique, time-ordered ID.
 * @param {object} personalInfo - An object containing visitor's personal details.
 * @param {number} score - The visitor's quiz score.
 * @returns {Promise<string|null>} A promise that resolves with the new unique ID, or null on failure.
 */
async function saveQuizTakerInfo(personalInfo, score) {
  const data = { ...personalInfo, score, createdAt: firebase.database.ServerValue.TIMESTAMP };
  try {
    const newTakerRef = firebase.database().ref('quiz-takers').push();
    await newTakerRef.set(data);
    return newTakerRef.key;
  } catch (error) {
    console.error('Firebase write failed:', error);
    // Optionally, provide more specific feedback based on error.code
    alert('Failed to save your information. Please check your internet connection and try again.');
    return null;
  }
}

/**
 * Generates a QR code and displays it on a canvas element.
 * @param {string} id - The unique ID to be encoded in the QR code URL.
 * @param {string} elementId - The ID of the canvas element to draw the QR code on.
 */
function generateQRCode(id, elementId) {
  const url = window.location.origin + '/display-info.html?id=' + encodeURIComponent(id);
  const canvas = document.getElementById(elementId);
  
  if (canvas) {
    QRCode.toCanvas(canvas, url, { width: 200, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, function (error) {
      if (error) console.error(error);

      // Update the download link
      const downloadLink = document.getElementById(elementId + '-download');
      if (downloadLink) {
        downloadLink.href = canvas.toDataURL('image/png');
      }
    });
    
    // Update the link if it exists
    const linkElement = document.getElementById(elementId + '-link');
    if (linkElement) {
      linkElement.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    }
  }
}
