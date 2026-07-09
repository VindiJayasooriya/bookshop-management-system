const cart = getCart();

if (!cart.length) {
    window.location.href = "cart.html";
}

const member = getMember();

if (member) {
    document.getElementById("firstName").value = member.firstName || "";
    document.getElementById("lastName").value  = member.lastName  || "";
    document.getElementById("email").value     = member.email     || "";
    document.getElementById("phone").value     = member.phoneNumber || "";
    document.getElementById("address").value   = member.address   || "";
    document.getElementById("memberNotice").style.display = "block";
}

// ─── Live Validation Setup ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    attachLiveValidation("firstName", ["required", { rule: "minLength", param: 2 }, "lettersOnly"]);
    attachLiveValidation("lastName",  ["required", { rule: "minLength", param: 2 }, "lettersOnly"]);
    attachLiveValidation("email",     ["required", "email"]);
    attachLiveValidation("phone",     ["required", "phone"]);
    attachLiveValidation("address",   ["required", "address"]);
});

// ─── Render Checkout Summary ──────────────────────────────────────────────────
function renderCheckoutSummary() {
    const itemsEl = document.getElementById("checkoutItems");
    itemsEl.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span class="item-name">${item.productName} × ${item.quantity}</span>
            <span class="item-total">${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join("");

    const subtotal = getCartSubtotal();
    const { discount, final } = calculateDiscount(subtotal, member);

    document.getElementById("checkoutSubtotal").textContent = formatCurrency(subtotal);
    document.getElementById("checkoutTotal").textContent    = formatCurrency(final);

    if (discount > 0) {
        document.getElementById("checkoutDiscountRow").style.display = "flex";
        document.getElementById("checkoutDiscount").textContent = "- " + formatCurrency(discount);
    }
}

renderCheckoutSummary();

// ─── Place Order ──────────────────────────────────────────────────────────────
async function placeOrder() {
    const isValid = validateForm([
        { id: "firstName", rules: ["required", { rule: "minLength", param: 2 }, "lettersOnly"] },
        { id: "lastName",  rules: ["required", { rule: "minLength", param: 2 }, "lettersOnly"] },
        { id: "email",     rules: ["required", "email"] },
        { id: "phone",     rules: ["required", "phone"] },
        { id: "address",   rules: ["required", "address"] }
    ]);

    if (!isValid) {
        showToast("Please fill in all required fields correctly.", "warning");
        // Scroll to first error
        const firstError = document.querySelector(".field-invalid");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    const request = {
        firstName:  document.getElementById("firstName").value.trim(),
        lastName:   document.getElementById("lastName").value.trim(),
        email:      document.getElementById("email").value.trim(),
        phoneNumber: document.getElementById("phone").value.trim(),
        address:    document.getElementById("address").value.trim(),
        customerId: member ? member.customerId : null,
        items: cart.map(item => ({
            productId: item.productId,
            quantity:  item.quantity
        }))
    };

    const btn = document.querySelector("button[onclick='placeOrder()']");
    setButtonLoading(btn, "Placing Order...");

    try {
        const order = await apiFetch("/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        localStorage.setItem("pendingOrder", JSON.stringify(order));
        localStorage.removeItem("cart");
        showToast("Order placed successfully! 🎉", "success");
        setTimeout(() => {
            window.location.href = "order-confirmation.html?orderId=" + order.orderId;
        }, 800);
    } catch (e) {
        showToast(e.message || "Failed to place order. Please try again.", "error");
        resetButton(btn);
    }
}
