
$(document).ready(async function () {
    'use strict';
    debugger;
    // ========================================
    // SELECTORS
    // ========================================
    const $modal = $("#pendingAlertsModal");
    const $backdrop = $("#modalBackdrop");
    const $list = $("#pendingAlertsList");
    const $name = $(".employee-name");
    const $noAlert = $(".no-alerts");
    const $container = $("#alertsContainer");

    // ========================================
    // CLOSE MODAL FUNCTION
    // ========================================
    function closeModal() {
        $modal.removeClass("show");
        $backdrop.removeClass("show");
        $("body").css("overflow", "");
    }

    // Attach close handlers (once)
    $(document).off("click", ".modal-close, .btn-ok, #modalBackdrop").on("click", ".modal-close, .btn-ok, #modalBackdrop", closeModal);
    $(document).off("keydown").on("keydown", function (e) {
        if (e.key === "Escape" && $modal.hasClass("show")) closeModal();
    });

    // ========================================
    // CHECK IF MODAL SHOULD OPEN
    // ========================================
    const showModalFlag = sessionStorage.getItem("showPendingAlerts");
    if (showModalFlag !== "true") return;

    sessionStorage.removeItem("showPendingAlerts"); // Run only once

    try {
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            post: sessionStorage.getItem("Post")
        };

        var Res = await fetch("/proc_legal_workalert", "POST", requestData);

        // Decrypt (your function)
        const decrypted = decryptAES(Res);
        const responseData = JSON.parse(decrypted);

        // Reset UI
        $name.text("");
        $list.empty();
        $container.hide();
        $noAlert.hide();

        if (responseData.err_sts === "1") {
            const data = JSON.parse(responseData.outdata);
            const rows = data.Table || [];

            if (rows.length > 0) {
                // Show name once
                $name.text("DEAR " + (rows[0].EMP_NAME || "User") + ",");

                // Show all alerts
                rows.forEach(row => {
                    const msg = (row.ALERT_MESSAGE || "").trim();
                    if (msg) $list.append(`<li>${msg}</li>`);
                });

                $container.show();
            } else {
                $backdrop.hide();
                $modal.hide();
               /* $noAlert.show();*/
            }
        } else {
            $backdrop.hide();
            $modal.hide();
            //$noAlert.show();
            //await showAlert("Alert!", responseData.outmsg || "Unable to load alerts.", "warning");
        }

        // Show modal
        $backdrop.addClass("show");
        $modal.addClass("show");
        $("body").css("overflow", "hidden");

    } catch (error) {
        console.error("Pending Alerts Error:", error);
        $noAlert.show();
        await showAlert("Error!", "Failed to load alerts. Please try again.", "error");
    }
});
