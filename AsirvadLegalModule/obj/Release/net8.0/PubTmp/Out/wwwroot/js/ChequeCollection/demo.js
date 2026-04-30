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
    UploadFN(this);
});

$(document).on('change', '#FileUpload2', function () {
    UploadFN(this);
});

$(document).on('change', '#FileUpload3', function () {
    UploadFN(this);
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
    UploadFN(this);
});

$(document).on('change', '#FileUpload5', function () {
    UploadFN(this);
});

$(document).on('change', '#FileUpload6', function () {
    UploadFN(this);
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
        debugger;
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

                /*if (responseData.status === "1") {*/
                const selectElement = document.getElementById("drp_emp");
                selectElement.innerHTML = '';
                const outdata = JSON.parse(responseData.outdata);
                console.log(outdata);
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

                /*if (responseData.status === "1") {*/
                const selectElement = document.getElementById("DropDownList2");
                selectElement.innerHTML = '';
                const outdata = JSON.parse(responseData.outdata);
                console.log(outdata);
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
            console.error("Error fetching pledge details:", error);

        }

    },
    getPledgeDetails: async function () {
        await this.all_clear();
        debugger;
        const pledgeNo = document.getElementById("DropDownList2").value;
        if (pledgeNo != '---Select---') {
            try {
                const requestData = {
                    "Emp_id": sessionStorage.getItem("EmployeeId"),
                    "Encrypted_data": sessionStorage.getItem("BranchId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES( pledgeNo + "~" + document.getElementById("drp_irr").value),
                    "Flag": encryptAES("16")
                };
                var Res = await fetch("/Challan_bh_data", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.status === "111") {
                    const outdata = JSON.parse(responseData.outdata);
                    console.log(outdata);
                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        const item = outdata.Table[0];
                        document.getElementById("Text18").value = item.IRREGULARITY_STATUS;
                        document.getElementById("Text10").value = item.CUST_ID;
                        document.getElementById("Text11").value = item.CUST_NAME;
                        document.getElementById("mob_num").value = item.PHONE2;
                        document.getElementById("createdDate").value = item.DDATE;
                        console.log(item.DDATE);
                        document.getElementById("gross_we").value = item.ACT_WEIGHT;
                        document.getElementById("totalOutstandingAmount").value = item.LOSS;
                        document.getElementById("Text12").value = item.BRANCH_ID;
                        document.getElementById("Text13").value = item.BRANCH_NAME;
                        document.getElementById("Text14").value = item.AREA_NAME;

                        document.getElementById("Text15").value = item.REG_NAME;
                        document.getElementById("Text16").value = item.ZONAL_NAME;
                        /* document.getElementById("Text17").value = item.xxx;*/
                        document.getElementById("address").value = item.ADDRESS;
                        document.getElementById("Text17").value = item.C_DT;
                    }
                }

                else {
                    alert("Please select a pledge number.");
                }
            } catch (error) {
                console.error("Error fetching pledge details:", error);
            }
        }
    },

    getEmpDetails: async function () {
        await this.all_clear();
        debugger;
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
                    console.log(outdata);
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
                        /*document.getElementById("txt_chal_dt").value = item.C_DT;*/

                    }
                }
            } catch (error) {
                console.error("Error fetching eMP details:", error);
            }
        } else {
            alert("Please select a pledge number.");
        }
    },
    //sumbitPledgeDetails: async function () {
    //    debugger;
    //    if (document.getElementById("drp_irr").value === "0") {
    //        showAlert("Warning", "Please select irregularity type..!!");
    //        document.getElementById("drp_irr").focus();
    //        return false;
    //    }
    //    if (document.getElementById("DropDownList2").value === "---Select---") {
    //        showAlert("Warning", "Please select pledge..!!");
    //        document.getElementById("DropDownList2").focus();
    //        return false;
    //    }

    //    if (document.getElementById("remarks").value == "") {
    //        showAlert("Warning", "Please enter remark..!!");
    //        document.getElementById("remarks").focus();
    //        return false;
    //    }

    //    if (document.getElementById("cheque_sts_pledge").value == "0") {

    //    }
    //    else if (document.getElementById("cheque_sts_pledge").value == "1") {
    //        sts = "E";
    //        const fileInput = document.getElementById("FileUpload1");

    //        if (fileInput.files.length > 0) {
    //            const file = fileInput.files[0];
    //            const fileSize = file.size; // File size in bytes
    //            const maxSize = 2 * 1024 * 1024; // 1MB in bytes
    //            const fileType = file.type;

    //            // Ensure file is a PDF
    //            if (fileType !== "application/pdf") {
    //                await showAlert("ERROR!", "Only PDF files are allowed.");
    //                fileInput.value = ""; // Reset the input
    //                return;
    //            }

    //            // Ensure file size is below 1MB
    //            if (fileSize > maxSize) {
    //                await showAlert("ERROR!", "File size must be below 2MB.");
    //                fileInput.value = ""; // Reset the input
    //                return;
    //            }
    //        }
    //        const fileInput1 = document.getElementById("FileUpload2");

    //        if (fileInput1.files.length > 0) {
    //            const file = fileInput1.files[0];
    //            const fileSize = file.size; // File size in bytes
    //            const maxSize = 2 * 1024 * 1024; // 1MB in bytes
    //            const fileType = file.type;

    //            // Ensure file is a PDF
    //            if (fileType !== "application/pdf") {
    //                await showAlert("ERROR!", "Only PDF files are allowed.");
    //                fileInput1.value = ""; // Reset the input
    //                return;
    //            }

    //            // Ensure file size is below 1MB
    //            if (fileSize > maxSize) {
    //                await showAlert("ERROR!", "File size must be below 2MB.");
    //                fileInput1.value = ""; // Reset the input
    //                return;
    //            }
    //        }
    //    }
    //    else {
    //        sts = "B";
    //        const fileInput = document.getElementById("FileUpload3");

    //        if (fileInput.files.length > 0) {
    //            const file = fileInput.files[0];
    //            const fileSize = file.size; // File size in bytes
    //            const maxSize = 2 * 1024 * 1024; // 1MB in bytes
    //            const fileType = file.type;

    //            // Ensure file is a PDF
    //            if (fileType !== "application/pdf") {
    //                await showAlert("ERROR!", "Only PDF files are allowed.");
    //                fileInput.value = ""; // Reset the input
    //                return;
    //            }

    //            // Ensure file size is below 1MB
    //            if (fileSize > maxSize) {
    //                await showAlert("ERROR!", "File size must be below 2MB.");
    //                fileInput.value = ""; // Reset the input
    //                return;
    //            }
    //        }
    //    }

    //    try {

    //        const requestData = {
    //            "Emp_id": sessionStorage.getItem("EmployeeId"),
    //            "Encrypted_data": sessionStorage.getItem("EmployeeId") + "~" + sessionStorage.getItem("BranchId"),
    //            "Token": sessionStorage.getItem("Token"),
    //            "Indata": document.getElementById("DropDownList2").value + "~" + document.getElementById("remarks").value+"~"+sts,
    //            "Flag": "17"
    //        };
    //        var Res = await fetch("/Challan_bh_data", "POST", requestData);
    //        const responseData = JSON.parse(Res);
    //        if (responseData.status == "111") {
    //            showSuccessAlert("Success", "Pledge details submitted successfully.", "/Challan_Ah/Challan_Ah");
    //        }
    //        else {
    //            showAlert("Error!", "Something Went Wrong. Try Again!");
    //            return;
    //        }
    //    } catch (error) {
    //        console.error("Error fetching pledge details:", error);
    //    }

    //},

    sumbitPledgeDetails: async function () {
        debugger;
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
        else if (document.getElementById("cheque_sts_pledge").value == "2") {
            sts = "B";
            if (document.getElementById("FileUpload1").value == "") {
                showAlert('Alert', 'Please insert a Pdf in Statement Document ');
                return;
            }
            if (document.getElementById("FileUpload2").value == "") {
                showAlert('Alert', 'Please insert a Pdf in Bounces Document ');
                return;
            }
            const fileInput = document.getElementById("FileUpload1");

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 2 * 1024 * 1024; // 1MB in bytes
                const fileType = file.type;

                // Ensure file is a PDF
                if (fileType !== "application/pdf") {
                    await showAlert("ERROR!", "Only PDF files are allowed.");
                    fileInput.value = ""; // Reset the input
                    return;
                }

                // Ensure file size is below 1MB
                if (fileSize > maxSize) {
                    await showAlert("ERROR!", "File size must be below 2MB.");
                    fileInput.value = ""; // Reset the input
                    return;
                }
            }
            const fileInput1 = document.getElementById("FileUpload2");

            if (fileInput1.files.length > 0) {
                const file = fileInput1.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 2 * 1024 * 1024; // 1MB in bytes
                const fileType = file.type;

                // Ensure file is a PDF
                if (fileType !== "application/pdf") {
                    await showAlert("ERROR!", "Only PDF files are allowed.");
                    fileInput1.value = ""; // Reset the input
                    return;
                }

                // Ensure file size is below 1MB
                if (fileSize > maxSize) {
                    await showAlert("ERROR!", "File size must be below 2MB.");
                    fileInput1.value = ""; // Reset the input
                    return;
                }
            }
        }
        else {
            sts = "E";
            const fileInput2 = document.getElementById("FileUpload3");

            if (document.getElementById("FileUpload3").value == "") {
                showAlert('Alert', 'Please insert a Pdf in Statement Document ');
                return;
            }

            if (fileInput2.files.length > 0) {
                const file = fileInput2.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 2 * 1024 * 1024; // 1MB in bytes
                const fileType = file.type;

                // Ensure file is a PDF
                if (fileType !== "application/pdf") {
                    await showAlert("ERROR!", "Only PDF files are allowed.");
                    fileInput.value = ""; // Reset the input
                    return;
                }

                // Ensure file size is below 1MB
                if (fileSize > maxSize) {
                    await showAlert("ERROR!", "File size must be below 2MB.");
                    fileInput.value = ""; // Reset the input
                    return;
                }
            }
        }

        try {
            const requestData = {
                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("EmployeeId") + "~" + sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata": encryptAES(document.getElementById("DropDownList2").value + "~" + document.getElementById("remarks").value + "~" + sts),
                "Flag": encryptAES("17")
            };
            var Res = await fetch("/Challan_bh_data", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.status == "111") {

                //showSuccessAlert("Success", "Employee details submitted successfully.", "/Challan_Ah/Challan_Ah");
                //console.log("Pledge details submitted successfully.");
                if (document.getElementById("cheque_sts_pledge").value == "2") {
                    const fileInput4 = document.getElementById('FileUpload1');

                    // PDF conversion to bytes - FIXED VERSION for large files
                    if (fileInput4.files[0]) {
                        try {
                            const file = fileInput4.files[0];

                            if (file.type !== 'application/pdf') {
                               showAlert("error",'Please select a valid PDF file');
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

                            console.log('PDF converted to bytes successfully');

                        } catch (error) {
                            console.error('Error converting PDF to bytes:', error);
                            return;
                        }
                    } else {
                        console.log('No file selected');
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



                    /*  Pdfupload was  written in LegalNotice Controller */
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {


                        const fileInput8 = document.getElementById('FileUpload2');

                        // PDF conversion to bytes - FIXED VERSION for large files
                        if (fileInput8.files[0]) {
                            try {
                                const file = fileInput8.files[0];



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

                                console.log('PDF converted to bytes successfully');

                            } catch (error) {
                                console.error('Error converting PDF to bytes:', error);
                                return;
                            }
                        } else {
                            console.log('No file selected');
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



                        /*  Pdfupload was  written in LegalNotice Controller */
                        var Res = await fetch("/PdfUpload", "POST", data);
                        Res = decryptAES(Res);
                        const dataString = JSON.parse(Res).status;
                        if (dataString == "True") {
                            showSuccessAlert("Success", "Pledge details submitted successfully.", "/Cheque_status_up/Cheque_status_up");
                            return;
                        }
                        else {
                            showAlert("Error!", "Something Went Wrong. Try Again!");
                            return;
                        }

                    }
                    else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }


                }
                else /*if (document.getElementById("cheque_sts_emp").value == "2")*/ {
                    const fileInput6 = document.getElementById('FileUpload3');

                    // PDF conversion to bytes - FIXED VERSION for large files
                    if (fileInput6.files[0]) {
                        try {
                            const file = fileInput6.files[0];



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

                            console.log('PDF converted to bytes successfully');

                        } catch (error) {
                            console.error('Error converting PDF to bytes:', error);
                            return;
                        }
                    } else {
                        console.log('No file selected');
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



                    /*  Pdfupload was  written in LegalNotice Controller */
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {
                        showSuccessAlert("Success", "Employee details submitted successfully.", "/Challan_Ah/Challan_Ah");
                        return;

                    }
                    else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }











                }


            }
            else {
                showAlert("Error!", "Something Went Wrong. Try Again!");
                return;
            }
        } catch (error) {
            console.error("Error fetching pledge details:", error);
        }

    },

    sumbitEmpDetails: async function () {
        debugger;
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
        else if (document.getElementById("cheque_sts_emp").value == "2") {
            sts = "B";
            const fileInput = document.getElementById("FileUpload4");

            if (document.getElementById("FileUpload4").value == "") {
                showAlert('Alert', 'Please insert a Pdf in Statement Document ');
                return;
            }
            if (document.getElementById("FileUpload5").value == "") {
                showAlert('Alert', 'Please insert a Pdf in Bounces Document ');
                return;
            }

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 2 * 1024 * 1024; // 1MB in bytes
                const fileType = file.type;

                // Ensure file is a PDF
                if (fileType !== "application/pdf") {
                    await showAlert("ERROR!", "Only PDF files are allowed.");
                    document.getElementById("FileUpload4").value = '';
                    return;
                }

                // Ensure file size is below 1MB
                if (fileSize > maxSize) {
                    await showAlert("ERROR!", "File size must be below 2MB.");
                    document.getElementById("FileUpload4").value = '';
                    return;
                }
            }
            else {
                showAlert('Alert', 'Please Check the Pdf...');
                return;
            }
            const fileInput1 = document.getElementById("FileUpload5");

            if (fileInput1.files.length > 0) {
                const file = fileInput1.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 2 * 1024 * 1024; // 1MB in bytes
                const fileType = file.type;

                // Ensure file is a PDF
                if (fileType !== "application/pdf") {
                    await showAlert("ERROR!", "Only PDF files are allowed.");
                    document.getElementById("FileUpload5").value = '';
                    return;
                }

                // Ensure file size is below 1MB
                if (fileSize > maxSize) {
                    await showAlert("ERROR!", "File size must be below 2MB.");
                    document.getElementById("FileUpload5").value = '';
                    return;
                }
            }
            else {
                showAlert('Alert', 'Please Check the Pdf...');
                return;
            }
        }
        else {
            sts = "E";
            const fileInput = document.getElementById("FileUpload6");

            if (document.getElementById("FileUpload6").value == "") {
                showAlert('Alert', 'Please insert a Pdf in Statement Document ');
                return;
            }

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 2 * 1024 * 1024; // 1MB in bytes
                const fileType = file.type;

                // Ensure file is a PDF
                if (fileType !== "application/pdf") {
                    await showAlert("ERROR!", "Only PDF files are allowed.");
                    document.getElementById("FileUpload6").value = '';
                    return;
                }

                // Ensure file size is below 1MB
                if (fileSize > maxSize) {
                    await showAlert("ERROR!", "File size must be below 2MB.");
                    document.getElementById("FileUpload6").value = '';
                    return;
                }
            }
            else {
                showAlert('Alert', 'Please Check the Pdf...');
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

                //showSuccessAlert("Success", "Employee details submitted successfully.", "/Challan_Ah/Challan_Ah");
                //console.log("Pledge details submitted successfully.");
                if (document.getElementById("cheque_sts_emp").value == "2") {
                    const fileInput14 = document.getElementById('FileUpload4');

                    // PDF conversion to bytes - FIXED VERSION for large files
                    if (fileInput14.files[0]) {
                        try {
                            const file = fileInput14.files[0];



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

                            console.log('PDF converted to bytes successfully');

                        } catch (error) {
                            console.error('Error converting PDF to bytes:', error);
                            return;
                        }
                    } else {
                        console.log('No file selected');
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



                    /*  Pdfupload was  written in LegalNotice Controller */
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {


                        const fileInput4 = document.getElementById('FileUpload5');

                        // PDF conversion to bytes - FIXED VERSION for large files
                        if (fileInput4.files[0]) {
                            try {
                                const file = fileInput4.files[0];



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

                                console.log('PDF converted to bytes successfully');

                            } catch (error) {
                                console.error('Error converting PDF to bytes:', error);
                                return;
                            }
                        } else {
                            console.log('No file selected');
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



                        /*  Pdfupload was  written in LegalNotice Controller */
                        var Res = await fetch("/PdfUpload", "POST", data);
                        Res = decryptAES(Res);
                        const dataString = JSON.parse(Res).status;
                        if (dataString == "True") {
                            showSuccessAlert("Success", "Employee details submitted successfully.", "/Cheque_status_up/Cheque_status_up");
                            return;
                        }
                        else {
                            showAlert("Error!", "Something Went Wrong. Try Again!");
                            return;
                        }

                    }
                    else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }


                }
                else if (document.getElementById("cheque_sts_emp").value == "1") {
                    const fileInput114 = document.getElementById('FileUpload6');

                    // PDF conversion to bytes - FIXED VERSION for large files
                    if (fileInput114.files[0]) {
                        try {
                            const file = fileInput114.files[0];



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

                            console.log('PDF converted to bytes successfully');

                        } catch (error) {
                            console.error('Error converting PDF to bytes:', error);
                            return;
                        }
                    } else {
                        console.log('No file selected');
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



                    /*  Pdfupload was  written in LegalNotice Controller */
                    var Res = await fetch("/PdfUpload", "POST", data);
                    Res = decryptAES(Res);
                    const dataString = JSON.parse(Res).status;
                    if (dataString == "True") {
                        showSuccessAlert("Success", "Employee details submitted successfully.", "/Cheque_status_up/Cheque_status_up");
                        return;

                    }
                    else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }











                }


            }
            else {
                showAlert("Error!", "Something Went Wrong. Try Again!");
                return;
            }
        } catch (error) {
            console.error("Error fetching pledge details:", error);
        }

    },
    //validateChallanDate1: async function () {
    //    var resignedDate = document.getElementById('txt_redt').value;
    //    var challanDate = document.getElementById('txt_chal_dt').value;
    //    var currentDate = new Date().toISOString().split('T')[0];

    //    if (resignedDate.includes('-')) {
    //        resignedDate = convertDateFormat(resignedDate);
    //    }
    //    if (challanDate < resignedDate || challanDate > currentDate) {
    //        showAlert('Warning', 'Challan Date must be between the Last working Date and the Current Date');
    //        document.getElementById('txt_chal_dt').value = '';
    //    }
    //},
    //validateChallanDate: async function () {
    //    var createdDate = document.getElementById('createdDate').value;
    //    var challanDate = document.getElementById('Text17').value;
    //    var currentDate = new Date().toISOString().split('T')[0];

    //    if (createdDate.includes('-')) {
    //        createdDate = convertDateFormat(createdDate);
    //    }
    //    if (challanDate < createdDate || challanDate > currentDate) {
    //        showAlert('Warning', 'Challan Date must be between the Reported Date and the Current Date');
    //        document.getElementById('Text17').value = '';
    //    }
    //},

    pdfdownload: async function () {
        let requestData = "";
        debugger;
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
            }
            else {
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

            /* pdfview was written in LegalNotice Controller*/
            var Res = await fetch("/pdfdown2", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length == 0) {
                await showAlert("Alert!", "No Pdf to Download..",);
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

    pdfdownload1: async function () {
        debugger;
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
            }
            else {
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

                /* pdfview was written in LegalNotice Controller*/
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
    RejectPledgeDetails: async function () {
    debugger;
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
            }
            else {
                showAlert("Error!", "Something Went Wrong. Try Again!");
                return;
            }
        } catch (error) {
            console.error("Error fetching pledge details:", error);
        }

    },
    RejectEmpDetails: async function () {
    debugger;
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
                

            }
            else {
                showAlert("Error!", "Something Went Wrong. Try Again!");
                return;
            }
        } catch (error) {
            showAlert("Error!", "Something Went Wrong. Try Again!");
            return;
        }

    }


}

