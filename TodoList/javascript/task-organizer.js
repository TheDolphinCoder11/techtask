/**
 * Task Organizer - Moves completed tasks to the top of the list
 * This script handles the automatic reorganization of tasks based on completion status
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure other scripts have initialized
    setTimeout(initTaskOrganizer, 100);
});

function initTaskOrganizer() {
    // Get the task list element
    const taskList = document.getElementById('task-list');
    
    // Add a mutation observer to watch for changes in the task list
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                // Only reorganize if we're in the "all" filter view
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter && activeFilter.dataset.filter === 'all') {
                    organizeTasksByCompletion();
                }
            }
        });
    });
    
    // Configure the observer to watch for changes to the task list and its children
    observer.observe(taskList, { 
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'checked']
    });
    
    // Override the existing checkbox change handler
    taskList.addEventListener('change', function(e) {
        if (e.target.classList.contains('task-checkbox')) {
            // Let the original event handler run first
            setTimeout(() => {
                handleTaskCompletion(e.target);
            }, 0);
        }
    }, true);
    
    // Listen for the custom tasksUpdated event
    document.addEventListener('tasksUpdated', function(e) {
        // Wait a moment for the DOM to update
        setTimeout(organizeTasksByCompletion, 50);
    });
    
    // Initial organization
    organizeTasksByCompletion();
    
    // Hook into filter buttons
    hookIntoFilters();
}

/**
 * Handles when a task is marked as completed or uncompleted
 * @param {HTMLElement} checkbox - The checkbox that was changed
 */
function handleTaskCompletion(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    const taskList = document.getElementById('task-list');
    
    if (checkbox.checked) {
        // Task was completed - move to top with animation
        taskList.insertBefore(taskItem, taskList.firstChild);
        
        // Add a subtle animation to highlight the movement
        taskItem.style.backgroundColor = 'rgba(48, 207, 208, 0.3)';
        setTimeout(() => {
            taskItem.style.backgroundColor = '';
            taskItem.style.transition = 'background-color 0.5s ease';
        }, 10);
        
        setTimeout(() => {
            taskItem.style.transition = '';
        }, 600);
    } else {
        // Task was unchecked - reorganize all tasks
        organizeTasksByCompletion();
    }
}

/**
 * Organizes all tasks in the list by completion status
 * Completed tasks go to the top, active tasks below
 */
function organizeTasksByCompletion() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    
    const tasks = Array.from(taskList.querySelectorAll('.task-item'));
    if (tasks.length === 0) return;
    
    // Get the current filter
    const activeFilter = document.querySelector('.filter-btn.active');
    if (!activeFilter || activeFilter.dataset.filter !== 'all') {
        return;
    }
    
    // Sort tasks: completed first, then active
    tasks.sort((a, b) => {
        const aCompleted = a.querySelector('.task-checkbox')?.checked || false;
        const bCompleted = b.querySelector('.task-checkbox')?.checked || false;
        
        if (aCompleted && !bCompleted) return -1;
        if (!aCompleted && bCompleted) return 1;
        return 0;
    });
    
    // Reorder the DOM elements
    tasks.forEach(task => taskList.appendChild(task));
}

/**
 * Hook into the existing filter functionality
 */
function hookIntoFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // After the filter is applied and tasks are rendered
            setTimeout(() => {
                if (this.dataset.filter === 'all') {
                    organizeTasksByCompletion();
                }
            }, 50);
        });
    });
}

// Make sure the script doesn't interfere with the original task rendering
window.addEventListener('load', function() {
    setTimeout(organizeTasksByCompletion, 200);
});