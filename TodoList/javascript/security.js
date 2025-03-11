/**
 * Security utilities for the Todo List application
 */

const SecurityUtils = {
    /**
     * Sanitizes input to prevent XSS attacks
     * @param {string} input - The input to sanitize
     * @returns {string} - The sanitized input
     */
    sanitizeInput: function(input) {
        if (!input) return '';
        
        // Convert special characters to HTML entities
        return String(input)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
    
    /**
     * Generates a CSRF token
     * @returns {string} - The generated token
     */
    generateCSRFToken: function() {
        // Generate a random token
        const token = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
        
        // Store the token in sessionStorage
        sessionStorage.setItem('csrfToken', token);
        
        return token;
    },
    
    /**
     * Validates a CSRF token
     * @param {string} token - The token to validate
     * @returns {boolean} - Whether the token is valid
     */
    validateCSRFToken: function(token) {
        const storedToken = sessionStorage.getItem('csrfToken');
        return token === storedToken;
    },
    
    /**
     * Encrypts data for storage
     * @param {any} data - The data to encrypt
     * @returns {string} - The encrypted data
     */
    encryptData: function(data) {
        // Simple XOR encryption with a fixed key (for demonstration purposes)
        // In a real application, use a proper encryption library
        const key = 'TodoSecretKey2023';
        const dataStr = JSON.stringify(data);
        let encrypted = '';
        
        for (let i = 0; i < dataStr.length; i++) {
            const charCode = dataStr.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            encrypted += String.fromCharCode(charCode);
        }
        
        // Convert to base64 for safe storage
        return btoa(encrypted);
    },
    
    /**
     * Decrypts stored data
     * @param {string} encryptedData - The encrypted data
     * @returns {any} - The decrypted data
     */
    decryptData: function(encryptedData) {
        if (!encryptedData) return null;
        
        try {
            // Decode from base64
            const encrypted = atob(encryptedData);
            const key = 'TodoSecretKey2023';
            let decrypted = '';
            
            for (let i = 0; i < encrypted.length; i++) {
                const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                decrypted += String.fromCharCode(charCode);
            }
            
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    },
    
    /**
     * Sets up basic authentication
     * @param {string} username - The username to set
     * @param {string} password - The password to set
     */
    setupAuthentication: function(username, password) {
        if (!username || !password) return;
        
        // Hash the password (simple hash for demonstration)
        const hashedPassword = this.simpleHash(password);
        
        // Store credentials
        localStorage.setItem('auth_username', username);
        localStorage.setItem('auth_password', hashedPassword);
    },
    
    /**
     * Authenticates a user
     * @param {string} username - The username to authenticate
     * @param {string} password - The password to authenticate
     * @returns {boolean} - Whether authentication was successful
     */
    authenticate: function(username, password) {
        const storedUsername = localStorage.getItem('auth_username');
        const storedPassword = localStorage.getItem('auth_password');
        
        if (!storedUsername || !storedPassword) return true; // No auth set up yet
        
        // Hash the provided password and compare
        const hashedPassword = this.simpleHash(password);
        
        return username === storedUsername && hashedPassword === storedPassword;
    },
    
    /**
     * Simple hash function (for demonstration purposes)
     * @param {string} str - The string to hash
     * @returns {string} - The hashed string
     */
    simpleHash: function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    },
    
    /**
     * Adds Content Security Policy headers
     */
    setupCSP: function() {
        // This would normally be done server-side, but we'll add a meta tag for demonstration
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://cdn-icons-png.flaticon.com;";
        document.head.appendChild(meta);
    }
};