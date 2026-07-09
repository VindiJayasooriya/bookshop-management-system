loadOrders();

function loadOrders() {
    apiFetch("/orders")
        .then(orders => {
            const tableBody = document.querySelector("#orderTable tbody");
            tableBody.innerHTML = "";
            orders.forEach(order => {
                const customerName = order.customer
                    ? order.customer.firstName + " " + order.customer.lastName
                    : "N/A";
                const statusClass = "status-" + (order.orderStatus || "pending").toLowerCase();
                tableBody.innerHTML += `
                    <tr>
                        <td>${order.orderId}</td>
                        <td>${formatDate(order.orderDate)}</td>
                        <td>${customerName}</td>
                        <td>${formatCurrency(order.totalAmount)}</td>
                        <td>${formatCurrency(order.discountAmount || 0)}</td>
                        <td><span class="status-badge ${statusClass}">${order.orderStatus}</span></td>
                        <td class="actions">
                            <button class="btn-sm btn-edit"   onclick="editOrder(${order.orderId})">Update</button>
                            <button class="btn-sm btn-delete" onclick="deleteOrder(${order.orderId})">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(e => console.error(e));
}

async function editOrder(id) {
    try {
        const order = await apiFetch("/orders/" + id);
        document.getElementById("orderId").value          = order.orderId;
        document.getElementById("orderIdDisplay").value   = "#" + order.orderId;
        document.getElementById("customerName").value     = order.customer
            ? order.customer.firstName + " " + order.customer.lastName : "N/A";
        document.getElementById("totalAmount").value      = formatCurrency(order.totalAmount);
        document.getElementById("orderStatus").value      = order.orderStatus;
        document.getElementById("editPanel").classList.add("visible");
    } catch (e) {
        showToast("Failed to load order details.", "error");
    }
}

function closeEditPanel() {
    document.getElementById("editPanel").classList.remove("visible");
}

async function updateOrder() {
    const id    = document.getElementById("orderId").value;
    const btn   = document.querySelector("button[onclick='updateOrder()']");

    setButtonLoading(btn, "Updating...");

    try {
        const order = await apiFetch("/orders/" + id);
        order.orderStatus = document.getElementById("orderStatus").value;

        await apiFetch("/orders/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });
        showToast("Order status updated successfully! ✅", "success");
        closeEditPanel();
        loadOrders();
    } catch (e) {
        showToast(e.message || "Failed to update order.", "error");
    } finally {
        resetButton(btn);
    }
}

function deleteOrder(id) {
    showConfirm(
        "Are you sure you want to delete this order? This action cannot be undone.",
        "Delete Order",
        () => {
            apiFetch("/orders/" + id, { method: "DELETE" })
                .then(() => {
                    showToast("Order deleted successfully.", "success");
                    loadOrders();
                })
                .catch(e => showToast(e.message || "Failed to delete order.", "error"));
        }
    );
}
