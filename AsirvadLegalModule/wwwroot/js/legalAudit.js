/* File: wwwroot/js/legalAudit.js */
(function () {
    const at = "\x40";
    const KEY = "Anu||" + at + at + "thattu*#0770||^TTT";

    window.encryptData = function (txt) {
        if (!txt) return "";
        const k = CryptoJS.enc.Utf8.parse(KEY);
        const v = CryptoJS.enc.Utf8.parse("\0".repeat(16));
        return CryptoJS.AES.encrypt(txt.toString(), k, {
            iv: v, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
        }).toString();
    };

    window.decryptData = function (cipher) {
        try {
            if (!cipher) return "";
            // Fix: Ensure cipher is a string before replacing quotes
            let cipherStr = (typeof cipher === 'string') ? cipher : JSON.stringify(cipher);
            cipherStr = cipherStr.replace(/^"|"$/g, '');

            const k = CryptoJS.enc.Utf8.parse(KEY);
            const v = CryptoJS.enc.Utf8.parse("\0".repeat(16));
            const bytes = CryptoJS.AES.decrypt(cipherStr, k, {
                iv: v, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
            });
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.error("Decryption failed:", e);
            return "";
        }
    };
})();

$(function () {
    $('#btnSearch').on('click', async function () {
        const $status = $('#statusText');
        const $body = $('#gBody');

        $status.text("Connecting to API...");
        console.log("Search initiated...");

        try {
            const req = {
                flag: 1,
                indata: encryptData($('#pInput').val() || "0"),
                employeeId: encryptData(sessionStorage.getItem("EmployeeId") || "364625"),
                branch: encryptData(sessionStorage.getItem("BranchId") || "1"),
                p_type: encryptData("1")
            };

            const response = await $.ajax({
                url: "/api/LegalAudit/Proc_new_RIIM_Legal_Details",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(req)
            });

            console.log("API Response Received:", response);

            const decrypted = decryptData(response);
            console.log("Decrypted Data:", decrypted);

            if (!decrypted) {
                $status.text("Error: Could not decrypt API response.");
                return;
            }

            const json = JSON.parse(decrypted);

            // Handle both stringified and object versions of outdata
            let finalData = json.outdata;
            if (typeof finalData === 'string') {
                finalData = JSON.parse(finalData);
            }

            // Ensure we are targeting the right table array
            const rows = finalData.Table || (Array.isArray(finalData) ? finalData : []);

            $body.empty();
            if (rows.length === 0) {
                $body.append('<tr><td colspan="4" class="text-center py-5 text-muted">No records found.</td></tr>');
            } else {
                rows.forEach(item => {
                    $body.append(`
                        <tr>
                            <td class="ps-4"><input type="checkbox" class="form-check-input"></td>
                            <td>
                                <div class="fw-bold text-dark">${item.CUST_NAME || 'N/A'}</div>
                                <div class="small text-muted">ID: ${item.CUST_ID || '--'}</div>
                            </td>
                            <td><span class="badge bg-light text-dark border">${item.PLEDGE_NO || '--'}</span></td>
                            <td class="text-end pe-4 fw-bold text-danger">₹${parseFloat(item.LOSS || 0).toLocaleString('en-IN')}</td>
                        </tr>
                    `);
                });
            }

            $status.text("Success: Loaded " + rows.length + " records.");
            $('#rowCount').text(rows.length + " Records found");

        } catch (err) {
            console.error("AJAX Error:", err);
            $status.text("Error: API returned " + (err.status || "Connection Failed"));
        }
    });
});