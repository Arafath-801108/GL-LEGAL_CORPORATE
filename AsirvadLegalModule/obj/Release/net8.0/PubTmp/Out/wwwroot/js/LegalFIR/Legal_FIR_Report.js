
$(document).ready(async function () {

    checkAccess("43");
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
            "flag": "6"
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

        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');

            // List of fields to display
            const fields = [
                'COMPLAINT_ID', 'BRANCH_ID', 'POLICE_COMPLAINT_DATE', 'COURT_NAME', 'ADVOCATE_NAME','REQUEST_DATE', 'LAG_DAYS', 'CUSTOMER_ID'
            ];

            // Add data cells
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = item[field] || '';
                row.appendChild(cell);
            });

            // Define action buttons
            const actions = [

                { label: 'Click Here', handler: _report.secondFunction }
            ];

            actions.forEach((action, index) => {
                const cell = document.createElement('td');
                const button = document.createElement('button');
                button.textContent = action.label;
                button.type = 'button';
                button.id = `btn-${index}-${item.COMPLAINT_ID}`;
                button.addEventListener('click', () => action.handler(item.COMPLAINT_ID));
                cell.appendChild(button);
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });


    },

    secondFunction: async function (x) {
        debugger;
        let legilId = x.toString();
        try {
            //const requestData = {

            //    //"Emp_id": sessionStorage.getItem("EmployeeId"),
            //    //"Encrypted_data": sessionStorage.getItem("BranchId"),
            //    //"Token": sessionStorage.getItem("Token"),
            //    //"Indata": encryptAES("4424"),
            //    //"Flag": encryptAES("42")


            //    "Emp_id": sessionStorage.getItem("EmployeeId"),
            //    "Encrypted_data": sessionStorage.getItem("BranchId"),
            //    "Token": sessionStorage.getItem("Token"),
            //    "Indata": encryptAES(legilId),
            //    "Flag": encryptAES("42")
            //};
            //console.log(requestData);
            //var ytuio = "fgh"
            ///* pdfview was written in LegalNotice Controller*/
            //var Res = await fetch("/pdfdown1", "POST", requestData);
            //Res = decryptAES(Res);
            //let data = JSON.parse(Res).outdata;

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),

                ReqId: encryptAES(legilId),
                Flag: encryptAES("Report_DocView")
            };


            const response = await fetch('/FIRRegistration/FIRfetch', "POST", requestData);



            // Step 1: Decrypt and parse the response
            const decryptedText = decryptAES(response);
            const docs = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(docs.Query_result);
            const detaildoc = parsedInner.Table || [];

            // Step 2: Extract base64 document
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
        XLSX.utils.book_append_sheet(workbook, worksheet, " PRIVATE COMPLAINT Report");

        // Export to Excel file
        XLSX.writeFile(workbook, " PRIVATE_COMPLAINT_Report.xlsx");
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
}
  