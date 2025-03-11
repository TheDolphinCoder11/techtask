document.addEventListener('DOMContentLoaded', function() {
    // Notes-related variables and functions removed
    
    // Goal Progress Widget
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const completedCount = document.getElementById('completed-count');
    const totalCount = document.getElementById('total-count');
    const toggleProgressBtn = document.getElementById('toggle-progress');
    const progressContent = document.querySelector('.progress-content');
    
    // Update progress bar
    function updateProgressBar() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Update the goal progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            
            // Update progress bar color based on percentage
            progressBar.classList.remove('progress-low', 'progress-medium', 'progress-high');
            if (percentage < 33) {
                progressBar.classList.add('progress-low');
            } else if (percentage < 66) {
                progressBar.classList.add('progress-medium');
            } else {
                progressBar.classList.add('progress-high');
            }
        }
        
        // Update text elements
        document.getElementById('progress-percentage').textContent = `${percentage}%`;
        document.getElementById('completed-count').textContent = completedTasks;
        document.getElementById('total-count').textContent = totalTasks;
    }
    
    // Toggle progress visibility
    function toggleProgress() {
        progressContent.classList.toggle('collapsed');
        toggleProgressBtn.textContent = progressContent.classList.contains('collapsed') ? '▲' : '▼';
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Event listeners
    toggleProgressBtn.addEventListener('click', toggleProgress);
    
    // Listen for task updates to refresh progress bar
    document.addEventListener('tasksUpdated', updateProgressBar);
    
    // Initialize
    updateProgressBar();
});