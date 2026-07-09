loadHomeProducts();

loadCategories("categoryFilters", (categoryId) => {
    if (categoryId) {
        filterByCategory(categoryId);
    } else {
        loadHomeProducts();
    }
});

function loadHomeProducts() {
    apiFetch("/products")
        .then(products => displayHomeProducts(products))
        .catch(e => console.error(e));
}

function searchProducts() {
    const name = document.getElementById("searchInput").value;
    if (!name.trim()) {
        loadHomeProducts();
        return;
    }
    apiFetch("/products/search?name=" + encodeURIComponent(name))
        .then(products => displayHomeProducts(products))
        .catch(e => console.error(e));
}

function filterByCategory(categoryId) {
    apiFetch("/products/category/" + categoryId)
        .then(products => displayHomeProducts(products))
        .catch(e => console.error(e));
}

function displayHomeProducts(products) {
    const container = document.getElementById("productContainer");
    if (!products.length) {
        container.innerHTML = '<div class="empty-state"><h3>No products found</h3><p>Try a different search or category.</p></div>';
        return;
    }
    products.forEach(p => { productCache[p.productId] = p; });
    container.innerHTML = products.map(p => renderProductCard(p)).join("");
}

document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchProducts();
});
