document.addEventListener('DOMContentLoaded', function() {
    // Pomodoro elements
    const timerDisplay = document.getElementById('timer-display');
    const pomodoroStatus = document.getElementById('pomodoro-status');
    const startBtn = document.getElementById('pomodoro-start');
    const pauseBtn = document.getElementById('pomodoro-pause');
    const resetBtn = document.getElementById('pomodoro-reset');
    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');
    const taskSelector = document.getElementById('pomodoro-task-selector');
    
    let timer;
    let timeLeft;
    let isRunning = false;
    let isWorkSession = true;
    
    // Initialize task selector
    function updateTaskSelector() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const activeTasks = tasks.filter(task => !task.completed);
        
        // Clear existing options except the default one
        while (taskSelector.options.length > 1) {
            taskSelector.remove(1);
        }
        
        // Add active tasks to selector
        activeTasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = task.text;
            taskSelector.appendChild(option);
        });
    }
    
    // Format time as MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update timer display
    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
    }
    
    // Start timer countdown
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                
                // Play beep sound when timer ends
                playAlarm();
                
                // Switch to the next session after a short delay
                setTimeout(() => {
                    switchSession();
                }, 1500); // Give time for the sound to play before switching
            }
        }, 1000);
    }
    
    // Play alarm sound when timer ends - KEEP ONLY THIS VERSION
    function playAlarm() {
        // Create a beep using Web Audio API - this is more reliable than external URLs
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 800; // Higher pitch beep
            gainNode.gain.value = 0.5;
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            setTimeout(() => oscillator.stop(), 1000);
            
            console.log('Beep sound played using Web Audio API');
        } catch (err) {
            console.log('Web Audio API failed:', err);
            
            // Fallback to a simple audio element with a local beep sound
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.volume = 1.0; // Maximum volume
            audio.play().catch(error => console.log('Audio playback failed:', error));
        }
        
        // Show notification if permitted
        if ("Notification" in window && Notification.permission === "granted") {
            let notificationTitle = isWorkSession ? 'Break Time!' : 'Work Time!';
            let notificationBody = isWorkSession ? 'Time for a break.' : 'Break is over. Time to get back to work!';
            
            if (isWorkSession && taskSelector.value) {
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                const selectedTask = tasks.find(task => task.id === taskSelector.value);
                if (selectedTask) {
                    notificationBody = `You've completed a work session on: ${selectedTask.text}`;
                }
            }
            
            new Notification(notificationTitle, {
                body: notificationBody,
                icon: 'https://cdn-icons-png.flaticon.com/512/2098/2098402.png'
            });
        }
    }
    
    // Pause timer
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            
            // Update button states
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
        }
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        
        // Reset to work session
        isWorkSession = true;
        pomodoroStatus.textContent = 'Work Session';
        pomodoroStatus.className = 'work-session';
        
        // Set time based on work duration
        timeLeft = workDurationInput.value * 60;
        updateDisplay();
        
        // Update button states
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
    }
    
    // Switch between work and break sessions
    function switchSession() {
        isWorkSession = !isWorkSession;
        
        if (isWorkSession) {
            pomodoroStatus.textContent = 'Work Session';
            pomodoroStatus.className = 'work-session';
            timeLeft = workDurationInput.value * 60;
        } else {
            pomodoroStatus.textContent = 'Break Session';
            pomodoroStatus.className = 'break-session';
            timeLeft = breakDurationInput.value * 60;
        }
        
        updateDisplay();
        
        // Auto-start the next session
        startTimer();
    }
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    workDurationInput.addEventListener('change', function() {
        if (isWorkSession && !isRunning) {
            timeLeft = this.value * 60;
            updateDisplay();
        }
    });
    
    breakDurationInput.addEventListener('change', function() {
        if (!isWorkSession && !isRunning) {
            timeLeft = this.value * 60;
            updateDisplay();
        }
    });
    
    // Request notification permission
    function requestNotificationPermission() {
        if ("Notification" in window) {
            if (Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    }
    
    // Listen for task updates
    document.addEventListener('tasksUpdated', updateTaskSelector);
    
    // Initialize
    updateTaskSelector();
    resetTimer();
    requestNotificationPermission();
});