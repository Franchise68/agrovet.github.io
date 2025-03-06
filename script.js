const API_URL = 'http://localhost:5000'; // Backend server URL
let cart = [];
let total = 0;
let isLoggedIn = false;

// Get modal and button elements
const modal = document.getElementById('auth-modal');
const shopNowBtn = document.getElementById('shop-now-btn');
const closeModal = document.querySelector('.close');

// Tab buttons
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');

// Forms
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Check if elements exist before adding event listeners
if (shopNowBtn) {
    shopNowBtn.addEventListener('click', () => {
        if (!isLoggedIn) {
            modal.style.display = 'block';
            showLoginForm(); // Default to login form
        } else {
            window.location.href = '#products';
        }
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

if (loginTab) {
    loginTab.addEventListener('click', () => {
        showLoginForm();
    });
}

if (signupTab) {
    signupTab.addEventListener('click', () => {
        showSignupForm();
    });
}

function showLoginForm() {
    if (loginTab) loginTab.classList.add('active');
    if (signupTab) signupTab.classList.remove('active');
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
}

function showSignupForm() {
    if (signupTab) signupTab.classList.add('active');
    if (loginTab) loginTab.classList.remove('active');
    if (signupForm) signupForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Save token
                isLoggedIn = true;
                modal.style.display = 'none';
                window.location.href = '#products';
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Handle signup form submission
if (signupForm) {
    signupForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Signup successful. Please login.');
                showLoginForm(); // Switch to login form after signup
            } else {
                alert(data.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Add to cart
async function addToCart(productName, price) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to your cart.');
        modal.style.display = 'block';
        showLoginForm(); // Show login form by default
        return;
    }

    console.log('Token:', token); // Log the token

    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ productName, price }),
        });

        const data = await response.json();
        if (response.ok) {
            cart.push({ name: productName, price: price });
            total += price;
            updateCart();
            alert('Product added to cart');
        } else {
            console.error('Error response:', data);
            alert(data.error || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('An error occurred. Please try again.');
    }
}

// Update cart UI
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (cartItems) cartItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - KSh ${item.price}`;
        if (cartItems) cartItems.appendChild(li);
    });

    if (cartCount) cartCount.textContent = cart.length;
    if (cartTotal) cartTotal.textContent = total;
}

// Fetch cart items on page load (if logged in)
window.addEventListener('load', async() => {
    const token = localStorage.getItem('token');
    if (token) {
        isLoggedIn = true;
        console.log('Token:', token); // Log the token

        try {
            const response = await fetch(`${API_URL}/cart`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                cart = data.cart;
                total = data.total;
                updateCart();
            } else {
                console.error('Error fetching cart:', data.error);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }
});