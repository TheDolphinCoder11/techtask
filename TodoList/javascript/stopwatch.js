document.addEventListener('DOMContentLoaded', function() {
    // Stopwatch elements
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const startBtn = document.getElementById('stopwatch-start');
    const pauseBtn = document.getElementById('stopwatch-pause');
    const resetBtn = document.getElementById('stopwatch-reset');
    const lapBtn = document.getElementById('stopwatch-lap');
    const lapList = document.getElementById('lap-list');
    
    let startTime;
    let elapsedTime = 0;
    let running = false;
    let animationFrameId;
    let lapCount = 0;
    let lastLapTime = 0;
    
    // Format time as HH:MM:SS.mmm
    function formatTime(timeInMs) {
        const ms = Math.floor((timeInMs % 1000));
        const totalSeconds = Math.floor(timeInMs / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    }
    
    // Update stopwatch display
    function updateDisplay() {
        if (running) {
            const currentTime = Date.now();
            const timeToDisplay = elapsedTime + (currentTime - startTime);
            stopwatchDisplay.textContent = formatTime(timeToDisplay);
            animationFrameId = requestAnimationFrame(updateDisplay);
        }
    }
    
    // Start the stopwatch
    function startStopwatch() {
        if (!running) {
            startTime = Date.now();
            running = true;
            animationFrameId = requestAnimationFrame(updateDisplay);
            
            // Update button states
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            lapBtn.disabled = false;
        }
    }
    
    // Pause the stopwatch
    function pauseStopwatch() {
        if (running) {
            cancelAnimationFrame(animationFrameId);
            elapsedTime += (Date.now() - startTime);
            running = false;
            
            // Update button states
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
            lapBtn.disabled = true;
        }
    }
    
    // Reset the stopwatch
    function resetStopwatch() {
        if (running) {
            cancelAnimationFrame(animationFrameId);
        }
        
        elapsedTime = 0;
        running = false;
        lapCount = 0;
        lastLapTime = 0;
        
        // Clear display
        stopwatchDisplay.textContent = '00:00:00.000';
        lapList.innerHTML = '';
        
        // Update button states
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        lapBtn.disabled = true;
    }
    
    // Record a lap time
    function recordLap() {
        if (running) {
            lapCount++;
            const currentTime = Date.now();
            const totalElapsedTime = elapsedTime + (currentTime - startTime);
            const lapTime = totalElapsedTime - lastLapTime;
            lastLapTime = totalElapsedTime;
            
            // Create lap entry
            const lapItem = document.createElement('li');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${lapCount}</span>
                <span class="lap-time">${formatTime(lapTime)}</span>
                <span class="total-time">${formatTime(totalElapsedTime)}</span>
            `;
            
            // Add to lap list (newest at top)
            lapList.insertBefore(lapItem, lapList.firstChild);
        }
    }
    
    // Event listeners
    startBtn.addEventListener('click', startStopwatch);
    pauseBtn.addEventListener('click', pauseStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);
    
    // Initialize the stopwatch display
    resetStopwatch();
});