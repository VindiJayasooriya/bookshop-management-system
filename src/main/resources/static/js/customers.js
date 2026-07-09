loadCustomers();

function loadCustomers() {
    apiFetch("/customers")
        .then(customers => {
            const tableBody = document.querySelector("#customerTable tbody");
            tableBody.innerHTML = "";
            customers.forEach(customer => {
                const memberBadge = customer.isMember
                    ? '<span class="status-badge status-completed">Member</span>'
                    : '<span class="status-badge status-pending">Non-Member</span>';
                tableBody.innerHTML += `
                    <tr>
                        <td>${customer.customerId}</td>
                        <td>${customer.firstName} ${customer.lastName}</td>
                        <td>${customer.email}</td>
                        <td>${customer.phoneNumber || "-"}</td>
                        <td>${customer.address || "-"}</td>
                        <td>${memberBadge}</td>
                        <td>${customer.discountPercentage || 0}%</td>
                        <td class="actions">
                            <button class="btn-sm btn-edit"   onclick="editCustomer(${customer.customerId})">Edit</button>
                            <button class="btn-sm btn-delete" onclick="deleteCustomer(${customer.customerId})">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(e => console.error(e));
}

async function editCustomer(id) {
    try {
        const customer = await apiFetch("/customers/" + id);
        document.getElementById("customerId").value          = customer.customerId;
        document.getElementById("firstName").value           = customer.firstName;
        document.getElementById("lastName").value            = customer.lastName;
        document.getElementById("email").value               = customer.email;
        document.getElementById("phoneNumber").value         = customer.phoneNumber || "";
        document.getElementById("isMember").value            = customer.isMember ? "true" : "false";
        document.getElementById("discountPercentage").value  = customer.discountPercentage || 0;
        document.getElementById("editPanel").classList.add("visible");
    } catch (e) {
        showToast("Failed to load customer details.", "error");
    }
}

function closeEditPanel() {
    document.getElementById("editPanel").classList.remove("visible");
}

async function updateCustomer() {
    const id = document.getElementById("customerId").value;
    const customer = {
        firstName:          document.getElementById("firstName").value,
        lastName:           document.getElementById("lastName").value,
        email:              document.getElementById("email").value,
        phoneNumber:        document.getElementById("phoneNumber").value,
        isMember:           document.getElementById("isMember").value === "true",
        discountPercentage: parseFloat(document.getElementById("discountPercentage").value)
    };

    const btn = document.querySelector("button[onclick='updateCustomer()']");
    setButtonLoading(btn, "Updating...");

    try {
        await apiFetch("/customers/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer)
        });
        showToast("Customer updated successfully! ✅", "success");
        closeEditPanel();
        loadCustomers();
    } catch (e) {
        showToast(e.message || "Failed to update customer.", "error");
    } finally {
        resetButton(btn);
    }
}

function deleteCustomer(id) {
    showConfirm(
        "Are you sure you want to delete this customer? This action cannot be undone.",
        "Delete Customer",
        () => {
            apiFetch("/customers/" + id, { method: "DELETE" })
                .then(() => {
                    showToast("Customer deleted successfully.", "success");
                    loadCustomers();
                })
                .catch(e => showToast(e.message || "Failed to delete customer.", "error"));
        }
    );
}
