// keyboard.js - Mobile PIN entry enhancement - Revised fix
document.addEventListener('DOMContentLoaded', function() {
  // Get all PIN input fields
  const pinDigits = document.querySelectorAll('.pin-digit');
  const pinContainer = document.getElementById('pin-container');
  
  if (!pinDigits.length || !pinContainer) {
    console.error('PIN elements not found!');
    return;
  }
  
  // Make sure inputs are properly configured for mobile keyboard
  pinDigits.forEach((input) => {
    // The critical fix: Set input properties that ensure keyboard appears
    input.type = "tel"; // Best type for numeric PIN entry
    input.inputMode = "numeric"; // Explicitly request numeric input mode
    input.pattern = "[0-9]*"; // Enforce numeric input pattern
    input.autocomplete = "one-time-code"; // Suggest this is a one-time code
    
    // Remove any attributes that might prevent keyboard
    input.removeAttribute("readonly");
    input.disabled = false;
    
    // Set minimum size to prevent zoom on iOS (which can hide keyboard)
    input.style.fontSize = "16px";
    input.style.minHeight = "44px"; // iOS minimum tappable height
    input.style.minWidth = "44px"; // iOS minimum tappable width
  });
  
  // Create a direct keyboard trigger button (critical fix)
  const keyboardTrigger = document.createElement('button');
  keyboardTrigger.textContent = "Open Keyboard";
  keyboardTrigger.style.width = "100%";
  keyboardTrigger.style.padding = "15px";
  keyboardTrigger.style.margin = "10px 0";
  keyboardTrigger.style.backgroundColor = "#007bff";
  keyboardTrigger.style.color = "#fff";
  keyboardTrigger.style.border = "none";
  keyboardTrigger.style.borderRadius = "5px";
  keyboardTrigger.style.fontSize = "16px";
  
  // Insert button before the PIN container
  pinContainer.parentNode.insertBefore(keyboardTrigger, pinContainer);
  
  // Force keyboard using this hack: create a temporary input
  keyboardTrigger.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Create temporary input field
    const tempInput = document.createElement('input');
    tempInput.type = "tel";
    tempInput.style.position = "fixed";
    tempInput.style.top = "0";
    tempInput.style.left = "0";
    tempInput.style.opacity = "0.01";
    tempInput.style.height = "1px";
    tempInput.style.width = "1px";
    tempInput.inputMode = "numeric";
    
    // Add to DOM
    document.body.appendChild(tempInput);
    
    // Force focus (this should trigger keyboard)
    tempInput.focus();
    
    // After keyboard appears, focus on the first PIN digit
    setTimeout(function() {
      // Find first empty input
      let targetInput = pinDigits[0];
      for (let i = 0; i < pinDigits.length; i++) {
        if (!pinDigits[i].value) {
          targetInput = pinDigits[i];
          break;
        }
      }
      
      // Remove temp input
      tempInput.remove();
      
      // Focus target input
      targetInput.focus();
    }, 300);
  });
  
  // Handle automatic navigation between PIN digits
  pinDigits.forEach((digit, index) => {
    // Auto-advance to next field when digit entered
    digit.addEventListener('input', function() {
      if (this.value && index < pinDigits.length - 1) {
        pinDigits[index + 1].focus();
      }
    });
    
    // Handle backspace to go to previous field
    digit.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && !this.value && index > 0) {
        pinDigits[index - 1].focus();
      }
    });
  });
  
  // Add simple CSS instructions to make inputs more obvious
  const style = document.createElement('style');
  style.textContent = `
    .pin-digit {
      width: 40px;
      height: 50px;
      text-align: center;
      font-size: 16px;
      margin: 5px;
      border: 2px solid #0066ff;
      border-radius: 5px;
    }
    .pin-digit:focus {
      border-color: #ff6600;
      outline: none;
      box-shadow: 0 0 5px #ff6600;
    }
    /* Pulsing animation to draw attention */
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    .keyboard-trigger-pulse {
      animation: pulse 2s infinite;
    }
  `;
  document.head.appendChild(style);
  
  keyboardTrigger.classList.add('keyboard-trigger-pulse');
  
  // For iOS devices only - add extra helper text
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    const iosHelper = document.createElement('p');
    iosHelper.textContent = "On iOS, you may need to tap the button above first, then tap on a PIN field";
    iosHelper.style.fontSize = "14px";
    iosHelper.style.color = "#666";
    iosHelper.style.margin = "5px 0";
    pinContainer.parentNode.insertBefore(iosHelper, pinContainer);
  }
  
  // Add a fallback method for Android
  if (/Android/i.test(navigator.userAgent)) {
    // On Android, create a hidden checkbox hack that can force keyboard
    const checkboxHack = document.createElement('input');
    checkboxHack.type = "checkbox";
    checkboxHack.style.position = "fixed";
    checkboxHack.style.opacity = "0";
    checkboxHack.style.pointerEvents = "none";
    document.body.appendChild(checkboxHack);
    
    keyboardTrigger.addEventListener('click', function() {
      // Toggle checkbox to force focus change
      checkboxHack.checked = !checkboxHack.checked;
    });
  }
});

// Add this script to window load event to ensure it runs after everything else
window.addEventListener('load', function() {
  // This is a last resort approach
  setTimeout(function() {
    const inputs = document.querySelectorAll('.pin-digit');
    if (inputs.length) {
      // Try to focus first input after a delay
      inputs[0].focus();
      
      // For stubborn iOS devices, create and focus a temporary input
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const tempInput = document.createElement('input');
        tempInput.type = "tel";
        document.body.appendChild(tempInput);
        tempInput.focus();
        setTimeout(function() {
          tempInput.remove();
          inputs[0].focus();
        }, 100);
      }
    }
  }, 1000);
});
