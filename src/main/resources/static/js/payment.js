const params  = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");
let orderData = null;

// ─── Payment Method Toggle ────────────────────────────────────────────────────
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener("change", () => {
        const cardForm = document.getElementById("cardForm");
        cardForm.style.display = radio.value === "ONLINE" ? "block" : "none";
        // Clear card field errors when toggling away from ONLINE
        if (radio.value !== "ONLINE") {
            ["cardNumber", "cardHolder", "expiryDate", "cvv"].forEach(id => clearFieldState(id));
        }
    });
});

// ─── Card Number Formatting ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const cardNumberInput = document.getElementById("cardNumber");
    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "").substring(0, 16);
            e.target.value = value.replace(/(.{4})/g, "$1 ").trim();
        });
    }

    const expiryInput = document.getElementById("expiryDate");
    if (expiryInput) {
        expiryInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "").substring(0, 4);
            if (value.length >= 3) {
                value = value.substring(0, 2) + "/" + value.substring(2);
            }
            e.target.value = value;
        });
    }

    const cvvInput = document.getElementById("cvv");
    if (cvvInput) {
        cvvInput.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3);
        });
    }

    // Live validation
    attachLiveValidation("cardNumber",  ["cardNumber"]);
    attachLiveValidation("cardHolder",  ["required"]);
    attachLiveValidation("expiryDate",  ["required", "expiryDate"]);
    attachLiveValidation("cvv",         ["required", "cvv"]);
});

// ─── Load Payment Page ────────────────────────────────────────────────────────
async function loadPaymentPage() {
    if (!orderId) {
        window.location.href = "home.html";
        return;
    }

    try {
        orderData = await apiFetch("/orders/" + orderId);
        document.getElementById("orderIdDisplay").textContent  = "#" + orderData.orderId;
        document.getElementById("paymentAmount").textContent   = formatCurrency(orderData.totalAmount);
    } catch (e) {
        showToast("Order not found. Redirecting...", "error");
        setTimeout(() => { window.location.href = "home.html"; }, 1500);
    }
}

// ─── Process Payment ──────────────────────────────────────────────────────────
async function processPayment() {
    const method = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Validate card fields only if ONLINE payment
    if (method === "ONLINE") {
        const isValid = validateForm([
            { id: "cardNumber", rules: ["required", "cardNumber"] },
            { id: "cardHolder", rules: ["required"] },
            { id: "expiryDate", rules: ["required", "expiryDate"] },
            { id: "cvv",        rules: ["required", "cvv"] }
        ]);

        if (!isValid) {
            showToast("Please enter valid card details.", "warning");
            return;
        }
    }

    const payment = {
        paymentDate:   new Date().toISOString().split("T")[0],
        amount:        orderData.totalAmount,
        paymentMethod: method,
        paymentStatus: "PAID",
        order:         { orderId: parseInt(orderId) }
    };

    const btn = document.querySelector("button[onclick='processPayment()']");
    setButtonLoading(btn, "Processing Payment...");

    try {
        const result = await apiFetch("/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payment)
        });

        localStorage.setItem("lastPayment", JSON.stringify(result));
        localStorage.removeItem("pendingOrder");
        showToast("Payment successful! 💳 Redirecting to receipt...", "success");
        setTimeout(() => {
            window.location.href = "receipt.html?paymentId=" + result.paymentId;
        }, 1200);
    } catch (e) {
        showToast(e.message || "Payment failed. Please try again.", "error");
        resetButton(btn);
    }
}

loadPaymentPage();
