document.addEventListener("DOMContentLoaded", function () {
    // Target the form by id (make sure your form has id="explainationForm")
    const form = document.getElementById("explainationForm");

    if (!form) {
        console.error("Form element not found. Add id='explainationForm' to your form.");
        return;
    }

    form.addEventListener("submit", function (event) {
        // Collect values only when submit is clicked
        const branchId = document.getElementById("branchId").value.trim();
        const irrCode = document.getElementById("irrCode").value.trim();
        const customerName = document.getElementById("customerName").value.trim();
        const customerId = document.getElementById("customerId").value.trim();
        const pledgeNumber = document.getElementById("pledgeNumber").value.trim();
        const irregularityStatus = document.getElementById("irregularityStatus").value.trim();
        const remark = document.getElementById("remark").value.trim();
        const documents = document.getElementById("documents").files;

        // Track missing fields
        let missing = [];
        if (!branchId) missing.push("Branch");
        if (!irrCode) missing.push("Irregularity Code");
        if (!customerName) missing.push("Customer Name");
        if (!customerId) missing.push("Customer ID");
        if (!pledgeNumber) missing.push("Pledge Number");
        if (!irregularityStatus) missing.push("Irregularity Status");
        if (!remark) missing.push("Remark");
        if (documents.length === 0) missing.push("Documents");

        if (missing.length > 0) {
            event.preventDefault(); // stop submission
            alert("Please fill in the following fields before submitting:\n- " + missing.join("\n- "));
        }
    });
});
ss