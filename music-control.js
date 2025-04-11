// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create a new audio element (without modifying the existing one)
    const music = new Audio('love.mp3');
    music.loop = true;
    
    // Add event listener for when the music ends to ensure it replays
    music.addEventListener('ended', function() {
        music.currentTime = 0;
        music.play().catch(e => console.log("Auto-replay failed, will try again"));
    });
    
    // Add volume control
    let currentVolume = 0.7; // Default volume
    music.volume = currentVolume;
    
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
    
    // Create and add music controls and pose buttons to the page
    function addMusicAndPoseControls() {
        const mainContent = document.querySelector('.content') || document.body;
        
        // Create music controls container
        const musicControlsContainer = document.createElement('div');
        musicControlsContainer.className = 'music-controls';
        musicControlsContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.6); padding: 10px; border-radius: 10px; z-index: 1000; display: flex; flex-direction: column; gap: 8px;';
        
        // Volume controls
        const volumeContainer = document.createElement('div');
        volumeContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px;';
        
        const volumeDownBtn = document.createElement('button');
        volumeDownBtn.innerHTML = '🔉';
        volumeDownBtn.className = 'music-btn';
        volumeDownBtn.style.cssText = 'background: #444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;';
        volumeDownBtn.addEventListener('click', function() {
            currentVolume = Math.max(0, currentVolume - 0.1);
            music.volume = currentVolume;
            showNotification(`Volume: ${Math.round(currentVolume * 100)}%`);
        });
        
        const volumeUpBtn = document.createElement('button');
        volumeUpBtn.innerHTML = '🔊';
        volumeUpBtn.className = 'music-btn';
        volumeUpBtn.style.cssText = 'background: #444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;';
        volumeUpBtn.addEventListener('click', function() {
            currentVolume = Math.min(1, currentVolume + 0.1);
            music.volume = currentVolume;
            showNotification(`Volume: ${Math.round(currentVolume * 100)}%`);
        });
        
        const muteBtn = document.createElement('button');
        muteBtn.innerHTML = '🔇';
        muteBtn.className = 'music-btn';
        muteBtn.style.cssText = 'background: #444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;';
        let isMuted = false;
        muteBtn.addEventListener('click', function() {
            if (isMuted) {
                music.volume = currentVolume;
                muteBtn.innerHTML = '🔇';
                showNotification("Sound on");
            } else {
                music.volume = 0;
                muteBtn.innerHTML = '🔈';
                showNotification("Sound off");
            }
            isMuted = !isMuted;
        });
        
        volumeContainer.appendChild(volumeDownBtn);
        volumeContainer.appendChild(muteBtn);
        volumeContainer.appendChild(volumeUpBtn);
        musicControlsContainer.appendChild(volumeContainer);
        
        // Create pose buttons container
        const poseContainer = document.createElement('div');
        poseContainer.className = 'pose-buttons';
        poseContainer.style.cssText = 'position: fixed; left: 20px; bottom: 20px; background: rgba(0,0,0,0.6); padding: 10px; border-radius: 10px; z-index: 1000; display: flex; flex-direction: column; gap: 8px;';
        
        // Define poses
        const poses = [
            { name: 'Heart Hands', emoji: '🫶', description: 'Make heart hands gesture' },
            { name: 'Hug', emoji: '🤗', description: 'Offer a warm embrace' },
            { name: 'Romantic Dance', emoji: '💃🕺', description: 'Share a dance together' },
            { name: 'Blow Kiss', emoji: '😘', description: 'Blow a loving kiss' },
            { name: 'Take a Selfie', emoji: '📸', description: 'Capture this special moment' }
        ];
        
        // Create a header for the pose section
        const poseHeader = document.createElement('div');
        poseHeader.textContent = 'Romantic Poses';
        poseHeader.style.cssText = 'color: #ff6b95; font-weight: bold; text-align: center; margin-bottom: 8px; font-size: 14px;';
        poseContainer.appendChild(poseHeader);
        
        // Add pose buttons
        poses.forEach(pose => {
            const poseBtn = document.createElement('button');
            poseBtn.innerHTML = `${pose.emoji} ${pose.name}`;
            poseBtn.className = 'pose-btn';
            poseBtn.style.cssText = 'background: linear-gradient(to right, #ff6b95, #ffa07a); color: white; border: none; border-radius: 20px; padding: 8px 15px; cursor: pointer; font-weight: bold; transition: transform 0.2s; width: 100%;';
            poseBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            poseBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            poseBtn.addEventListener('click', function() {
                showPoseInstructions(pose);
            });
            poseContainer.appendChild(poseBtn);
        });
        
        // Add containers to the page
        mainContent.appendChild(musicControlsContainer);
        mainContent.appendChild(poseContainer);
    }
    
    // Function to show pose instructions
    function showPoseInstructions(pose) {
        // Create or get existing pose modal
        let poseModal = document.getElementById('pose-modal');
        if (!poseModal) {
            poseModal = document.createElement('div');
            poseModal.id = 'pose-modal';
            poseModal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 2000;
                max-width: 80%;
                text-align: center;
                display: none;
            `;
            document.body.appendChild(poseModal);
        }
        
        // Update content and show modal
        poseModal.innerHTML = `
            <h3 style="margin-top: 0; color: #ff6b95;">${pose.emoji} ${pose.name}</h3>
            <p>${pose.description}</p>
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
                <button id="close-pose-modal" style="background: #555; color: white; border: none; border-radius: 5px; padding: 8px 15px; cursor: pointer;">Close</button>
                <button id="take-pose-photo" style="background: linear-gradient(to right, #ff6b95, #ffa07a); color: white; border: none; border-radius: 5px; padding: 8px 15px; cursor: pointer;">Take Photo</button>
            </div>
        `;
        
        poseModal.style.display = 'block';
        
        // Add close button functionality
        document.getElementById('close-pose-modal').addEventListener('click', function() {
            poseModal.style.display = 'none';
        });
        
        // Add take photo functionality
        document.getElementById('take-pose-photo').addEventListener('click', function() {
            // Show countdown for photo
            let countdown = 3;
            poseModal.innerHTML = `<h2 style="font-size: 48px; color: #ff6b95;">${countdown}</h2>`;
            
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    poseModal.innerHTML = `<h2 style="font-size: 48px; color: #ff6b95;">${countdown}</h2>`;
                } else {
                    clearInterval(countdownInterval);
                    poseModal.innerHTML = `<h2 style="font-size: 48px; color: #ff6b95;">📸</h2>`;
                    
                    // Flash effect
                    const flashOverlay = document.createElement('div');
                    flashOverlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: white;
                        opacity: 0;
                        z-index: 1999;
                        pointer-events: none;
                        transition: opacity 0.1s;
                    `;
                    document.body.appendChild(flashOverlay);
                    
                    setTimeout(() => {
                        flashOverlay.style.opacity = '0.8';
                        setTimeout(() => {
                            flashOverlay.style.opacity = '0';
                            setTimeout(() => {
                                document.body.removeChild(flashOverlay);
                                
                                // Show success message after photo
                                poseModal.innerHTML = `
                                    <h3 style="color: #ff6b95;">Perfect! 💕</h3>
                                    <p>Your romantic ${pose.name} pose looks beautiful!</p>
                                    <button id="close-pose-modal" style="background: #555; color: white; border: none; border-radius: 5px; padding: 8px 15px; cursor: pointer; margin-top: 10px;">Close</button>
                                `;
                                
                                document.getElementById('close-pose-modal').addEventListener('click', function() {
                                    poseModal.style.display = 'none';
                                });
                            }, 300);
                        }, 100);
                    }, 50);
                }
            }, 1000);
        });
    }
    
    // Enhance the showNotification function if it doesn't exist yet
    if (!window.showNotification) {
        window.showNotification = function(message) {
            let notification = document.getElementById('custom-notification');
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'custom-notification';
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 2001;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;
                document.body.appendChild(notification);
            }
            
            notification.textContent = message;
            notification.style.opacity = '1';
            
            clearTimeout(window.notificationTimeout);
            window.notificationTimeout = setTimeout(() => {
                notification.style.opacity = '0';
            }, 3000);
        };
    }
    
    // Initialize the enhancements
    addMusicAndPoseControls();
});
