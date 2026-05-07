$(document).ready(async function () {

    checkAccess("24");

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
            window.location.href = liveurl + href;
        }
    });
}


$(document).on('change','#drp_irr', function () {
    Challan_Ah.pledgeddl();
});

$(document).on('change','#drp_emp', function () {
    Challan_Ah.getEmpDetails();
});

$(document).on('click','#viewChequeBtn', function () {
    Challan_Ah.pdfdownload();
});

$(document).on('click','#viewChequeBtn1', function () {
    Challan_Ah.pdfdownload1();
});



$(document).on('click', '#btnReject', function () {
    Challan_Ah.RejectEmpDetails();
});

$(document).on('click','#btnconfirm', function () {
    Challan_Ah.sumbitEmpDetails();
});

$(document).on('click', '#btnReject1', function () {
    Challan_Ah.RejectPledgeDetails();
});

$(document).on('click', '#btnconfirm1', function () {
    Challan_Ah.sumbitPledgeDetails();
});

$(document).on('click', '#imgview', function () {
    Challan_Ah.pdfdownload();
});

$(document).on('click', '#imgview1', function () {
    Challan_Ah.pdfdownload1();
});

$(document).on('change', '#DropDownList2', function () {
    Challan_Ah.getPledgeDetails();
});


var Challan_Ah = {
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
                    "Encrypted_data": sessionStorage.getItem("BranchId") + "~" + sessionStorage.getItem("EmployeeId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_irr").value),
                    "Flag": encryptAES("12")
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
                    "Encrypted_data": sessionStorage.getItem("BranchId") + "~" + sessionStorage.getItem("EmployeeId"),
                    "Token": sessionStorage.getItem("Token"),
                    "Indata": encryptAES(document.getElementById("drp_irr").value),
                    "Flag": encryptAES("12")
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
                    "Flag": encryptAES("11")
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
                        document.getElementById("Text17").value = item.C_DT;
                    }
                }

                else {
                    alert("Please select a pledge number.");
                }
            } catch (error) {
               
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
                            "Flag": encryptAES("29")
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
                                document.getElementById("txt_chal_dt").value = item.C_DT;

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
                        "Flag": encryptAES("13")
                    };
                    var Res = await fetch("/Challan_bh_data", "POST", requestData);
                    Res = decryptAES(Res);
                    const responseData = JSON.parse(Res);
                    if (responseData.status == "111") {
                        showSuccessAlert("Success", "Pledge details Verified successfully.", "/Challan_Ah/Challan_Ah");
                    }
                    else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }
                } catch (error) {
                    
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

                try {
                    const requestData = {
                        "Emp_id": sessionStorage.getItem("EmployeeId"),
                        "Encrypted_data": sessionStorage.getItem("EmployeeId") + "~" + sessionStorage.getItem("BranchId"),
                        "Token": sessionStorage.getItem("Token"),
                        "Indata": encryptAES(document.getElementById("drp_emp").value + "~" + document.getElementById("txt_remark1").value),
                        "Flag": encryptAES("30")
                    };
                    var Res = await fetch("/Challan_bh_data", "POST", requestData);
                    Res = decryptAES(Res);
                    const responseData = JSON.parse(Res);
                    if (responseData.status == "111") {

                        showSuccessAlert("Success", "Employee details Verified successfully.", "/Challan_Ah/Challan_Ah");
                        

                    }
                    else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }
                } catch (error) {
                    
                }

            },
            validateChallanDate1: async function () {
                var resignedDate = document.getElementById('txt_redt').value;
                var challanDate = document.getElementById('txt_chal_dt').value;
                var currentDate = new Date().toISOString().split('T')[0];

               
                if (challanDate < resignedDate || challanDate > currentDate) {
                    showAlert('Warning', 'Challan Date must be between the Last working Date and the Current Date');
                    document.getElementById('txt_chal_dt').value = '';
                }
            },
            validateChallanDate: async function () {
                var createdDate = document.getElementById('createdDate').value;
                var challanDate = document.getElementById('Text17').value;
                var currentDate = new Date().toISOString().split('T')[0];

                
                if (challanDate < createdDate || challanDate > currentDate) {
                    showAlert('Warning', 'Challan Date must be between the Reported Date and the Current Date');
                    document.getElementById('Text17').value = '';
                }
            },

            pdfdownload: async function () {
               
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
                        showSuccessAlert("Success", " Rejected successfully.", "/Challan_Ah/Challan_Ah");
                        return;
                    }
                    else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }
                } catch (error) {
                   
                }

            },
            RejectEmpDetails: async function () {
               
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

                        showSuccessAlert("Success", " Rejected successfully.", "/Challan_Ah/Challan_Ah");
                        return;
                       

                    }
                    else {
                        showAlert("Error!", "Something Went Wrong. Try Again!");
                        return;
                    }
                } catch (error) {
                   
                }

            }


}
    
