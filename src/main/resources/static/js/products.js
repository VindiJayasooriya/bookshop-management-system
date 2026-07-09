loadCategories();
loadProducts();

async function loadCategories() {
    try {
        const categories = await apiFetch("/categories");
        const select = document.getElementById("categoryId");
        select.innerHTML = categories.map(c =>
            `<option value="${c.categoryId}">${c.categoryName}</option>`
        ).join("");
    } catch (e) { console.error(e); }
}

function loadProducts() {
    apiFetch("/products")
        .then(products => {
            const tableBody = document.querySelector("#productTable tbody");
            tableBody.innerHTML = "";
            products.forEach(product => {
                const catName = product.category ? product.category.categoryName : "-";
                tableBody.innerHTML += `
                    <tr>
                        <td>${product.productId}</td>
                        <td>${product.productName}</td>
                        <td>${formatCurrency(product.price)}</td>
                        <td>${product.stockQuantity}</td>
                        <td>${catName}</td>
                        <td class="actions">
                            <button class="btn-sm btn-edit"   onclick="editProduct(${product.productId})">Edit</button>
                            <button class="btn-sm btn-delete" onclick="deleteProduct(${product.productId})">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(e => console.error(e));
}

async function editProduct(id) {
    try {
        const product = await apiFetch("/products/" + id);
        document.getElementById("productId").value      = product.productId;
        document.getElementById("productName").value    = product.productName;
        document.getElementById("description").value    = product.description || "";
        document.getElementById("price").value          = product.price;
        document.getElementById("stockQuantity").value  = product.stockQuantity;
        document.getElementById("imageUrl").value       = product.imageUrl || "";
        if (product.category) {
            document.getElementById("categoryId").value = product.category.categoryId;
        }
        document.getElementById("formTitle").textContent = "Edit Product";
        // Clear previous validation states when loading a product to edit
        ["productName", "description", "price", "stockQuantity"].forEach(clearFieldState);
        // Scroll to form
        document.getElementById("productForm").scrollIntoView({ behavior: "smooth" });
    } catch (e) {
        showToast("Failed to load product details.", "error");
    }
}

function clearForm() {
    document.getElementById("productId").value     = "";
    document.getElementById("productName").value   = "";
    document.getElementById("description").value   = "";
    document.getElementById("price").value         = "";
    document.getElementById("stockQuantity").value = "";
    document.getElementById("imageUrl").value      = "";
    document.getElementById("formTitle").textContent = "Add Product";
    ["productName", "description", "price", "stockQuantity"].forEach(clearFieldState);
}

// ─── Live Validation ──────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    attachLiveValidation("productName",   ["required", "productName"]);
    attachLiveValidation("description",   ["required"]);
    attachLiveValidation("price",         ["required", "positive"]);
    attachLiveValidation("stockQuantity", ["required", "nonNegative"]);
});

// ─── Save Product ─────────────────────────────────────────────────────────────
async function saveProduct() {
    const isValid = validateForm([
        { id: "productName",   rules: ["required", "productName"] },
        { id: "description",   rules: ["required"] },
        { id: "price",         rules: ["required", "positive"] },
        { id: "stockQuantity", rules: ["required", "nonNegative"] }
    ]);

    if (!isValid) {
        showToast("Please fix the highlighted errors before saving.", "warning");
        return;
    }

    const productId = document.getElementById("productId").value;
    const product = {
        productName:   document.getElementById("productName").value.trim(),
        description:   document.getElementById("description").value.trim(),
        price:         parseFloat(document.getElementById("price").value),
        stockQuantity: parseInt(document.getElementById("stockQuantity").value),
        imageUrl:      document.getElementById("imageUrl").value.trim(),
        category:      { categoryId: parseInt(document.getElementById("categoryId").value) }
    };

    const url    = productId ? "/products/" + productId : "/products";
    const method = productId ? "PUT" : "POST";
    const btn    = document.querySelector("button[onclick='saveProduct()']");

    setButtonLoading(btn, "Saving...");

    try {
        await apiFetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        showToast(productId ? "Product updated successfully! ✅" : "Product added successfully! ✅", "success");
        clearForm();
        loadProducts();
    } catch (e) {
        showToast(e.message || "Failed to save product.", "error");
    } finally {
        resetButton(btn);
    }
}

// ─── Delete Product ───────────────────────────────────────────────────────────
function deleteProduct(id) {
    showConfirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
        "Delete Product",
        () => {
            apiFetch("/products/" + id, { method: "DELETE" })
                .then(() => {
                    showToast("Product deleted successfully.", "success");
                    loadProducts();
                })
                .catch(e => showToast(e.message || "Failed to delete product.", "error"));
        }
    );
}
