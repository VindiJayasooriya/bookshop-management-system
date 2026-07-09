// ─── Live Validation Setup ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    attachLiveValidation("email", ["required", "email"]);
    attachLiveValidation("password", ["required"]);
});

// ─── Login Function ───────────────────────────────────────────────────────────
async function login() {
    const isValid = validateForm([
        { id: "email",    rules: ["required", "email"] },
        { id: "password", rules: ["required"] }
    ]);

    if (!isValid) {
        showToast("Please fix the errors below before logging in.", "warning");
        return;
    }

    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn      = document.querySelector("button[onclick='login()']");

    setButtonLoading(btn, "Logging in...");

    try {
        const customer = await apiFetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        setMember(customer);
        showToast("Welcome back, " + customer.firstName + "! 🎉 You have a 5% member discount.", "success");
        setTimeout(() => { window.location.href = "home.html"; }, 1200);
    } catch (e) {
        showToast(e.message || "Login failed. Please check your credentials.", "error");
        resetButton(btn);
    }
}

document.getElementById("password").addEventListener("keypress", (e) => {
    if (e.key === "Enter") login();
});
