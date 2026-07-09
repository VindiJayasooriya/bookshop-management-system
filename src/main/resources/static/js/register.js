// ─── Live Validation Setup ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    attachLiveValidation("firstName",   ["required", { rule: "minLength", param: 2 }, { rule: "maxLength", param: 50 }, "lettersOnly"]);
    attachLiveValidation("lastName",    ["required", { rule: "minLength", param: 2 }, { rule: "maxLength", param: 50 }, "lettersOnly"]);
    attachLiveValidation("email",       ["required", "email"]);
    attachLiveValidation("password",    ["required", "password"]);
    attachLiveValidation("phoneNumber", ["required", "phone"]);
    attachLiveValidation("address",     ["required", "address"]);
});

// ─── Register Function ────────────────────────────────────────────────────────
async function register() {
    const isValid = validateForm([
        { id: "firstName",   rules: ["required", { rule: "minLength", param: 2 }, { rule: "maxLength", param: 50 }, "lettersOnly"] },
        { id: "lastName",    rules: ["required", { rule: "minLength", param: 2 }, { rule: "maxLength", param: 50 }, "lettersOnly"] },
        { id: "email",       rules: ["required", "email"] },
        { id: "password",    rules: ["required", "password"] },
        { id: "phoneNumber", rules: ["required", "phone"] },
        { id: "address",     rules: ["required", "address"] }
    ]);

    if (!isValid) {
        showToast("Please fix the highlighted errors before registering.", "warning");
        return;
    }

    const data = {
        firstName:   document.getElementById("firstName").value.trim(),
        lastName:    document.getElementById("lastName").value.trim(),
        email:       document.getElementById("email").value.trim(),
        password:    document.getElementById("password").value,
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        address:     document.getElementById("address").value.trim()
    };

    const btn = document.querySelector("button[onclick='register()']");
    setButtonLoading(btn, "Registering...");

    try {
        const customer = await apiFetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        setMember(customer);
        showToast("Registration successful! 🎉 You now have a 5% member discount.", "success");
        setTimeout(() => { window.location.href = "home.html"; }, 1400);
    } catch (e) {
        showToast(e.message || "Registration failed. Please try again.", "error");
        resetButton(btn);
    }
}
