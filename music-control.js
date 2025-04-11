// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create a new audio element (without modifying the existing one)
    const music = new Audio('love.mp3');
    music.loop = true;
    
    // Override the playMusic function without modifying the original code
    const originalPlayMusic = window.playMusic;
    window.playMusic = function() {
        music.play().then(() => {
            showNotification("Music is now playing ♫");
        }).catch(e => {
            showNotification("Click again to play music ♫");
        });
        return originalPlayMusic ? originalPlayMusic.apply(this, arguments) : undefined;
    };
    
    // Play music when pin is entered successfully
    const originalVerifyPin = window.verifyPin;
    window.verifyPin = function() {
        const result = originalVerifyPin ? originalVerifyPin.apply(this, arguments) : undefined;
        
        // If the pin was correct (we can't check directly, so we'll observe the UI change)
        setTimeout(() => {
            if (document.getElementById('pin-container').style.display === 'none') {
                music.play().catch(e => {
                    // Music will play when user interacts with the page
                });
            }
        }, 100);
        
        return result;
    };
    
    // Add event listeners to existing music buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn.secondary') && e.target.closest('.btn.secondary').textContent.includes('Play Music')) {
            window.playMusic();
        }
    });
});
