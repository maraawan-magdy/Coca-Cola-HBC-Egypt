// Error checking script for Coca-Cola HBC website
console.log("=== Coca-Cola HBC Website Error Check ===");

// Check if all required scripts are loaded
console.log("Script Loading Status:");
console.log("- Firebase App:", typeof firebase !== 'undefined' ? '✅ Loaded' : '❌ Not loaded');
console.log("- Firebase Database:", typeof firebase !== 'undefined' && firebase.database ? '✅ Loaded' : '❌ Not loaded');
console.log("- QRCode:", typeof QRCode !== 'undefined' ? '✅ Loaded' : '❌ Not loaded');
console.log("- ScrollReveal:", typeof ScrollReveal !== 'undefined' ? '✅ Loaded' : '❌ Not loaded');
console.log("- CinematicIntro:", typeof CinematicIntro !== 'undefined' ? '✅ Loaded' : '❌ Not loaded');
console.log("- Theme Toggle:", typeof toggleTheme !== 'undefined' ? '❌ Should not be loaded (theme toggle removed)' : '✅ Correctly not loaded (theme toggle removed)');

// Check if all required CSS files are loaded
console.log("\nCSS Loading Status:");
const stylesheets = Array.from(document.styleSheets);
stylesheets.forEach(sheet => {
  try {
    const rules = sheet.cssRules || sheet.rules;
    console.log(`- ${sheet.href || 'Inline CSS'}: ✅ Loaded (${rules?.length || 0} rules)`);
  } catch (e) {
    console.log(`- ${sheet.href || 'Inline CSS'}: ❌ Error loading (CORS or other issue)`);
  }
});

// Check localStorage status
console.log("\nLocalStorage Status:");
console.log("- Available:", typeof Storage !== 'undefined' ? '✅ Yes' : '❌ No');
console.log("- introPlayed:", localStorage.getItem('introPlayed'));
console.log("- themePreference:", localStorage.getItem('themePreference'));

// Check if images exist
console.log("\nImage Check:");
const imagesToCheck = ['Logo1.png', 'Logo2.png', 'Picture1.png', 'q1.jpg'];
imagesToCheck.forEach(img => {
  const testImg = new Image();
  testImg.onload = () => console.log(`- ${img}: ✅ Found`);
  testImg.onerror = () => console.log(`- ${img}: ❌ Not found`);
  testImg.src = img;
});

// Check for JavaScript errors
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
});

console.log("\n=== Error Check Complete ===");
console.log("Use debugShowIntro() to test the cinematic intro");
