// Over Ons Beheerdersmodus JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load any saved changes first
    loadSavedChanges();
    
    // Check if admin is logged in
    checkAdminStatus();
    
    // Setup admin mode functionality
    setupAdminMode();
});

function loadSavedChanges() {
    // Load changes from localStorage (persistent) or sessionStorage (temporary)
    let changes = JSON.parse(localStorage.getItem('overOnsChanges') || '{}');
    const sessionChanges = JSON.parse(sessionStorage.getItem('overOnsChanges') || '{}');
    
    // Merge session changes with persistent changes (session takes priority)
    changes = { ...changes, ...sessionChanges };
    
    if (Object.keys(changes).length === 0) {
        return; // No changes to apply
    }
    
    console.log('Loading saved changes:', changes);
    
    // Apply changes to elements
    Object.keys(changes).forEach(elementId => {
        const newText = changes[elementId];
        const element = findElementById(elementId);
        
        if (element) {
            element.textContent = newText;
            console.log(`Applied change to ${elementId}: ${newText}`);
        }
    });
}

function findElementById(elementId) {
    // Find element by the specific ID we created
    if (elementId === 'hero-title') {
        return document.querySelector('.hero-title');
    } else if (elementId === 'hero-subtitle') {
        return document.querySelector('.hero-subtitle');
    } else if (elementId === 'lead') {
        return document.querySelector('.lead');
    } else if (elementId.startsWith('story-p-')) {
        const index = parseInt(elementId.split('-')[2]);
        const paragraphs = document.querySelectorAll('.story-text p');
        return paragraphs[index] || null;
    }
    
    // Fallback: try to find by tag and index
    const parts = elementId.split('-');
    const tagName = parts[0].toUpperCase();
    const index = parseInt(parts[1]);
    
    const elements = document.querySelectorAll(tagName);
    return elements[index] || null;
}

function checkAdminStatus() {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true' || 
                           sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isAdminLoggedIn) {
        console.log('Admin mode available');
        addAdminModeToggle();
    }
}

function addAdminModeToggle() {
    // Create admin controls container
    const adminControlsContainer = document.createElement('div');
    adminControlsContainer.id = 'adminControlsContainer';
    adminControlsContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        z-index: 1000;
    `;
    
    // Create back to dashboard button
    const backToDashboardBtn = document.createElement('button');
    backToDashboardBtn.id = 'backToDashboard';
    backToDashboardBtn.innerHTML = `
        Terug naar Dashboard
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
    `;
    backToDashboardBtn.style.cssText = `
        background: linear-gradient(135deg, #48bb78, #38a169);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
        transition: all 0.3s ease;
        white-space: nowrap;
    `;
    
    // Add hover effect for back button
    backToDashboardBtn.addEventListener('mouseenter', () => {
        backToDashboardBtn.style.transform = 'translateY(-2px)';
        backToDashboardBtn.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
    });
    
    backToDashboardBtn.addEventListener('mouseleave', () => {
        backToDashboardBtn.style.transform = 'translateY(0)';
        backToDashboardBtn.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.3)';
    });
    
    // Navigate to dashboard
    backToDashboardBtn.addEventListener('click', () => {
        window.location.href = '../beheerdersportaal/admin.html';
    });
    
    // Create admin mode toggle button
    const adminToggle = document.createElement('button');
    adminToggle.id = 'adminToggle';
    adminToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
        Beheerdersmodus
    `;
    adminToggle.style.cssText = `
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        white-space: nowrap;
    `;
    
    // Add hover effect for admin toggle
    adminToggle.addEventListener('mouseenter', () => {
        adminToggle.style.transform = 'translateY(-2px)';
        adminToggle.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
    });
    
    adminToggle.addEventListener('mouseleave', () => {
        adminToggle.style.transform = 'translateY(0)';
        adminToggle.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
    });
    
    // Toggle admin mode
    adminToggle.addEventListener('click', toggleAdminMode);
    
    // Add buttons to container (beheerdersmodus first, then dashboard)
    adminControlsContainer.appendChild(adminToggle);
    adminControlsContainer.appendChild(backToDashboardBtn);
    
    document.body.appendChild(adminControlsContainer);
}

function toggleAdminMode() {
    const isAdminMode = document.body.classList.contains('admin-mode');
    
    if (isAdminMode) {
        // Exit admin mode
        document.body.classList.remove('admin-mode');
        hideAdminControls();
        showNotification('Beheerdersmodus uitgeschakeld', 'info');
    } else {
        // Enter admin mode
        document.body.classList.add('admin-mode');
        showAdminControls();
        showNotification('Beheerdersmodus ingeschakeld', 'success');
    }
}

function showAdminControls() {
    // Add edit buttons to all editable text elements
    const editableElements = document.querySelectorAll('.hero-title, .hero-subtitle, .lead, .story-text p');
    
    editableElements.forEach((element, index) => {
        if (!element.querySelector('.edit-btn')) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '✏️';
            editBtn.style.cssText = `
                position: absolute;
                top: -10px;
                right: -10px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                z-index: 10;
            `;
            
            // Make parent element relative positioned
            element.style.position = 'relative';
            element.appendChild(editBtn);
            
            // Add hover effect
            editBtn.addEventListener('mouseenter', () => {
                editBtn.style.transform = 'scale(1.1)';
                editBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.5)';
            });
            
            editBtn.addEventListener('mouseleave', () => {
                editBtn.style.transform = 'scale(1)';
                editBtn.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.3)';
            });
            
            // Add click handler
            editBtn.addEventListener('click', () => {
                editText(element);
            });
        }
    });
    
    // Add admin control panel
    addAdminControlPanel();
}

function hideAdminControls() {
    // Remove edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => btn.remove());
    
    // Remove admin control panel
    const controlPanel = document.querySelector('.admin-control-panel');
    if (controlPanel) {
        controlPanel.remove();
    }
}

function editText(element) {
    const originalText = element.textContent.trim();
    const isHeading = element.tagName === 'H1' || element.tagName === 'H2';
    
    // Create input field
    const input = document.createElement(isHeading ? 'input' : 'textarea');
    input.value = originalText;
    input.style.cssText = `
        width: 100%;
        padding: 0.5rem;
        border: 2px solid #667eea;
        border-radius: 8px;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        background: white;
        color: #333;
        resize: ${isHeading ? 'none' : 'vertical'};
        min-height: ${isHeading ? 'auto' : '100px'};
    `;
    
    // Replace element content with input
    const parent = element.parentNode;
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative; width: 100%;';
    
    // Create save/cancel buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
        justify-content: flex-end;
    `;
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Opslaan';
    saveBtn.style.cssText = `
        background: #48bb78;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
    `;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Annuleren';
    cancelBtn.style.cssText = `
        background: #e2e8f0;
        color: #718096;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
    `;
    
    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
    wrapper.appendChild(input);
    wrapper.appendChild(buttonContainer);
    
    // Replace element with wrapper
    parent.replaceChild(wrapper, element);
    
    // Focus input
    input.focus();
    input.select();
    
    // Save functionality
    saveBtn.addEventListener('click', () => {
        const newText = input.value.trim();
        if (newText && newText !== originalText) {
            // Update the element
            element.textContent = newText;
            parent.replaceChild(element, wrapper);
            
            // Save to localStorage
            saveTextChange(element, newText);
            showNotification('Tekst opgeslagen!', 'success');
        } else {
            // Cancel if no changes
            parent.replaceChild(element, wrapper);
        }
    });
    
    // Cancel functionality
    cancelBtn.addEventListener('click', () => {
        parent.replaceChild(element, wrapper);
    });
    
    // Save on Enter (for inputs)
    if (isHeading) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        });
    }
}

function saveTextChange(element, newText) {
    const elementId = getElementId(element);
    const changes = JSON.parse(localStorage.getItem('overOnsChanges') || '{}');
    changes[elementId] = newText;
    localStorage.setItem('overOnsChanges', JSON.stringify(changes));
    
    // Also save to sessionStorage for immediate access
    sessionStorage.setItem('overOnsChanges', JSON.stringify(changes));
    
    // Broadcast changes to other tabs/windows
    broadcastChanges(changes);
    
    console.log('Changes saved and broadcasted:', changes);
}

function broadcastChanges(changes) {
    // Use localStorage event to sync across tabs
    const event = new StorageEvent('storage', {
        key: 'overOnsChanges',
        newValue: JSON.stringify(changes),
        url: window.location.href
    });
    
    // Dispatch the event
    window.dispatchEvent(event);
}

// Listen for changes from other tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'overOnsChanges' && e.newValue) {
        const changes = JSON.parse(e.newValue);
        console.log('Received changes from other tab:', changes);
        
        // Apply changes immediately
        Object.keys(changes).forEach(elementId => {
            const newText = changes[elementId];
            const element = findElementById(elementId);
            
            if (element) {
                element.textContent = newText;
                console.log(`Applied change from other tab to ${elementId}: ${newText}`);
            }
        });
    }
});

function getElementId(element) {
    // Create a unique ID based on element class and position
    const tagName = element.tagName.toLowerCase();
    const className = element.className || 'no-class';
    const parent = element.parentElement;
    const index = Array.from(parent.children).indexOf(element);
    
    // Use a more reliable identifier
    if (element.classList.contains('hero-title')) {
        return 'hero-title';
    } else if (element.classList.contains('hero-subtitle')) {
        return 'hero-subtitle';
    } else if (element.classList.contains('lead')) {
        return 'lead';
    } else {
        // For paragraphs in story-text, use position
        const storyText = element.closest('.story-text');
        if (storyText) {
            const paragraphs = storyText.querySelectorAll('p');
            const paragraphIndex = Array.from(paragraphs).indexOf(element);
            return `story-p-${paragraphIndex}`;
        }
    }
    
    return `${tagName}-${index}`;
}

function addAdminControlPanel() {
    // Check if panel already exists
    if (document.querySelector('.admin-control-panel')) return;
    
    const controlPanel = document.createElement('div');
    controlPanel.className = 'admin-control-panel';
    controlPanel.style.cssText = `
    position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border: 2px solid rgba(102, 126, 234, 0.3);
        border-radius: 15px;
        padding: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
        max-width: 300px;
    `;
    
    controlPanel.innerHTML = `
        <h4 style="margin: 0 0 1rem 0; color: #1a202c; font-size: 1rem;">Beheerderscontroles</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button id="resetChanges" style="background: #f56565; color: white; border: none; padding: 0.5rem 1rem; 
                    border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
                🔄 Wijzigingen Resetten
            </button>
            <button id="viewChanges" style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; 
                    border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
                👁️ Bekijk Wijzigingen
            </button>
        </div>
    `;
    
    document.body.appendChild(controlPanel);
    
    // Add event listeners
    controlPanel.querySelector('#resetChanges').addEventListener('click', resetAllChanges);
    controlPanel.querySelector('#viewChanges').addEventListener('click', showChangesOverview);
}

function resetAllChanges() {
    if (confirm('Weet je zeker dat je alle wijzigingen wilt resetten?')) {
        localStorage.removeItem('overOnsChanges');
        location.reload();
        showNotification('Alle wijzigingen zijn gereset!', 'info');
    }
}

function showChangesOverview() {
    const changes = JSON.parse(localStorage.getItem('overOnsChanges') || '{}');
    const changeCount = Object.keys(changes).length;
    
    if (changeCount === 0) {
        showNotification('Geen wijzigingen gevonden', 'info');
        return;
    }
    
    showNotification(`${changeCount} wijziging(en) gevonden. Bekijk de console voor details.`, 'info');
    console.log('Over Ons Wijzigingen:', changes);
}

function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideInLeft 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function setupAdminMode() {
    // Add CSS for admin mode
    const style = document.createElement('style');
    style.textContent = `
        .admin-mode .edit-btn {
            display: block !important;
        }
        
        .edit-btn {
            display: none;
        }
        
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    `;
    document.head.appendChild(style);
    
}