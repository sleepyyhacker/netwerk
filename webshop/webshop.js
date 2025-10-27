// Webshop JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in as admin
    checkAdminStatus();
    
    // Initialize webshop
    initializeWebshop();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load cart from localStorage
    loadCart();
});

function checkAdminStatus() {
    // Check if user is logged in as admin
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true' || 
                      localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        // Add admin mode toggle
        addAdminModeToggle();
        console.log('Admin mode available');
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
    // Add edit buttons to all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (!card.querySelector('.edit-product-btn')) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-product-btn';
            editBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Bewerken
            `;
            editBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(102, 126, 234, 0.9);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                transition: all 0.3s ease;
                z-index: 10;
            `;
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editProduct(card);
            });
            
            card.style.position = 'relative';
            card.appendChild(editBtn);
        }
    });
    
    // Add admin control panel
    addAdminControlPanel();
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
    if (confirm('Weet je zeker dat je alle productwijzigingen wilt resetten? Dit kan niet ongedaan worden gemaakt.')) {
        // Clear all product changes from localStorage
        localStorage.removeItem('productChanges');
        
        // Reload the page to show original products
        window.location.reload();
        
        showNotification('Alle wijzigingen zijn gereset!', 'info');
    }
}

function showChangesOverview() {
    const productChanges = JSON.parse(localStorage.getItem('productChanges') || '{}');
    const changeCount = Object.keys(productChanges).length;
    
    if (changeCount === 0) {
        showNotification('Geen wijzigingen opgeslagen', 'info');
        return;
    }
    
    // Create overview modal
    const overlay = document.createElement('div');
    overlay.className = 'admin-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
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
    
    let changesHTML = '';
    Object.keys(productChanges).forEach(productId => {
        const changes = productChanges[productId];
        changesHTML += `
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #1a202c;">${changes.name}</h4>
                <p style="margin: 0 0 0.5rem 0; color: #718096; font-size: 0.9rem;">${changes.description}</p>
                <p style="margin: 0; color: #667eea; font-weight: 600;">€${changes.price.toFixed(2)}/maand</p>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #1a202c; text-align: center;">Opgeslagen Wijzigingen (${changeCount})</h3>
        <div style="margin-bottom: 1.5rem;">
            ${changesHTML}
        </div>
        <div style="text-align: center;">
            <button onclick="this.closest('.admin-modal-overlay').remove()" 
                    style="background: linear-gradient(135deg, #667eea, #764ba2); 
                           color: white; border: none; padding: 0.75rem 2rem; 
                           border-radius: 8px; cursor: pointer; font-weight: 600;">
                Sluiten
            </button>
        </div>
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

function hideAdminControls() {
    // Remove edit buttons
    const editButtons = document.querySelectorAll('.edit-product-btn');
    editButtons.forEach(btn => btn.remove());
    
    // Remove admin control panel
    const controlPanel = document.querySelector('.admin-control-panel');
    if (controlPanel) {
        controlPanel.remove();
    }
    
    // Note: We don't remove the admin controls container here because
    // the "Terug naar Dashboard" button should always be visible for admins
}

function editProduct(productCard) {
    const productName = productCard.querySelector('h3').textContent;
    const priceElement = productCard.querySelector('.price');
    const currentPrice = priceElement.textContent;
    const description = productCard.querySelector('.product-description').textContent;
    
    // Create edit modal
    const overlay = document.createElement('div');
    overlay.className = 'admin-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
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
        <h3 style="margin-bottom: 1.5rem; color: #1a202c; text-align: center;">Product Bewerken</h3>
        <form id="editProductForm" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <label style="font-weight: 600; color: #1a202c; display: block; margin-bottom: 0.5rem;">Productnaam</label>
                <input type="text" id="editProductName" value="${productName}" required 
                       style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
            </div>
            <div>
                <label style="font-weight: 600; color: #1a202c; display: block; margin-bottom: 0.5rem;">Prijs (€)</label>
                <input type="number" id="editProductPrice" value="${currentPrice.replace('€', '').replace(',', '.')}" step="0.01" required 
                       style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
            </div>
            <div>
                <label style="font-weight: 600; color: #1a202c; display: block; margin-bottom: 0.5rem;">Beschrijving</label>
                <textarea id="editProductDescription" required 
                          style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; min-height: 80px; resize: vertical;">${description}</textarea>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); 
                        color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Opslaan
                </button>
                <button type="button" onclick="this.closest('.admin-modal-overlay').remove()" 
                        style="flex: 1; background: #e2e8f0; color: #718096; border: none; padding: 0.75rem; 
                        border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Annuleren
                </button>
            </div>
        </form>
        <div id="editMessage" style="margin-top: 1rem; text-align: center; display: none;"></div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Handle form submission
    const form = modal.querySelector('#editProductForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProductChanges(productCard, form, modal);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

function saveProductChanges(productCard, form, modal) {
    const newName = form.querySelector('#editProductName').value.trim();
    const newPrice = parseFloat(form.querySelector('#editProductPrice').value);
    const newDescription = form.querySelector('#editProductDescription').value.trim();
    
    if (!newName || !newPrice || !newDescription) {
        showEditMessage('Vul alle velden in', 'error', modal);
        return;
    }
    
    // Get product ID from the add-to-cart button
    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    const productId = addToCartBtn ? addToCartBtn.getAttribute('data-product') : 'unknown';
    
    // Update the product card
    productCard.querySelector('h3').textContent = newName;
    productCard.querySelector('.price').textContent = `€${newPrice.toFixed(2)}`;
    productCard.querySelector('.product-description').textContent = newDescription;
    
    // Save changes to localStorage for persistence
    saveProductToStorage(productId, {
        name: newName,
        price: newPrice,
        description: newDescription
    });
    
    // Show success message
    showEditMessage('Product succesvol bijgewerkt! Wijzigingen zijn opgeslagen voor alle gebruikers.', 'success', modal);
    
    // Close modal after 3 seconds
    setTimeout(() => {
        const overlay = document.querySelector('.admin-modal-overlay');
        if (overlay) overlay.remove();
    }, 3000);
}

function showEditMessage(message, type, modal) {
    const messageDiv = modal.querySelector('#editMessage');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.color = type === 'error' ? '#f56565' : '#48bb78';
    messageDiv.style.background = type === 'error' ? 'rgba(245, 101, 101, 0.1)' : 'rgba(72, 187, 120, 0.1)';
    messageDiv.style.padding = '0.75rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.border = `1px solid ${type === 'error' ? 'rgba(245, 101, 101, 0.2)' : 'rgba(72, 187, 120, 0.2)'}`;
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
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function saveProductToStorage(productId, productData) {
    // Get existing product changes from localStorage
    let productChanges = JSON.parse(localStorage.getItem('productChanges') || '{}');
    
    // Save the new changes
    productChanges[productId] = productData;
    
    // Store back to localStorage
    localStorage.setItem('productChanges', JSON.stringify(productChanges));
    
    console.log('Product changes saved:', productId, productData);
}

function loadProductChanges() {
    // Get saved product changes from localStorage
    const productChanges = JSON.parse(localStorage.getItem('productChanges') || '{}');
    
    // Apply changes to all products
    Object.keys(productChanges).forEach(productId => {
        const changes = productChanges[productId];
        const productCard = document.querySelector(`[data-product="${productId}"]`)?.closest('.product-card');
        
        if (productCard && changes) {
            // Update product name
            const nameElement = productCard.querySelector('h3');
            if (nameElement && changes.name) {
                nameElement.textContent = changes.name;
            }
            
            // Update product price
            const priceElement = productCard.querySelector('.price');
            if (priceElement && changes.price) {
                priceElement.textContent = `€${changes.price.toFixed(2)}`;
            }
            
            // Update product description
            const descElement = productCard.querySelector('.product-description');
            if (descElement && changes.description) {
                descElement.textContent = changes.description;
            }
        }
    });
    
    console.log('Product changes loaded from storage');
}

function initializeWebshop() {
    console.log('Webshop initialized');
    
    // Load any saved product changes first
    loadProductChanges();
    
    // Show all products initially
    filterProducts('all');
    
    // Update cart display
    updateCartDisplay();
}

function setupEventListeners() {
    // CTA Button functionality - scroll to top when on webshop page
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Category filter buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            addToCart(productId);
        });
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
}

function addToCart(productId) {
    // Get product details
    const productCard = document.querySelector(`[data-product="${productId}"]`).closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('webshopCart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('webshopCart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Show success message
    showAddToCartMessage(productName);
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('webshopCart') || '[]');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Je winkelwagen is leeg</p>';
        cartTotal.style.display = 'none';
    } else {
        // Display cart items
        let cartHTML = '';
        let totalPrice = 0;
        
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
            const itemTotal = price * item.quantity;
            totalPrice += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.quantity}x ${item.price}</p>
                    </div>
                    <div class="cart-item-price">
                        €${itemTotal.toFixed(2).replace('.', ',')}
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        ✕
                    </button>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        
        // Update total
        const totalElement = cartTotal.querySelector('.total-price');
        totalElement.textContent = `€${totalPrice.toFixed(2).replace('.', ',')}`;
        
        cartTotal.style.display = 'block';
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('webshopCart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('webshopCart', JSON.stringify(cart));
    updateCartDisplay();
}

function loadCart() {
    updateCartDisplay();
}

function showAddToCartMessage(productName) {
    // Create success message
    const message = document.createElement('div');
    message.className = 'add-to-cart-message';
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #48bb78, #38a169);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(72, 187, 120, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"></path>
            </svg>
            <span>${productName} toegevoegd aan winkelwagen!</span>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);
}

function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('webshopCart') || '[]');
    
    if (cart.length === 0) {
        alert('Je winkelwagen is leeg!');
        return;
    }
    
    // Calculate total
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
        return sum + (price * item.quantity);
    }, 0);
    
    // Show checkout modal
    showCheckoutModal(cart, totalPrice);
}

function showCheckoutModal(cart, totalPrice) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'checkout-modal-overlay';
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
    modal.className = 'checkout-modal';
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        animation: slideIn 0.3s ease;
    `;
    
    // Create order summary
    let orderHTML = '';
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
        const itemTotal = price * item.quantity;
        orderHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${item.name} (${item.quantity}x)</span>
                <span>€${itemTotal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #1a202c; text-align: center;">Bestelling Bevestigen</h3>
        <div style="margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 1rem;">Je bestelling:</h4>
            ${orderHTML}
            <hr style="margin: 1rem 0;">
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 1.1rem;">
                <span>Totaal:</span>
                <span>€${totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
        <div style="display: flex; gap: 1rem;">
            <button onclick="confirmOrder()" 
                    style="flex: 1; background: linear-gradient(135deg, #48bb78, #38a169); 
                           color: white; border: none; padding: 0.75rem; border-radius: 8px; 
                           font-weight: 600; cursor: pointer;">
                Bevestigen
            </button>
            <button onclick="this.closest('.checkout-modal-overlay').remove()" 
                    style="flex: 1; background: #e2e8f0; color: #718096; border: none; 
                           padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Annuleren
            </button>
        </div>
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

function confirmOrder() {
    // Clear cart
    localStorage.removeItem('webshopCart');
    
    // Close modal
    const overlay = document.querySelector('.checkout-modal-overlay');
    if (overlay) overlay.remove();
    
    // Show success message with better styling
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 30px 40px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        animation: successPopup 0.5s ease;
        max-width: 400px;
    `;
    successMessage.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
        <div>Bestelling succesvol geplaatst!</div>
        <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Je ontvangt een bevestigingsmail.</div>
    `;
    document.body.appendChild(successMessage);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        successMessage.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => successMessage.remove(), 300);
    }, 4000);
    
    // Update cart display
    updateCartDisplay();
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
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes successPopup {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Admin mode styles */
    .admin-mode .product-card {
        border: 2px solid rgba(102, 126, 234, 0.3);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    }
    
    .edit-product-btn:hover {
        background: rgba(102, 126, 234, 1) !important;
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Set correct Over Ons link based on admin status
function setOverOnsLink() {
    const overOnsLink = document.getElementById('overOnsLink');
    if (overOnsLink) {
        const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
        if (isAdmin) {
            overOnsLink.href = '../over-ons/over-ons-admin.html';
        } else {
            overOnsLink.href = '../over-ons/over-ons.html';
        }
    }
}

// Initialize link when page loads
document.addEventListener('DOMContentLoaded', setOverOnsLink);