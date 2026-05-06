document.addEventListener('DOMContentLoaded', function() {

    // Product data store
    const products = [
        { id: 0, name: 'Wireless Bluetooth Headphones', price: 14.49, originalPrice: 19.99, discount: '27% off', img: 'assets/product2-1.jpg', category: 'Electronics', description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.' },
        { id: 1, name: 'Portable Phone Charger', price: 12.99, originalPrice: 19.99, discount: '35% off', img: 'assets/product2-2.jpg', category: 'Electronics', description: 'Compact 10000mAh power bank with fast charging support for all devices.' },
        { id: 2, name: 'LED Desk Lamp with USB', price: 18.49, originalPrice: 22.99, discount: '20% off', img: 'assets/product2-3.jpg', category: 'Home & Kitchen', description: 'Adjustable LED desk lamp with USB charging port and 3 color modes.' },
        { id: 3, name: 'Fitness Resistance Bands Set', price: 21.49, originalPrice: 24.99, discount: '15% off', img: 'assets/product2-4.jpg', category: 'Sports & Outdoors', description: 'Set of 5 resistance bands with different strengths for full-body workouts.' },
        { id: 4, name: 'Stainless Steel Water Bottle', price: 11.99, originalPrice: 19.99, discount: '40% off', img: 'assets/product2-5.jpg', category: 'Sports & Outdoors', description: 'Double-wall insulated bottle keeps drinks cold 24hrs or hot 12hrs.' },
        { id: 5, name: 'Wireless Mouse Ergonomic', price: 14.99, originalPrice: 19.99, discount: '25% off', img: 'assets/product2-6.jpg', category: 'Computers', description: 'Ergonomic design wireless mouse with silent clicks and USB receiver.' },
        { id: 6, name: 'Yoga Mat Non-Slip Premium', price: 13.99, originalPrice: 19.99, discount: '30% off', img: 'assets/product2-7.jpg', category: 'Sports & Outdoors', description: 'Extra thick 6mm non-slip yoga mat with carrying strap included.' },
        { id: 7, name: 'Kitchen Knife Set Stainless', price: 15.49, originalPrice: 19.99, discount: '22% off', img: 'assets/product2-8.jpg', category: 'Home & Kitchen', description: 'Professional 6-piece knife set with ergonomic handles and knife block.' },
        { id: 8, name: 'USB-C Fast Charging Cable', price: 16.49, originalPrice: 19.99, discount: '18% off', img: 'assets/product2-9.jpg', category: 'Electronics', description: '6ft braided USB-C cable with 100W fast charging and data transfer.' },
        { id: 9, name: 'Bamboo Cutting Board Set', price: 13.49, originalPrice: 19.99, discount: '33% off', img: 'assets/product2-10.jpg', category: 'Home & Kitchen', description: 'Set of 3 organic bamboo cutting boards in different sizes with juice groove.' },
        { id: 10, name: 'Silicone Baking Mat Set', price: 14.49, originalPrice: 19.99, discount: '28% off', img: 'assets/product2-11.jpg', category: 'Home & Kitchen', description: 'Non-stick silicone baking mats, reusable and heat resistant to 480°F.' }
    ];

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 0;
    const product = products[productId] || products[0];

    // Populate product page
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = '$' + product.price.toFixed(2);
    document.getElementById('product-original-price').textContent = '$' + product.originalPrice.toFixed(2);
    document.getElementById('product-discount').textContent = product.discount;
    document.getElementById('product-main-img').src = product.img;
    document.getElementById('buy-price').textContent = '$' + product.price.toFixed(2);
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-breadcrumb-name').textContent = product.name;
    document.title = product.name + ' - Amazon Clone';

    // Product thumbnails
    const thumbnailContainer = document.getElementById('product-thumbnails');
    const relatedProducts = products.filter(p => p.category === product.category).slice(0, 4);
    if (relatedProducts.length < 4) {
        relatedProducts.push(...products.slice(0, 4 - relatedProducts.length));
    }
    thumbnailContainer.innerHTML = relatedProducts.map(p => 
        `<img src="${p.img}" alt="${p.name}" class="thumbnail ${p.id === product.id ? 'active' : ''}" data-img="${p.img}">`
    ).join('');

    thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.getElementById('product-main-img').src = thumb.dataset.img;
            thumbnailContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // Add to cart
    let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];

    function updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = cart.length;
            badge.style.display = cart.length > 0 ? 'flex' : 'none';
        }
    }

    updateCartBadge();

    document.getElementById('btn-add-to-cart').addEventListener('click', () => {
        const qty = parseInt(document.getElementById('qty').value);
        for (let i = 0; i < qty; i++) {
            cart.push({
                id: Date.now() + i,
                productId: product.id,
                name: product.name,
                price: product.price.toString(),
                img: product.img,
                quantity: 1
            });
        }
        localStorage.setItem('amazonCart', JSON.stringify(cart));
        updateCartBadge();
        showNotification(product.name + ' added to cart!');
    });

    document.getElementById('btn-buy-now').addEventListener('click', () => {
        const qty = parseInt(document.getElementById('qty').value);
        cart.push({
            id: Date.now(),
            productId: product.id,
            name: product.name,
            price: product.price.toString(),
            img: product.img,
            quantity: qty
        });
        localStorage.setItem('amazonCart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    });

    // Reviews system
    let reviews = JSON.parse(localStorage.getItem('amazonReviews_' + productId)) || [
        { name: 'John D.', rating: 5, text: 'Excellent product! Exactly as described and arrived quickly.', date: '2024-01-15' },
        { name: 'Sarah M.', rating: 4, text: 'Good quality for the price. Would recommend to others.', date: '2024-01-10' },
        { name: 'Mike R.', rating: 4, text: 'Works well. Packaging could be better but product is solid.', date: '2024-01-05' }
    ];

    function renderReviews() {
        const list = document.getElementById('reviews-list');
        list.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <strong>${review.name}</strong>
                    <span class="review-stars">${'&#9733;'.repeat(review.rating)}${'&#9734;'.repeat(5 - review.rating)}</span>
                </div>
                <p class="review-date">${review.date}</p>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    }

    renderReviews();

    document.getElementById('review-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('review-name').value;
        const rating = parseInt(document.getElementById('review-rating').value);
        const text = document.getElementById('review-text').value;
        const date = new Date().toISOString().split('T')[0];

        reviews.unshift({ name, rating, text, date });
        localStorage.setItem('amazonReviews_' + productId, JSON.stringify(reviews));
        renderReviews();
        e.target.reset();
        showNotification('Review submitted successfully!');
    });

    // Notification
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
