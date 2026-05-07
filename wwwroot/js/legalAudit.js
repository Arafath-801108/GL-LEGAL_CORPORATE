///* File: wwwroot/js/legalAudit.js */
//(function () {
//    const at = "\x40";
//    const KEY = "Anu||" + at + at + "thattu*#0770||^TTT";

//    window.encryptData = function (txt) {
//        if (!txt) return "";
//        const k = CryptoJS.enc.Utf8.parse(KEY);
//        const v = CryptoJS.enc.Utf8.parse("\0".repeat(16));
//        return CryptoJS.AES.encrypt(txt.toString(), k, {
//            iv: v, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
//        }).toString();
//    };

//    window.decryptData = function (cipher) {
//        try {
//            if (!cipher) return "";
//            // Fix: Ensure cipher is a string before replacing quotes
//            let cipherStr = (typeof cipher === 'string') ? cipher : JSON.stringify(cipher);
//            cipherStr = cipherStr.replace(/^"|"$/g, '');

//            const k = CryptoJS.enc.Utf8.parse(KEY);
//            const v = CryptoJS.enc.Utf8.parse("\0".repeat(16));
//            const bytes = CryptoJS.AES.decrypt(cipherStr, k, {
//                iv: v, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
//            });
//            return bytes.toString(CryptoJS.enc.Utf8);
//        } catch (e) {
//            console.error("Decryption failed:", e);
//            return "";
//        }
//    };
//})();

//$(function () {
//    $('#btnSearch').on('click', async function () {
//        const $status = $('#statusText');
//        const $body = $('#gBody');

//        $status.text("Connecting to API...");
//        console.log("Search initiated...");

//        try {
//            const req = {
//                flag: 1,
//                indata: encryptData($('#pInput').val() || "0"),
//                employeeId: encryptData(sessionStorage.getItem("EmployeeId") || "364625"),
//                branch: encryptData(sessionStorage.getItem("BranchId") || "1"),
//                p_type: encryptData("1")
//            };

//            const response = await $.ajax({
//                url: "/api/LegalAudit/Proc_new_RIIM_Legal_Details",
//                type: "POST",
//                contentType: "application/json",
//                data: JSON.stringify(req)
//            });

//            console.log("API Response Received:", response);

//            const decrypted = decryptData(response);
//            console.log("Decrypted Data:", decrypted);

//            if (!decrypted) {
//                $status.text("Error: Could not decrypt API response.");
//                return;
//            }

//            const json = JSON.parse(decrypted);

//            // Handle both stringified and object versions of outdata
//            let finalData = json.outdata;
//            if (typeof finalData === 'string') {
//                finalData = JSON.parse(finalData);
//            }

//            // Ensure we are targeting the right table array
//            const rows = finalData.Table || (Array.isArray(finalData) ? finalData : []);

//            $body.empty();
//            if (rows.length === 0) {
//                $body.append('<tr><td colspan="4" class="text-center py-5 text-muted">No records found.</td></tr>');
//            } else {
//                rows.forEach(item => {
//                    $body.append(`
//                        <tr>
//                            <td class="ps-4"><input type="checkbox" class="form-check-input"></td>
//                            <td>
//                                <div class="fw-bold text-dark">${item.CUST_NAME || 'N/A'}</div>
//                                <div class="small text-muted">ID: ${item.CUST_ID || '--'}</div>
//                            </td>
//                            <td><span class="badge bg-light text-dark border">${item.PLEDGE_NO || '--'}</span></td>
//                            <td class="text-end pe-4 fw-bold text-danger">₹${parseFloat(item.LOSS || 0).toLocaleString('en-IN')}</td>
//                        </tr>
//                    `);
//                });
//            }

//            $status.text("Success: Loaded " + rows.length + " records.");
//            $('#rowCount').text(rows.length + " Records found");

//        } catch (err) {
//            console.error("AJAX Error:", err);
//            $status.text("Error: API returned " + (err.status || "Connection Failed"));
//        }
//    });
//});
/* File: wwwroot/js/legalAudit.js */
/* File: wwwroot/js/legalAudit.js */
/* File: wwwroot/js/legalAudit.js */
/* File: wwwroot/js/legalAudit.js */

// 1. The Secure Handshake Logic (Matched to your working console script)
$(function () {
    const at = String.fromCharCode(64);
    const KEY = "Anu||" + at + at + "thattu*#0770||^TTT";

    // --- ENCRYPTION ---
    function encryptAES(txt) {
        if (!txt) return "";
        const k = CryptoJS.enc.Utf8.parse(KEY);
        const v = CryptoJS.enc.Utf8.parse("\0".repeat(16));
        return CryptoJS.AES.encrypt(txt.toString(), k, {
            iv: v, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
        }).toString();
    }

    // --- DECRYPTION ---
    function decryptAES(cipher) {
        try {
            if (!cipher) return "";
            let str = cipher.toString().replace(/^"|"$/g, '').trim();
            const k = CryptoJS.enc.Utf8.parse(KEY);
            const v = CryptoJS.enc.Utf8.parse("\0".repeat(16));
            const bytes = CryptoJS.AES.decrypt(str, k, {
                iv: v, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
            });
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            alert("❌ DECRYPTION CRITICAL ERROR: " + e.message);
            return "";
        }
    }

    // --- BUTTON CLICK ---
    $('#btnSearch').on('click', function () {
        // ALERT 1
        alert("🔍 STEP 1: Search Button Clicked!");

        const queryValue = $('#pInput').val() || "0328560730000906";

        // ALERT 2
        alert("🔒 STEP 2: Encrypting Payload for: " + queryValue);

        const payload = {
            flag: 1,
            indata: encryptAES(queryValue),
            employeeId: encryptAES("364625"),
            branch: "1",
            p_type: "SEARCH"
        };

        console.log("%c 🔍 FETCHING DATA... ", "background: #222; color: #fff");

        $.ajax({
            url: "https://localhost:7161/api/LegalAudit/Proc_new_RIIM_Legal_Details",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function (res) {
                // ALERT 3
                alert("📡 STEP 3: SERVER RESPONDED! (Status: 200 OK)");
                console.log("%c ✅ SERVER RESPONDED ", "color: green; font-weight: bold;");

                try {
                    // ALERT 4
                    alert("🔓 STEP 4: Attempting Decryption...");

                    let decrypted = (typeof decryptAES === "function") ? decryptAES(res) : res;
                    let finalJson = JSON.parse(decrypted);

                    // Accessing Table
                    const tableData = JSON.parse(finalJson.outdata).Table;

                    // ALERT 5
                    alert("🏆 STEP 5: Success! Found " + tableData.length + " rows in Oracle.");
                    console.table(tableData);

                    // Update UI
                    $('#gBody').empty();
                    tableData.forEach(item => {
                        $('#gBody').append(`
                            <tr>
                                <td class="ps-4"><input type="checkbox" class="form-check-input"></td>
                                <td><b>${item.CUST_NAME}</b><br><small>ID: ${item.CUST_ID}</small></td>
                                <td>${item.PLEDGE_NO}</td>
                                <td class="text-end pe-4 fw-bold text-danger">₹${item.LOSS}</td>
                            </tr>
                        `);
                    });
                    $('#statusText').text("✅ SYNCHRONIZED").css("color", "#0be881");

                } catch (err) {
                    alert("⚠️ DATA ERROR: Received data but failed to parse. Check console.");
                    console.error(err);
                }
            },
            error: function (xhr) {
                // ALERT ERROR
                alert("❌ API CONNECTION ERROR!\nStatus: " + xhr.status + "\nCheck if API is running on Port 7161.");
                console.error("❌ API ERROR:", xhr.responseText);
            }
        });
    });
});