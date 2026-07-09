/**
 * Form Validation Library — ABC Bookshop
 * Provides client-side validation with inline field errors and success states.
 *
 * Usage:
 *   validateForm([
 *     { id: "email",    rules: ["required", "email"] },
 *     { id: "phone",    rules: ["required", "phone"] },
 *     { id: "password", rules: ["required", "password"] },
 *   ])
 *   Returns true if all fields are valid, false otherwise.
 */

(function () {

    // ──────────────────────────────────────────────────────────────────────────
    // VALIDATORS
    // ──────────────────────────────────────────────────────────────────────────
    const VALIDATORS = {
        required: (value) => ({
            ok: value.trim().length > 0,
            msg: "This field is required."
        }),

        minLength: (value, param) => ({
            ok: value.trim().length >= parseInt(param),
            msg: `Must be at least ${param} characters.`
        }),

        maxLength: (value, param) => ({
            ok: value.trim().length <= parseInt(param),
            msg: `Must not exceed ${param} characters.`
        }),

        lettersOnly: (value) => ({
            ok: /^[A-Za-z\s]+$/.test(value.trim()),
            msg: "Only letters and spaces are allowed."
        }),

        email: (value) => ({
            ok: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()),
            msg: "Please enter a valid email address."
        }),

        // Sri Lankan mobile number: 07X XXXXXXX (10 digits)
        phone: (value) => ({
            ok: /^07[0-9]{8}$/.test(value.trim()),
            msg: "Enter a valid Sri Lankan mobile number (e.g. 0712345678)."
        }),

        // Old NIC: 9 digits + V/X, or new NIC: 12 digits
        nic: (value) => ({
            ok: /^(\d{9}[VvXx]|\d{12})$/.test(value.trim()),
            msg: "Enter a valid NIC (e.g. 123456789V or 200012345678)."
        }),

        // Min 8 chars, at least: 1 uppercase, 1 lowercase, 1 digit, 1 special char
        password: (value) => {
            const v = value;
            const checks = [
                v.length >= 8,
                /[A-Z]/.test(v),
                /[a-z]/.test(v),
                /[0-9]/.test(v),
                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v)
            ];
            return {
                ok: checks.every(Boolean),
                msg: "Password must be 8+ characters with uppercase, lowercase, number, and special character."
            };
        },

        // Match another field's value
        confirmPassword: (value, param) => {
            const otherField = document.getElementById(param);
            const otherVal = otherField ? otherField.value : "";
            return {
                ok: value === otherVal,
                msg: "Passwords do not match."
            };
        },

        address: (value) => ({
            ok: value.trim().length >= 10,
            msg: "Address must be at least 10 characters."
        }),

        minValue: (value, param) => ({
            ok: parseFloat(value) >= parseFloat(param),
            msg: `Value must be at least ${param}.`
        }),

        maxValue: (value, param) => ({
            ok: parseFloat(value) <= parseFloat(param),
            msg: `Value must not exceed ${param}.`
        }),

        positive: (value) => ({
            ok: parseFloat(value) > 0,
            msg: "Value must be greater than 0."
        }),

        nonNegative: (value) => ({
            ok: parseFloat(value) >= 0,
            msg: "Value must be 0 or greater."
        }),

        // Rating: integer 1–5
        rating: (value) => ({
            ok: Number.isInteger(parseInt(value)) && parseInt(value) >= 1 && parseInt(value) <= 5,
            msg: "Please select a rating between 1 and 5."
        }),

        // Card number: exactly 16 digits (spaces allowed)
        cardNumber: (value) => ({
            ok: value.replace(/\s/g, "").replace(/-/g, "").length === 16 &&
                /^\d+$/.test(value.replace(/\s/g, "").replace(/-/g, "")),
            msg: "Card number must be exactly 16 digits."
        }),

        // CVV: exactly 3 digits
        cvv: (value) => ({
            ok: /^\d{3}$/.test(value.trim()),
            msg: "CVV must be exactly 3 digits."
        }),

        // Expiry: MM/YY, not in the past
        expiryDate: (value) => {
            const match = value.trim().match(/^(\d{2})\/(\d{2})$/);
            if (!match) return { ok: false, msg: "Enter expiry date in MM/YY format." };
            const month = parseInt(match[1]);
            const year = parseInt("20" + match[2]);
            if (month < 1 || month > 12) return { ok: false, msg: "Invalid month in expiry date." };
            const now = new Date();
            const expiry = new Date(year, month - 1, 1);
            const current = new Date(now.getFullYear(), now.getMonth(), 1);
            return {
                ok: expiry >= current,
                msg: "This card has expired."
            };
        },

        // Select must have a real selected value (not empty string)
        selectRequired: (value) => ({
            ok: value !== "" && value !== null && value !== undefined,
            msg: "Please select an option."
        }),

        // Product name: min 3 chars
        productName: (value) => ({
            ok: value.trim().length >= 3,
            msg: "Product name must be at least 3 characters."
        }),
    };

    // ──────────────────────────────────────────────────────────────────────────
    // FIELD ERROR / SUCCESS DISPLAY
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Show an error message below a field and mark it invalid (red border).
     * @param {string} fieldId
     * @param {string} message
     */
    window.showFieldError = function (fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.remove("field-valid");
        field.classList.add("field-invalid");

        // Find or create error message element
        let errorEl = field.parentNode.querySelector(".field-error-msg[data-for='" + fieldId + "']");
        if (!errorEl) {
            errorEl = document.createElement("span");
            errorEl.className = "field-error-msg";
            errorEl.setAttribute("data-for", fieldId);
            field.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.style.display = "block";
    };

    /**
     * Show a valid (green border) state on a field and clear any error.
     * @param {string} fieldId
     */
    window.showFieldSuccess = function (fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.remove("field-invalid");
        field.classList.add("field-valid");

        const errorEl = field.parentNode.querySelector(".field-error-msg[data-for='" + fieldId + "']");
        if (errorEl) errorEl.style.display = "none";
    };

    /**
     * Clear validation state from a field.
     * @param {string} fieldId
     */
    window.clearFieldState = function (fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.classList.remove("field-invalid", "field-valid");
        const errorEl = field.parentNode.querySelector(".field-error-msg[data-for='" + fieldId + "']");
        if (errorEl) errorEl.style.display = "none";
    };

    // ──────────────────────────────────────────────────────────────────────────
    // VALIDATE A SINGLE FIELD
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Validate a single field against a list of rules.
     * @param {string} fieldId
     * @param {Array<string|Object>} rules - e.g. ["required","email"] or [{rule:"minLength",param:2}]
     * @returns {boolean} true if valid
     */
    window.validateField = function (fieldId, rules) {
        const field = document.getElementById(fieldId);
        if (!field) return true; // Skip if field doesn't exist

        const value = field.value;

        for (const ruleItem of rules) {
            let ruleName, ruleParam;

            if (typeof ruleItem === "string") {
                ruleName = ruleItem;
                ruleParam = null;
            } else {
                ruleName = ruleItem.rule;
                ruleParam = ruleItem.param;
            }

            const validator = VALIDATORS[ruleName];
            if (!validator) continue;

            const result = validator(value, ruleParam);
            if (!result.ok) {
                showFieldError(fieldId, result.msg);
                return false;
            }
        }

        showFieldSuccess(fieldId);
        return true;
    };

    // ──────────────────────────────────────────────────────────────────────────
    // VALIDATE ENTIRE FORM
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Validate multiple fields and return true only if ALL are valid.
     * @param {Array<{id: string, rules: Array}>} fieldConfigs
     * @returns {boolean}
     */
    window.validateForm = function (fieldConfigs) {
        let allValid = true;

        for (const config of fieldConfigs) {
            const isValid = validateField(config.id, config.rules);
            if (!isValid) allValid = false;
        }

        return allValid;
    };

    // ──────────────────────────────────────────────────────────────────────────
    // LIVE VALIDATION ATTACHMENT
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Attach live validation to a field — validates on blur and clears on input.
     * @param {string} fieldId
     * @param {Array} rules
     */
    window.attachLiveValidation = function (fieldId, rules) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // On blur: validate
        field.addEventListener("blur", () => {
            validateField(fieldId, rules);
        });

        // On input: clear error so user isn't nagged while typing
        field.addEventListener("input", () => {
            const errorEl = field.parentNode.querySelector(".field-error-msg[data-for='" + fieldId + "']");
            if (errorEl) errorEl.style.display = "none";
            field.classList.remove("field-invalid");
            // Remove green border too, re-apply only on blur
            field.classList.remove("field-valid");
        });
    };

    // ──────────────────────────────────────────────────────────────────────────
    // BUTTON LOADING STATE HELPERS
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Set a button to loading state (disabled + spinner).
     * @param {HTMLButtonElement} btn
     * @param {string} loadingText - Text to show while loading.
     */
    window.setButtonLoading = function (btn, loadingText = "Processing...") {
        if (!btn) return;
        btn.disabled = true;
        btn._originalText = btn.innerHTML;
        btn.innerHTML = `
            <span class="btn-spinner" aria-hidden="true"></span>
            <span>${loadingText}</span>
        `;
        btn.classList.add("btn-loading");
    };

    /**
     * Restore a button from loading state.
     * @param {HTMLButtonElement} btn
     */
    window.resetButton = function (btn) {
        if (!btn) return;
        btn.disabled = false;
        if (btn._originalText) {
            btn.innerHTML = btn._originalText;
        }
        btn.classList.remove("btn-loading");
    };

    // ──────────────────────────────────────────────────────────────────────────
    // INJECT VALIDATION STYLES
    // ──────────────────────────────────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
        /* ── Valid Field ── */
        .field-valid {
            border-color: #22c55e !important;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12) !important;
        }

        /* ── Invalid Field ── */
        .field-invalid {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
        }

        /* ── Error Message ── */
        .field-error-msg {
            display: none;
            color: #dc2626;
            font-size: 12px;
            font-weight: 500;
            margin-top: 4px;
            padding-left: 2px;
            line-height: 1.4;
        }

        /* ── Button Spinner ── */
        .btn-spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid rgba(255, 255, 255, 0.35);
            border-top-color: #fff;
            border-radius: 50%;
            animation: btn-spin 0.7s linear infinite;
            vertical-align: middle;
            flex-shrink: 0;
        }

        @keyframes btn-spin {
            to { transform: rotate(360deg); }
        }

        .btn-loading {
            opacity: 0.8 !important;
            cursor: not-allowed !important;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

})();
