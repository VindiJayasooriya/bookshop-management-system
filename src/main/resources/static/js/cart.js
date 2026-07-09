function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cartContainer");

    if (!cart.length) {
        container.innerHTML = `
            <div class="empty-state card">
                <h3>Your cart is empty</h3>
                <p>Add some products to get started.</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top:16px">Browse Products</a>
            </div>`;
        document.getElementById("checkoutBtn").style.display = "none";
        updateTotals();
        return;
    }

    container.innerHTML = cart.map((item, index) => {
        const img = item.imageUrl
            ? `../../images/${item.imageUrl}`
            : "https://via.placeholder.com/80?text=Book";

        return `
            <div class="cart-item">
                <img src="${img}" alt="${item.productName}">
                <div class="cart-item-info">
                    <h3>${item.productName}</h3>
                    <span class="item-price">${formatCurrency(item.price)}</span>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>`;
    }).join("");

    updateTotals();
}

function changeQty(index, delta) {
    const cart = getCart();
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function updateTotals() {
    const subtotal = getCartSubtotal();
    const member = getMember();
    const { discount, final, pct } = calculateDiscount(subtotal, member);

    document.getElementById("subtotalAmount").textContent = formatCurrency(subtotal);
    document.getElementById("totalPrice").textContent = formatCurrency(final);

    const discountRow = document.getElementById("discountRow");
    if (discount > 0) {
        discountRow.style.display = "flex";
        document.getElementById("discountPct").textContent = pct;
        document.getElementById("discountAmount").textContent = "- " + formatCurrency(discount);
    } else {
        discountRow.style.display = "none";
    }
}

renderCart();
