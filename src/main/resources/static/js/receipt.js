const params    = new URLSearchParams(window.location.search);
const paymentId = params.get("paymentId");
let receiptData = null;

async function loadReceipt() {
    if (!paymentId) {
        window.location.href = "home.html";
        return;
    }

    try {
        const payment = await apiFetch("/payments/" + paymentId);
        const order   = payment.order
            ? await apiFetch("/orders/" + payment.order.orderId)
            : null;

        const customerName = order && order.customer
            ? order.customer.firstName + " " + order.customer.lastName
            : "N/A";

        receiptData = { payment, order, customerName };

        document.getElementById("receiptDetails").innerHTML = `
            <div class="receipt-row">
                <span class="label">Receipt ID</span>
                <span class="value">#${payment.paymentId}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Order ID</span>
                <span class="value">#${order ? order.orderId : "-"}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Customer</span>
                <span class="value">${customerName}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Payment Method</span>
                <span class="value">${payment.paymentMethod}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Payment Date</span>
                <span class="value">${formatDate(payment.paymentDate)}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Amount Paid</span>
                <span class="value">${formatCurrency(payment.amount)}</span>
            </div>
        `;
    } catch (e) {
        showToast("Receipt not found.", "error");
        setTimeout(() => { window.location.href = "home.html"; }, 1500);
    }
}

function downloadReceipt() {
    if (!receiptData) return;

    const { payment, order, customerName } = receiptData;
    const content = `
ABC BOOKSHOP - PAYMENT RECEIPT
================================
Receipt ID: #${payment.paymentId}
Order ID: #${order ? order.orderId : "-"}
Customer: ${customerName}
Payment Method: ${payment.paymentMethod}
Payment Date: ${formatDate(payment.paymentDate)}
Amount Paid: ${formatCurrency(payment.amount)}
Status: ${payment.paymentStatus}
================================
Thank you for shopping with us!
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "receipt-" + payment.paymentId + ".txt";
    a.click();
    URL.revokeObjectURL(url);
}

loadReceipt();
