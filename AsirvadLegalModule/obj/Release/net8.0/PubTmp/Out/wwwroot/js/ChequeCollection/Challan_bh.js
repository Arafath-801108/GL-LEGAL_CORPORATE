$(document).ready(async function () {

    checkAccess("23");

});
var img = "";
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
            window.location.href = liveurl+href;
        }
    });
}

$(document).on('change', '#drp_irr', function () {
    Challan_bh.pledgeddl();
});

$(document).on('change', '#drp_emp', function () {
    Challan_bh.getEmpDetails();
});

$(document).on('change', '#txt_chal_dt', function () {
    Challan_bh.validateChallanDate1();
});

$(document).on('click', '#viewChequeBtn', function () {
    Challan_bh.pdfdownload();
});

$(document).on('change', '#DropDownList2', function () {
    Challan_bh.getPledgeDetails();
});

$(document).on('change', '#Text17', function () {
    Challan_bh.validateChallanDate();
});

$(document).on('click', '#imgview', function () {
    Challan_bh.pdfdownload();
});

$(document).on('click', '#btnconfirm1', function () {
    Challan_bh.sumbitPledgeDetails();
});

$(document).on('click', '#btnexit1', function () {
    redirectToDashboard();
});

$(document).on('click', '#btnconfirm', function () {
    Challan_bh.sumbitEmpDetails();
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard()
});
function all_clear() {
   
    document.getElementById("Text18").value = "";
    document.getElementById("Text10").value = "";
    document.getElementById("Text11").value = "";
    document.getElementById("mob_num").value = "";
    document.getElementById("createdDate").value = "";
    document.getElementById("gross_we").value = "";
    document.getElementById("totalOutstandingAmount").value = "";
    document.getElementById("Text12").value = "";
    document.getElementById("Text13").value = "";
    document.getElementById("Text14").value = "";
    document.getElementById("Text15").value = "";
    document.getElementById("Text16").value = "";   
    document.getElementById("address").value = "";

    document.getElementById("txt_cat").value = "";
    document.getElementById("txt_emp").value = "";
    document.getElementById("txt_add").value = "";
    document.getElementById("txt_ph").value = "";
    document.getElementById("txt_des").value = "";
    document.getElementById("txt_bran").value = "";
    document.getElementById("txt_brid").value = "";
    document.getElementById("txt_area").value = "";
    document.getElementById("txt_reg").value = "";
    document.getElementById("txt_zone").value = "";
    document.getElementById("txt_amt").value = "";
    document.getElementById("txt_redt").value = "";

    document.getElementById("remarks").value = "";
    document.getElementById("txt_remark1").value = "";
   
}




var Challan_bh = {
   

    pledgeddl: async function () {
        await this.all_clear();
       

        const irregularityType = document.getElementById("drp_irr").value;
        const employee_div = document.getElementById("employee_div");
        const customer_div = document.getElementById("customer_div");

        if (irregularityType === "4") { // Employee Debit
            employee_div.style.display = "block";
            customer_div.style.display = "none";
        } else if (irregularityType !== "0") { // Other options except SELECT
            employee_div.style.display = "none";
            customer_div.style.display = "block";
        } else { // SELECT option
            employee_div.style.display = "none";
            customer_div.style.display = "none";
        }
        try {
            if (irregularityType == "4") {


                const requestData = {

                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_irr").value),
                    "Flag": encryptAES("8")
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                /*if (responseData.status === "1") {*/
                const selectElement = document.getElementById("drp_emp");
                selectElement.innerHTML = '';
                const outdata = JSON.parse(responseData.outdata);
              
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.EMP_CODE; // Assigning pledge_no as value
                        option.textContent = item.EMP_CODE; // Displaying pledge_no as text
                        selectElement.appendChild(option);
                    });
                }
            }
            else {

                const requestData = {

                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_irr").value),
                    "Flag": encryptAES("8")
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                /*if (responseData.status === "1") {*/
                const selectElement = document.getElementById("DropDownList2");
                selectElement.innerHTML = '';
                const outdata = JSON.parse(responseData.outdata);
               
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.PLEDGENO; // Assigning pledge_no as value
                        option.textContent = item.PLEDGENO; // Displaying pledge_no as text
                        selectElement.appendChild(option);
                    });
                }

                /*}*/
            }

        }
        catch (error) {
            await showAlert("Alert!", "Error occured..Please try again..");

        }

    },
    getPledgeDetails: async function () {
        await this.all_clear();
      
        const pledgeNo = document.getElementById("DropDownList2").value;
        if (pledgeNo != '-1') {
            try {
                const requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(pledgeNo + "~" + document.getElementById("drp_irr").value),
                    "Flag": encryptAES("10")
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.status === "111") {
                    const outdata = JSON.parse(responseData.outdata);
                   
                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        const item = outdata.Table[0];
                        document.getElementById("Text18").value = item.IRREGULARITY_STATUS;
                        document.getElementById("Text10").value = item.CUST_ID;
                        document.getElementById("Text11").value = item.CUST_NAME;
                        document.getElementById("mob_num").value = item.PHONE2;
                        document.getElementById("createdDate").value = item.DDATE;
                      
                        document.getElementById("gross_we").value = item.ACT_WEIGHT;
                        document.getElementById("totalOutstandingAmount").value = item.LOSS;
                        document.getElementById("Text12").value = item.BRANCH_ID;
                        document.getElementById("Text13").value = item.BRANCH_NAME;
                        document.getElementById("Text14").value = item.AREA_NAME;

                        document.getElementById("Text15").value = item.REG_NAME;
                        document.getElementById("Text16").value = item.ZONAL_NAME;
                        /* document.getElementById("Text17").value = item.xxx;*/
                        document.getElementById("address").value = item.ADDRESS;
                    }
                }
            } catch (error) {
               
            }
        } else {
            showAlert("Alert","Please select a pledge number.");
        }
    },

    getEmpDetails: async function () {
        await this.all_clear();
       
        const drp_emp = document.getElementById("drp_emp").value;
        if (drp_emp != '-1') {
            try {
                const requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": drp_emp,
                    "Flag": "27"
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                const responseData = JSON.parse(Res);
                if (responseData.status === "111") {
                    const outdata = JSON.parse(responseData.outdata);
                  
                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        const item = outdata.Table[0];
                        document.getElementById("txt_cat").value = item.IRREGULARITY_STATUS;
                        document.getElementById("txt_emp").value = item.EMP_NAME;
                        document.getElementById("txt_add").value = item.ADDR;
                        document.getElementById("txt_ph").value = item.MOBILE_NO;
                        document.getElementById("txt_des").value = item.DESIGNATION;

                        document.getElementById("txt_bran").value = item.BRANCH_NAME;
                        document.getElementById("txt_brid").value = item.BRANCH_ID;
                        document.getElementById("txt_area").value = item.AREA_NAME;
                        document.getElementById("txt_reg").value = item.REG_NAME;
                        document.getElementById("txt_zone").value = item.ZONAL_NAME;

                        document.getElementById("txt_amt").value = item.AMOUNT;
                        document.getElementById("txt_redt").value = item.DISCONT_DT;
                        /* document.getElementById("Text17").value = item.xxx;*/
                        //    document.getElementById("address").value = item.ADDRESS;
                    }
                }
            } catch (error) {
               
            }
        } else {
            alert("Please select a pledge number.");
        }
    },
    sumbitPledgeDetails: async function () {
       
        if (document.getElementById("drp_irr").value === "0") {
            showAlert("Warning", "Please select irregularity type..!!");
            document.getElementById("drp_irr").focus();
            return false;
        }
        if (document.getElementById("DropDownList2").value === "---Select---") {
            showAlert("Warning", "Please select pledge..!!");
            document.getElementById("DropDownList2").focus();
            return false;
        }
        if (document.getElementById("Text17").value == "") {
            showAlert("Warning", "Please select challan date..!!");
            document.getElementById("Text17").focus();
            return false;
        }
        if (document.getElementById('FileUpload1').value === "") {
            showAlert("Warning", "Please attach challan document..!!");
            document.getElementById('FileUpload1').focus();
            return false;
        }
        const fileInput = document.getElementById("FileUpload1");

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileSize = file.size; // File size in bytes
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes

            // Check file size (2MB limit)
            if (fileSize > maxSize) {
                await showAlert("Error!", "File size must be below 2MB.", "error");
                fileInput.value = "";
                if (fileNameDisplay) fileNameDisplay.textContent = "";
                return;
            }

            // Validate PDF file using magic number
            if (file.type === "application/pdf") {
                try {
                    const fileReader = new FileReader();
                    const magicNumberPromise = new Promise((resolve, reject) => {
                        fileReader.onload = function (e) {
                            const arr = new Uint8Array(e.target.result).subarray(0, 4);
                            let header = "";
                            for (let i = 0; i < arr.length; i++) {
                                header += String.fromCharCode(arr[i]);
                            }
                            if (header !== "%PDF") {
                                reject(new Error("Invalid PDF file."));
                            } else {
                                resolve();
                            }
                        };
                        fileReader.onerror = () => reject(new Error("Error reading file."));
                        fileReader.readAsArrayBuffer(file.slice(0, 4));
                    });
                    await magicNumberPromise;
                } catch (error) {
                    await showAlert("Alert!", "Invalid PDF file. Please upload a valid PDF.", "warning");
                    fileInput.value = "";
                    if (fileNameDisplay) fileNameDisplay.textContent = "";
                    return;
                }
            } else {
                await showAlert("Error!", "Only PDF files are allowed.", "error");
                fileInput.value = "";
                if (fileNameDisplay) fileNameDisplay.textContent = "";
                return;
            }
        } else {
            await showAlert("Error!", "Please select a PDF file to upload.", "error");
            fileInput.value = "";
            if (fileNameDisplay) fileNameDisplay.textContent = "";
            return;
        }
        if (document.getElementById("remarks").value == "") {
            showAlert("Warning", "Please enter remark..!!");
            document.getElementById("remarks").focus();
            return false;
        }

        try {
            const requestData = {
                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("EmployeeId") + "~" + sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata": encryptAES(document.getElementById("DropDownList2").value + "~" + document.getElementById("remarks").value + "~" + document.getElementById("Text17").value),
                "Flag": encryptAES("9")
            };
            var Res = await fetch("/Challan_bh_data", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.status == "111") {
                const fileInput = document.getElementById('FileUpload1');

                // PDF conversion to bytes - FIXED VERSION for large files
                if (fileInput.files[0]) {
                    try {
                        const file = fileInput.files[0];

                        // Check if it's a PDF file
                        if (file.type !== 'application/pdf') {
                            
                            return;
                        }

                        // Convert file to Base64 using FileReader (safer for large files)
                        img = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                // Get the base64 string (remove the data:application/pdf;base64, prefix)
                                const base64String = e.target.result.split(',')[1];
                                resolve(base64String);
                            };
                            reader.onerror = function (e) {
                                reject(new Error('Failed to read file'));
                            };
                            reader.readAsDataURL(file);
                        });

                        

                    } catch (error) {
                        
                         showAlert('Error', ' Please try again.');
                        return;
                    }
                } else {
                   
                }

                var data = {
                    "img": img,
                    "indata": encryptAES(document.getElementById("DropDownList2").value),
                    "employeeId": sessionStorage.getItem("EmployeeId"),
                    "token": sessionStorage.getItem("Token"),
                    "BranchId": sessionStorage.getItem("BranchId"),
                    "enindata": sessionStorage.getItem("BranchId"),
                    "flag": encryptAES("14")
                };



                /*  Pdfupload was  written in LegalNotice Controller */
                var Res = await fetch("/PdfUpload", "POST", data);
                Res = decryptAES(Res);
                const dataString = JSON.parse(Res).status;
                if (dataString == "True") {
                    showSuccessAlert("Success", "Pledge details submitted successfully.", "/Challan/Challan_bh");
                    return;
                }
            }
            else {
                showAlert('Error', "Failed. Please try again.");
                return;
            }
        } catch (error) {
            showAlert('Error', "Failed. Please try again.");
            return;
        }

    },
    sumbitEmpDetails: async function () {

        if (document.getElementById("drp_irr").value === "0") {
            showAlert("Warning", "Please select irregularity type..!!");
            document.getElementById("drp_irr").focus();
            return false;
        }
        if (document.getElementById("drp_emp").value === "---Select---") {
            showAlert("Warning", "Please select employee..!!");
            document.getElementById("DropDownList").focus();
            return false;
        }
        if (document.getElementById("txt_chal_dt").value == "") {
            showAlert("Warning", "Please select challan date..!!");
            document.getElementById("txt_chal_dt").focus();
            return false;
        }
        if (document.getElementById('FileUpload2').value === "") {
            showAlert("Warning", "Please attach challan document..!!");
            document.getElementById('FileUpload2').focus();
            return false;
        }
        const fileInput = document.getElementById("FileUpload2");

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileSize = file.size; // File size in bytes
            const maxSize = 2 * 1024 * 1024; // 1MB in bytes
            const fileType = file.type;

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 2 * 1024 * 1024; // 2MB in bytes

                // Check file size (2MB limit)
                if (fileSize > maxSize) {
                    await showAlert("Error!", "File size must be below 2MB.", "error");
                    fileInput.value = "";
                    if (fileNameDisplay) fileNameDisplay.textContent = "";
                    return;
                }

                // Validate PDF file using magic number
                if (file.type === "application/pdf") {
                    try {
                        const fileReader = new FileReader();
                        const magicNumberPromise = new Promise((resolve, reject) => {
                            fileReader.onload = function (e) {
                                const arr = new Uint8Array(e.target.result).subarray(0, 4);
                                let header = "";
                                for (let i = 0; i < arr.length; i++) {
                                    header += String.fromCharCode(arr[i]);
                                }
                                if (header !== "%PDF") {
                                    reject(new Error("Invalid PDF file."));
                                } else {
                                    resolve();
                                }
                            };
                            fileReader.onerror = () => reject(new Error("Error reading file."));
                            fileReader.readAsArrayBuffer(file.slice(0, 4));
                        });
                        await magicNumberPromise;
                    } catch (error) {
                        await showAlert("Alert!", "Invalid PDF file. Please upload a valid PDF.", "warning");
                        fileInput.value = "";
                        if (fileNameDisplay) fileNameDisplay.textContent = "";
                        return;
                    }
                } else {
                    await showAlert("Error!", "Only PDF files are allowed.", "error");
                    fileInput.value = "";
                    if (fileNameDisplay) fileNameDisplay.textContent = "";
                    return;
                }
            } else {
                await showAlert("Error!", "Please select a PDF file to upload.", "error");
                fileInput.value = "";
                if (fileNameDisplay) fileNameDisplay.textContent = "";
                return;
            }



            if (document.getElementById("txt_remark1").value == "") {
                showAlert("Warning", "Please enter remark..!!");
                document.getElementById("txt_remark1").focus();
                return false;
            }

            try {
                const requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("EmployeeId") + "~" + sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_emp").value + "~" + document.getElementById("txt_remark1").value + "~" + document.getElementById("txt_chal_dt").value),
                    "Flag": encryptAES("28")
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.status == "111") {
                    const fileInput = document.getElementById('FileUpload2');

                    // PDF conversion to bytes - FIXED VERSION for large files
                    if (fileInput.files[0]) {
                        try {
                            const file = fileInput.files[0];

                            // Check if it's a PDF file
                            if (file.type !== 'application/pdf') {

                                return;
                            }

                            // Convert file to Base64 using FileReader (safer for large files)
                            img = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    // Get the base64 string (remove the data:application/pdf;base64, prefix)
                                    const base64String = e.target.result.split(',')[1];
                                    resolve(base64String);
                                };
                                reader.onerror = function (e) {
                                    reject(new Error('Failed to read file'));
                                };
                                reader.readAsDataURL(file);
                            });


                        } catch (error) {

                            return;
                        }
                    } else {

                    }

                    var data = {
                        "img": img,
                        "indata": encryptAES(document.getElementById("drp_emp").value),
                        "employeeId": sessionStorage.getItem("EmployeeId"),
                        "token": sessionStorage.getItem("Token"),
                        "BranchId": sessionStorage.getItem("BranchId"),
                        "enindata": sessionStorage.getItem("BranchId"),
                        "flag": encryptAES("13")
                    };



                    /*  Pdfupload was  written in LegalNotice Controller */
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {

                        await showSuccessAlert("Success", "Employee details submitted successfully.", "/Challan/Challan_bh");
                        return;
                    }
                }
                else {
                    await showAlert("Error!", "Error occured..Please try again..", "warning");
                }
            } catch (error) {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
            }

        }
    },
        validateChallanDate1: async function () {

            var resignedDate = document.getElementById('txt_redt').value;
            var challanDate = document.getElementById('txt_chal_dt').value;
            var currentDate = new Date().toISOString().split('T')[0];


            if (challanDate < resignedDate || challanDate > currentDate) {

                await showAlert("Alert!", 'Challan Date must be between the Last working Date and the Current Date');
                document.getElementById('txt_chal_dt').value = '';
                return;
            }
        },
    validateChallanDate: async function () {
       
        var createdDate = document.getElementById('createdDate').value;
        var challanDate = document.getElementById('Text17').value;
        var currentDate = new Date().toISOString().split('T')[0];

       
        
        
        if (challanDate < createdDate || challanDate > currentDate) {
            await showAlert("Alert!", 'Challan Date must be between the Reported Date and the Current Date');
            
            document.getElementById('Text17').value = '';
            return;
        }
    },

    pdfdownload: async function () {
       
        
     
        try {
            let requestData = "";
            if (document.getElementById('drp_irr').value == '0') {
               
                await showAlert("Alert!", "Please select a Irregularity Type to download the document.");

                return;
            }

            else if (document.getElementById("drp_irr").value == '4') {
                if (document.getElementById("drp_emp").value == '---select---') {

                   
                    await showAlert("Alert!", "Please select a Employee Code to download the document.");

                    return;
                }

                 requestData = {

                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                     "Indata": encryptAES(document.getElementById("drp_emp").value),
                     "Flag": encryptAES("38")


                };
            }
            else {
                if (document.getElementById("DropDownList2").value == '---Select---') {
                    
                    await showAlert("Alert!", "Please select a Pledge Number to download the document.");
                    return;
                }
                 requestData = {

                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                     "Indata": encryptAES(document.getElementById("DropDownList2").value),
                     "Flag": encryptAES("39")

                };
            }
                
                /* pdfview was written in LegalNotice Controller*/
                var Res = await fetch("/pdfdown2", "POST", requestData);
                Res = decryptAES(Res);
                let data = JSON.parse(Res).outdata;
                if (!data || data.length == 0) {
                    
                    await showAlert("Error!", "No PDF Data to Download..");
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
            
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }
    
    },

    pdfdownloadx: async function () {
       
        try {
            if (document.getElementById('drp_irr').value == '0') {
                showAlert("Warning", "Please select a Irregularity Type to download the document.");
               

                return;
            }

            else if (document.getElementById("drp_irr").value == '4') {
                if (document.getElementById("drp_emp").value == '---select---') {

                    showAlert("Warning", "Please select a Employee Code to download the document.");

                    return;
                }

                const requestData = {

                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_emp").value),
                    "Flag": encryptAES("38")

                };
            }
            else {
                if (document.getElementById("DropDownList2").value == '---Select---') {
                    showAlert("Warning", "Please select a Pledge Number to download the document.");
                    return;
                }
                const requestData = {

                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("DropDownList2").value),
                    "Flag": encryptAES("39")

                };

                /* pdfview was written in LegalNotice Controller*/
                var Res = await fetch("/pdfdown2", "POST", requestData);

                Res = decryptAES(Res);
                let data = JSON.parse(Res).outdata;
                if (!data || data.length == 0) {
                    showAlert("Warning", "No PDF Data to Download..");
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
        } catch (error) {
         
         
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }

    },


    all_clear: function () {

        document.getElementById("Text18").value = "";
        document.getElementById("Text10").value = "";
        document.getElementById("Text11").value = "";
        document.getElementById("mob_num").value = "";
        document.getElementById("createdDate").value = "";
        document.getElementById("gross_we").value = "";
        document.getElementById("totalOutstandingAmount").value = "";
        document.getElementById("Text12").value = "";
        document.getElementById("Text13").value = "";
        document.getElementById("Text14").value = "";
        document.getElementById("Text15").value = "";
        document.getElementById("Text16").value = "";
        document.getElementById("address").value = "";

        document.getElementById("txt_cat").value = "";
        document.getElementById("txt_emp").value = "";
        document.getElementById("txt_add").value = "";
        document.getElementById("txt_ph").value = "";
        document.getElementById("txt_des").value = "";
        document.getElementById("txt_bran").value = "";
        document.getElementById("txt_brid").value = "";
        document.getElementById("txt_area").value = "";
        document.getElementById("txt_reg").value = "";
        document.getElementById("txt_zone").value = "";
        document.getElementById("txt_amt").value = "";
        document.getElementById("txt_redt").value = "";

        document.getElementById("remarks").value = "";
        document.getElementById("txt_remark1").value = "";

    },

}
