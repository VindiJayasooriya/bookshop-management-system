loadFeedbacks();

function loadFeedbacks() {
    apiFetch("/feedbacks")
        .then(feedbacks => {
            const tableBody = document.querySelector("#feedbackTable tbody");
            tableBody.innerHTML = "";
            feedbacks.forEach(feedback => {
                const customerName = feedback.customer
                    ? feedback.customer.firstName + " " + feedback.customer.lastName
                    : "N/A";
                const productName = feedback.product
                    ? feedback.product.productName
                    : "N/A";
                const stars = "★".repeat(feedback.rating) + "☆".repeat(5 - feedback.rating);
                tableBody.innerHTML += `
                    <tr>
                        <td>${feedback.feedbackId}</td>
                        <td>${formatDate(feedback.feedbackDate)}</td>
                        <td>${stars} (${feedback.rating})</td>
                        <td>${feedback.comment}</td>
                        <td>${customerName}</td>
                        <td>${productName}</td>
                        <td class="actions">
                            <button class="btn-sm btn-delete" onclick="deleteFeedback(${feedback.feedbackId})">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(e => console.error(e));
}

function deleteFeedback(id) {
    showConfirm(
        "Are you sure you want to delete this feedback entry?",
        "Delete Feedback",
        () => {
            apiFetch("/feedbacks/" + id, { method: "DELETE" })
                .then(() => {
                    showToast("Feedback deleted successfully.", "success");
                    loadFeedbacks();
                })
                .catch(e => showToast(e.message || "Failed to delete feedback.", "error"));
        }
    );
}
