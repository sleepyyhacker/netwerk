// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form
    initializeLoginForm();
    
    // Setup event listeners
    setupEventListeners();
});

function initializeLoginForm() {
    console.log('Login form initialized');
    
    // Check if user is already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        redirectToAdmin();
    }
}

function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Password visibility toggle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function(e) {
            e.preventDefault();
            togglePasswordVisibility(passwordInput, passwordToggle);
        });
    }
    
    // Enter key on inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });
    });
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginButton = document.getElementById('loginButton');
    const buttonLoader = document.getElementById('buttonLoader');
    const buttonText = document.querySelector('.button-text');
    const errorMessage = document.getElementById('errorMessage');
    
    // Clear previous errors
    hideError();
    
    // Validate inputs
    if (!username || !password) {
        showError('Vul alle velden in');
        return;
    }
    
    // Show loading state
    showLoadingState(loginButton, buttonLoader, buttonText);
    
    // Simulate login process
    setTimeout(() => {
        if (validateCredentials(username, password)) {
            // Successful login
            handleSuccessfulLogin(rememberMe);
        } else {
            // Failed login
            handleFailedLogin(loginButton, buttonLoader, buttonText);
        }
    }, 1500);
}

function validateCredentials(username, password) {
    // Demo credentials - in real application, this would be server-side validation
    const defaultCredentials = [
        { username: 'Hoofdgebruiker123', password: 'Hoofdwachtwoord123' },
        { username: 'beheerder', password: 'beheerder123' },
        { username: 'test', password: 'test123' }
    ];
    
    // Get custom users from localStorage
    const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
    
    // Combine default and custom users
    const allCredentials = [...defaultCredentials, ...customUsers];
    
    // Debug logging
    console.log('Attempting login with:', { username, password });
    console.log('Available credentials:', allCredentials);
    
    const isValid = allCredentials.some(cred => {
        const usernameMatch = cred.username.toLowerCase() === username.toLowerCase();
        const passwordMatch = cred.password === password;
        console.log('Checking credential:', cred, 'Username match:', usernameMatch, 'Password match:', passwordMatch);
        return usernameMatch && passwordMatch;
    });
    
    console.log('Login result:', isValid);
    return isValid;
}

function handleSuccessfulLogin(rememberMe) {
    const username = document.getElementById('username').value.trim();
    
    // Store login state
    if (rememberMe) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminRememberMe', 'true');
        localStorage.setItem('currentUser', username);
    } else {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('currentUser', username);
    }
    
    // Redirect to admin dashboard immediately
    redirectToAdmin();
}

function handleFailedLogin(loginButton, buttonLoader, buttonText) {
    // Hide loading state
    hideLoadingState(loginButton, buttonLoader, buttonText);
    
    // Show error message
    showError('Ongeldige gebruikersnaam of wachtwoord');
    
    // Shake animation
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        loginCard.style.animation = '';
    }, 500);
}

function showLoadingState(button, loader, text) {
    button.disabled = true;
    loader.classList.add('active');
    button.style.cursor = 'not-allowed';
}

function hideLoadingState(button, loader, text) {
    button.disabled = false;
    loader.classList.remove('active');
    button.style.cursor = 'pointer';
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideError();
        }, 5000);
    }
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.classList.remove('show');
    }
}




function togglePasswordVisibility(passwordInput, toggleButton) {
    // Toggle password visibility
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
    
    // Update icon based on current state
    const icon = toggleButton.querySelector('svg');
    if (icon) {
        if (passwordInput.type === 'text') {
            // Password is visible (letters) - show open eye
            icon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        } else {
            // Password is hidden (bolletjes) - show eye with slash
            icon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        }
    }
}

function redirectToAdmin() {
    window.location.href = 'admin.html';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes checkmark {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
