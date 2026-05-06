document.addEventListener('DOMContentLoaded', function() {

    // ===== HERO IMAGE SLIDER =====
    const imgs = document.querySelectorAll('.header-slider ul img');
    const prev_btn = document.querySelector('.control-prev');
    const next_btn = document.querySelector('.control-next');
    let n = 0;
    let autoSlideInterval;

    function changeSlide() {
        imgs.forEach(img => {
            img.style.display = 'none';
        });
        if (imgs[n]) {
            imgs[n].style.display = 'block';
        }
    }

    function nextSlide() {
        n = (n < imgs.length - 1) ? n + 1 : 0;
        changeSlide();
    }

    function prevSlide() {
        n = (n > 0) ? n - 1 : imgs.length - 1;
        changeSlide();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    changeSlide();
    startAutoSlide();

    prev_btn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        resetAutoSlide();
    });

    next_btn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        resetAutoSlide();
    });

    // ===== HORIZONTAL PRODUCT SCROLL =====
    const scrollContainers = document.querySelectorAll('.products');
    for (const item of scrollContainers) {
        item.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            item.scrollLeft += evt.deltaY;
        });
    }

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.querySelector('.nav-search-input');
    const searchIcon = document.querySelector('.nav-search-icon');
    const productCards = document.querySelectorAll('.product-card');
    const boxCols = document.querySelectorAll('.box-col');

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            productCards.forEach(card => card.style.display = '');
            boxCols.forEach(box => box.style.display = '');
            return;
        }

        productCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });

        boxCols.forEach(box => {
            const text = box.textContent.toLowerCase();
            box.style.display = text.includes(query) ? '' : 'none';
        });
    }

    searchIcon.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // ===== CART SYSTEM =====
    let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];
    const cartBadge = document.querySelector('.cart-badge');

    function updateCartBadge() {
        if (cartBadge) {
            cartBadge.textContent = cart.length;
            cartBadge.style.display = cart.length > 0 ? 'flex' : 'none';
        }
    }

    function addToCart(productName, productPrice, productImg, productId) {
        cart.push({
            id: Date.now(),
            productId: productId || 0,
            name: productName,
            price: productPrice,
            img: productImg,
            quantity: 1
        });
        localStorage.setItem('amazonCart', JSON.stringify(cart));
        updateCartBadge();
        showNotification(productName + ' added to cart!');
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('amazonCart', JSON.stringify(cart));
        updateCartBadge();
        renderCartPanel();
    }

    function clearCart() {
        cart = [];
        localStorage.setItem('amazonCart', JSON.stringify(cart));
        updateCartBadge();
        renderCartPanel();
    }

    updateCartBadge();

    // Add to Cart buttons on product cards
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const name = card.querySelector('h4') ? card.querySelector('h4').textContent : 'Product';
            const priceEl = card.querySelector('.product-price span');
            const price = priceEl ? priceEl.textContent : '0';
            const imgEl = card.querySelector('img');
            const img = imgEl ? imgEl.src : '';
            const productId = card.dataset.id || '0';
            addToCart(name, price, img, parseInt(productId));
        });
    });

    // ===== CART SIDE PANEL =====
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartLink = document.querySelector('.nav-cart');
    const closeCartBtn = document.querySelector('.close-cart');

    function openCart() {
        if (cartPanel) {
            cartPanel.classList.add('open');
            cartOverlay.classList.add('open');
            renderCartPanel();
        }
    }

    function closeCart() {
        if (cartPanel) {
            cartPanel.classList.remove('open');
            cartOverlay.classList.remove('open');
        }
    }

    function renderCartPanel() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total span');
        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '0.00';
            return;
        }

        let html = '';
        let total = 0;
        cart.forEach(item => {
            const price = parseFloat(item.price) || 0;
            total += price;
            html += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">$${price.toFixed(2)}</p>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">&times;</button>
                </div>
            `;
        });

        cartItems.innerHTML = html;
        if (cartTotal) cartTotal.textContent = total.toFixed(2);

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(parseInt(btn.dataset.id));
            });
        });
    }

    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

    // ===== NOTIFICATION TOAST =====
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // ===== BACK TO TOP BUTTON =====
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

    // ===== MOBILE NAV TOGGLE =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navBottom = document.querySelector('.nav-bottom');

    if (mobileMenuBtn && navBottom) {
        mobileMenuBtn.addEventListener('click', () => {
            navBottom.classList.toggle('nav-bottom-open');
        });
    }

    // ===== SIGN-IN MODAL =====
    const signInTrigger = document.querySelector('.nav-text');
    const signInModal = document.querySelector('.sign-in-modal');
    const signInOverlay = document.querySelector('.sign-in-overlay');
    const closeSignIn = document.querySelector('.close-sign-in');
    const signInForm = document.querySelector('.sign-in-form');

    if (signInTrigger && signInModal) {
        signInTrigger.addEventListener('click', () => {
            signInModal.classList.add('open');
            signInOverlay.classList.add('open');
        });
    }

    function closeSignInModal() {
        if (signInModal) {
            signInModal.classList.remove('open');
            signInOverlay.classList.remove('open');
        }
    }

    if (closeSignIn) closeSignIn.addEventListener('click', closeSignInModal);
    if (signInOverlay) signInOverlay.addEventListener('click', closeSignInModal);

    if (signInForm) {
        signInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = signInForm.querySelector('input[type="email"]').value;
            const password = signInForm.querySelector('input[type="password"]').value;
            if (email && password) {
                localStorage.setItem('amazonUser', JSON.stringify({ email }));
                showNotification('Signed in as ' + email);
                closeSignInModal();
                updateSignInState();
            }
        });
    }

    function updateSignInState() {
        const user = JSON.parse(localStorage.getItem('amazonUser'));
        const signInText = document.querySelector('.sign-in-text');
        if (user && signInText) {
            signInText.textContent = 'Hello, ' + user.email.split('@')[0];
        }
    }

    updateSignInState();

    // ===== SIGN OUT =====
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            localStorage.removeItem('amazonUser');
            showNotification('Signed out successfully');
            const signInText = document.querySelector('.sign-in-text');
            if (signInText) signInText.textContent = 'Hello, Sign in';
        });
    }

    // ===== CATEGORY DROPDOWN =====
    const categoryBtn = document.querySelector('.nav-search-gategory');
    const categoryDropdown = document.querySelector('.category-dropdown');

    if (categoryBtn && categoryDropdown) {
        categoryBtn.addEventListener('click', () => {
            categoryDropdown.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!categoryBtn.contains(e.target) && !categoryDropdown.contains(e.target)) {
                categoryDropdown.classList.remove('open');
            }
        });

        categoryDropdown.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                const categoryText = categoryBtn.querySelector('p');
                categoryText.textContent = li.textContent;
                categoryDropdown.classList.remove('open');
            });
        });
    }

});
