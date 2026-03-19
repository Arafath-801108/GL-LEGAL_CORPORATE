$(document).ready(async function () {

    checkAccess("21");


});

$(document).on('change', '#fmDate', function () {
    validateDates();
});

$(document).on('change', '#toDate', function () {
    validateDates();
});

$(document).on('click', '#GenerateReport', function () {
    ChReport.ReportDetails();
});

$(document).on('click', '#Excel', function () {
    ChReport.ExportToExcel();
});

$(document).on('click', '#exitButton', function () {
    redirectToDashboard();
});




var ChReport = {
    ReportDetails: async function () {
        document.getElementById("CusReport").style.display = "none";
        document.getElementById("EmpReport").style.display = "none";
        
        const fromdt = document.getElementById("fmDate").value;
        const todt = document.getElementById("toDate").value;
        const formattedFromDate = formatDate(fromdt);
        const formattedToDate = formatDate(todt);
        const Irr = document.getElementById("DrpIrr").value;

        if (!fromdt || !todt) {
            await showAlert("Please Select Both Dates Before Clicking Generate Report.");
            return false;
        }
        if (Irr === "0") {
            await showAlert("Please Select Irregularity Type Before Clicking Generate Report.");
            return false;
        }

        try {
            const requestData = {
                Br_id: sessionStorage.getItem("BranchId"),
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(formattedFromDate + " ~ " + formattedToDate + " ~ " + Irr),
                Flag: encryptAES(37)
            };
            var Res = await fetch("/ChequeReportDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
          
            if (responseData.status === "1") {
                const outdata = JSON.parse(responseData.outdata);
              
                // Excel export function

                if (Irr === "4") {
                    document.getElementById("EmpReport").style.display = "block";

                    // Populate table
                    const tbody = document.getElementById("EmpReportTableBody");
                    tbody.innerHTML = ''; // Clear previous content

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(data => {
                            const row = document.createElement("tr");
                            row.innerHTML = `
                            <td>${data.ZONAL_NAME || '-'}</td>
                            <td>${data.REG_NAME || '-'}</td>
                            <td>${data.AREA_NAME || '-'}</td>
                            <td>${data.BRANCH_NAME || '-'}</td>
                            <td>${data.BRANCH_ID || '-'}</td>
                            <td>${data.EMP_CODE || '-'}</td>
                            <td>${data.EMP_NAME || '-'}</td>
                            <td>${data.DESIGNATION || '-'}</td>
                            <td>${data.AMOUNT || '-'}</td>
                            <td>${data.DISCONT_DT || '-'}</td>
                            <td>${data.IRREGULARITY_TYPE || '-'}</td>
                            <td>${data.IRREGULARITY_STATUS || '-'}</td>
                            <td>${data.CHEQUE_STATUS || '-'}</td>
                            <td>${data.CHEQUE_REASON || '-'}</td>
                             <td>${data.CHEQUE_DT || '-'}</td>
                            <td>${data.ENTERED_DT || '-'}</td>
                            <td>${data.ENTERED_BY || '-'}</td>
                           <td>${data.STATUS || '-'}</td>
                           <td>${data.AMRH_EMP || '-'}</td>
                            <td>${data.AMRH_DT || '-'}</td>
                            <td>${data.CHALLAN_UPD_BY || '-'}</td>
                            <td>${data.CHALLAN_UPD_DT || '-'}</td>
                            <td>${data.CHALLAN_DT || '-'}</td>
                            <td>${data.CHALLAN_VER_BY || '-'}</td>
                            <td>${data.CHALLAN_VER_DT || '-'}</td>
                            <td>${data.CHEQ_STS_UPD_BY || '-'}</td>
                            <td>${data.CHEQ_STS_UPD_DT || '-'}</td>
                            <td>${data.CHEQ_STS || '-'}</td>
                            <td>${data.CHEQ_STS_VER_BY || '-'}</td>
                            <td>${data.CHEQ_STS_VER_DT || '-'}</td>
                            <td><button onclick="handleFileDownload('${data.CHEQUE_DOC || ''}', 'cheque.pdf')" class="btn btn-link">Download</button></td>
                            <td><button onclick="handleFileDownload('${data.CHALLAN_DOC || ''}', 'challan.pdf')" class="btn btn-link">Download</button></td>
                            <td><button onclick="handleFileDownload('${data.BOUNCE_CHE_DOC || ''}', 'bounce.pdf')" class="btn btn-link">Download</button></td>
                            <td><button onclick="handleFileDownload('${data.STATEMENT_DOC || ''}', 'return.pdf')" class="btn btn-link">Download</button></td>

                        `;
                            /*//    ENTERED_BY ? new Date(data.SEIZURED_DATE).toLocaleDateString() : '-'}</td>*/
                            tbody.appendChild(row);
                        });


                    } else {
                       
                        document.getElementById("EmpReport").style.display = "none";
                        await showAlert("No data available for the selected criteria.");
                        return;
                    }
                }

                else {
                    document.getElementById("CusReport").style.display = "block";
                    const auctionHeader = document.getElementById("auctionDateHeader");
                    if (["1", "2", "5"].includes(Irr)) {
                        auctionHeader.textContent = "IRREGULARITY UPDATED DATE";
                    } else {
                        auctionHeader.textContent = "AUCTION DATE";
                    }
                    // Populate table
                    const tbody = document.getElementById("CusReportTableBody");
                    tbody.innerHTML = ''; // Clear previous content

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(data => {
                            const row = document.createElement("tr");
                            row.innerHTML = `
                            <td>${data.ZONAL_NAME || '-'}</td>
                            <td>${data.REG_NAME || '-'}</td>
                            <td>${data.AREA_NAME || '-'}</td>
                            <td>${data.BRANCH_NAME || '-'}</td>
                            <td>${data.BRANCH_ID || '-'}</td>
                            <td>${data.CUST_ID || '-'}</td>
                            <td>${data.CUST_NAME || '-'}</td>
                            <td>${data.PLEDGE_NO || '-'}</td>
                            <td>${data.IRREGULARITY_TYPE || '-'}</td>
                            <td>${data.STATUS || '-'}</td>
                            <td>${data.INVOICE_DT || '-'}</td>
                             <td>${data.ACT_WEIGHT || '-'}</td>
                              <td>${data.ACTUAL_LOSS || '-'}</td>
                            <td>${data.CHEQUE_STATUS || '-'}</td>
                            <td>${data.CHEQUE_REASON || '-'}</td>
                             <td>${data.CHEQUE_DT || '-'}</td>
                            <td>${data.ENTERED_DT || '-'}</td>
                            <td>${data.ENTERED_BY || '-'}</td>
                           <td>${data.STATUS1 || '-'}</td>
                           <td>${data.AMRH_EMP || '-'}</td>
                            <td>${data.AMRH_DT || '-'}</td>
                            <td>${data.CHALLAN_UPD_BY || '-'}</td>
                            <td>${data.CHALLAN_UPD_DT || '-'}</td>
                            <td>${data.CHALLAN_DT || '-'}</td>
                            <td>${data.CHALLAN_VER_BY || '-'}</td>
                            <td>${data.CHALLAN_VER_DT || '-'}</td>
                            <td>${data.CHEQ_STS_UPD_BY || '-'}</td>
                            <td>${data.CHEQ_STS_UPD_DT || '-'}</td>
                            <td>${data.CHEQ_STS || '-'}</td>
                            <td>${data.CHEQ_STS_VER_BY || '-'}</td>
                            <td>${data.CHEQ_STS_VER_DT || '-'}</td>
                             <td><button onclick="handleFileDownload('${data.CHEQUE_DOC || ''}', 'cheque.pdf')" class="btn btn-link">Download</button></td>
                            <td><button onclick="handleFileDownload('${data.CHALLAN_DOC || ''}', 'challan.pdf')" class="btn btn-link">Download</button></td>
                            <td><button onclick="handleFileDownload('${data.BOUNCE_CHE_DOC || ''}', 'bounce.pdf')" class="btn btn-link">Download</button></td>
                            <td><button onclick="handleFileDownload('${data.STATEMENT_DOC || ''}', 'return.pdf')" class="btn btn-link">Download</button></td>
                        `;
                            /*//    ENTERED_BY ? new Date(data.SEIZURED_DATE).toLocaleDateString() : '-'}</td>*/
                            tbody.appendChild(row);
                        });


                    }
                    else {
                        document.getElementById("CusReport").style.display = "none";
                        await showAlert("No data available for the selected criteria.");
                        return;
                    }
                }
            }
            
             else {
                await showAlert("Alert!", "Unable to load Details..", "warning");

            }
        }

        catch (error) {
           
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }
    },



    ExportToExcel: async function () {
       
        const fromdt = document.getElementById("fmDate").value;
        const todt = document.getElementById("toDate").value;
        const formattedFromDate = formatDate(fromdt);
        const formattedToDate = formatDate(todt);
        const Irr = document.getElementById("DrpIrr").value;

        if (!fromdt || !todt) {
            await showAlert("Please Select Both Dates Before Clicking Excel.");
            return false;
        }
        if (Irr === "-1") {
            await showAlert("Please Select Irregularity Type Before Clicking Excel.");
            return false;
        }


        try {
            const requestData = {
                Br_id: sessionStorage.getItem("BranchId"),
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(formattedFromDate + " ~ " + formattedToDate + " ~ " + Irr),
                Flag: encryptAES(37)
            };
            var Res = await fetch("/ChequeReportDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
           
            if (responseData.status === "1") {
                const outdata = JSON.parse(responseData.outdata);
                

                // Check if outdata is available and valid
                if (!outdata || !outdata.Table || !Array.isArray(outdata.Table) || outdata.Table.length === 0) {
                    await showAlert("No data available to export.");
                    return;
                }

                const data = outdata.Table;
                let headers, rows;

                if (Irr === "4") {
                    // Employee Report
                    headers = [
                        "ZONAL_NAME", "REG_NAME", "AREA_NAME", "BRANCH_NAME", "BRANCH_ID",
                        "EMP_CODE", "EMP_NAME", "DESIGNATION", "AMOUNT", "DISCONT_DT",
                        "IRREGULARITY_TYPE", "IRREGULARITY_STATUS", "CHEQUE_STATUS", "CHEQUE_REASON",
                        "CHEQUE_DT", "ENTERED_DT", "ENTERED_BY", "STATUS", "AMRH_EMP",
                        "AMRH_DT", "CHALLAN_UPD_BY", "CHALLAN_UPD_DT", "CHALLAN_DT",
                        "CHALLAN_VER_BY", "CHALLAN_VER_DT", "CHEQ_STS_UPD_BY", "CHEQ_STS_UPD_DT",
                        "CHEQ_STS", "CHEQ_STS_VER_BY", "CHEQ_STS_VER_DT"
                    ];

                    rows = data.map(item => ({
                        ZONAL_NAME: item.ZONAL_NAME || '-',
                        REG_NAME: item.REG_NAME || '-',
                        AREA_NAME: item.AREA_NAME || '-',
                        BRANCH_NAME: item.BRANCH_NAME || '-',
                        BRANCH_ID: item.BRANCH_ID || '-',
                        EMP_CODE: item.EMP_CODE || '-',
                        EMP_NAME: item.EMP_NAME || '-',
                        DESIGNATION: item.DESIGNATION || '-',
                        AMOUNT: item.AMOUNT || '-',
                        DISCONT_DT: item.DISCONT_DT || '-',
                        IRREGULARITY_TYPE: item.IRREGULARITY_TYPE || '-',
                        IRREGULARITY_STATUS: item.IRREGULARITY_STATUS || '-',
                        CHEQUE_STATUS: item.CHEQUE_STATUS || '-',
                        CHEQUE_REASON: item.CHEQUE_REASON || '-',
                        CHEQUE_DT: item.CHEQUE_DT || '-',
                        ENTERED_DT: item.ENTERED_DT || '-',
                        ENTERED_BY: item.ENTERED_BY || '-',
                        STATUS: item.STATUS || '-',
                        AMRH_EMP: item.AMRH_EMP || '-',
                        AMRH_DT: item.AMRH_DT || '-',
                        CHALLAN_UPD_BY: item.CHALLAN_UPD_BY || '-',
                        CHALLAN_UPD_DT: item.CHALLAN_UPD_DT || '-',
                        CHALLAN_DT: item.CHALLAN_DT || '-',
                        CHALLAN_VER_BY: item.CHALLAN_VER_BY || '-',
                        CHALLAN_VER_DT: item.CHALLAN_VER_DT || '-',
                        CHEQ_STS_UPD_BY: item.CHEQ_STS_UPD_BY || '-',
                        CHEQ_STS_UPD_DT: item.CHEQ_STS_UPD_DT || '-',
                        CHEQ_STS: item.CHEQ_STS || '-',
                        CHEQ_STS_VER_BY: item.CHEQ_STS_VER_BY || '-',
                        CHEQ_STS_VER_DT: item.CHEQ_STS_VER_DT || '-'
                    }));
                } else {
                    // Customer Report
                    headers = [
                        "ZONAL_NAME", "REG_NAME", "AREA_NAME", "BRANCH_NAME", "BRANCH_ID",
                        "CUST_ID", "CUST_NAME", "PLEDGE_NO", "IRREGULARITY_TYPE", "IRREGULARITY_STATUS",
                        ["1", "2", "5"].includes(Irr) ? "IRREGULARITY_UPDATED_DATE" : "INVOICE_DT", // Dynamic header
                        "ACT_WEIGHT", "ACTUAL_LOSS", "CHEQUE_STATUS", "CHEQUE_REASON",
                        "CHEQUE_DT", "ENTERED_DT", "ENTERED_BY", "STATUS", "AMRH_EMP",
                        "AMRH_DT", "CHALLAN_UPD_BY", "CHALLAN_UPD_DT", "CHALLAN_DT",
                        "CHALLAN_VER_BY", "CHALLAN_VER_DT", "CHEQ_STS_UPD_BY", "CHEQ_STS_UPD_DT",
                        "CHEQ_STS", "CHEQ_STS_VER_BY", "CHEQ_STS_VER_DT"
                    ];

                    rows = data.map(item => ({
                        ZONAL_NAME: item.ZONAL_NAME || '-',
                        REG_NAME: item.REG_NAME || '-',
                        AREA_NAME: item.AREA_NAME || '-',
                        BRANCH_NAME: item.BRANCH_NAME || '-',
                        BRANCH_ID: item.BRANCH_ID || '-',
                        CUST_ID: item.CUST_ID || '-',
                        CUST_NAME: item.CUST_NAME || '-',
                        PLEDGE_NO: item.PLEDGE_NO || '-',
                        IRREGULARITY_TYPE: item.IRREGULARITY_TYPE || '-',
                        IRREGULARITY_STATUS: item.STATUS || '-',
                        INVOICE_DT: item.INVOICE_DT || '-',
                        ACT_WEIGHT: item.ACT_WEIGHT || '-',
                        ACTUAL_LOSS: item.ACTUAL_LOSS || '-',
                        CHEQUE_STATUS: item.CHEQUE_STATUS || '-',
                        CHEQUE_REASON: item.CHEQUE_REASON || '-',
                        CHEQUE_DT: item.CHEQUE_DT || '-',
                        ENTERED_DT: item.ENTERED_DT || '-',
                        ENTERED_BY: item.ENTERED_BY || '-',
                        STATUS: item.STATUS1 || '-',
                        AMRH_EMP: item.AMRH_EMP || '-',
                        AMRH_DT: item.AMRH_DT || '-',
                        CHALLAN_UPD_BY: item.CHALLAN_UPD_BY || '-',
                        CHALLAN_UPD_DT: item.CHALLAN_UPD_DT || '-',
                        CHALLAN_DT: item.CHALLAN_DT || '-',
                        CHALLAN_VER_BY: item.CHALLAN_VER_BY || '-',
                        CHALLAN_VER_DT: item.CHEQ_STS_VER_DT || '-',
                        CHEQ_STS_UPD_BY: item.CHEQ_STS_UPD_BY || '-',
                        CHEQ_STS_UPD_DT: item.CHEQ_STS_UPD_DT || '-',
                        CHEQ_STS: item.CHEQ_STS || '-',
                        CHEQ_STS_VER_BY: item.CHEQ_STS_VER_BY || '-',
                        CHEQ_STS_VER_DT: item.CHEQ_STS_VER_DT || '-'
                    }));
                }

                // Create worksheet
                const ws = XLSX.utils.json_to_sheet(rows, { header: headers });

                // Set column widths
                const colWidths = headers.map(() => ({ wch: 20 }));
                ws['!cols'] = colWidths;

                // Create workbook
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, Irr === "4" ? "Employee Report" : "Customer Report");

                // Generate and download Excel file
                XLSX.writeFile(wb, Irr === "4" ? "Employee_Report.xlsx" : "Customer_Report.xlsx");
            } else {
                await showAlert("Failed to fetch report data.");
            }
        }
        catch (error) {
            
            await showAlert("An error occurred while exporting the report.");

        }

    }
}








// Download file function
async function handleFileDownload(base64String, filename) {
    if (!base64String || base64String.trim() === "" || base64String === "AA==") {
        await showAlert("No document available.");
        return;
    }

    try {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const mimeType = "application/pdf";
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        await showAlert("Error processing document. It might be corrupted or an unsupported format.");
    }
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
        await showAlert("Future dates are not allowed.");
        fromdtElement.value = "";
        todtElement.value = "";
        return false;
    }

    // Ensure "To Date" is not earlier than "From Date"
    if (toDate < fromDate) {
        await showAlert("To Date cannot be earlier than From Date.");
        todtElement.value = "";
        return false;
    }

    return true; // Validation passed
}
