const member = getMember();
if (member) {
    document.getElementById("email").value = member.email;
    loadOrders();
}

// ─── Live Validation Setup ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    attachLiveValidation("email", ["required", "email"]);
});

document.getElementById("email").addEventListener("keypress", (e) => {
    if (e.key === "Enter") loadOrders();
});

async function loadOrders() {
    const isValid = validateForm([
        { id: "email", rules: ["required", "email"] }
    ]);

    if (!isValid) {
        showToast("Please enter a valid email address.", "warning");
        return;
    }

    const email = document.getElementById("email").value.trim();
    const btn   = document.querySelector("button[onclick='loadOrders()']");
    setButtonLoading(btn, "Loading...");

    try {
        const customer = await apiFetch("/customers/email/" + encodeURIComponent(email));
        const orders   = await apiFetch("/orders/customer/" + customer.customerId);

        const container = document.getElementById("ordersList");

        if (!orders.length) {
            container.innerHTML = '<div class="empty-state card"><h3>No orders found</h3><p>You haven\'t placed any orders yet.</p></div>';
            resetButton(btn);
            return;
        }

        let html = "";
        for (const order of orders) {
            let paymentStatus = "Not Paid";
            let paymentMethod = "-";
            try {
                const payment = await apiFetch("/payments/order/" + order.orderId);
                if (payment) {
                    paymentStatus = payment.paymentStatus;
                    paymentMethod = payment.paymentMethod;
                }
            } catch (e) { /* no payment yet */ }

            let itemsHtml = "";
            try {
                const items = await apiFetch("/order-items/order/" + order.orderId);
                if (items.length) {
                    itemsHtml = '<div class="order-items-section"><h4>Items</h4>';
                    items.forEach(item => {
                        const name = item.product ? item.product.productName : "Product";
                        itemsHtml += `<div class="order-item-line"><span>${name} × ${item.quantity}</span><span>${formatCurrency(item.unitPrice * item.quantity)}</span></div>`;
                    });
                    itemsHtml += '</div>';
                }
            } catch (e) { /* no items */ }

            const statusClass = "status-" + (order.orderStatus || "pending").toLowerCase();
            const payClass    = "status-" + paymentStatus.toLowerCase().replace(" ", "-");

            html += `
                <div class="order-card">
                    <div class="order-card-header">
                        <h3>Order #${order.orderId}</h3>
                        <span class="status-badge ${statusClass}">${order.orderStatus}</span>
                    </div>
                    <div class="order-card-body">
                        <div class="order-detail">
                            <span class="label">Date</span>
                            <span class="value">${formatDate(order.orderDate)}</span>
                        </div>
                        <div class="order-detail">
                            <span class="label">Total</span>
                            <span class="value">${formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div class="order-detail">
                            <span class="label">Discount</span>
                            <span class="value">${formatCurrency(order.discountAmount || 0)}</span>
                        </div>
                        <div class="order-detail">
                            <span class="label">Payment</span>
                            <span class="value"><span class="status-badge ${payClass}">${paymentStatus}</span></span>
                        </div>
                        <div class="order-detail">
                            <span class="label">Method</span>
                            <span class="value">${paymentMethod}</span>
                        </div>
                    </div>
                    ${itemsHtml}
                </div>`;
        }

        container.innerHTML = html;
    } catch (e) {
        showToast("Customer not found. Please check your email address.", "error");
    } finally {
        resetButton(btn);
    }
}
