// Sample Products Data
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        category: 'electronics',
        price: 3499,
        originalPrice: 4999,
        image: 'https://via.placeholder.com/250x250?text=Headphones',
        rating: 4.5,
        reviews: 128,
        description: 'High-quality wireless headphones with noise cancellation'
    },
    {
        id: 2,
        name: 'Smart Watch',
        category: 'electronics',
        price: 5999,
        originalPrice: 7999,
        image: 'https://via.placeholder.com/250x250?text=Smart+Watch',
        rating: 4.8,
        reviews: 256,
        description: 'Feature-rich smart watch with health monitoring'
    },
    {
        id: 3,
        name: 'Casual T-Shirt',
        category: 'fashion',
        price: 899,
        originalPrice: 1499,
        image: 'https://via.placeholder.com/250x250?text=T-Shirt',
        rating: 4.3,
        reviews: 89,
        description: 'Comfortable cotton t-shirt for everyday wear'
    },
    {
        id: 4,
        name: 'Running Shoes',
        category: 'fashion',
        price: 2999,
        originalPrice: 4499,
        image: 'https://via.placeholder.com/250x250?text=Running+Shoes',
        rating: 4.6,
        reviews: 167,
        description: 'Professional running shoes with excellent support'
    },
    {
        id: 5,
        name: 'Desk Lamp',
        category: 'home',
        price: 1299,
        originalPrice: 1999,
        image: 'https://via.placeholder.com/250x250?text=Desk+Lamp',
        rating: 4.4,
        reviews: 72,
        description: 'LED desk lamp with adjustable brightness'
    },
    {
        id: 6,
        name: 'Yoga Mat',
        category: 'sports',
        price: 1799,
        originalPrice: 2499,
        image: 'https://via.placeholder.com/250x250?text=Yoga+Mat',
        rating: 4.7,
        reviews: 134,
        description: 'Non-slip yoga mat for exercise and meditation'
    },
    {
        id: 7,
        name: 'Coffee Maker',
        category: 'home',
        price: 4499,
        originalPrice: 6499,
        image: 'https://via.placeholder.com/250x250?text=Coffee+Maker',
        rating: 4.5,
        reviews: 98,
        description: 'Programmable coffee maker for perfect brew'
    },
    {
        id: 8,
        name: 'Dumbbell Set',
        category: 'sports',
        price: 3999,
        originalPrice: 5999,
        image: 'https://via.placeholder.com/250x250?text=Dumbbells',
        rating: 4.6,
        reviews: 145,
        description: 'Adjustable dumbbell set for home gym'
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadFeaturedProducts();
    loadShopProducts();
    loadCart();
    loadCheckoutSummary();
    setupEventListeners();
});

// Load Featured Products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = products.slice(0, 4);
    container.innerHTML = featured.map(product => createProductHTML(product)).join('');
    attachProductListeners();
}

// Load Shop Products
function loadShopProducts() {
    const container = document.getElementById('shopProducts');
    if (!container) return;

    container.innerHTML = products.map(product => createProductHTML(product)).join('');
    attachProductListeners();
}

// Create Product HTML
function createProductHTML(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">${stars} (${product.reviews} reviews)</div>
                <div class="product-price">
                    <div>
                        <span class="price">Rs. ${product.price.toLocaleString()}</span>
                        <span class="original-price">Rs. ${product.originalPrice.toLocaleString()}</span>
                    </div>
                    <span class="discount-badge">-${discount}%</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="wishlist-btn" onclick="addToWishlist(${product.id})">♥</button>
                </div>
            </div>
        </div>
    `;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

// Update Cart Item Quantity
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Load Cart
function loadCart() {
    const container = document.getElementById('cartContainer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items to your cart</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Continue Shopping</a>
            </div>
        `;
        updateCartSummary();
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">Rs. ${item.price.toLocaleString()} each</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" readonly>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <p style="font-weight: bold;">Rs. ${(item.price * item.quantity).toLocaleString()}</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 200 : 0;
    const tax = subtotal * 0.17;
    const total = subtotal + shipping + tax;

    const summaryContainer = document.querySelector('.cart-summary');
    if (!summaryContainer) return;

    document.getElementById('subtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
    document.getElementById('shipping').textContent = `Rs. ${shipping.toLocaleString()}`;
    document.getElementById('tax').textContent = `Rs. ${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `Rs. ${total.toLocaleString()}`;
}

// Load Checkout Summary
function loadCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    if (!container) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 200 : 0;
    const tax = subtotal * 0.17;
    const total = subtotal + shipping + tax;

    let html = '<div style="margin-bottom: 20px;">';
    cart.forEach(item => {
        html += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
                <span>${item.name} x${item.quantity}</span>
                <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    });
    html += '</div>';
    html += `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>Rs. ${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>Rs. ${shipping.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Tax:</span>
            <span>Rs. ${tax.toLocaleString()}</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span>Rs. ${total.toLocaleString()}</span>
        </div>
    `;
    container.innerHTML = html;
}

// Update Cart Count
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = count);
}

// Attach Product Listeners
function attachProductListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart') && !e.target.classList.contains('wishlist-btn')) {
                const productId = this.getAttribute('data-id');
                // Could redirect to product detail page here
                console.log('Product clicked:', productId);
            }
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Payment method toggle
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const cardDetails = document.getElementById('cardDetails');
            if (cardDetails) {
                cardDetails.style.display = this.value === 'card' ? 'block' : 'none';
            }
        });
    });

    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Order placed successfully! Thank you for your purchase.');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            window.location.href = 'index.html';
        });
    }

    // Price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.getElementById('priceValue').textContent = `Rs. ${parseInt(this.value).toLocaleString()}`;
        });
    }
}

// Add to Wishlist
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} added to wishlist!`);
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
