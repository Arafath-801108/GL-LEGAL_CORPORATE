$(document).ready(async function () {
    debugger;
    checkAccess("18");
});

function showAlert(title, text) {
    Swal.fire({
        icon: 'Error',
        title: title,
        text: text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#4caf50'
    }).then((result) => {
        if (result.isConfirmed) {
            /* window.location.href = href;*/
        }
    });
}
function showSuccessAlert(title, text, href) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#4caf50'
    }).then((result) => {
        if (result.isConfirmed) {
            const isDevelopment = window.location.hostname === 'localhost';
            const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';
            window.location.href = liveurl + href;
        }
    });
}



function formatDate(inputDate) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const parts = inputDate.split('-');
    const day = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[2];

    const month = months[monthIndex];

    return `${year}-${month}-${day}`;
}


$(document).on('change', '#FromDate', function () {
    _report.validateDate(this);
});

$(document).on('click', '#btnsearch', function () {
    _report.getdtl(this);
});

$(document).on('change', '#toDate', function () {
    _report.validateDate1(this);
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard(this);
});

$(document).on('click', '#btndownload', function () {
    _report.downloadExcel1(this);
});

$(document).on('click', '#btndownload1', function () {
    _report.downloadExcel(this);
});

var _report = {
    getdtl: async function () {
        debugger;

        if (document.getElementById('drp_report').value == "0") {
            showAlert('Alert!', "Please Select Report ");
            return;
        }
        /*loader_spin();*/
        var FrmDateInput = document.getElementById('FromDate').value;
        var toDateInput = document.getElementById('toDate').value;

        if (!FrmDateInput) {
            showAlert('Alert!', "SELECT FROM DATE");
            return;
        }
        if (!toDateInput) {
            showAlert('Alert!', "SELECT TO DATE");

            return;
        }


        if (document.getElementById('drp_report').value == "0") {
            document.getElementById('second_sub').style.display = "none";
            document.getElementById('second_sub1').style.display = "none";
            showAlert('Alert!', "Please Select Report ");
            return;
        }
        else if (document.getElementById('drp_report').value == "2") {
            document.getElementById('second_sub').style.display = "block";
            document.getElementById('second_sub1').style.display = "none";


            const txtData = [formatDate(FrmDateInput), formatDate(toDateInput)].join('~');
            const requestData = {
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "indata": encryptAES(txtData),
                "BranchId": sessionStorage.getItem("BranchId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "flag": encryptAES("2"),
                "post": sessionStorage.getItem("Post")
            };



            const response = await fetch("/report", "POST", requestData);
            response = decryptAES(response);
            console.log(response);


            const data = JSON.parse(response); // Ensure JSON parsing
            console.log("Parsed Data:", data);


            if (!Array.isArray(data) || data.length === 0) {
                document.getElementById('second_sub').style.display = "none";
                document.getElementById('second_sub1').style.display = "none";
                showAlert("Alert!", "No Data found!");
                return;
            }

            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';




            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                     <td>${item.LEGALID || ''}</td>
                     <td>${item.CUSTOMERNAME || ''}</td>
                     <td>${item.PLEDGENUMBER || ''}</td>
                     <td>${item.BRANCH || ''}</td>
                     <td>${item.STATE || ''}</td>
                     <td>${item.REGIONNAME || ''}</td>
                     <td>${item.TYPEOFITEM || ''}</td>
                     <td>${item.CASE_NO || ''}</td>
                     <td>${item.OPENDATE || ''}</td>
                     <td>${item.DEFERDATE || ''}</td>
                     <td>${item.CLOSEDATE || ''}</td>
                     <td>${item.CUST_ID || ''}</td>
                     <td>${item.REPORTED_DATE || ''}</td>
                     <td>${item.APPROVED_DATE || ''}</td>
                     <td>${item.PLEDGE_DATE || ''}</td>
                     <td>${item.PLEDGE_VAL || ''}</td>
                     <td>${item.BALANCE || ''}</td>
                     <td>${item.ACT_WEIGHT || ''}</td>
                     <td>${item.NET_WEIGHT || ''}</td>
                     <td>${item.STONE_WEIGHT || ''}</td>
                     <td>${item.STATUS || ''}</td>
                     <td>${item.LCUREMARK || ''}</td>
                     <td>${item.DAYS || ''}</td>
                     <td>${item.COMPLAINT_TYPE || ''}</td>
                     <td>${item.GOLD_AVL_PLACE || ''}</td>
                     <td>${item.POLICESTAT_NAME || ''}</td>
                     <td>${item.CURRENT_BRANCH || ''}</td>
                     <td>${item.OTHER_BRANCH_ID || ''}</td>
                     <td>${item.RESON_SUIT_FILE || ''}</td>
                     <td>${item.GOLDINBRANCH || ''}</td>
                     <td>${item.PREVIOUS_ENTERED_OR_NOT || ''}</td>
                     <td>${item.REVIEW_DT || ''}</td>
                     <td>${item.PLEDGE_STATUS || ''}</td>
                     <td>${item.LOSS || ''}</td>
                     <td>${item.IRREGULARITY_TYPE || ''}</td>
                     <td>${item.PURITY || ''}</td>
                     <td>${item.CATEGORY || ''}</td>
                     <td>${item.CASE_STS || ''}</td>
                     <td>${item.REQUESTED_BH || ''}</td>
                     <td>${item.BH_REQUESTED_DATE || ''}</td>
                     <td>${item.RECOMMENDED_AH || ''}</td>
                     <td>${item.AH_RECOMMENDED_DATE || ''}</td>
                     <td>${item.RECOMMENDED_RHA || ''}</td>
                     <td>${item.RHA_RECOMMENDED_DATE || ''}</td>
                     <td>${item.RECOMMENDED_RM || ''}</td>
                     <td>${item.RM_RECOMMENDED_DATE || ''}</td>
                     <td>${item.RECOMMENDED_LM_LO || ''}</td>
                     <td>${item.LM_LO_RECOMMENDED_DATE || ''}</td>
                     <td>${item.APPROVED_HO || ''}</td>
                     <td>${item.HO_APPROVED_DATE || ''}</td>
                       <td>${item.AH_RMK || ''}</td>
                      <td>${item.RHA_RMK || ''}</td>
                      <td>${item.APPR_RMRKS || ''}</td>
                        <td>${item.LO_RMK || ''}</td>
                     <td><button type="button" onclick=" _report.firstFunction('${item.LEGALID}')">Click Here</button></td>
                      <td><button type="button" onclick=" _report.thirdFunction('${item.LEGALID}')">Click Here</button></td>
                    <td><button type="button" onclick=" _report.fourthFunction('${item.LEGALID}')">Click Here</button></td>
                     <td><button type="button" onclick=" _report.secondFunction('${item.LEGALID}')">Click Here</button></td>
                `;
                tableBody.appendChild(row);
            });

        }
        else {
            document.getElementById('second_sub').style.display = "none";
            document.getElementById('second_sub1').style.display = "block";

            const txtData1 = [formatDate(FrmDateInput), formatDate(toDateInput)].join('~');
            const requestData1 = {
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "indata": encryptAES(txtData1),
                "BranchId": sessionStorage.getItem("BranchId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "flag": encryptAES("3"),
                "post": sessionStorage.getItem("Post")

            };



            const response = await fetch("/report", "POST", requestData1);
            response = decryptAES(response);
            console.log(response);


            const data1 = JSON.parse(response); // Ensure JSON parsing
            console.log("Parsed Data:", data1);


            if (!Array.isArray(data1) || data1.length === 0) {
                document.getElementById('second_sub').style.display = "none";
                document.getElementById('second_sub1').style.display = "none";
                showAlert("Alert!", "No Data found!");
                return;
            }

            const tableBody1 = document.getElementById('tableBody1');
            tableBody1.innerHTML = '';

            data1.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                                <td>${item.LEGAL_ID || ''}</td>
                                <td>${item.REC_BRANCH || ''}</td>
                                <td>${item.BRANCH || ''}</td>
                                <td>${item.AREA || ''}</td>
                                <td>${item.REGION || ''}</td>
                                <td>${item.ZONE || ''}</td>
                                <td>${item.PLEDGE_NO || ''}</td>
                                <td>${item.PLEDGE_VAL || ''}</td>
                                <td>${item.STATUS || ''}</td>
                                <td>${item.LOSS || ''}</td>
                                 <td>${item.SFADATE || ''}</td>
                                <td>${item.REMOVEREQUESTEDBY || ''}</td>
                                <td>${item.REMOVEREQUESTEDDATE || ''}</td>
                                <td>${item.REMOVALAPPROVEDBY || ''}</td>
                                <td>${item.REMOVALAPPROVEDDATE || ''}</td>
                               
                               <td><button type="button" onclick=" _report.firstFunction('${item.LEGAL_ID}')">Click Here</button></td>
                                <td><button type="button" onclick=" _report.thirdFunction('${item.LEGAL_ID}')">Click Here</button></td>
                                 <td><button type="button" onclick=" _report.fourthFunction('${item.LEGAL_ID}')">Click Here</button></td>
                                 <td><button type="button" onclick=" _report.secondFunction('${item.LEGAL_ID}')">Click Here</button></td>
                            `;
                tableBody1.appendChild(row);
            });

        }


       


       





    },


    downloadPDF: async function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Legal Notice Report', 14, 15);

        // Add date
        const now = new Date();
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${now.toLocaleDateString()}`, 14, 22);

        const table = document.getElementById("dataTable");
        if (!table) {
            showAlert("Error", "No Data found!");
            return;
        }

        // Extract headers and rows
        const headers = [...table.querySelectorAll("thead th")].map(th => th.innerText.trim());
        const rows = [];
        table.querySelectorAll("tbody tr").forEach(tr => {
            const row = [...tr.querySelectorAll("td")].map(td => td.innerText.trim());
            rows.push(row);
        });

        // Calculate column widths dynamically
        const pageWidth = doc.internal.pageSize.width - 28; // 14mm margin on each side
        const columnWidth = pageWidth / headers.length;

        // Excel-like table with autoTable
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 30,
            theme: 'grid',

            // Styling for Excel appearance
            styles: {
                fontSize: 8,
                cellPadding: 3,
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
                textColor: [0, 0, 0],
                overflow: 'linebreak',
                halign: 'center',
                valign: 'middle'
            },

            // Header styling (Excel blue)
            headStyles: {
                fillColor: [68, 114, 196],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9,
                halign: 'center',
                valign: 'middle'
            },

            // Body styling
            bodyStyles: {
                textColor: [0, 0, 0],
                valign: 'middle',
                halign: 'center'
            },

            // Alternating row colors
            alternateRowStyles: {
                fillColor: [248, 248, 248]
            },

            // Make all columns equal width
            columnStyles: Object.fromEntries(
                headers.map((_, index) => [
                    index,
                    {
                        cellWidth: columnWidth,
                        halign: 'center'
                    }
                ])
            ),

            // Table settings
            margin: { left: 14, right: 14 },
            tableWidth: 'auto',

            // Ensure each row stays on one line
            rowPageBreak: 'avoid',

            // Custom styling for borders
            didDrawCell: function (data) {
                // Add border to each cell
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(0.1);
            }
        });

        // Add total count at the bottom
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Records: ${rows.length}`, 14, finalY);

        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        }

        doc.save('Legal_Notice_Report.pdf');
    },
    downloadExcel: async function () {
        const table = document.getElementById("dataTable");
        if (!table) {
            Swal.fire("Alert", "Table not found!", "error");
            return;
        }

        // Convert table to a worksheet
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Suit File Report");

        // Export to Excel file
        XLSX.writeFile(workbook, "Suit File Report.xlsx");
    },

    validateDate: async function () {
        var dateInput = document.getElementById("FromDate").value;
        var dateInput1 = document.getElementById("toDate").value;


        if (dateInput === "") {
            showAlert("Alert!", "Please Select FROM Date..!!");
            return;
        }

        var tdate = new Date(dateInput1);
        var fdate = new Date(dateInput);
        var today = new Date();
        if (fdate > today) {
            showAlert("Alert!", "From Date cannot be in the future..!!");
            document.getElementById("FromDate").value = "";
            return;
        }



    },

    validateDate1: async function () {
        var dateInput = document.getElementById("FromDate").value;
        var dateInput1 = document.getElementById("toDate").value;



        if (dateInput1 === "") {
            showAlert("Alert!", "Please Select To Date..!!");
            return;
        }
        var tdate = new Date(dateInput1);
        var fdate = new Date(dateInput);
        var today = new Date();


        if (tdate > today) {
            showAlert("Alert!", "To Date cannot be in the future..!!");
            document.getElementById("toDate").value = "";
            return;
        }
        if (fdate > tdate) {
            showAlert("Alert!", "From Date cannot be Greater than To Date..!!");
            document.getElementById("toDate").value = "";
            document.getElementById("FromDate").value = "";
            return;
        }


    },
    secondFunction: async function (x) {
        debugger;
var legilId = x;
try {
    const requestData = {

        "Emp_id": sessionStorage.getItem("EmployeeId"),
        "Encrypted_data": sessionStorage.getItem("BranchId"),
        "Token": sessionStorage.getItem("Token"),
        "Indata": encryptAES(legilId),
        "Flag": encryptAES("42")

    };

    /* pdfview was written in LegalNotice Controller*/
    var Res = await fetch("/pdfdown1", "POST", requestData);
    Res = decryptAES(Res);
    let data = JSON.parse(Res).outdata;
    if (!data || data.length == 0) {
        showAlert("Alert!","No pdf to Download..");
       
        return;
    }
    let mimeType = getFileType(data);
    let fileExtension = getFileExtension(mimeType);
    let downloadLink = document.createElement("a");
    downloadLink.href = `data:${mimeType};base64,${data}`;
    downloadLink.download = `Document.${fileExtension}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);



    function getFileType(base64String) {
        if (base64String.startsWith("/9j")) return "image/jpeg"; // JPG
        if (base64String.startsWith("iVBORw0")) return "image/png"; // PNG
        if (base64String.startsWith("JVBER")) return "application/pdf"; // PDF
        return "application/octet-stream"; // Default (DOC, etc.)
    }

    function getFileExtension(mimeType) {
        switch (mimeType) {
            case "image/jpeg":
                return "jpg";
            case "image/png":
                return "png";
            case "application/pdf":
                return "pdf";
            default:
                return "bin"; // Default for unknown types
        }
    }
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

    firstFunction: async function (y) {
        debugger;
        var legilId = y;
        try {
            const requestData = {

                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata": encryptAES(legilId),
                "Flag": encryptAES("43")

            };

            /* pdfview was written in LegalNotice Controller*/
            var Res = await fetch("/pdfdown1", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length == 0) {
                showAlert("Alert!", "No pdf to Download..");
                return;
            }
            let mimeType = getFileType(data);
            let fileExtension = getFileExtension(mimeType);
            let downloadLink = document.createElement("a");
            downloadLink.href = `data:${mimeType};base64,${data}`;
            downloadLink.download = `Document.${fileExtension}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);



            function getFileType(base64String) {
                if (base64String.startsWith("/9j")) return "image/jpeg"; // JPG
                if (base64String.startsWith("iVBORw0")) return "image/png"; // PNG
                if (base64String.startsWith("JVBER")) return "application/pdf"; // PDF
                return "application/octet-stream"; // Default (DOC, etc.)
            }

            function getFileExtension(mimeType) {
                switch (mimeType) {
                    case "image/jpeg":
                        return "jpg";
                    case "image/png":
                        return "png";
                    case "application/pdf":
                        return "pdf";
                    default:
                        return "bin"; // Default for unknown types
                }
            }
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

    fourthFunction: async function (y) {
        debugger;
        var legilId = y;
        try {
            const requestData = {

                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata": encryptAES(legilId),
                "Flag": encryptAES("45")

            };

            /* pdfview was written in LegalNotice Controller*/
            var Res = await fetch("/pdfdown1", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length == 0) {
                showAlert("Alert!", "No pdf to Download..");
                return;
            }
            let mimeType = getFileType(data);
            let fileExtension = getFileExtension(mimeType);
            let downloadLink = document.createElement("a");
            downloadLink.href = `data:${mimeType};base64,${data}`;
            downloadLink.download = `Document.${fileExtension}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);



            function getFileType(base64String) {
                if (base64String.startsWith("/9j")) return "image/jpeg"; // JPG
                if (base64String.startsWith("iVBORw0")) return "image/png"; // PNG
                if (base64String.startsWith("JVBER")) return "application/pdf"; // PDF
                return "application/octet-stream"; // Default (DOC, etc.)
            }

            function getFileExtension(mimeType) {
                switch (mimeType) {
                    case "image/jpeg":
                        return "jpg";
                    case "image/png":
                        return "png";
                    case "application/pdf":
                        return "pdf";
                    default:
                        return "bin"; // Default for unknown types
                }
            }
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
    thirdFunction: async function (x) {
        debugger;
        var legilId = x;
        try {
            const requestData = {

                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata": encryptAES(legilId),
                "Flag": encryptAES("44")

            };

            /* pdfview was written in LegalNotice Controller*/
            var Res = await fetch("/pdfdown1", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length == 0) {
                showAlert("Alert!", "No pdf to Download..");

                return;
            }
            let mimeType = getFileType(data);
            let fileExtension = getFileExtension(mimeType);
            let downloadLink = document.createElement("a");
            downloadLink.href = `data:${mimeType};base64,${data}`;
            downloadLink.download = `Document.${fileExtension}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);



            function getFileType(base64String) {
                if (base64String.startsWith("/9j")) return "image/jpeg"; // JPG
                if (base64String.startsWith("iVBORw0")) return "image/png"; // PNG
                if (base64String.startsWith("JVBER")) return "application/pdf"; // PDF
                return "application/octet-stream"; // Default (DOC, etc.)
            }

            function getFileExtension(mimeType) {
                switch (mimeType) {
                    case "image/jpeg":
                        return "jpg";
                    case "image/png":
                        return "png";
                    case "application/pdf":
                        return "pdf";
                    default:
                        return "bin"; // Default for unknown types
                }
            }
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
    downloadExcel1: async function () {
        const table = document.getElementById("dataTable1");
        if (!table) {
            Swal.fire("Alert", "Table not found!", "error");
            return;
        }

        // Convert table to a worksheet
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Suit File Remove Report");

        // Export to Excel file
        XLSX.writeFile(workbook, "Suit File Remove Report.xlsx");
    },









}


