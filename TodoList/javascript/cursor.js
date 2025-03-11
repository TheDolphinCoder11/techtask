// Make the initialization function globally available
function initCustomCursor() {
    // Create cursor elements
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    // Add cursor elements to the DOM
    document.body.appendChild(customCursor);
    document.body.appendChild(cursorDot);
    
    // Set default cursor mode
    document.body.classList.add('cursor-default');
    
    // Track mouse movement with requestAnimationFrame for better performance
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Use requestAnimationFrame for smoother cursor movement
    function updateCursorPosition() {
        // Update cursor positions
        customCursor.style.left = mouseX + 'px';
        customCursor.style.top = mouseY + 'px';
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        
        requestAnimationFrame(updateCursorPosition);
    }
    
    // Start the animation loop
    requestAnimationFrame(updateCursorPosition);
    
    // Change cursor mode based on element being hovered
    document.addEventListener('mouseover', function(e) {
        // Check for clickable elements
        if (
            e.target.tagName === 'BUTTON' || 
            e.target.tagName === 'A' ||
            e.target.classList.contains('task-checkbox') ||
            e.target.classList.contains('delete-btn') ||
            e.target.classList.contains('edit-btn') ||
            e.target.classList.contains('priority-btn') ||
            e.target.classList.contains('filter-btn') ||
            e.target.classList.contains('toggle-btn') ||
            e.target.closest('button') !== null
        ) {
            document.body.classList.remove('cursor-default', 'cursor-text');
            document.body.classList.add('cursor-pointer');
        }
        // Check for text input elements
        else if (
            e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' ||
            e.target.getAttribute('contenteditable') === 'true'
        ) {
            document.body.classList.remove('cursor-default', 'cursor-pointer');
            document.body.classList.add('cursor-text');
        }
        // Default cursor for other elements
        else {
            document.body.classList.remove('cursor-pointer', 'cursor-text');
            document.body.classList.add('cursor-default');
        }
    });
    
    // Add click animation
    document.addEventListener('mousedown', function() {
        customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', function() {
        if (document.body.classList.contains('cursor-pointer')) {
            customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        } else if (document.body.classList.contains('cursor-text')) {
            customCursor.style.transform = 'translate(-50%, -50%)';
        } else {
            customCursor.style.transform = 'translate(-50%, -50%)';
        }
        cursorDot.style.transform = 'translate(-50%, -50%)';
    });
    
    // Handle cursor leaving the window
    document.addEventListener('mouseleave', function() {
        customCursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        customCursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
    
    // Initial check for viewport width
    if (window.innerWidth <= 768) {
        document.body.style.cursor = 'auto';
        customCursor.style.display = 'none';
        cursorDot.style.display = 'none';
    }
}

// Also initialize on DOMContentLoaded for normal script loading
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not already initialized
    if (!document.querySelector('.custom-cursor')) {
        initCustomCursor();
    }
});