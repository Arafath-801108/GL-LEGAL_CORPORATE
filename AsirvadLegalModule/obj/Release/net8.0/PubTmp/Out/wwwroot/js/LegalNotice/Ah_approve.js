$(document).ready(async function () {

    checkAccess("2");
    _approve.Dropdown();
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
            window.location.href = liveurl+href;
        }
    });
}

$(document).on('change', '#branch', function () {
    _approve.noticeTypeDropdown(this.value);
});

$(document).on('change', '#noticeType', function () {
    _approve.LegalFetch(this.value)
});

$(document).on('click', '#btnsubmit', function () {
    _approve.ah_update();
});

$(document).on('click', '#btnpdf', function () {
    _approve.pdfview();
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

$(document).on("input", "#remarks", function () {


    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');

});




var _approve = {

    Dropdown: async function () {

      
        await this.all_Clear();
        try {
            const requestData = {
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "indata": encryptAES("2"),
                "BranchId": sessionStorage.getItem("BranchId"),
                "enindata": sessionStorage.getItem("BranchId"),
                "flag": encryptAES("3")
            };
            var Res = await fetch("/Dropdown", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            const selectElement1 = document.getElementById('branch');

            selectElement1.innerHTML = '';
            JSON.parse(Res).Dropdown.forEach(item => {
                const option = document.createElement('option');
                option.value = item.items;
                option.textContent = item.items_name;
                selectElement1.appendChild(option);
            });
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },


    noticeTypeDropdown: async function () {
        
     
        await this.all_Clear();
        try {
            const requestData = {
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "indata": encryptAES($("#branch").val()),
                "BranchId": sessionStorage.getItem("BranchId"),
                "enindata": sessionStorage.getItem("BranchId"),
                "flag": encryptAES("4")
            };
            var Res = await fetch("/TypeDropdown", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            const selectElement1 = document.getElementById('noticeType');

            selectElement1.innerHTML = '';
            JSON.parse(Res).Dropdown.forEach(item => {
                const option = document.createElement('option');
                option.value = item.items;
                option.textContent = item.items_name;
                selectElement1.appendChild(option);
            });
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },
    LegalFetch: async function () {
        await this.all_Clear();
        const requestData = {
            "employeeId": sessionStorage.getItem("EmployeeId"),
            "token": sessionStorage.getItem("Token"),
            "indata": encryptAES($("#noticeType").val()),
            "BranchId": sessionStorage.getItem("BranchId"),
            "enindata": sessionStorage.getItem("BranchId"),
            "flag": encryptAES("11")
        };
        var Res = await fetch("/LegalFetch", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        
        const dataString = JSON.parse(Res).data1;  // Assuming StateData is a string
        const values = dataString.split("^");

        document.getElementById("docType").value = values[0];
        document.getElementById("relatedEmployee").value = values[1];
        document.getElementById("relatedDepartment").value = values[2];
        document.getElementById("receivedDate").value = values[3];
        document.getElementById("updatedBh").value = values[4];
        document.getElementById("bhRemarks").value = values[5];
    },
    pdfview: async function () {
      
        try {
        const requestData = {
            "employeeId": sessionStorage.getItem("EmployeeId"),
            "token": sessionStorage.getItem("Token"),
            "indata": encryptAES($("#noticeType").val()),
            "BranchId": sessionStorage.getItem("BranchId"),
            "enindata": sessionStorage.getItem("BranchId"),
            "flag": encryptAES("17")
        };
            var Res = await fetch("/pdfview", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length == 0) {
             
                await showAlert("Warning","No Data Found!!!!!");
                return;
            }
            Swal.fire({
                title: "Document",
                html: `
                <h3>Document</h3>
                ${getFileType(data).startsWith("image") ?
                    `<img src="data:${getFileType(data)};base64,${data}" alt=" Document" width="100%"><br>`
                    : `<iframe src="data:${getFileType(data)};base64,${data}" width="100%" height="500px"></iframe><br>`}
                <a href="data:${getFileType(data)};base64,${data}" download="Document.${getFileExtension(getFileType(data))}" style="text-decoration: none; color: #007bff;">Download The Document</a><br><br>
               `,
                width: "800px",
                showCloseButton: true
            });

        } catch (error) {
           
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }

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

    },
    ah_update: async function () {
        try {
            const caseCatDrp = document.getElementById('branch').value;
            const pledgDrp = document.getElementById('noticeType').value;



            if (!caseCatDrp || caseCatDrp.trim() === "" || caseCatDrp === "0") {
                showAlert("Error!", "Please Select Branch  before submitting.");
                return;
            }


            if (!pledgDrp || pledgDrp.trim() === "" || pledgDrp === "-1" || pledgDrp === "0") {
                showAlert("Error!", "Please Select The  Type of Notice  before submitting.");
                return;
            }

            if (document.getElementById('remarks').value == "") {
                await showAlert("Alert!", "Please Enter Remarks..!!");
                return;
            }

            var data = {
                "indata": encryptAES($("#noticeType").val() + "~" + $("#remarks").val()),
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "BranchId": sessionStorage.getItem("BranchId"),
                "flag": encryptAES("6"),

            };
          
          

            var Res = await fetch("/LegalRequestSubmit", "POST", data);
            Res = decryptAES(Res);
            let data2 = JSON.parse(Res);
            if (data2.status == "True") {
                await showSuccessAlert("success!", "Successfully Updated", "/LegalNotice/LegalAh_recommend");
            }
            else {
                await showAlert("Alert!", "Retry", "warning");
            }



        }
        catch (error) {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
           
            return;
        }
    },
    
    all_Clear: function(){
        document.getElementById("docType").value = "";
        document.getElementById("relatedEmployee").value = "";
        document.getElementById("relatedDepartment").value = "";
        document.getElementById("receivedDate").value = "";
        document.getElementById("updatedBh").value = "";
        document.getElementById("bhRemarks").value = "";
    }


}
