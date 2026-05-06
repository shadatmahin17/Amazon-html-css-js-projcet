document.addEventListener('DOMContentLoaded', function() {

    let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];

    function updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = cart.length;
            badge.style.display = cart.length > 0 ? 'flex' : 'none';
        }
    }

    function renderCart() {
        const container = document.getElementById('cart-items-container');
        const countEl = document.getElementById('cart-count');
        const subtotalEl = document.getElementById('cart-subtotal-price');

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-page">
                    <h2>Your Amazon Cart is empty</h2>
                    <p>Shop today's deals</p>
                    <a href="index.html" class="btn-shop-deals">Shop Today's Deals</a>
                </div>
            `;
            countEl.textContent = '0';
            subtotalEl.textContent = '0.00';
            return;
        }

        let html = '';
        let total = 0;

        cart.forEach((item, index) => {
            const price = parseFloat(item.price) || 0;
            total += price * (item.quantity || 1);
            html += `
                <div class="cart-page-item">
                    <div class="cart-page-item-img">
                        <a href="product.html?id=${item.productId || index}">
                            <img src="${item.img}" alt="${item.name}">
                        </a>
                    </div>
                    <div class="cart-page-item-details">
                        <a href="product.html?id=${item.productId || index}" class="cart-item-title">${item.name}</a>
                        <p class="cart-item-stock in-stock">In Stock</p>
                        <p class="cart-item-shipping">FREE Shipping on orders over $25</p>
                        <div class="cart-item-actions">
                            <div class="qty-control">
                                <label>Qty:</label>
                                <select data-index="${index}" class="qty-select">
                                    ${[1,2,3,4,5,6,7,8,9,10].map(q => 
                                        `<option value="${q}" ${(item.quantity || 1) === q ? 'selected' : ''}>${q}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <button class="cart-action-btn cart-delete-btn" data-index="${index}">Delete</button>
                            <button class="cart-action-btn cart-save-btn" data-index="${index}">Save for later</button>
                        </div>
                    </div>
                    <div class="cart-page-item-price">
                        <strong>$${price.toFixed(2)}</strong>
                    </div>
                </div>
                <hr>
            `;
        });

        container.innerHTML = html;
        countEl.textContent = cart.length;
        subtotalEl.textContent = total.toFixed(2);

        container.querySelectorAll('.cart-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                cart.splice(idx, 1);
                localStorage.setItem('amazonCart', JSON.stringify(cart));
                renderCart();
                updateCartBadge();
            });
        });

        container.querySelectorAll('.qty-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index);
                cart[idx].quantity = parseInt(e.target.value);
                localStorage.setItem('amazonCart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    renderCart();
    updateCartBadge();

    // Back to top
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        }
    });
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navBottom = document.querySelector('.nav-bottom');
    if (mobileMenuBtn && navBottom) {
        mobileMenuBtn.addEventListener('click', () => {
            navBottom.classList.toggle('nav-bottom-open');
        });
    }

    // Update sign-in state
    const user = JSON.parse(localStorage.getItem('amazonUser'));
    const signInText = document.querySelector('.sign-in-text');
    if (user && signInText) {
        signInText.textContent = 'Hello, ' + user.email.split('@')[0];
    }
});
