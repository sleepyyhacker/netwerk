// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    checkAuthentication();
    
    // Initialize dashboard
    initializeDashboard();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
});

function checkAuthentication() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true' || 
                      localStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
}

function initializeDashboard() {
    console.log('Admin Dashboard initialized');
    
    // Add loading animation
    showLoadingAnimation();
    
    // Simulate data loading
    setTimeout(() => {
        hideLoadingAnimation();
        animateCards();
    }, 1000);
}

function setupEventListeners() {
    // Logout button
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleActionClick);
    });
    
    // Special handling for prices/products button
    const pricesProductsBtn = document.getElementById('pricesProductsBtn');
    if (pricesProductsBtn) {
        pricesProductsBtn.addEventListener('click', handlePricesProductsClick);
    }
    
}

function handleLogout() {
    if (confirm('Weet je zeker dat je wilt uitloggen?')) {
        // Show loading animation
        showLoadingAnimation();
        
        // Clear authentication
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminRememberMe');
        localStorage.removeItem('currentUser');
        
        // Simulate logout process
        setTimeout(() => {
            alert('Je bent succesvol uitgelogd!');
            // Redirect to login page
            window.location.href = 'login.html';
        }, 1500);
    }
}

function handleActionClick(event) {
    const button = event.currentTarget;
    const buttonText = button.textContent.trim();
    
    // If it's a link, let it navigate naturally
    if (button.tagName === 'A') {
        return; // Don't prevent default navigation
    }
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Handle different actions
    switch(buttonText) {
        case 'Nieuwe Gebruiker':
            showNewUserModal();
            break;
        case 'Gebruiker Verwijderen':
            showDeleteUserModal();
            break;
        default:
            console.log('Action clicked:', buttonText);
    }
}

function handlePricesProductsClick(event) {
    const button = event.currentTarget;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Show confirmation modal
    showPricesProductsModal();
}


function showNewUserModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        animation: slideIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #1a202c; text-align: center;">Nieuwe Gebruiker Toevoegen</h3>
        <form id="newUserForm" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="font-weight: 600; color: #1a202c;">Gebruikersnaam</label>
                <input type="text" id="newUsername" placeholder="Voer gebruikersnaam in" required 
                       style="padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="font-weight: 600; color: #1a202c;">Wachtwoord</label>
                <input type="password" id="newPassword" placeholder="Voer wachtwoord in" required 
                       style="padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); 
                        color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Gebruiker Toevoegen
                </button>
                <button type="button" onclick="this.closest('.modal-overlay').remove()" 
                        style="flex: 1; background: #e2e8f0; color: #718096; border: none; padding: 0.75rem; 
                        border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Annuleren
                </button>
            </div>
        </form>
        <div id="userMessage" style="margin-top: 1rem; text-align: center; display: none;"></div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Handle form submission
    const form = modal.querySelector('#newUserForm');
    form.addEventListener('submit', handleNewUserSubmit);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

function handleNewUserSubmit(event) {
    event.preventDefault();
    
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const messageDiv = document.getElementById('userMessage');
    
    if (!username || !password) {
        showUserMessage('Vul alle velden in', 'error');
        return;
    }
    
    // Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem('customUsers') || '[]');
    
    // Check if username already exists
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        showUserMessage('Gebruikersnaam bestaat al', 'error');
        return;
    }
    
    // Add new user
    const newUser = { username: username, password: password };
    users.push(newUser);
    localStorage.setItem('customUsers', JSON.stringify(users));
    
    showUserMessage('Gebruiker succesvol toegevoegd!', 'success');
    
    // Clear form
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    
    // Close modal after 2 seconds
    setTimeout(() => {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
    }, 2000);
}

function showUserMessage(message, type) {
    const messageDiv = document.getElementById('userMessage');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.color = type === 'error' ? '#f56565' : '#48bb78';
    messageDiv.style.background = type === 'error' ? 'rgba(245, 101, 101, 0.1)' : 'rgba(72, 187, 120, 0.1)';
    messageDiv.style.padding = '0.75rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.border = `1px solid ${type === 'error' ? 'rgba(245, 101, 101, 0.2)' : 'rgba(72, 187, 120, 0.2)'}`;
}

function showDeleteUserModal() {
    // Check if current user is the main user
    const currentUser = getCurrentUser();
    if (currentUser !== 'Hoofdgebruiker123') {
        showModal('Toegang Geweigerd', 'Alleen de hoofdgebruiker kan gebruikers verwijderen.');
        return;
    }
    
    // Get all users
    const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
    
    if (customUsers.length === 0) {
        showModal('Geen Gebruikers', 'Er zijn geen aangemelde gebruikers om te verwijderen.');
        return;
    }
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
    `;
    
    // Create user list HTML
    let userListHTML = '';
    customUsers.forEach((user, index) => {
        userListHTML += `
            <div class="user-item" style="display: flex; justify-content: space-between; align-items: center; 
                    padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 0.5rem;">
                <div>
                    <strong>${user.username}</strong>
                </div>
                <button onclick="deleteUser(${index})" 
                        style="background: #f56565; color: white; border: none; padding: 0.5rem 1rem; 
                        border-radius: 5px; cursor: pointer; font-weight: 600;">
                    Verwijderen
                </button>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #1a202c; text-align: center;">Gebruikersbeheer</h3>
        <p style="margin-bottom: 1.5rem; color: #718096; text-align: center;">
            Klik op "Verwijderen" om een gebruiker te verwijderen
        </p>
        <div id="userList">
            ${userListHTML}
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button onclick="this.closest('.modal-overlay').remove()" 
                    style="flex: 1; background: #e2e8f0; color: #718096; border: none; padding: 0.75rem; 
                    border-radius: 8px; font-weight: 600; cursor: pointer;">
                Sluiten
            </button>
        </div>
        <div id="deleteMessage" style="margin-top: 1rem; text-align: center; display: none;"></div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

function getCurrentUser() {
    // Get the current logged in user from session storage
    const loggedInUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    return loggedInUser || 'unknown';
}

function deleteUser(index) {
    if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
        return;
    }
    
    const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
    const deletedUser = customUsers[index];
    
    // Remove user from array
    customUsers.splice(index, 1);
    localStorage.setItem('customUsers', JSON.stringify(customUsers));
    
    // Show success message
    const messageDiv = document.getElementById('deleteMessage');
    messageDiv.textContent = `Gebruiker "${deletedUser.username}" is verwijderd!`;
    messageDiv.style.display = 'block';
    messageDiv.style.color = '#48bb78';
    messageDiv.style.background = 'rgba(72, 187, 120, 0.1)';
    messageDiv.style.padding = '0.75rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.border = '1px solid rgba(72, 187, 120, 0.2)';
    
    // Refresh the user list
    setTimeout(() => {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        showDeleteUserModal(); // Refresh the modal
    }, 1500);
}

function showPricesProductsModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 1rem;">🛒</div>
        <h3 style="margin-bottom: 1rem; color: #1a202c;">Prijzen & Producten Beheren</h3>
        <p style="margin-bottom: 2rem; color: #718096;">
            U wordt doorgestuurd naar de webshop pagina waar u prijzen en producten kunt aanpassen.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="goToWebshop" 
                    style="background: linear-gradient(135deg, #667eea, #764ba2); 
                           color: white; 
                           border: none; 
                           padding: 0.75rem 2rem; 
                           border-radius: 8px; 
                           cursor: pointer; 
                           font-weight: 600;
                           transition: all 0.3s ease;">
                Naar Webshop
            </button>
            <button onclick="this.closest('.modal-overlay').remove()" 
                    style="background: #e2e8f0; 
                           color: #718096; 
                           border: none; 
                           padding: 0.75rem 2rem; 
                           border-radius: 8px; 
                           cursor: pointer; 
                           font-weight: 600;
                           transition: all 0.3s ease;">
                Annuleren
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Handle webshop navigation
    const goToWebshopBtn = modal.querySelector('#goToWebshop');
    goToWebshopBtn.addEventListener('click', () => {
        // Navigate to webshop
        window.location.href = '../webshop/webshop.html';
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

function showModal(title, message) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #1a202c;">${title}</h3>
        <p style="margin-bottom: 2rem; color: #718096;">${message}</p>
        <button onclick="this.closest('.modal-overlay').remove()" 
                style="background: linear-gradient(135deg, #667eea, #764ba2); 
                       color: white; 
                       border: none; 
                       padding: 0.75rem 2rem; 
                       border-radius: 5px; 
                       cursor: pointer; 
                       font-weight: 600;">
            Sluiten
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}


function showLoadingAnimation() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-animation';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    loadingDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p style="color: #718096; font-weight: 600;">Laden...</p>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

function hideLoadingAnimation() {
    const loadingDiv = document.getElementById('loading-animation');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function animateCards() {
    // Cards removed - no animation needed
}

function loadDashboardData() {
    // Simulate loading real-time data
    setInterval(() => {
        updateStats();
    }, 5000);
}

function updateStats() {
    // Stats removed - no update needed
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
