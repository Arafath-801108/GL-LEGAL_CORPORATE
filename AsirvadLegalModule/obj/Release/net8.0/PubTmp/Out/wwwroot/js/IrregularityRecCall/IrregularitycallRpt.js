$(document).ready(async function () {

    checkAccess("36");
    
});


$(document).on('change', '#fmDate', function () {
    validateDates();
});

$(document).on('change', '#toDate', function () {
    validateDates();
});

$(document).on('click', '#generateReport', function () {
    _Report.IrregularityCallDetails();
});

$(document).on('click', '#excelReport', function () {
    _Report.excelconvertreport();
});

$(document).on('click', '#exitButton', function () {
    redirectToDashboard();
});


var _Report = {
    async IrregularityCallDetails() {
        try {
            const fromdt = document.getElementById("fmDate").value;
            const todt = document.getElementById("toDate").value;
            const formattedFromDate = formatDate(fromdt);
            const formattedToDate = formatDate(todt);
            if (!fromdt || !todt) {
                await showAlert("Alert!", "Please Select Both Dates Before Clicking Generate Report....", "warning");

                return false;
            }
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(formattedFromDate + " ~ " + formattedToDate),
                as_optflag: encryptAES("11")
            };


            var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            console.log(responseData);
            debugger;
            if (responseData.err_code === "1") {
                document.getElementById("div_rpt").style.display = "block";
                
                const outdata = JSON.parse(responseData.outdata);
                // Populate table
                const tbody = document.getElementById("reportTable");
                tbody.innerHTML = ''; // Clear previous content

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(data => {
                        const row = document.createElement("tr");

                        const fields = [
                            'REC_ID', 'ZONAL_NAME', 'AREA_NAME', 'BRANCH_ID', 'CUST_ID', 'CUST_NAME',
                            'PLEDGE_NO', 'AMOUNT', 'FIRST_DATE', 'FIRST_RMK', 'SECOND_DATE', 'SECOND_RMK',
                            'HOME_DATE', 'HOME_RMK', 'CUS_STATUS', 'PLEDGESTS'
                        ];

                        // Create data cells
                        fields.forEach(field => {
                            const cell = document.createElement("td");
                            cell.textContent = data[field] || '-';
                            row.appendChild(cell);
                        });

                        // Create action buttons
                        const actions = [
                            { handler: _Report.firstFunction, label: 'Click Here' },
                            { handler: _Report.secondFunction, label: 'Click Here' }
                        ];

                        actions.forEach(action => {
                            const cell = document.createElement("td");
                            const button = document.createElement("button");
                            button.type = "button";
                            button.textContent = action.label;
                            button.addEventListener("click", () => action.handler(data.REC_ID, data.CUST_ID));
                            cell.appendChild(button);
                            row.appendChild(cell);
                        });

                        tbody.appendChild(row);
                    });

                } else {
                    const row = document.createElement("tr");
                    row.innerHTML = `<td colspan="12" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                    tbody.appendChild(row);
                }
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },
    async excelconvertreport() {
        debugger;
        const table = document.getElementById("dataTable1");
        if (!table) {
            await showAlert("Alert", "Table not found!", "warning");
            return;
        }
        const tbody = document.getElementById("reportTable");

        // Check if tbody exists and has no rows
        if (!tbody || tbody.rows.length === 0) {

            await showAlert("Alert", "There is no data to download!", "warning");
            return;
        }
        // Convert table to a worksheet
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Irregularity call Report");

        // Export to Excel file
        XLSX.writeFile(workbook, "Irregularity call Report.xlsx");
    },
    firstFunction: async function (y,x) {
       
        var input = y +"~"+x;
       
        try {
            const requestData = {

                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(input),
                as_optflag: encryptAES("46")

            };

            /* pdfview was written in LegalNotice Controller*/
            var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            const parsedData = JSON.parse(data);
            const table = parsedData.Table?.[0];
            
            if (!table || !table.HOME_DOC1 || !table.DOC1_EXT) {
                await showAlert("Alert!", "No Document to Download....", "warning");
                return;
            }
            const base64String = table.HOME_DOC1;
            const extension = table.DOC1_EXT.toLowerCase(); // e.g., "pdf", "docx", "xlsx"

            // Convert Base64 to Blob
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);

            // Determine MIME type based on extension
            const mimeTypes = {
                pdf: "application/pdf",
                docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                doc: "application/msword",
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                xls: "application/vnd.ms-excel"
            };
            const mimeType = mimeTypes[extension] || "application/octet-stream";

            const blob = new Blob([byteArray], { type: mimeType });

            // Trigger download
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Document1.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Error fetching documents:", error);
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }
    },
    secondFunction: async function (y,x) {
       
        var input = y + "~" + x;
        
        try {
            const requestData = {

                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(input),
                as_optflag: encryptAES("47")

            };

            /* pdfview was written in LegalNotice Controller*/
            var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            const parsedData = JSON.parse(data);
            const table = parsedData.Table?.[0];

            if (!table || !table.HOME_DOC2 || !table.DOC2_EXT) {
                await showAlert("Alert!", "No Document to Download....", "warning");
                return;
            }
            const base64String = table.HOME_DOC2;
            const extension = table.DOC2_EXT.toLowerCase(); // e.g., "pdf", "docx", "xlsx"

            // Convert Base64 to Blob
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);

            // Determine MIME type based on extension
            const mimeTypes = {
                pdf: "application/pdf",
                docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                doc: "application/msword",
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                xls: "application/vnd.ms-excel"
            };
            const mimeType = mimeTypes[extension] || "application/octet-stream";

            const blob = new Blob([byteArray], { type: mimeType });

            // Trigger download
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Document2.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Error fetching documents:", error);
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }
    },
   
}
function formatDate(inputDate) {
    let date = new Date(inputDate);
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date.getDate().toString().padStart(2, '0');
    let month = monthNames[date.getMonth()]; // Get month abbreviation
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

async function validateDates() {
    const fromdtElement = document.getElementById("fmDate");
    const todtElement = document.getElementById("toDate");

    const fromdt = fromdtElement.value;
    const todt = todtElement.value;

    const fromDate = new Date(fromdt);
    const toDate = new Date(todt);
    const today = new Date();

    // Ensure "From Date" and "To Date" are not in the future
    if (fromDate > today || toDate > today) {
        await showAlert("Alert!", "Future dates are not allowed....", "warning");
        fromdtElement.value = "";
        todtElement.value = "";
        return false;
    }

    // Ensure "To Date" is not earlier than "From Date"
    if (toDate < fromDate) {
        await showAlert("Alert!", "To Date cannot be earlier than From Date...", "warning");

        todtElement.value = "";
        return false;
    }

    return true; // Validation passed
}
