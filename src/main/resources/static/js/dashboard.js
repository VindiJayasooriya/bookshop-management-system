loadDashboard();

function loadDashboard() {
    apiFetch("/dashboard")
        .then(data => {
            document.getElementById("customers").textContent = data.totalCustomers || 0;
            document.getElementById("products").textContent = data.totalProducts || 0;
            document.getElementById("orders").textContent = data.totalOrders || 0;
            document.getElementById("sales").textContent = formatCurrency(data.totalSales || 0);
            document.getElementById("pendingOrders").textContent = data.pendingOrders || 0;
            document.getElementById("completedOrders").textContent = data.completedOrders || 0;
            document.getElementById("members").textContent = data.memberCustomers || 0;
        })
        .catch(e => console.error(e));
}
