$(document).ready(async function () {
    checkAccess("25");
});

var img = "";
var sts = "";
var status = "";



$(document).on('change', '#DropDownList2', function () {
    Challan_sts.getPledgeDetails();
});

$(document).on('change', '#cheque_sts_pledge', function () {
    Challan_sts.sts_check2();
});

$(document).on('change', '#FileUpload1', function () {
    UploadFN();
});

$(document).on('change', '#FileUpload2', function () {
    UploadFN();
});

$(document).on('change', '#FileUpload3', function () {
    UploadFN();
});

$(document).on('click', '#imgview', function () {
    Challan_sts.pdfdownload();
});

$(document).on('click', '#imgview1', function () {
    Challan_sts.pdfdownload1();;
});

$(document).on('click', '#btnsubmit1', function () {
    Challan_sts.sumbitPledgeDetails();
});

$(document).on('click', '#btnexit1', function () {
    redirectToDashboard();
});
//----------------------------------------------------------------------------
$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

$(document).on('click', '#btnsubmit', function () {
    Challan_sts.sumbitEmpDetails();
});

$(document).on('click', '#viewChequeBtn1', function () {
    Challan_sts.pdfdownload1();
});

$(document).on('click', '#viewChequeBtn', function () {
    Challan_sts.pdfdownload();
});

$(document).on('change', '#drp_irr', function () {
    Challan_sts.pledgeddl();
});

$(document).on('change', '#drp_emp', function () {
    Challan_sts.getEmpDetails();
});

$(document).on('change', '#cheque_sts_emp', function () {
    Challan_sts.stscheck();
});

$(document).on('change', '#FileUpload4', function () {
    UploadFN();
});

$(document).on('change', '#FileUpload5', function () {
    UploadFN();
});

$(document).on('change', '#FileUpload6', function () {
    UploadFN();
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
            /* window.location.href = href; */
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

// PDF validation function
async function validatePDFFile(fileInput, fileNameDisplay = null) {
    if (fileInput.files.length === 0) {
        await showAlert("Error!", "Please select a PDF file to upload.", "error");
        fileInput.value = "";
        if (fileNameDisplay) fileNameDisplay.textContent = "";
        return false;
    }

    const file = fileInput.files[0];
    const fileSize = file.size; // File size in bytes
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    // Check file size (2MB limit)
    if (fileSize > maxSize) {
        await showAlert("Error!", "File size must be below 2MB.", "error");
        fileInput.value = "";
        if (fileNameDisplay) fileNameDisplay.textContent = "";
        return false;
    }

    // Validate PDF file using MIME type and magic number
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
            return false;
        }
    } else {
        await showAlert("Error!", "Only PDF files are allowed.", "error");
        fileInput.value = "";
        if (fileNameDisplay) fileNameDisplay.textContent = "";
        return false;
    }

    return true; // File is valid
}

var Challan_sts = {
    stscheck: async function () {
        if (document.getElementById("cheque_sts_emp").value == "0") {
            document.getElementById("cheque_status_emp").style.display = "none";
            document.getElementById("emp_b").style.display = "none";
        }
        else if (document.getElementById("cheque_sts_emp").value == "2") {
            document.getElementById("cheque_status_emp").style.display = "block";
            document.getElementById("emp_b").style.display = "none";
        }
        else {
            document.getElementById("cheque_status_emp").style.display = "none";
            document.getElementById("emp_b").style.display = "block";
        }
    },
    sts_check2: async function () {
        if (document.getElementById("cheque_sts_pledge").value == "0") {
            document.getElementById("cheque_status_pledge").style.display = "none";
            document.getElementById("pledge_b").style.display = "none";
        }
        else if (document.getElementById("cheque_sts_pledge").value == "2") {
            document.getElementById("cheque_status_pledge").style.display = "block";
            document.getElementById("pledge_b").style.display = "none";
        }
        else {
            document.getElementById("cheque_status_pledge").style.display = "none";
            document.getElementById("pledge_b").style.display = "block";
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
    pledgeddl: async function () {
        await this.all_clear();
        const irregularityType = document.getElementById("drp_irr").value;
        const employee_div = document.getElementById("employee_div");
        const customer_div = document.getElementById("customer_div");
        if (irregularityType === "4") {
            employee_div.style.display = "block";
            customer_div.style.display = "none";
        } else if (irregularityType !== "0") {
            employee_div.style.display = "none";
            customer_div.style.display = "block";
        } else {
            employee_div.style.display = "none";
            customer_div.style.display = "none";
        }
        try {
            let requestData = "";
            if (irregularityType == "4") {
                requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_irr").value),
                    "Flag": encryptAES("15")
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                const selectElement = document.getElementById("drp_emp");
                selectElement.innerHTML = '';
                const outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.EMP_CODE;
                        option.textContent = item.EMP_CODE;
                        selectElement.appendChild(option);
                    });
                }
            } else {
                requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_irr").value),
                    "Flag": encryptAES("15")
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                const responseData = JSON.parse(Res);
                const selectElement = document.getElementById("DropDownList2");
                selectElement.innerHTML = '';
                const outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.PLEDGENO;
                        option.textContent = item.PLEDGENO;
                        selectElement.appendChild(option);
                    });
                }
            }
        } catch (error) {
            // Handle error
        }
    },
    getPledgeDetails: async function () {
        await this.all_clear();
        const pledgeNo = document.getElementById("DropDownList2").value;
        if (pledgeNo != '---Select---') {
            try {
                const requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(pledgeNo + "~" + document.getElementById("drp_irr").value),
                    "Flag": encryptAES("16")
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
                        document.getElementById("address").value = item.ADDRESS;
                        document.getElementById("Text17").value = item.C_DT;
                    }
                } else {
                    alert("Please select a pledge number.");
                }
            } catch (error) {
                // Handle error
            }
        }
    },
    getEmpDetails: async function () {
        await this.all_clear();
        const drp_emp = document.getElementById("drp_emp").value;
        if (drp_emp != '---Select---') {
            try {
                const requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(drp_emp + "~" + document.getElementById("drp_irr").value),
                    "Flag": encryptAES("32")
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                Res = decryptAES(Res);
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
                    }
                }
            } catch (error) {
                // Handle error
            }
        } else {
            alert("Please select a pledge number.");
        }
    },
    sumbitPledgeDetails: async function () {
        if (document.getElementById("drp_irr").value === "0") {
            showAlert("Warning", "Please select irregularity type..!!");
            document.getElementById("drp_irr").focus();
            return;
        }
        if (document.getElementById("DropDownList2").value === "---Select---") {
            showAlert("Warning", "Please select Pledge..!!");
            document.getElementById("DropDownList2").focus();
            return;
        }
        if (document.getElementById("remarks").value == "") {
            showAlert("Warning", "Please enter remark..!!");
            document.getElementById("remarks").focus();
            return;
        }
        if (document.getElementById("cheque_sts_pledge").value == "0") {
            showAlert("Warning", "Please select the Check Status..!!");
            return;
        }

        let sts = "S"; // Success status by default
        if (document.getElementById("cheque_sts_pledge").value == "2") {
            sts = "B";
            const fileInput1 = document.getElementById("FileUpload1");
            const fileInput2 = document.getElementById("FileUpload2");

            if (!fileInput1.files.length) {
                showAlert('Alert', 'Please insert a Pdf in Statement Document ');
                return;
            }
            if (!fileInput2.files.length) {
                showAlert('Alert', 'Please insert a Pdf in Bounces Document ');
                return;
            }

            // Validate both PDF files
            if (!(await validatePDFFile(fileInput1)) || !(await validatePDFFile(fileInput2))) {
                sts = "E";
                return;
            }
        } else {
            sts = "E";
            const fileInput3 = document.getElementById("FileUpload3");
            if (!fileInput3.files.length) {
                showAlert('Alert', 'Please insert a Pdf in Statement Document ');
                return;
            }
            if (!(await validatePDFFile(fileInput3))) {
                sts = "E";
                return;
            }
        }

        try {
            const requestData = {
                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("EmployeeId") + "~" + sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata": encryptAES(document.getElementById("DropDownList2").value + "~" + document.getElementById("remarks").value + "~" + sts),
                "Flag": "17"
            };
            var Res = await fetch("/Challan_bh_data", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.status == "111") {
                if (document.getElementById("cheque_sts_pledge").value == "2") {
                    const fileInput1 = document.getElementById('FileUpload1');
                    if (fileInput1.files[0]) {
                        try {
                            const file = fileInput1.files[0];
                            img = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    const base64String = e.target.result.split(',')[1];
                                    resolve(base64String);
                                };
                                reader.onerror = function (e) {
                                    reject(new Error('Failed to read file'));
                                };
                                reader.readAsDataURL(file);
                            });
                        } catch (error) {
                            showAlert("Error!", "Failed to process PDF file.");
                            return;
                        }
                    } else {
                        showAlert("Error!", "No PDF file selected.");
                        return;
                    }
                    var data = {
                        "img": img,
                        "indata": encryptAES(document.getElementById("DropDownList2").value),
                        "employeeId": sessionStorage.getItem("EmployeeId"),
                        "token": sessionStorage.getItem("Token"),
                        "BranchId": sessionStorage.getItem("BranchId"),
                        "enindata": sessionStorage.getItem("BranchId"),
                        "flag": encryptAES("11")
                    };
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {
                        const fileInput2 = document.getElementById('FileUpload2');
                        if (fileInput2.files[0]) {
                            try {
                                const file = fileInput2.files[0];
                                img = await new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = function (e) {
                                        const base64String = e.target.result.split(',')[1];
                                        resolve(base64String);
                                    };
                                    reader.onerror = function (e) {
                                        reject(new Error('Failed to read file'));
                                    };
                                    reader.readAsDataURL(file);
                                });
                            } catch (error) {
                                showAlert("Error!", "Failed to process PDF file.");
                                return;
                            }
                        } else {
                            showAlert("Error!", "No PDF file selected.");
                            return;
                        }
                        var data = {
                            "img": img,
                            "indata": encryptAES(document.getElementById("DropDownList2").value),
                            "employeeId": sessionStorage.getItem("EmployeeId"),
                            "token": sessionStorage.getItem("Token"),
                            "BranchId": sessionStorage.getItem("BranchId"),
                            "enindata": sessionStorage.getItem("BranchId"),
                            "flag": encryptAES("12")
                        };
                        var Res = await fetch("/PdfUpload", "POST", data);
                        Res = decryptAES(Res);
                        const dataString = JSON.parse(Res).status;
                        if (dataString == "True") {
                            showSuccessAlert("Success", "Pledge details submitted successfully.", "/Cheque_status_up/Cheque_status_up");
                            return;
                        } else {
                            showAlert("Error!", "Something Went Wrong. Try Again!");
                            return;
                        }
                    } else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }
                } else {
                    const fileInput3 = document.getElementById('FileUpload3');
                    if (fileInput3.files[0]) {
                        try {
                            const file = fileInput3.files[0];
                            img = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    const base64String = e.target.result.split(',')[1];
                                    resolve(base64String);
                                };
                                reader.onerror = function (e) {
                                    reject(new Error('Failed to read file'));
                                };
                                reader.readAsDataURL(file);
                            });
                        } catch (error) {
                            showAlert("Error!", "Failed to process PDF file.");
                            return;
                        }
                    } else {
                        showAlert("Error!", "No PDF file selected.");
                        return;
                    }
                    var data = {
                        "img": img,
                        "indata": encryptAES(document.getElementById("DropDownList2").value),
                        "employeeId": sessionStorage.getItem("EmployeeId"),
                        "token": sessionStorage.getItem("Token"),
                        "BranchId": sessionStorage.getItem("BranchId"),
                        "enindata": sessionStorage.getItem("BranchId"),
                        "flag": encryptAES("10")
                    };
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {
                        showSuccessAlert("Success", "Employee details submitted successfully.", "/Challan_Ah/Challan_Ah");
                        return;
                    } else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }
                }
            } else {
                showAlert("Error!", "Something Went Wrong. Try Again!");
                return;
            }
        } catch (error) {
            showAlert("Error!", "Something Went Wrong. Try Again!");
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
        if (document.getElementById("txt_remark1").value == "") {
            showAlert("Warning", "Please enter remark..!!");
            document.getElementById("txt_remark1").focus();
            return false;
        }
        if (document.getElementById("cheque_sts_emp").value == "0") {
            showAlert("Warning", "Please enter Select Check Status..!!");
            return;
        }

        let sts = "S";
        if (document.getElementById("cheque_sts_emp").value == "2") {
            sts = "B";
            const fileInput4 = document.getElementById("FileUpload4");
            const fileInput5 = document.getElementById("FileUpload5");

            if (!fileInput4.files.length) {
                showAlert('Alert', 'Please insert a Pdf in Statement Document ');
                return;
            }
            if (!fileInput5.files.length) {
                showAlert('Alert', 'Please insert a Pdf in Bounces Document ');
                return;
            }

            // Validate both PDF files
            if (!(await validatePDFFile(fileInput4)) || !(await validatePDFFile(fileInput5))) {
                sts = "E";
                return;
            }
        } else {
            sts = "E";
            const fileInput6 = document.getElementById("FileUpload6");
            if (!fileInput6.files.length) {
                showAlert('Alert', 'Please insert a Pdf in Statement Document ');
                return;
            }
            if (!(await validatePDFFile(fileInput6))) {
                sts = "E";
                return;
            }
        }

        try {
            const requestData = {
                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("EmployeeId") + "~" + sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata": encryptAES(document.getElementById("drp_emp").value + "~" + document.getElementById("txt_remark1").value + "~" + sts),
                "Flag": encryptAES("33")
            };
            var Res = await fetch("/Challan_bh_data", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.status == "111") {
                if (document.getElementById("cheque_sts_emp").value == "2") {
                    const fileInput4 = document.getElementById('FileUpload4');
                    if (fileInput4.files[0]) {
                        try {
                            const file = fileInput4.files[0];
                            img = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    const base64String = e.target.result.split(',')[1];
                                    resolve(base64String);
                                };
                                reader.onerror = function (e) {
                                    reject(new Error('Failed to read file'));
                                };
                                reader.readAsDataURL(file);
                            });
                        } catch (error) {
                            showAlert("Error!", "Failed to process PDF file.");
                            return;
                        }
                    } else {
                        showAlert("Error!", "No PDF file selected.");
                        return;
                    }
                    var data = {
                        "img": img,
                        "indata": encryptAES(document.getElementById("drp_emp").value),
                        "employeeId": sessionStorage.getItem("EmployeeId"),
                        "token": sessionStorage.getItem("Token"),
                        "BranchId": sessionStorage.getItem("BranchId"),
                        "enindata": sessionStorage.getItem("BranchId"),
                        "flag": encryptAES("8")
                    };
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {
                        const fileInput5 = document.getElementById('FileUpload5');
                        if (fileInput5.files[0]) {
                            try {
                                const file = fileInput5.files[0];
                                img = await new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = function (e) {
                                        const base64String = e.target.result.split(',')[1];
                                        resolve(base64String);
                                    };
                                    reader.onerror = function (e) {
                                        reject(new Error('Failed to read file'));
                                    };
                                    reader.readAsDataURL(file);
                                });
                            } catch (error) {
                                showAlert("Error!", "Failed to process PDF file.");
                                return;
                            }
                        } else {
                            showAlert("Error!", "No PDF file selected.");
                            return;
                        }
                        var data = {
                            "img": img,
                            "indata": encryptAES(document.getElementById("drp_emp").value),
                            "employeeId": sessionStorage.getItem("EmployeeId"),
                            "token": sessionStorage.getItem("Token"),
                            "BranchId": sessionStorage.getItem("BranchId"),
                            "enindata": sessionStorage.getItem("BranchId"),
                            "flag": encryptAES("9")
                        };
                        var Res = await fetch("/PdfUpload", "POST", data);
                        Res = decryptAES(Res);
                        const dataString = JSON.parse(Res).status;
                        if (dataString == "True") {
                            showSuccessAlert("Success", "Employee details submitted successfully.", "/Cheque_status_up/Cheque_status_up");
                            return;
                        } else {
                            showAlert("Error!", "Something Went Wrong. Try Again!");
                            return;
                        }
                    } else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }
                } else if (document.getElementById("cheque_sts_emp").value == "1") {
                    const fileInput6 = document.getElementById('FileUpload6');
                    if (fileInput6.files[0]) {
                        try {
                            const file = fileInput6.files[0];
                            img = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    const base64String = e.target.result.split(',')[1];
                                    resolve(base64String);
                                };
                                reader.onerror = function (e) {
                                    reject(new Error('Failed to read file'));
                                };
                                reader.readAsDataURL(file);
                            });
                        } catch (error) {
                            showAlert("Error!", "Failed to process PDF file.");
                            return;
                        }
                    } else {
                        showAlert("Error!", "No PDF file selected.");
                        return;
                    }
                    var data = {
                        "img": img,
                        "indata": encryptAES(document.getElementById("DropDownList2").value),
                        "employeeId": sessionStorage.getItem("EmployeeId"),
                        "token": sessionStorage.getItem("Token"),
                        "BranchId": sessionStorage.getItem("BranchId"),
                        "enindata": sessionStorage.getItem("BranchId"),
                        "flag": encryptAES("7")
                    };
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {
                        showSuccessAlert("Success", "Employee details submitted successfully.", "/Cheque_status_up/Cheque_status_up");
                        return;
                    } else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }
                }
            } else {
                showAlert("Error!", "Something Went Wrong. Try Again!");
                return;
            }
        } catch (error) {
            showAlert("Error!", "Something Went Wrong. Try Again!");
            return;
        }
    },
    pdfdownload: async function () {
        let requestData = "";
        try {
            if (document.getElementById("drp_irr").value == '4') {
                if (document.getElementById("drp_emp").value == '---Select---') {
                    showAlert("Warning", "Please select a Employee Code to download the document.");
                    return;
                }
                requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_emp").value),
                    "Flag": encryptAES("38")
                };
            } else {
                if (document.getElementById("DropDownList2").value == '---Select---') {
                    showAlert("Warning", "Please select a Pledge Number to download the document.");
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
            var Res = await fetch("/pdfdown2", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length == 0) {
                await showAlert("Alert!", "No Pdf to Download..");
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
                if (base64String.startsWith("/9j")) return "image/jpeg";
                if (base64String.startsWith("iVBORw0")) return "image/png";
                if (base64String.startsWith("JVBER")) return "application/pdf";
                return "application/octet-stream";
            }
            function getFileExtension(mimeType) {
                switch (mimeType) {
                    case "image/jpeg": return "jpg";
                    case "image/png": return "png";
                    case "application/pdf": return "pdf";
                    default: return "bin";
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
    pdfdownload1: async function () {
        try {
            let requestData = "";
            if (document.getElementById("drp_irr").value == '4') {
                if (document.getElementById("drp_emp").value == '---Select---') {
                    showAlert("Warning", "Please select a Employee Code to download the document.");
                    return;
                }
                requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_emp").value),
                    "Flag": encryptAES("40")
                };
            } else {
                if (document.getElementById("DropDownList2").value == '---Select---') {
                    showAlert("Warning", "Please select a Pledge Number to download the document.");
                    return;
                }
                requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("DropDownList2").value),
                    "Flag": encryptAES("41")
                };
            }
            var Res = await fetch("/pdfdown2", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length == 0) {
                showAlert('Error', 'No Pdf to Download.');
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
                if (base64String.startsWith("/9j")) return "image/jpeg";
                if (base64String.startsWith("iVBORw0")) return "image/png";
                if (base64String.startsWith("JVBER")) return "application/pdf";
                return "application/octet-stream";
            }
            function getFileExtension(mimeType) {
                switch (mimeType) {
                    case "image/jpeg": return "jpg";
                    case "image/png": return "png";
                    case "application/pdf": return "pdf";
                    default: return "bin";
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
    RejectPledgeDetails: async function () {
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
                "Indata": encryptAES(document.getElementById("DropDownList2").value + "~" + document.getElementById("remarks").value),
                "Flag": encryptAES("14")
            };
            var Res = await fetch("/Challan_bh_data", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.status == "111") {
                showSuccessAlert("Success", "Pledge details submitted successfully.", "/Challan_Ah/Challan_Ah");
            } else {
                showAlert("Error!", "Something Went Wrong. Try Again!");
                return;
            }
        } catch (error) {
            showAlert("Error!", "Something Went Wrong. Try Again!");
            return;
        }
    },
    RejectEmpDetails: async function () {
        if (document.getElementById("drp_irr").value === "0") {
            showAlert("Warning", "Please select irregularity type..!!");
            document.getElementById("drp_irr").focus();
            return false;
        }
        if (document.getElementById("drp_emp").value === "-1") {
            showAlert("Warning", "Please select employee..!!");
            document.getElementById("DropDownList").focus();
            return false;
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
                "Indata": encryptAES(document.getElementById("drp_emp").value + "~" + document.getElementById("txt_remark1").value),
                "Flag": encryptAES("31")
            };
            var Res = await fetch("/Challan_bh_data", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.status == "111") {
                showSuccessAlert("Success", "Employee details submitted successfully.", "/Challan_Ah/Challan_Ah");
            } else {
                showAlert("Error!", "Something Went Wrong. Try Again!");
                return;
            }
        } catch (error) {
            showAlert("Error!", "Something Went Wrong. Try Again!");
            return;
        }
    }
}