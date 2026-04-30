document.addEventListener("DOMContentLoaded", function () {
    checkAccess("53");
    const form = document.getElementById("reportForm");
    const resultsDiv = document.getElementById("reportResults");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;

        if (!fromDate || !toDate) {
            await showAlert("Alert!","Please select From Date, To Date.", "warning");
            return;
        }

        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            p_indata: encryptAES(`${fromDate}~${toDate}`), // pass dates as tilde-separated string
            as_optflag: encryptAES("5") // example flag for report
        };

        let res = await fetch("/getExplReport", "POST", requestData);
        res = decryptAES(res); // if encryption/decryption is used
        const docs = JSON.parse(res);

        resultsDiv.innerHTML = "";
        if (docs.length === 0) {
            resultsDiv.innerHTML = "<p>No documents found for the selected range.</p>";
        } else {
            let html = "<table><thead><tr><th>Customer ID</th><th>Customer Name</th><th>Branch Name</th><th>Division Name</th><th>Area Name</th><th>RM Updated Date</th><th>Document</th><th>Type</th></tr></thead><tbody>";
            docs.forEach(doc => {
                //const fileUrl = `data:${doc.doc_type};base64,${doc.document}`;
                //if (doc.doc_type.startsWith("image/")) {
                    html += `<tr>
                            <td>${doc.cust_id}</td>
                            <td>${doc.cust_name}</td>
                            <td>${doc.branch_name}</td>
                            <td>${doc.div_name}</td>
                            <td>${doc.area_name}</td>
                            <td>${doc.rm_date}</td>
                            <td><button class="view-btn" data-base64="${doc.document}" data-type="${doc.doc_type}">View</button></td>
                            <td>${doc.doc_type}</td>
                         </tr>`;
                //} else {
                //    html += `<tr>
                //            <td>${doc.cust_id}</td>
                //            <td>${doc.cust_name}</td>
                //            <td>${doc.branch_name}</td>
                //            <td>${doc.div_name}</td>
                //            <td>${doc.area_name}</td>
                //            <td>${doc.rm_date}</td>
                //            <td><a href="${fileUrl}" download="document">Download</a></td>
                //            <td>${doc.doc_type}</td>
                //         </tr>`;
                //}
            });
            html += "</tbody></table>";
            resultsDiv.innerHTML = html;
        }
    });
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("view-btn")) {
            const base64 = e.target.getAttribute("data-base64");
            const mimeType = e.target.getAttribute("data-type");

            // Decode Base64 → byte array
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create Blob + Object URL
            const blob = new Blob([byteArray], { type: mimeType });
            const url = URL.createObjectURL(blob);

            // Open in new tab
            window.open(url, "_blank");
        }
    });
});
