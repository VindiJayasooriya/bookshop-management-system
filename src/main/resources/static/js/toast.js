/**
 * Toast Notification System — ABC Bookshop
 * Provides showToast() and showConfirm() to replace all browser alert/confirm dialogs.
 */

(function () {
    // ─── Inject container on first use ───────────────────────────────────────
    function getContainer() {
        let container = document.getElementById("toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            document.body.appendChild(container);
        }
        return container;
    }

    // ─── Icon map per type ────────────────────────────────────────────────────
    const ICONS = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    };

    const LABELS = {
        success: "Success",
        error:   "Error",
        warning: "Warning",
        info:    "Info"
    };

    /**
     * Show a toast notification.
     * @param {string} message - The message to display.
     * @param {'success'|'error'|'warning'|'info'} type - Toast type.
     * @param {number} duration - Auto-dismiss duration in ms (default 3500).
     */
    window.showToast = function (message, type = "info", duration = 3500) {
        const container = getContainer();

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.setAttribute("role", "alert");
        toast.setAttribute("aria-live", "assertive");

        toast.innerHTML = `
            <div class="toast-icon">${ICONS[type] || ICONS.info}</div>
            <div class="toast-body">
                <div class="toast-title">${LABELS[type] || "Notice"}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
            <div class="toast-progress"></div>
        `;

        // Close button
        toast.querySelector(".toast-close").addEventListener("click", () => dismissToast(toast));

        // Click anywhere on toast to dismiss
        toast.addEventListener("click", (e) => {
            if (!e.target.classList.contains("toast-close")) dismissToast(toast);
        });

        container.appendChild(toast);

        // Trigger animation (allow paint first)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add("toast-show");
            });
        });

        // Progress bar animation
        const progress = toast.querySelector(".toast-progress");
        progress.style.transition = `width ${duration}ms linear`;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                progress.style.width = "0%";
            });
        });

        // Auto dismiss
        const timer = setTimeout(() => dismissToast(toast), duration);
        toast._dismissTimer = timer;
    };

    function dismissToast(toast) {
        clearTimeout(toast._dismissTimer);
        toast.classList.add("toast-hide");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
        // Fallback removal
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 600);
    }

    // ─── Confirm Modal ────────────────────────────────────────────────────────
    /**
     * Show a custom confirm dialog (replaces window.confirm).
     * @param {string} message - The confirmation message.
     * @param {string} title - Modal title (optional).
     * @param {Function} onConfirm - Callback when user clicks Confirm.
     * @param {Function} onCancel - Callback when user clicks Cancel (optional).
     */
    window.showConfirm = function (message, title, onConfirm, onCancel) {
        // Support 3-arg form: showConfirm(message, onConfirm, onCancel)
        if (typeof title === "function") {
            onCancel = onConfirm;
            onConfirm = title;
            title = "Confirm Action";
        }

        // Remove existing modals
        const existing = document.getElementById("confirm-modal-overlay");
        if (existing) existing.remove();

        const overlay = document.createElement("div");
        overlay.id = "confirm-modal-overlay";
        overlay.className = "confirm-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "confirm-modal-title");

        overlay.innerHTML = `
            <div class="confirm-modal">
                <div class="confirm-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <h3 id="confirm-modal-title" class="confirm-title">${title}</h3>
                <p class="confirm-message">${message}</p>
                <div class="confirm-actions">
                    <button class="btn confirm-cancel-btn" id="confirmCancelBtn">Cancel</button>
                    <button class="btn confirm-ok-btn" id="confirmOkBtn">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Animate in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add("confirm-show");
            });
        });

        function close() {
            overlay.classList.remove("confirm-show");
            overlay.classList.add("confirm-hide");
            setTimeout(() => overlay.remove(), 300);
        }

        overlay.querySelector("#confirmOkBtn").addEventListener("click", () => {
            close();
            if (typeof onConfirm === "function") onConfirm();
        });

        overlay.querySelector("#confirmCancelBtn").addEventListener("click", () => {
            close();
            if (typeof onCancel === "function") onCancel();
        });

        // Close on overlay click
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                close();
                if (typeof onCancel === "function") onCancel();
            }
        });

        // Close on Escape
        function escHandler(e) {
            if (e.key === "Escape") {
                document.removeEventListener("keydown", escHandler);
                close();
                if (typeof onCancel === "function") onCancel();
            }
        }
        document.addEventListener("keydown", escHandler);

        // Focus confirm button
        setTimeout(() => overlay.querySelector("#confirmOkBtn").focus(), 50);
    };

    // ─── Inject styles ────────────────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
        /* ── Toast Container ── */
        #toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
            max-width: 380px;
            width: calc(100% - 40px);
        }

        /* ── Toast Base ── */
        .toast {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 16px 16px;
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
            pointer-events: all;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            min-width: 280px;
            border-left: 4px solid transparent;
            opacity: 0;
            transform: translateX(120%);
            transition: none;
        }

        /* ── Toast Animations ── */
        @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(120%); }
            to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastSlideOut {
            from { opacity: 1; transform: translateX(0); }
            to   { opacity: 0; transform: translateX(120%); }
        }

        .toast-show {
            animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }
        .toast-hide {
            animation: toastSlideOut 0.3s ease forwards;
        }

        /* ── Toast Types ── */
        .toast-success { border-left-color: #22c55e; }
        .toast-error   { border-left-color: #ef4444; }
        .toast-warning { border-left-color: #f59e0b; }
        .toast-info    { border-left-color: #3b82f6; }

        /* ── Toast Icon ── */
        .toast-icon {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .toast-icon svg { width: 16px; height: 16px; }

        .toast-success .toast-icon { background: #dcfce7; color: #16a34a; }
        .toast-error   .toast-icon { background: #fee2e2; color: #dc2626; }
        .toast-warning .toast-icon { background: #fef3c7; color: #d97706; }
        .toast-info    .toast-icon { background: #dbeafe; color: #2563eb; }

        /* ── Toast Body ── */
        .toast-body { flex: 1; min-width: 0; }
        .toast-title {
            font-weight: 700;
            font-size: 13px;
            margin-bottom: 2px;
            color: #111827;
        }
        .toast-message {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.4;
            word-break: break-word;
        }

        /* ── Toast Close Button ── */
        .toast-close {
            flex-shrink: 0;
            background: none;
            border: none;
            font-size: 18px;
            color: #9ca3af;
            cursor: pointer;
            line-height: 1;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: color 0.15s, background 0.15s;
        }
        .toast-close:hover { color: #374151; background: #f3f4f6; }

        /* ── Toast Progress Bar ── */
        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background: currentColor;
            opacity: 0.25;
            border-radius: 0 0 12px 12px;
        }
        .toast-success .toast-progress { color: #22c55e; }
        .toast-error   .toast-progress { color: #ef4444; }
        .toast-warning .toast-progress { color: #f59e0b; }
        .toast-info    .toast-progress { color: #3b82f6; }

        /* ── Confirm Modal Overlay ── */
        .confirm-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            backdrop-filter: blur(3px);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.25s ease;
        }
        .confirm-overlay.confirm-show { opacity: 1; }
        .confirm-overlay.confirm-hide { opacity: 0; }

        /* ── Confirm Modal Box ── */
        .confirm-modal {
            background: #fff;
            border-radius: 16px;
            padding: 32px 28px 24px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            text-align: center;
            transform: scale(0.9) translateY(10px);
            transition: transform 0.25s cubic-bezier(0.21, 1.02, 0.73, 1);
        }
        .confirm-overlay.confirm-show .confirm-modal {
            transform: scale(1) translateY(0);
        }

        /* ── Confirm Icon ── */
        .confirm-icon {
            width: 56px;
            height: 56px;
            background: #fef3c7;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            color: #d97706;
        }
        .confirm-icon svg { width: 28px; height: 28px; }

        /* ── Confirm Text ── */
        .confirm-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
        }
        .confirm-message {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 24px;
            line-height: 1.5;
        }

        /* ── Confirm Buttons ── */
        .confirm-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        .confirm-cancel-btn {
            background: #f3f4f6;
            color: #374151;
            border: none;
            padding: 10px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s;
            flex: 1;
        }
        .confirm-cancel-btn:hover { background: #e5e7eb; }
        .confirm-ok-btn {
            background: #ef4444;
            color: #fff;
            border: none;
            padding: 10px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s;
            flex: 1;
        }
        .confirm-ok-btn:hover { background: #dc2626; }
        .confirm-ok-btn:focus { outline: 2px solid #ef4444; outline-offset: 2px; }

        /* ── Responsive ── */
        @media (max-width: 480px) {
            #toast-container { top: 12px; right: 12px; left: 12px; width: auto; }
            .confirm-modal { padding: 24px 20px 20px; }
        }
    `;
    document.head.appendChild(style);
})();
