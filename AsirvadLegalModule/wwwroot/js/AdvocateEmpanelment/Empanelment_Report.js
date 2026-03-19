$(document).ready(async function () {
     checkAccess("47");
});

$(document).on('change', '#toDate', function () {
    _report.validateDate1(this);
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

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
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


        const txtData = [formatDate(FrmDateInput), formatDate(toDateInput)].join('^');
        //const safeTxtData = encryptAES(String(txtData))
        //    ; 


        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            Flag: encryptAES("24"),
            indata: encryptAES(txtData)
        };

        Swal.fire({
            title: 'Submitting...',
            text: 'Please wait while we save your data',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const outResult = JSON.parse(customes.out_result);

            // Extract the Table array from outResult
            const data = outResult.Table || [];
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            Swal.close();

            //// Check for errors first
            //if (errorStatus !== "1" && errorMsg) {
            //    document.getElementById('second_sub').style.display = "none";
            //    showAlert("Error", errorMsg);
            //    return;
            //}

            // Check if data exists
            if (!Array.isArray(data) || data.length === 0) {
                document.getElementById('second_sub').style.display = "none";
                showAlert("Error", "No Data found!");
                return;
            }

            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            data.forEach(item => {
                const row = document.createElement('tr');

                // List of fields to display - Updated to match your data structure
                const fields = [
                    'ADVOCATE_ID', 'FULL_NAME', 'FATHER_NAME', 'GENDER',
                    'OCCUPATION_DETAILS', 'STATE', 'DISTRICT', 'UPDATED_DATE',
                    'EMPLOYEE_CODE', 'GRADE', 'VERTICAL_NAME',
                    'CASE_NUMBER', 'CASE_TYPES', 'STATUS','EMPANELED_DATE'
                ];

                // Add data cells
                fields.forEach(field => {
                    const cell = document.createElement('td');
                    cell.textContent = item[field] || '';
                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });

            // Show the table section
            document.getElementById('second_sub').style.display = "block";

        } catch (error) {
            Swal.close();
            console.error("Error in getdtl:", error);
            showAlert("Error", "An error occurred: " + error.message);
        }
    },

    secondFunction: async function (x) {
        let legilId = x.toString();
        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                ReqId: encryptAES(legilId),
                Flag: encryptAES("Report_DocView")
            };

            const response = await fetch('/FIRRegistration/FIRfetch', "POST", requestData);

            // Decrypt and parse the response
            const decryptedText = decryptAES(response);
            const docs = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(docs.Query_result);
            const detaildoc = parsedInner.Table || [];

            // Extract base64 document
            const data = detaildoc[0].DOCVIEW;

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
        } catch (error) {
            console.error("Error fetching documents:", error);
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Empanelment Report");

        // Export to Excel file
        XLSX.writeFile(workbook,"EMPANELMENT_Report.xlsx");
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
};