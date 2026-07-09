const params  = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");

async function loadOrderConfirmation() {
    if (!orderId) {
        window.location.href = "home.html";
        return;
    }

    try {
        const order = await apiFetch("/orders/" + orderId);
        const items = await apiFetch("/order-items/order/" + orderId);

        const customerName = order.customer
            ? order.customer.firstName + " " + order.customer.lastName
            : "N/A";

        let itemsHtml = '<div class="order-items-list"><h4>Ordered Items</h4>';
        items.forEach(item => {
            const name = item.product ? item.product.productName : "Product";
            itemsHtml += `
                <div class="order-item-row">
                    <span>${name} × ${item.quantity}</span>
                    <span>${formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>`;
        });
        itemsHtml += '</div>';

        document.getElementById("orderDetails").innerHTML = `
            <div class="detail-row">
                <span class="label">Order ID</span>
                <span class="value">#${order.orderId}</span>
            </div>
            <div class="detail-row">
                <span class="label">Customer</span>
                <span class="value">${customerName}</span>
            </div>
            <div class="detail-row">
                <span class="label">Date</span>
                <span class="value">${formatDate(order.orderDate)}</span>
            </div>
            <div class="detail-row">
                <span class="label">Discount</span>
                <span class="value">${formatCurrency(order.discountAmount || 0)}</span>
            </div>
            <div class="detail-row">
                <span class="label">Total Amount</span>
                <span class="value">${formatCurrency(order.totalAmount)}</span>
            </div>
            ${itemsHtml}
        `;

        localStorage.setItem("pendingOrder", JSON.stringify(order));
    } catch (e) {
        showToast("Could not load order details.", "error");
        setTimeout(() => { window.location.href = "home.html"; }, 1500);
    }
}

function proceedToPayment() {
    window.location.href = "payment.html?orderId=" + orderId;
}

loadOrderConfirmation();
