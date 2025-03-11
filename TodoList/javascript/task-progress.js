// Task Progress Widget Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const taskProgressWidget = document.getElementById('task-progress-widget');
    const toggleBtn = document.getElementById('toggle-task-progress');
    const widgetContent = taskProgressWidget.querySelector('.widget-content');
    const progressBar = document.getElementById('task-progress-bar');
    const percentageEl = document.getElementById('task-progress-percentage');
    const completedCountEl = document.getElementById('task-completed-count');
    const totalCountEl = document.getElementById('task-total-count');
    
    // Toggle widget content
    toggleBtn.addEventListener('click', function() {
        widgetContent.classList.toggle('collapsed');
        toggleBtn.textContent = widgetContent.classList.contains('collapsed') ? '▲' : '▼';
    });
    
    // Function to update progress bar
    // Update the updateTaskProgress function
    function updateTaskProgress() {
        // Get tasks from localStorage or window.getTasks function
        const tasks = typeof window.getTasks === 'function' ? window.getTasks() : 
                     (JSON.parse(localStorage.getItem('tasks')) || []);
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        
        // Calculate percentage
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Update progress bar
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
        
        // Update text elements
        percentageEl.textContent = `${percentage}%`;
        
        // Add or remove high-completion class based on percentage
        if (percentage > 75) {
            percentageEl.classList.add('high-completion');
        } else {
            percentageEl.classList.remove('high-completion');
        }
        
        completedCountEl.textContent = completedTasks;
        totalCountEl.textContent = totalTasks;
    }
    
    // Initial update
    updateTaskProgress();
    
    // Listen for task changes
    document.addEventListener('tasksUpdated', updateTaskProgress);
    
    // Custom event for task updates (to be dispatched in script.js)
    function createTasksUpdatedEvent() {
        const event = new Event('tasksUpdated');
        document.dispatchEvent(event);
    }
    
    // Expose the function globally
    window.createTasksUpdatedEvent = createTasksUpdatedEvent;
});