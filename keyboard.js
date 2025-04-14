// keyboard.js - Mobile PIN entry enhancement
document.addEventListener('DOMContentLoaded', function() {
  // Get all PIN input fields
  const pinDigits = document.querySelectorAll('.pin-digit');
  const pinContainer = document.getElementById('pin-container');
  
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
      
      // Explicitly focus the input field
      pinDigits[focusIndex].focus();
      
      // iOS specific fix - needs a slight delay
      setTimeout(() => {
        pinDigits[focusIndex].focus();
        
        // For iOS Safari, which may still hide the keyboard
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          pinDigits[focusIndex].blur();
          pinDigits[focusIndex].focus();
        }
      }, 100);
    });
    
    // Add specific touch event handlers to each PIN digit
    pinDigits.forEach((digit, index) => {
      // Prevent default touch behavior that might interfere with keyboard
      digit.addEventListener('touchstart', function(e) {
        // Don't prevent default completely as we need the input to work
        // but stop propagation to parent elements
        e.stopPropagation();
        
        // Explicitly focus this input
        this.focus();
      });
      
      // Handle focus jumps for mobile more explicitly
      digit.addEventListener('input', function() {
        if (this.value.length === this.maxLength && index < pinDigits.length - 1) {
          // For mobile, need more explicit focus
          setTimeout(() => {
            pinDigits[index + 1].focus();
          }, 10);
        }
      });
    });
  }
  
  // Detect if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    enableMobileKeyboard();
    
    // Add visual indicator to show the input is tappable on mobile
    pinDigits.forEach(digit => {
      digit.classList.add('mobile-input');
      // Add slight pulse animation to indicate tappable
      digit.style.animation = 'pulse 2s infinite';
    });
    
    // Add helper text for mobile users
    const helperText = document.createElement('p');
    helperText.innerText = 'Tap on input field to bring up keyboard';
    helperText.style.fontSize = '0.8rem';
    helperText.style.opacity = '0.7';
    helperText.style.marginTop = '5px';
    pinContainer.querySelector('.pin-input-container').after(helperText);
    
    // Fix for virtual keyboard pushing content up
    function handleResize() {
      // Adjust container position if keyboard is open
      if (window.innerHeight < window.outerHeight) {
        pinContainer.style.position = 'absolute';
        pinContainer.style.top = '20px';
      } else {
        pinContainer.style.position = 'relative';
        pinContainer.style.top = 'auto';
      }
    }
    
    // Listen for resize events which happen when keyboard opens/closes
    window.addEventListener('resize', handleResize);
    
    // iOS specific fix for focusing inputs
    document.addEventListener('touchend', function(e) {
      const target = e.target;
      if (target.classList.contains('pin-digit')) {
        setTimeout(() => {
          target.focus();
        }, 100);
      }
    });
  }
  
  // Add keyboard navigation for better accessibility
  pinDigits.forEach((digit, index) => {
    digit.addEventListener('keydown', function(e) {
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
      if (pinContainer.style.display !== 'none') {
        pinDigits[0].focus();
      }
    }, 500);
  });
});
