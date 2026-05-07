
$(document).ready(async function () {
  
    checkAccess("17");
});
$(document).on('change', '#toDate', function () {
    _report.validateDate1(this)
});

$(document).on('change', '#FromDate', function () {
    _report.validateDate(this);
});

$(document).on('click', '#search', function () {
    _report.getdtl(this);
});

$(document).on('click', '#btnexcel', function () {
    _report.downloadExcel(this);
});
$(document).on('click', '#btnpdf', function () {
    _report.downloadPDF(this);
});

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
var _report = {
    getdtl: async function () {
      

       
        /*loader_spin();*/
        var FrmDateInput = document.getElementById('FromDate').value;
        var toDateInput = document.getElementById('toDate').value;

        if (!FrmDateInput) {
            showAlert('Error', "SELECT FROM DATE");
            return;
        }
        if (!toDateInput) {
            showAlert('Error', "SELECT TO DATE");
           
            return;
        }
        document.getElementById('second_sub').style.display = "block";
        

        const txtData = [formatDate(FrmDateInput), formatDate(toDateInput)].join('~');
        const requestData = {
            "employeeId": sessionStorage.getItem("EmployeeId"),
            "token": sessionStorage.getItem("Token"),
            "indata": txtData,
            "BranchId": sessionStorage.getItem("BranchId"),
            "Encrypted_data": sessionStorage.getItem("BranchId"),
            "flag": "1"
        };



        var response = await fetch("/report", "POST", requestData);
      
        
        response = decryptAES(response);
        const data = JSON.parse(response); // Ensure JSON parsing
      


        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById('second_sub').style.display = "none";
            showAlert("Error", "No Data found!");
            return;
        }

        const tableBody = document.getElementById('tableBody');

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.REGION_NAME || ''}</td>
                <td>${item.AREA_NAME || ''}</td>
                <td>${item.BRANCH_ID || ''}</td>
                <td>${item.BRANCH_NAME || ''}</td>
                <td>${item.TYPE_OF_NOTICE || ''}</td>
                <td>${item.TYPE_OF_DOCUMENT || ''}</td>
                <td>${item.BH_EMPLOYEECODE || ''}</td>
                <td>${item.BH_EMPLOYEE_NAME || ''}</td>
                <td>${item.AH_EMPCODE || ''}</td>
                <td>${item.AH_NAME || ''}</td>
                <td>${item.LM_EMPCODE || ''}</td>
                <td>${item.LM_NAME || ''}</td>
                <td>${item.LM_REMARKS || ''}</td>
                <td>${item.GL_HEAD_EMPCODE || ''}</td>
                <td>${item.GL_HEAD_NAME || ''}</td>
                <td>${item.GL_HEAD_REMARKS || ''}</td>
                <td>${item.APPROVED_BY || ''}</td>
                <td>${item.APPROVED_LEGAL_HEAD_EMP || ''}</td>
                <td>${item.LEGAL_HEAD_REMARKS || ''}</td>
            `;
            tableBody.appendChild(row);
        });


    },
    //downloadPDF: async function () {
    //    const { jsPDF } = window.jspdf; // Ensure correct reference
    //    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    //    doc.setFontSize(12);
    //    doc.text('Legal Notice Report', 14, 10);

    //    const table = document.getElementById("dataTable");
    //    if (!table) {
    //        Swal.fire("Error", "Table not found!", "error");
    //        return;
    //    }

    //    const rows = [];
    //    const headers = [...table.querySelectorAll("thead th")].map(th => th.innerText);
    //    rows.push(headers);

    //    table.querySelectorAll("tbody tr").forEach(tr => {
    //        const row = [...tr.querySelectorAll("td")].map(td => td.innerText);
    //        rows.push(row);
    //    });

    //    doc.autoTable({
    //        head: [headers],
    //        body: rows.slice(1), // Remove the header row from the body
    //        startY: 20,
    //        theme: 'grid',
    //        styles: { fontSize: 8, cellPadding: 2 },
    //        columnStyles: { 0: { cellWidth: 20 } },
    //        margin: { top: 20, left: 14, right: 14 }
    //    });

    //    doc.save('Legal_Notice_Report.pdf');
    //},

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
            Swal.fire("Error", "Table not found!", "error");
            return;
        }

        // Convert table to a worksheet
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Legal Notice Report");

        // Export to Excel file
        XLSX.writeFile(workbook, "Legal_Notice_Report.xlsx");
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


    }

    // Version with fixed column widths for specific columns
    //downloadFixedWidthPDF: async function () {
    //    const { jsPDF } = window.jspdf;
    //    const doc = new jsPDF({
    //        orientation: 'landscape',
    //        unit: 'mm',
    //        format: 'a4'
    //    });

    //    doc.setFontSize(16);
    //    doc.setFont('helvetica', 'bold');
    //    doc.text('Legal Notice Report', 14, 15);

    //    const table = document.getElementById("dataTable");
    //    if (!table) {
    //        Swal.fire("Error", "Table not found!", "error");
    //        return;
    //    }

    //    const headers = [...table.querySelectorAll("thead th")].map(th => th.innerText.trim());
    //    const rows = [];
    //    table.querySelectorAll("tbody tr").forEach(tr => {
    //        const row = [...tr.querySelectorAll("td")].map(td => td.innerText.trim());
    //        rows.push(row);
    //    });

    //    doc.autoTable({
    //        head: [headers],
    //        body: rows,
    //        startY: 25,
    //        theme: 'striped',

    //        styles: {
    //            fontSize: 8,
    //            cellPadding: 2,
    //            lineColor: [0, 0, 0],
    //            lineWidth: 0.1,
    //            halign: 'center',
    //            valign: 'middle'
    //        },

    //        headStyles: {
    //            fillColor: [68, 114, 196],
    //            textColor: [255, 255, 255],
    //            fontStyle: 'bold',
    //            fontSize: 9
    //        },

    //        bodyStyles: {
    //            fillColor: [255, 255, 255]
    //        },

    //        alternateRowStyles: {
    //            fillColor: [245, 245, 245]
    //        },

    //        // Specific column widths (adjust as needed)
    //        columnStyles: {
    //            0: { cellWidth: 20, halign: 'center' },  // ID column
    //            1: { cellWidth: 50, halign: 'left' },    // Name/Title column
    //            2: { cellWidth: 30, halign: 'center' },  // Date column
    //            3: { cellWidth: 40, halign: 'center' },  // Status column
    //            4: { cellWidth: 60, halign: 'left' },    // Description column
    //            5: { cellWidth: 25, halign: 'center' }   // Other column
    //        },

    //        margin: { left: 14, right: 14 }
    //    });

    //    doc.save('Legal_Notice_Report.pdf');
    //},


   



}


//var _report = {
//    data: [], // Store fetched data globally

//    formatDate: function (inputDate) {
//        const months = [
//            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//        ];
//        const parts = inputDate.split('-');
//        const day = parts[2];
//        const monthIndex = parseInt(parts[1], 10) - 1;
//        const year = parts[0];
//        const month = months[monthIndex];
//        return `${year}-${month}-${day}`;
//    },

//    getdtl: async function () {
//        document.getElementById('second_sub').style.display = "block";
//        var FrmDateInput = document.getElementById('FromDate').value;
//        var toDateInput = document.getElementById('toDate').value;

//        if (!FrmDateInput) {
//            alert('', "SELECT FROM DATE", "info");
//            hide();
//            return false;
//        }
//        if (!toDateInput) {
//            alert('', "SELECT TO DATE", "info");
//            hide();
//            return false;
//        }

//        const txtData = [this.formatDate(FrmDateInput), this.formatDate(toDateInput)].join('~');
//        const requestData = {
//            "employeeId": sessionStorage.getItem("EmployeeId"),
//            "token": sessionStorage.getItem("Token"),
//            "indata": txtData,
//            "BranchId": sessionStorage.getItem("BranchId"),
//            "Encrypted_data": sessionStorage.getItem("BranchId"),
//            "flag": "1"
//        };

//        try {
//            const response = await fetch("/report", "POST", requestData);
//            const data = JSON.parse(response);
//            /*const data = await response.json();*/
//           

//            if (!Array.isArray(data) || data.length === 0) {
//                Swal.fire("No Data Found", "No records available", "error");
//                return;
//            }

//            this.data = data; // Store data globally
//            const tableBody = document.getElementById('tableBody');
//            tableBody.innerHTML = ''; // Clear existing rows

//            data.forEach(item => {
//                const row = document.createElement('tr');
//                row.innerHTML = `
//                        <td>${item.REGION_NAME || ''}</td>
//                        <td>${item.AREA_NAME || ''}</td>
//                        <td>${item.BRANCH_ID || ''}</td>
//                        <td>${item.BRANCH_NAME || ''}</td>
//                        <td>${item.TYPE_OF_NOTICE || ''}</td>
//                        <td>${item.TYPE_OF_DOCUMENT || ''}</td>
//                        <td>${item.BH_EMPLOYEECODE || ''}</td>
//                        <td>${item.BH_EMPLOYEE_NAME || ''}</td>
//                        <td>${item.AH_EMPCODE || ''}</td>
//                        <td>${item.AH_NAME || ''}</td>
//                        <td>${item.LM_EMPCODE || ''}</td>
//                        <td>${item.LM_NAME || ''}</td>
//                        <td>${item.LM_REMARKS || ''}</td>
//                        <td>${item.RIIMHEAD_EMPCODE || ''}</td>
//                        <td>${item.RIIMHEAD_NAME || ''}</td>
//                        <td>${item.RIIMHEAD_REMARKS || ''}</td>
//                        <td>${item.APPROVED_BY || ''}</td>
//                        <td>${item.APPROVED_LEGAL_HEAD_EMP || ''}</td>
//                        <td>${item.LEGAL_HEAD_REMARKS || ''}</td>
//                    `;
//                tableBody.appendChild(row);
//            });
//        } catch (error) {
//           
//            Swal.fire("Error", "Failed to fetch data", "error");
//        }
//    },

//    downloadPDF: function () {
//        const { jsPDF } = window.jspdf;
//        const doc = new jsPDF({
//            orientation: 'landscape',
//            unit: 'mm',
//            format: 'a4'
//        });

//        doc.setFontSize(12);
//        doc.text('Legal Notice Report', 14, 10);

//        const headers = [
//            'REGION_NAME', 'AREA_NAME', 'BRANCH_ID', 'BRANCH_NAME', 'TYPE_OF_NOTICE',
//            'TYPE_OF_DOCUMENT', 'BH_EMPLOYEECODE', 'BH_EMPLOYEE_NAME', 'AH_EMPCODE',
//            'AH_NAME', 'LM_EMPCODE', 'LM_NAME', 'LM_REMARKS', 'RIIMHEAD_EMPCODE',
//            'RIIMHEAD_NAME', 'RIIMHEAD_REMARKS', 'APPROVED_BY', 'APPROVED_LEGAL_HEAD_EMP',
//            'LEGAL_HEAD_REMARKS'
//        ];

//        const tableData = this.data.map(item => [
//            item.REGION_NAME || '',
//            item.AREA_NAME || '',
//            item.BRANCH_ID || '',
//            item.BRANCH_NAME || '',
//            item.TYPE_OF_NOTICE || '',
//            item.TYPE_OF_DOCUMENT || '',
//            item.BH_EMPLOYEECODE || '',
//            item.BH_EMPLOYEE_NAME || '',
//            item.AH_EMPCODE || '',
//            item.AH_NAME || '',
//            item.LM_EMPCODE || '',
//            item.LM_NAME || '',
//            item.LM_REMARKS || '',
//            item.RIIMHEAD_EMPCODE || '',
//            item.RIIMHEAD_NAME || '',
//            item.RIIMHEAD_REMARKS || '',
//            item.APPROVED_BY || '',
//            item.APPROVED_LEGAL_HEAD_EMP || '',
//            item.LEGAL_HEAD_REMARKS || ''
//        ]);

//        if (tableData.length === 0) {
//            Swal.fire("No Data", "Please fetch data first by clicking Search", "warning");
//            return;
//        }

//        doc.autoTable({
//            head: [headers],
//            body: tableData,
//            startY: 20,
//            theme: 'grid',
//            styles: { fontSize: 8, cellPadding: 2 },
//            columnStyles: { 0: { cellWidth: 20 } },
//            margin: { top: 20, left: 14, right: 14 }
//        });

//        doc.save('legal_notice_report.pdf');
//    },

//    validateDate: async function () {
//        var FrmDateInput = document.getElementById('FromDate').value;
//        var toDateInput = document.getElementById('toDate').value;
//        var currentDate = new Date().toISOString().slice(0, 10);

//        if (toDateInput > currentDate) {
//            document.getElementById('toDate').value = currentDate;
//            hide();
//            showAlert("INVALID DATE", "NOT ABLE TO SELECT FUTURE DATE", "error");
//            return false;
//        }

//        if (FrmDateInput > toDateInput && toDateInput != '') {
//            document.getElementById('toDate').value = FrmDateInput;
//            showAlert("INVALID DATE", "PLEASE SELECT VALID TO DATE", "error");
//            return false;
//        }

//        if (FrmDateInput > currentDate) {
//            showAlert("INVALID DATE", "NOT ABLE TO SELECT FUTURE DATE", "error");
//            return false;
//        }
//        return true;
//    },

//    validateDate1: async function () {
//        var FrmDateInput = document.getElementById('FromDate').value;
//        var toDateInput = document.getElementById('toDate').value;
//        var currentDate = new Date().toISOString().slice(0, 10);

//        if (FrmDateInput > currentDate) {
//            document.getElementById('FromDate').value = currentDate;
//            hide();
//            showAlert("INVALID DATE", "NOT ABLE TO SELECT FUTURE DATE", "error");
//            return false;
//        }
//        if (FrmDateInput > toDateInput && toDateInput != '') {
//            document.getElementById('toDate').value = currentDate;
//            document.getElementById('FromDate').value = currentDate;
//            hide();
//            showAlert("INVALID DATE", "NOT ABLE TO SELECT FUTURE DATE OF TO DATE", "error");
//            return false;
//        }
//        return true;
//    }
//};