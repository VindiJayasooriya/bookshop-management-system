loadProducts();

loadCategories("categoryFilters", (categoryId) => {
    if (categoryId) {
        filterCategory(categoryId);
    } else {
        loadProducts();
    }
});

function loadProducts() {
    apiFetch("/products")
        .then(products => displayProducts(products))
        .catch(e => console.error(e));
}

function searchProducts() {
    const name = document.getElementById("searchInput").value;
    if (!name.trim()) {
        loadProducts();
        return;
    }
    apiFetch("/products/search?name=" + encodeURIComponent(name))
        .then(products => displayProducts(products))
        .catch(e => console.error(e));
}

function displayProducts(products) {
    const container = document.getElementById("productContainer");
    if (!products.length) {
        container.innerHTML = '<div class="empty-state"><h3>No products found</h3></div>';
        return;
    }
    products.forEach(p => { productCache[p.productId] = p; });
    container.innerHTML = products.map(p => renderProductCard(p)).join("");
}

function filterCategory(categoryId) {
    apiFetch("/products/category/" + categoryId)
        .then(products => displayProducts(products))
        .catch(e => console.error(e));
}

document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchProducts();
});
