const API_BASE = "http://localhost:8080/api";

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === product.productId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: quantity
        });
    }

    saveCart(cart);
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? "inline-flex" : "none";
    }
}

function getMember() {
    const data = localStorage.getItem("member");
    return data ? JSON.parse(data) : null;
}

function setMember(customer) {
    localStorage.setItem("member", JSON.stringify(customer));
}

function logoutMember() {
    localStorage.removeItem("member");
}

function formatCurrency(amount) {
    return "Rs. " + Number(amount).toFixed(2);
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

async function apiFetch(endpoint, options = {}) {
    const response = await fetch(API_BASE + endpoint, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

function calculateDiscount(subtotal, member) {
    if (member && member.isMember) {
        const pct = member.discountPercentage || 5;
        const discount = subtotal * pct / 100;
        return { discount, final: subtotal - discount, pct };
    }
    return { discount: 0, final: subtotal, pct: 0 };
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    updateMemberNav();
});

function updateMemberNav() {
    const member = getMember();
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const memberName = document.getElementById("memberName");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!loginLink) return;

    if (member) {
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        if (memberName) {
            memberName.textContent = member.firstName;
            memberName.style.display = "inline";
        }
        if (logoutBtn) logoutBtn.style.display = "inline";
    } else {
        if (memberName) memberName.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            logoutMember();
            window.location.href = "home.html";
        };
    }
}

function renderProductCard(product) {
    const image = product.imageUrl
        ? `../../images/${product.imageUrl}`
        : "https://via.placeholder.com/280x200?text=Book";

    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${image}" alt="${product.productName}">
            </div>
            <div class="product-info">
                <h3>${product.productName}</h3>
                <p class="product-desc">${product.description || ""}</p>
                <div class="product-footer">
                    <span class="price">${formatCurrency(product.price)}</span>
                    <span class="stock">${product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}</span>
                </div>
                <button class="btn btn-primary btn-block"
                    id="addToCartBtn_${product.productId}"
                    onclick="handleAddToCart(${product.productId})"
                    ${product.stockQuantity <= 0 ? "disabled" : ""}>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

const productCache = {};

async function handleAddToCart(productId) {
    const btn = document.getElementById("addToCartBtn_" + productId);
    if (btn) setButtonLoading(btn, "Adding...");

    try {
        let product = productCache[productId];
        if (!product) {
            product = await apiFetch("/products/" + productId);
            productCache[productId] = product;
        }
        addToCart(product);
        showToast("\"" + product.productName + "\" added to cart! 🛒", "success");
    } catch (e) {
        showToast(e.message || "Could not add to cart.", "error");
    } finally {
        if (btn) resetButton(btn);
    }
}

async function loadCategories(containerId, onSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const categories = await apiFetch("/categories");
        let html = `<button class="category-btn active" data-id="all">All</button>`;
        categories.forEach(cat => {
            html += `<button class="category-btn" data-id="${cat.categoryId}">${cat.categoryName}</button>`;
        });
        container.innerHTML = html;

        container.querySelectorAll(".category-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                container.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const id = btn.dataset.id;
                onSelect(id === "all" ? null : parseInt(id));
            });
        });
    } catch (e) {
        console.error(e);
    }
}
