$(document).ready(async function () {
 
    checkAccess("32");
});

$(document).on('click', '#search', function () {
    _report.getdtl();
});
$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});
$(document).on('click', '#Excel', function () {
    _report.downloadExcel();
});

$(document).on('click', '#Excel1', function () {
    _report.downloadExcel1();
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
            const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';
            window.location.href = liveurl + href;
        }
    });
}


var _report = {

    getdtl: async function () {
      
        document.getElementById('second_sub1').style.display = "none";
        document.getElementById('second_sub').style.display = "none";
        

        if (document.getElementById('drp_report').value == "") {
           
            showAlert('Alert!', "Please Enter Pledge Number..! ");
            return;
        }
        if (document.getElementById('drp_report').value.length < 16) {
            await showAlert("Alert!", "Please Enter Pledge Number of 16 Number..!!");
            return;
        }
       

        const txtData = document.getElementById('drp_report').value;
            const requestData = {
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "indata": encryptAES(txtData),
                "BranchId": sessionStorage.getItem("BranchId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "flag": encryptAES("4")

            };



            const response = await fetch("/report", "POST", requestData);
           
        response = decryptAES(response);
            const data = JSON.parse(response); // Ensure JSON parsing
           

            if (!Array.isArray(data) || data.length === 0) {
                
              
                document.getElementById('drp_report').value = '';
                showAlert("Alert!", "No Data found!.Please Check Pledge Number.");
                
                return;
            }
        document.getElementById('second_sub').style.display = "block";
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';



       
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                   <td>${item.PLEDGE_NO || ''}</td>
                    <td>${item.CUST_ID || ''}</td>
                    <td>${item.CUST_NAME || ''}</td>
                    <td>${item.AREA_NAME || ''}</td>
                    <td>${item.ZONAL_NAME || ''}</td>
                    <td>${item.REG_NAME || ''}</td>
                    <td>${item.STATUS || ''}</td>
                    <td>${item.ACT_WEIGHT || ''}</td>
                    <td>${item.NET_WEIGHT || ''}</td>
                    <td>${item.STONE_WEIGHT === null ? 'nil' : item.STONE_WEIGHT}</td>
                    <td>${item.WEIGHT_LOSS === null ? 'nil' : item.WEIGHT_LOSS}</td>
                    <td>${item.LETTER_SENDING_DATE || ''}</td>
                    <td>${item.LOSS === null ? 'nil' : item.LOSS}</td>
                    <td>${item.Q1 || ''}</td>
                    <td>${item.Q2 || ''}</td>
                    <td>${item.ABH || ''}</td>
                   


                `;
            tableBody.appendChild(row);
        });

        
       

            
            const requestData1 = {
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "indata": encryptAES(txtData),
                "BranchId": sessionStorage.getItem("BranchId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "flag": encryptAES("5")
            };



            const response1 = await fetch("/report", "POST", requestData1);
          

            response1 = decryptAES(response1);
            const data1 = JSON.parse(response1); // Ensure JSON parsing
          


            if (!Array.isArray(data1) || data1.length === 0) {
                
                showAlert("Alert!", "No Data found! About Purity");
                return;
            }
        document.getElementById('second_sub1').style.display = "block";
            const tableBody1 = document.getElementById('tableBody1');
            tableBody1.innerHTML = '';

            data1.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                                <td>${item.PLEDGE_NO || ''}</td>
                                <td>${item.PURITY_BRANCH || ''}</td>
                                <td>${item.PURITY_BY_AUDIT || ''}</td>
                                <td>${item.ITEMS || ''}</td>
                                
                               
                            `;
                tableBody1.appendChild(row);
            });

        











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
        XLSX.utils.book_append_sheet(workbook, worksheet, "RecoveryStatus_report");

        // Export to Excel file
        XLSX.writeFile(workbook, "RecoveryStatus_report.xlsx");
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
           
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }
    },

    firstFunction: async function (y) {
       
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
           
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }
    },

    fourthFunction: async function (y) {
      
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
           
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }
    },
    thirdFunction: async function (x) {
        
        var legilId = x;
        try {
            const requestData = {

                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata": encryptAES(legilId),
                "Flag": "44"

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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Purity_Report");

        // Export to Excel file
        XLSX.writeFile(workbook, "Purity_Report.xlsx");
    },









}

