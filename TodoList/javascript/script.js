document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let tasks = [];
    let currentFilter = 'all';
    let currentEditId = null;
    let draggedItem = null;
    
    // Load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // Dispatch custom event for task updates
        document.dispatchEvent(new CustomEvent('tasksUpdated'));
    }
    
    // Add a new task
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now().toString(),
                text: text,
                completed: false,
                dueDate: null,
                category: '',
                priority: 'medium',
                notes: '',
                order: tasks.length
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            updateTasksCounter();
            
            taskInput.value = '';
            taskInput.focus();
        }
    }
    
    // Delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        
        // Update order of remaining tasks
        tasks = tasks.map((task, index) => ({
            ...task,
            order: index
        }));
        
        saveTasks();
        renderTasks();
        updateTasksCounter();
    }
    
    // Toggle task completion
    function toggleTaskCompletion(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
        updateTasksCounter();
    }
    
    // Clear completed tasks
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        
        // Update order of remaining tasks
        tasks = tasks.map((task, index) => ({
            ...task,
            order: index
        }));
        
        saveTasks();
        renderTasks();
        updateTasksCounter();
    }
    
    // Open edit modal
    function openEditModal(id) {
        currentEditId = id;
        const task = tasks.find(task => task.id === id);
        
        if (task) {
            document.getElementById('edit-task-text').value = task.text;
            document.getElementById('edit-task-due-date').value = task.dueDate || '';
            document.getElementById('edit-task-category').value = task.category || '';
            document.getElementById('edit-task-priority').value = task.priority || 'medium';
            document.getElementById('edit-task-notes').value = task.notes || '';
            
            document.getElementById('edit-modal').classList.add('show');
        }
    }
    
    // Save edited task
    function saveEditedTask() {
        if (currentEditId) {
            const taskText = document.getElementById('edit-task-text').value.trim();
            const dueDate = document.getElementById('edit-task-due-date').value;
            const category = document.getElementById('edit-task-category').value.trim();
            const priority = document.getElementById('edit-task-priority').value;
            const notes = document.getElementById('edit-task-notes').value.trim();
            
            if (taskText) {
                tasks = tasks.map(task => {
                    if (task.id === currentEditId) {
                        return {
                            ...task,
                            text: taskText,
                            dueDate: dueDate || null,
                            category: category,
                            priority: priority,
                            notes: notes
                        };
                    }
                    return task;
                });
                
                saveTasks();
                renderTasks();
                closeEditModal();
            }
        }
    }
    
    function closeEditModal() {
        document.getElementById('edit-modal').classList.remove('show');
    }
    
    // Setup drag and drop functionality
    function setupDragAndDrop() {
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            // Make items draggable
            item.setAttribute('draggable', true);
            
            // Drag start event
            item.addEventListener('dragstart', function() {
                draggedItem = this;
                setTimeout(() => {
                    this.classList.add('dragging');
                }, 0);
            });
            
            // Drag end event
            item.addEventListener('dragend', function() {
                draggedItem = null;
                this.classList.remove('dragging');
                saveTasks();
            });
            
            item.addEventListener('dragover', function(e) {
                e.preventDefault();
                if (draggedItem === this) return;
                
                const draggedOverItem = this;
                const draggedItemId = draggedItem.getAttribute('data-id');
                const draggedOverItemId = draggedOverItem.getAttribute('data-id');
                
                const draggedTaskIndex = tasks.findIndex(t => t.id === draggedItemId);
                const draggedOverTaskIndex = tasks.findIndex(t => t.id === draggedOverItemId);
                
                if (draggedTaskIndex !== -1 && draggedOverTaskIndex !== -1) {
                    const [movedTask] = tasks.splice(draggedTaskIndex, 1);
                    tasks.splice(draggedOverTaskIndex, 0, movedTask);
                    
                    tasks = tasks.map((task, index) => ({
                        ...task,
                        order: index
                    }));
                    
                    renderTasks();
                }
            });
            
            item.addEventListener('dragenter', function(e) {
                e.preventDefault();
                if (draggedItem === this) return;
                this.classList.add('drag-over');
            });
            
            item.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });
            
            item.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
            });
        });
    }
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        filteredTasks.sort((a, b) => a.order - b.order);
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;
            taskItem.setAttribute('data-id', task.id);
            
            let dueDateHtml = '';
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                let dateClass = '';
                if (dueDate < today) {
                    dateClass = 'overdue';
                } else if (dueDate.getTime() === today.getTime()) {
                    dateClass = 'due-today';
                }
                
                dueDateHtml = `<span class="due-date ${dateClass}">${formatDate(task.dueDate)}</span>`;
            }
            
            let categoryHtml = '';
            if (task.category) {
                categoryHtml = `<span class="task-category">${task.category}</span>`;
            }
            
            let notesIndicator = '';
            if (task.notes) {
                notesIndicator = '<span class="notes-indicator" title="This task has notes">📝</span>';
            }
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    ${dueDateHtml}
                    ${categoryHtml}
                    ${notesIndicator}
                </div>
                <div class="task-actions">
                    <button class="edit-btn" title="Edit task">✏️</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
        });
        
        setupDragAndDrop();
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}/${day}`;
    }
    
    function updateTasksCounter() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }
    
    function checkDueDates() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        tasks.forEach(task => {
            if (task.dueDate && !task.completed) {
                const dueDate = new Date(task.dueDate);
                
                if (dueDate.getTime() === today.getTime()) {
                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification("Task Due Today", {
                            body: task.text,
                            icon: "https://cdn-icons-png.flaticon.com/512/2098/2098402.png"
                        });
                    }
                }
            }
        });
    }
    
    function requestNotificationPermission() {
        if ("Notification" in window) {
            if (Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    }
    
    // Event listeners
    addButton.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    taskList.addEventListener('click', function(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const taskId = taskItem.getAttribute('data-id');
        
        if (e.target.classList.contains('task-checkbox')) {
            toggleTaskCompletion(taskId);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (e.target.classList.contains('edit-btn')) {
            openEditModal(taskId);
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Re-render tasks with the selected filter
            renderTasks();
        });
    });
    
    document.getElementById('save-edit-btn').addEventListener('click', saveEditedTask);
    document.getElementById('close-modal-btn').addEventListener('click', closeEditModal);
    
    // Theme toggle functionality - FIXED: Removed nested DOMContentLoaded event
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // If no saved preference, default to dark theme
    // If saved preference is light, apply light theme
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = '🌙'; // Moon icon for light theme
    } else {
        // Ensure dark theme is applied (this is redundant but explicit)
        document.body.classList.remove('light-theme');
        themeToggle.textContent = '☀️'; // Sun icon for dark theme
        
        // Save the dark theme preference
        localStorage.setItem('theme', 'dark');
    }
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('light-theme')) {
            // Switch to dark theme
            document.body.classList.remove('light-theme');
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            // Switch to light theme
            document.body.classList.add('light-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Remove the theme toggle functionality from here since it's now in theme.js
    
    // Initialize
    loadTasks();
    renderTasks();
    updateTasksCounter();
    requestNotificationPermission();
    checkDueDates();
    
    // Make tasks available globally for the task progress widget
    window.getTasks = function() {
        return tasks;
    };
});