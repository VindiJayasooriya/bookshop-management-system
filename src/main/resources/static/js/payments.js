loadPayments();

function loadPayments() {
    apiFetch("/payments")
        .then(payments => {
            const tableBody = document.querySelector("#paymentTable tbody");
            tableBody.innerHTML = "";
            payments.forEach(payment => {
                const statusClass = "status-" + (payment.paymentStatus || "pending").toLowerCase();
                const orderId = payment.order ? payment.order.orderId : "-";
                tableBody.innerHTML += `
                    <tr>
                        <td>${payment.paymentId}</td>
                        <td>${formatDate(payment.paymentDate)}</td>
                        <td>${formatCurrency(payment.amount)}</td>
                        <td>${payment.paymentMethod}</td>
                        <td><span class="status-badge ${statusClass}">${payment.paymentStatus}</span></td>
                        <td>#${orderId}</td>
                        <td class="actions">
                            <button class="btn-sm btn-delete" onclick="deletePayment(${payment.paymentId})">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(e => console.error(e));
}

function deletePayment(id) {
    showConfirm(
        "Are you sure you want to delete this payment record? This action cannot be undone.",
        "Delete Payment",
        () => {
            apiFetch("/payments/" + id, { method: "DELETE" })
                .then(() => {
                    showToast("Payment record deleted successfully.", "success");
                    loadPayments();
                })
                .catch(e => showToast(e.message || "Failed to delete payment.", "error"));
        }
    );
}
