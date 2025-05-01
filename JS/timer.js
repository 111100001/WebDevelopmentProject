document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const timerDisplay = document.querySelector('.game-timer');
    const start3SecBtn = document.querySelector('.start-3-btn');
    const start10SecBtn = document.querySelector('.start-10-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const timerSound = document.getElementById('timerSound');
    
    let countdown;
    let isRunning = false;
    const DEFAULT_TIME = 3.00;

    // Format time as XX.XX
    function formatTime(seconds) {
        return seconds.toFixed(2).padStart(5, '0');
    }

    // Stop any running timer
    function stopTimer() {
        clearInterval(countdown);
        isRunning = false;
    }

    // Play completion sound
    function playCompletionSound() {
        if (timerSound) {
            timerSound.currentTime = 0; // Rewind to start
            timerSound.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    const winBtn = document.getElementById('winBtn');
    const winSound = document.getElementById('winSound');

    // Add click event listener to the button
    winBtn.addEventListener('click', () => {
    // Play the sound
    winSound.play()
        .then(() => {
        console.log('Win sound played successfully');
        })
        .catch(error => {
        console.error('Error playing sound:', error);
        });
    });

    // Timer function
    function startTimer(duration) {
        stopTimer();
        isRunning = true;
        
        let timer = duration;
        timerDisplay.textContent = formatTime(timer);
        
        countdown = setInterval(function() {
            timer -= 0.01;
            if (timer <= 0) {
                stopTimer();
                timerDisplay.textContent = "00.00";
                playCompletionSound();
                return;
            }
            timerDisplay.textContent = formatTime(timer);
        }, 10);
    }

    // Reset to default time (3.00)
    function resetTimer() {
        stopTimer();
        timerDisplay.textContent = formatTime(DEFAULT_TIME);
    }

    // Button event listeners
    start3SecBtn.addEventListener('click', function() {
        startTimer(3.00);
    });

    start10SecBtn.addEventListener('click', function() {
        startTimer(10.00);
    });

    resetBtn.addEventListener('click', resetTimer);

    // Initialize with default time
    resetTimer();
});