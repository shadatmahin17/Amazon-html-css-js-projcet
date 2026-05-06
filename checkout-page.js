document.addEventListener('DOMContentLoaded', function() {

    let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];

    function renderCheckoutItems() {
        const container = document.getElementById('checkout-items');
        const itemCountEl = document.getElementById('checkout-item-count');
        const summaryItemsEl = document.getElementById('summary-items');
        const summaryShippingEl = document.getElementById('summary-shipping');
        const summaryTaxEl = document.getElementById('summary-tax');
        const summaryTotalEl = document.getElementById('summary-total');

        if (!container) return;

        itemCountEl.textContent = cart.length;

        if (cart.length === 0) {
            container.innerHTML = '<p class="checkout-empty">No items in your cart. <a href="index.html">Continue shopping</a></p>';
            return;
        }

        let html = '';
        let subtotal = 0;

        cart.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const qty = item.quantity || 1;
            subtotal += price * qty;
            html += `
                <div class="checkout-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="checkout-item-info">
                        <p class="checkout-item-name">${item.name}</p>
                        <p class="checkout-item-price">$${price.toFixed(2)} x ${qty}</p>
                        <p class="checkout-item-delivery">Delivery: Tomorrow</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        const shipping = subtotal > 25 ? 0 : 4.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        summaryItemsEl.textContent = '$' + subtotal.toFixed(2);
        summaryShippingEl.textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
        summaryTaxEl.textContent = '$' + tax.toFixed(2);
        summaryTotalEl.textContent = '$' + total.toFixed(2);
    }

    renderCheckoutItems();

    // Payment method toggle
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('card-form');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (cardForm) {
                cardForm.style.display = radio.value === 'card' ? 'block' : 'none';
            }
        });
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }

    // Expiry formatting
    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            e.target.value = value;
        });
    }

    // Place order
    const placeOrderBtn = document.getElementById('btn-place-order');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            const name = document.getElementById('ship-name').value;
            const address = document.getElementById('ship-address').value;
            const city = document.getElementById('ship-city').value;

            if (!name || !address || !city) {
                alert('Please fill in the shipping address.');
                return;
            }

            const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
            if (selectedPayment === 'card') {
                const cardNum = document.getElementById('card-number').value;
                if (!cardNum || cardNum.replace(/\s/g, '').length < 16) {
                    alert('Please enter a valid card number.');
                    return;
                }
            }

            // Generate order number
            const orderNumber = Math.floor(Math.random() * 900000) + 100000;
            document.getElementById('order-number').textContent = orderNumber;

            // Save order to history
            const orders = JSON.parse(localStorage.getItem('amazonOrders')) || [];
            orders.push({
                orderNumber,
                items: cart,
                total: document.getElementById('summary-total').textContent,
                date: new Date().toISOString(),
                status: 'Processing'
            });
            localStorage.setItem('amazonOrders', JSON.stringify(orders));

            // Clear cart
            localStorage.setItem('amazonCart', JSON.stringify([]));

            // Show confirmation
            document.getElementById('order-confirmation-overlay').classList.add('show');
        });
    }

    // Update sign-in state
    const user = JSON.parse(localStorage.getItem('amazonUser'));
    const signInText = document.querySelector('.sign-in-text');
    if (user && signInText) {
        signInText.textContent = 'Hello, ' + user.email.split('@')[0];
    }
});
