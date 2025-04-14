// keyboard.js - Mobile PIN entry enhancement
document.addEventListener('DOMContentLoaded', function() {
  // Get all PIN input fields
  const pinDigits = document.querySelectorAll('.pin-digit');
  const pinContainer = document.getElementById('pin-container');
  
  // Ensure elements exist before proceeding
  if (!pinDigits.length || !pinContainer) {
    console.error('PIN elements not found. Check class and ID names.');
    return;
  }
  
  // Fix for mobile keyboard not appearing
  function enableMobileKeyboard() {
    // Force show keyboard on mobile when clicking anywhere in the PIN container
    pinContainer.addEventListener('click', function(e) {
      // Find which pin digit should receive focus based on empty fields
      let focusIndex = 0;
      for (let i = 0; i < pinDigits.length; i++) {
        if (!pinDigits[i].value) {
          focusIndex = i;
          break;
        }
      }
      
      // Explicitly focus the input field with a more aggressive approach
      pinDigits[focusIndex].focus();
      pinDigits[focusIndex].click(); // Add explicit click
      
      // iOS specific fix - needs a slight delay
      setTimeout(() => {
        pinDigits[focusIndex].focus();
        
        // For iOS Safari, which may still hide the keyboard
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          // Multiple focus-blur cycles can help trigger stubborn keyboards
          pinDigits[focusIndex].blur();
          setTimeout(() => {
            pinDigits[focusIndex].focus();
            pinDigits[focusIndex].click();
          }, 50);
        }
      }, 100);
    });
    
    // Add specific touch event handlers to each PIN digit
    pinDigits.forEach((digit, index) => {
      // Ensure input is of type "text" or "tel" for better mobile keyboard handling
      if (digit.type !== "text" && digit.type !== "tel") {
        digit.type = "tel"; // tel is better for PIN input on mobile
      }
      
      // Prevent zoom on focus for iOS devices
      digit.style.fontSize = '16px'; // Prevents iOS zoom on input focus
      
      // Prevent default touch behavior that might interfere with keyboard
      digit.addEventListener('touchstart', function(e) {
        // Focus this specific input
        this.focus();
        this.click(); // Add explicit click
        
        // Don't stop propagation completely - that may be causing the issue
        // e.stopPropagation();
      });
      
      // Handle focus jumps for mobile more explicitly
      digit.addEventListener('input', function() {
        if (this.value.length === this.maxLength && index < pinDigits.length - 1) {
          // For mobile, need more explicit focus
          setTimeout(() => {
            pinDigits[index + 1].focus();
            pinDigits[index + 1].click(); // Add explicit click
          }, 10);
        }
      });
    });
  }
  
  // Detect if device is mobile - more comprehensive check
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent) 
                || ('ontouchstart' in window) 
                || (window.innerWidth <= 800);
  
  if (isMobile) {
    enableMobileKeyboard();
    
    // Add visual indicator to show the input is tappable on mobile
    pinDigits.forEach(digit => {
      digit.classList.add('mobile-input');
      // Add slight pulse animation to indicate tappable
      digit.style.animation = 'pulse 2s infinite';
      
      // Make inputs look more tappable with visual styling
      digit.style.border = '2px solid #0066ff';
      digit.style.borderRadius = '8px';
      digit.style.padding = '12px';
      digit.style.margin = '5px';
      
      // Explicitly set input to be non-readonly and enabled
      digit.readOnly = false;
      digit.disabled = false;
    });
    
    // Create a more visible and tappable helper button for stubborn keyboards
    const keyboardHelper = document.createElement('button');
    keyboardHelper.innerText = 'Tap here to open keyboard';
    keyboardHelper.style.marginTop = '10px';
    keyboardHelper.style.padding = '10px 15px';
    keyboardHelper.style.backgroundColor = '#0066ff';
    keyboardHelper.style.color = 'white';
    keyboardHelper.style.border = 'none';
    keyboardHelper.style.borderRadius = '5px';
    keyboardHelper.style.fontSize = '16px';
    keyboardHelper.style.width = '100%';
    
    keyboardHelper.addEventListener('click', function() {
      // Find first empty PIN input
      let targetInput = pinDigits[0];
      for (let i = 0; i < pinDigits.length; i++) {
        if (!pinDigits[i].value) {
          targetInput = pinDigits[i];
          break;
        }
      }
      
      // Force focus with multiple methods
      targetInput.focus();
      targetInput.click();
      
      // Create temporary input for stubborn mobile keyboards
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const tempInput = document.createElement('input');
        tempInput.type = 'tel';
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        tempInput.style.height = '0';
        tempInput.style.fontSize = '16px';
        
        document.body.appendChild(tempInput);
        tempInput.focus();
        
        setTimeout(() => {
          tempInput.remove();
          targetInput.focus();
          targetInput.click();
        }, 100);
      }
    });
    
    // Add helper text and button
    const helperText = document.createElement('p');
    helperText.innerText = 'Having trouble with keyboard? Try the button below:';
    helperText.style.fontSize = '0.9rem';
    helperText.style.marginTop = '15px';
    helperText.style.marginBottom = '5px';
    
    // Find container or create one if needed
    const pinInputContainer = pinContainer.querySelector('.pin-input-container') || pinContainer;
    pinInputContainer.appendChild(helperText);
    pinInputContainer.appendChild(keyboardHelper);
    
    // Fix for virtual keyboard pushing content up
    function handleResize() {
      // Adjust container position if keyboard is open
      if (window.innerHeight < window.outerHeight * 0.8) {
        // Keyboard is likely open
        pinContainer.style.position = 'absolute';
        pinContainer.style.top = '20px';
        pinContainer.style.zIndex = '9999';
      } else {
        pinContainer.style.position = 'relative';
        pinContainer.style.top = 'auto';
      }
    }
    
    // Listen for resize events which happen when keyboard opens/closes
    window.addEventListener('resize', handleResize);
    
    // Add global touch handler to help with iOS
    document.addEventListener('touchend', function(e) {
      const target = e.target;
      if (target.classList.contains('pin-digit')) {
        setTimeout(() => {
          target.focus();
          target.click();
        }, 50);
      }
    });
  }
  
  // Add keyboard navigation for better accessibility
  pinDigits.forEach((digit, index) => {
    digit.addEventListener('keydown', function(e) {
      // Handle backspace to go to previous input
      if (e.key === 'Backspace' && index > 0 && !this.value) {
        pinDigits[index - 1].focus();
      }
      
      // Navigate between inputs with arrow keys
      if (e.key === 'ArrowRight' && index < pinDigits.length - 1) {
        e.preventDefault();
        pinDigits[index + 1].focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        pinDigits[index - 1].focus();
      }
    });
  });
  
  // Ensure first PIN field is properly focused after page load
  window.addEventListener('pageshow', function() {
    setTimeout(() => {
      if (pinContainer && pinDigits.length && pinContainer.style.display !== 'none') {
        pinDigits[0].focus();
        
        // On mobile, need a more aggressive approach
        if (isMobile) {
          pinDigits[0].click();
        }
      }
    }, 500);
  });
});
