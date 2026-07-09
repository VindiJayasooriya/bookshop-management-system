let selectedRating = 0;

const member = getMember();
if (member) {
    document.getElementById("email").value = member.email;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.value);
        document.getElementById("rating").value = selectedRating;
        document.querySelectorAll(".star").forEach((s, i) => {
            s.classList.toggle("active", i < selectedRating);
        });
        // Clear rating error when user selects a star
        clearFieldState("rating");
    });
});

// ─── Load Products ────────────────────────────────────────────────────────────
async function loadProducts() {
    try {
        const products = await apiFetch("/products");
        const select   = document.getElementById("productId");
        products.forEach(p => {
            const opt       = document.createElement("option");
            opt.value       = p.productId;
            opt.textContent = p.productName;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error(e);
    }
}

// ─── Live Validation Setup ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    attachLiveValidation("email",     ["required", "email"]);
    attachLiveValidation("productId", ["required", "selectRequired"]);
    attachLiveValidation("comment",   ["required"]);
});

// ─── Submit Feedback ──────────────────────────────────────────────────────────
async function submitFeedback() {
    const isValid = validateForm([
        { id: "email",     rules: ["required", "email"] },
        { id: "productId", rules: ["required", "selectRequired"] },
        { id: "comment",   rules: ["required"] }
    ]);

    // Validate rating separately (hidden input driven by stars)
    const rating = parseInt(document.getElementById("rating").value);
    let ratingValid = true;
    if (!rating || rating < 1 || rating > 5) {
        showFieldError("rating", "Please select a star rating.");
        ratingValid = false;
    } else {
        showFieldSuccess("rating");
    }

    if (!isValid || !ratingValid) {
        showToast("Please fill in all fields and select a rating.", "warning");
        return;
    }

    const email     = document.getElementById("email").value.trim();
    const productId = document.getElementById("productId").value;
    const comment   = document.getElementById("comment").value.trim();

    const btn = document.querySelector("button[onclick='submitFeedback()']");
    setButtonLoading(btn, "Submitting...");

    try {
        const customer = await apiFetch("/customers/email/" + encodeURIComponent(email));

        const feedback = {
            feedbackDate: new Date().toISOString().split("T")[0],
            rating:       rating,
            comment:      comment,
            customer:     { customerId: customer.customerId },
            product:      { productId: parseInt(productId) }
        };

        await apiFetch("/feedbacks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedback)
        });

        showToast("Thank you for your feedback! ⭐", "success");
        setTimeout(() => { window.location.href = "home.html"; }, 1400);
    } catch (e) {
        showToast(e.message || "Could not submit feedback. Make sure your email is registered.", "error");
        resetButton(btn);
    }
}

loadProducts();
