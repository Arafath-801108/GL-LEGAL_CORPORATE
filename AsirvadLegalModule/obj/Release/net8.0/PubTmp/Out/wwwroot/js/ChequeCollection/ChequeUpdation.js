$(document).ready(async function () {

    checkAccess("19");


});

$(document).on('click', '#RadioButton3', function () {
    Radio3_onclick(); radioclear();
});

$(document).on('change', '#DrpIrr', function () {
    Update.IrrSelect(); validateirrgularity(); clearAllFields();
});

$(document).on('change', '#DrpCat', function () {
    Update.CatSelect(); clearexceptirr();
});

$(document).on('change', '#DrpPledgeEmp', function () {
    Update.LoadDetails(); cleardiv();
});

$(document).on('change', '#chdt1', function () {
    validateEmpChequeDate();
});

$(document).on('click', '#RadioButton4', function () {
    radioclear(); Radio4_onclick();
});

$(document).on('change', '#FileUpload2', function () {
    UploadFN();
});

$(document).on('change', '#DrpPledgeCust', function () {
    Update.LoadDetails(this.value); cleardiv();
});

$(document).on('change', '#chdt2', function () {
    validateCusChequeDate();
});

$(document).on('click', '#Radio1', function () {
    Radio1_onclick(); radioclear();
});

$(document).on('click', '#Radio2', function () {
    Radio2_onclick(); radioclear();
});

$(document).on('click', '#btnsubmit', function () {
    Update.SubmitDetails();
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});
window.Update = {
    IrrSelect: async function () {
        try {
                const requestData = {
                Br_id: sessionStorage.getItem("BranchId"),
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(document.getElementById('DrpIrr').value),
                    Flag:0
            };

            var Res = await fetch("/IrrSelection", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if (responseData.status === "1") {
                const selectElement = document.getElementById('DrpCat');
                selectElement.innerHTML = '';

                const outdata = JSON.parse(responseData.outdata);
               

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.SLNO;
                        option.textContent = item.IRR;
                        selectElement.appendChild(option);
                    });
                }
            }
            else {
                await showAlert("Alert!", "Unable to load the Pledge List..", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }

     },
    CatSelect: async function () {
        try {
            
            const categoryValue = document.getElementById('DrpCat').value;
            const irrValue = document.getElementById('DrpIrr').value;
            const requestData = {
                Br_id: sessionStorage.getItem("BranchId"),
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(categoryValue + " ~ " + irrValue),
                Flag: 1
            };

            var Res = await fetch("/IrrSelection", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if (responseData.status === "1") {
               
                if (irrValue === "4") {
                    selectElement = document.getElementById('DrpPledgeEmp');
                } else {
                    selectElement = document.getElementById('DrpPledgeCust');
                }

                selectElement.innerHTML = '';

                const outdata = JSON.parse(responseData.outdata);
              

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.SLNO;
                        option.textContent = item.CAT;
                        selectElement.appendChild(option);
                    });
                }
            }
            else {
                await showAlert("Alert!", "Unable to load the Pledge List..", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }

    },
    LoadDetails: async function () {
      
        const categoryValue = document.getElementById('DrpCat').value;
        const irrValue = document.getElementById('DrpIrr').value;
        const pledgeValue = document.getElementById('DrpPledgeCust').value;
        const EmpValue = document.getElementById('DrpPledgeEmp').value;
        if (pledgeValue === "-1") {
            await showAlert("Alert!", "Please select a Pledge Number.", "warning");
            return;
        }
        if (EmpValue === "-1") {
            await showAlert("Alert!", "Please select a Employee code.", "warning");
            return;
        }
        if (irrValue === "4") {
            try {
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(EmpValue + " ~ " + categoryValue),
                    Flag: 22
                };
                var Res = await fetch("/IrrSelection", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.status === "1") {

                    const parsedOutdata = JSON.parse(responseData.outdata);
                   
                    const data = parsedOutdata.Table[0];
                   
                    document.getElementById("emp_name").value = data.EMP_NAME;
                    document.getElementById("emp_add").value = data.ADDRESS;
                    document.getElementById("phone_no").value = data.MOBILE_NO;
                    document.getElementById("desg").value = data.DESIGNATION;
                    document.getElementById("br_name").value = data.BRANCH_NAME;
                    document.getElementById("br_id").value = data.BRANCH_ID;
                    document.getElementById("ar_name").value = data.AREA_NAME;
                    document.getElementById("rg_name").value = data.REG_NAME;
                    document.getElementById("zone").value = data.ZONAL_NAME;
                    document.getElementById("amount").value = data.AMOUNT;
                    document.getElementById("emp_dt").value = data.DIS_DATE;
                    
                }
                else {
                    await showAlert("Alert!", "Unable to load Details..", "warning");
                }
            }
            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }

        else {
            try {
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(pledgeValue + " ~ " + categoryValue + " ~ " + irrValue),
                    Flag: 2
                };
                var Res = await fetch("/IrrSelection", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                
                if (responseData.status === "1") {

                    const parsedOutdata = JSON.parse(responseData.outdata);
                 
                    const data = parsedOutdata.Table[0];
                  
                    document.getElementById("cust_id").value = data.CUST_ID;
                    document.getElementById("cust_name").value = data.CUST_NAME;
                    document.getElementById("con_num").value = data.PHONE2;
                    document.getElementById("in_dt").value = data.IN_DT;
                    document.getElementById("gr_wt").value = data.ACT_WEIGHT;
                    document.getElementById("loss").value = data.LOSS;
                    document.getElementById("br_id1").value = data.BRANCH_ID;
                    document.getElementById("br_name1").value = data.BRANCH_NAME;
                    document.getElementById("ar_name1").value = data.AREA_NAME;
                    document.getElementById("rg_name1").value = data.REG_NAME;
                    document.getElementById("zone1").value = data.ZONAL_NAME;
                   //tradate = data.TR_DT;
                    document.getElementById("add1").value = data.ADDRESS;

                }
                else {
                    await showAlert("Alert!", "Unable to load Details..", "warning");
                }
            }
            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }

        }

     },
    SubmitDetails :async function() {
   
    try {
        // Retrieve form values
        const categoryValue = document.getElementById('DrpCat').value;
        const irrValue = document.getElementById('DrpIrr').value;
        const pledgeValue = document.getElementById('DrpPledgeCust').value;
        const empValue = document.getElementById('DrpPledgeEmp').value;
        const irrName = document.getElementById('DrpIrr').selectedOptions[0]?.text || '';
        const selectedOption = document.querySelector('input[name="IrregularityCheck"]:checked');
        const selectedOption1 = document.querySelector('input[name="IrregularityCheckCustomer"]:checked');
        const empRadioValue = selectedOption?.value === 'Yes' ? 'Y' : 'N';
        const cusRadioValue = selectedOption1?.value === 'Yes' ? 'Y' : 'N';
        const cusRemark = document.getElementById('Remark1').value;
        const empRemark = document.getElementById('Remark2').value;
        const empDate = document.getElementById('chdt1').value;
        const cusDate = document.getElementById('chdt2').value;
        const loss = document.getElementById('loss').value;
        const amount = document.getElementById('amount').value;
        const cusId = document.getElementById('cust_id').value;
        const cusStatusSelect = document.getElementById('cus_status');
        const empStatusSelect = document.getElementById('emp_status');
        const cusstatus = cusStatusSelect && cusStatusSelect.selectedOptions[0]?.text && cusStatusSelect.value !== '-1' ? cusStatusSelect.selectedOptions[0].text : '';
        const empstatus = empStatusSelect && empStatusSelect.selectedOptions[0]?.text && empStatusSelect.value !== '-1' ? empStatusSelect.selectedOptions[0].text : '';
        const cusFileInput = document.getElementById('FileUpload1');
        const empFileInput = document.getElementById('FileUpload2');
       
        if (irrValue === "0") {
            await showAlert("Alert!", "Please select an Irregularity Type.", "warning");
            return;
        }
        if (categoryValue === "-1") {
            await showAlert("Alert!", "Please select a Category.", "warning");
            return;
        }

        if (irrValue === "4") {
            if (empValue === "-1") {
                await showAlert("Alert!", "Please select an Employee code.", "warning");
                return;
            }
            if (empDate === "") {
                await showAlert("Alert!", "Please select a Cheque Date.", "warning");
                return;
            }
            if (!selectedOption) {
                await showAlert("Alert!", "Please select an option for Irregularity Check.", "warning");
                return;
            } else {
                if (empRadioValue === "Y") {
                    if (!empFileInput || !empFileInput.value) {
                        await showAlert("Alert!", "Please Upload Cheque Document.", "warning");
                        return;
                    }
                } else if (empRadioValue === "N") {
                    if (!empstatus || empstatus === "") {
                        await showAlert("Alert!", "Please Select Cheque Status.", "warning");
                        return;
                    }
                }
            }

            if (empRemark === "") {
                await showAlert("Alert!", "Please Give Your Remarks.", "warning");
                return;
            }
        } else {
            if (pledgeValue === "-1") {
                await showAlert("Alert!", "Please select a Pledge Number.", "warning");
                return;
            }
            if (cusDate === "") {
                await showAlert("Alert!", "Please select a Cheque Date.", "warning");
                return;
            }
            if (!selectedOption1) {
                await showAlert("Alert!", "Please select an option for Irregularity Check.", "warning");
                return;
            } else {
                if (cusRadioValue === "Y") {
                    if (!cusFileInput || !cusFileInput.value) {
                        await showAlert("Alert!", "Please Upload Cheque Document.", "warning");
                        return;
                    }
                } else if (cusRadioValue === "N") {
                    if (!cusstatus || cusstatus === "") {
                        await showAlert("Alert!", "Please Select Cheque Status.", "warning");
                        return;
                    }
                }
            }
            if (cusRemark === "") {
                await showAlert("Alert!", "Please Give Your Remarks.", "warning");
                return;
            }
        }

       
        if (irrValue === "4") {
            if (empRadioValue === "Y") { // Employee-related submission
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(`${empValue} ~ ${irrName} ~ ${categoryValue} ~ ${empRadioValue} ~  ~ ${empRemark} ~ ${empDate} ~ ${amount}`),
                    Flag: 23
                };
                var Res = await fetch("/ChequeSubmit", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                
                if (responseData.status === "1") {
                    
                    if (!empFileInput.files[0]) {
                        await showAlert("Error!", "Please select a file to upload.", "error");
                        return;
                    }

                    const file = empFileInput.files[0];

                    if (file.type !== 'application/pdf' && file.type !== 'application/vnd.oasis.opendocument.text') {
                        await showAlert("Error!", "Please select a valid PDF or ODF file.", "error");
                        empFileInput.value = "";
                        if (fileNameDisplay) fileNameDisplay.textContent = "";
                        return;
                    }

                    if (file.size > 2 * 1024 * 1024) {
                        await showAlert("Error!", "File size exceeds the 2MB limit.", "error");
                        empFileInput.value = "";
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
                            empFileInput.value = "";
                            if (fileNameDisplay) fileNameDisplay.textContent = "";
                            return;
                        }
                    }
                    // Convert file to Base64
                    let img;
                    try {
                        img = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const base64String = e.target.result.split(',')[1];
                                if (!base64String || !/^[A-Za-z0-9+/=]+$/.test(base64String)) {
                                    reject(new Error('Invalid Base64 string'));
                                }
                                resolve(base64String);
                            };
                            reader.onerror = () => reject(new Error('Failed to read file'));
                            reader.readAsDataURL(empFileInput.files[0]);
                        });
                    } catch (error) {
                        await showAlert("Error!", "Error processing file. Please try again.", "error");
                        return;
                    }
                
                    try {
                        const requestData = {
                            EmpId: sessionStorage.getItem("EmployeeId"),
                            Token: sessionStorage.getItem("Token"),
                            Img: img,
                            Indata: encryptAES(empValue),
                            Flag:2
                        };

                        var Res = await fetch("/PdfUploadcheque", "POST", requestData);
                       
                        Res = decryptAES(Res);
                        const responseData = JSON.parse(Res);
                        if (responseData.status === "True") {
                            await showLoadAlert("Success!", "Cheque Updated Successfully.", "success");
                        } else {
                            await showLoadAlert("Error!", `Submission failed: ${responseData.err_sts || 'Unknown error'}`, "error");
                        }
                    } catch (error) {
                      
                        await showLoadAlert("Error!", `Submission failed: ${error.message || 'Please try again.'}`, "error");
                    }
                }
            } else if (empRadioValue === "N") {
               
                try {
                    const requestData = {
                        Br_id: sessionStorage.getItem("BranchId"),
                        Emp_id: sessionStorage.getItem("EmployeeId"),
                        Token: sessionStorage.getItem("Token"),
                        Indata: encryptAES(`${empValue} ~ ${irrName} ~ ${categoryValue} ~ ${empRadioValue} ~ ${empstatus} ~ ${empRemark} ~ ${empDate} ~ ${amount}`),
                        Flag: 23
                    };
                    var Res = await fetch("/ChequeSubmit", "POST", requestData);
                    Res = decryptAES(Res);
                    const responseData = JSON.parse(Res);
                    if (responseData.status === "1") {
                        await showLoadAlert("Success!", "Cheque Updated Successfully.", "success");
                    } else {
                        await showLoadAlert("Error!", "Submission failed ", "error");
                    }
                } catch (error) {
                    await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");
                }
            }
        } else {
          
            if (cusRadioValue === "Y") {
                try {
                    const requestData = {
                        Br_id: sessionStorage.getItem("BranchId"),
                        Emp_id: sessionStorage.getItem("EmployeeId"),
                        Token: sessionStorage.getItem("Token"),
                        Indata: encryptAES(`${cusId} ~ ${pledgeValue} ~ ${irrName} ~ ${categoryValue} ~ ${cusRadioValue} ~  ~ ${cusRemark} ~ ${cusDate}`),
                        Flag:3
                    };

                    var Res = await fetch("/ChequeSubmit", "POST", requestData);
                    Res = decryptAES(Res);
                    const responseData = JSON.parse(Res);

                    if (responseData.status === "1") {
                        if (!cusFileInput.files[0]) {
                            await showAlert("Error!", "Please select a file to upload.", "error");
                            return;
                        }

                        const file = cusFileInput.files[0];

                        if (file.type !== 'application/pdf' && file.type !== 'application/vnd.oasis.opendocument.text') {
                            await showAlert("Error!", "Please select a valid PDF or ODF file.", "error");
                            cusFileInput.value = "";
                            if (fileNameDisplay) fileNameDisplay.textContent = "";
                            return;
                        }

                        if (file.size > 2 * 1024 * 1024) {
                            await showAlert("Error!", "File size exceeds the 2MB limit.", "error");
                            cusFileInput.value = "";
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
                                cusFileInput.value = "";
                                if (fileNameDisplay) fileNameDisplay.textContent = "";
                                return;
                            }
                        }
                       
                        let img;
                        try {
                            img = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const base64String = e.target.result.split(',')[1];
                                    if (!base64String || !/^[A-Za-z0-9+/=]+$/.test(base64String)) {
                                        reject(new Error('Invalid Base64 string'));
                                    }
                                    resolve(base64String);
                                };
                                reader.onerror = () => reject(new Error('Failed to read file'));
                                reader.readAsDataURL(cusFileInput.files[0]);
                            });
                        } catch (error) {
                            await showAlert("Error!", "Error processing file. Please try again.", "error");
                            return;
                        }
                        try {
                            const requestData = {
                                EmpId: sessionStorage.getItem("EmployeeId"),
                                Token: sessionStorage.getItem("Token"),
                                Img: img,
                                Indata: encryptAES(pledgeValue),
                                Flag: 3
                            };

                            var Res = await fetch("/PdfUploadcheque", "POST", requestData);
                            Res = decryptAES(Res);
                            const responseData = JSON.parse(Res);
                            if (responseData.status === "True") {
                                await showLoadAlert("Success!", "Cheque Updated Successfully.", "success");
                            } else {
                                await showLoadAlert("Error!", `Submission failed: ${responseData.err_sts}`, "error");
                            }
                        } catch (error) {
                            await showLoadAlert("Error!", `Submission failed: ${error.message || 'Please try again.'}`, "error");
                        }
                    } else {
                        await showLoadAlert("Error!", "Submission failed. Please try again.", "error");
                    }
                } catch (error) {
                    await showLoadAlert("Alert!", "Error occurred. Please try again.", "warning");
                }
            } else if (cusRadioValue === "N") {
               
                try {
                    const requestData = {
                        Br_id: sessionStorage.getItem("BranchId"),
                        Emp_id: sessionStorage.getItem("EmployeeId"),
                        Token: sessionStorage.getItem("Token"),
                        Indata: encryptAES(`${cusId} ~ ${pledgeValue} ~ ${irrName} ~ ${categoryValue} ~ ${cusRadioValue} ~ ${cusstatus} ~ ${cusRemark} ~ ${cusDate}`),
                        Flag: 3
                    };
                    var Res = await fetch("/ChequeSubmit", "POST", requestData);
                    Res = decryptAES(Res);
                    const responseData = JSON.parse(Res);
                    if (responseData.status === "1") {
                        await showLoadAlert("Success!", "Cheque Updated Successfully.", "success");
                    } else {
                        await showLoadAlert("Error!", "Submission failed ", "error");
                    }
                } catch (error) {
                    await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");
                }
            }
        }
    } catch (error) {
        await showLoadAlert("Error!", "Error occurred. Please try again.", "error");
    }
}

}
function validateirrgularity() {
    const irregularityType = document.getElementById("DrpIrr").value;
    const employeeDiv = document.getElementById("employee_div");
    const customerDiv = document.getElementById("customer_div");
    const pledgeLabel = document.getElementById("DrpPledgeLabel");
    const pledgeLabelCustomer = document.getElementById("DrpPledgeLabelCustomer");

    if (irregularityType === "4") { // Employee Debit
        employeeDiv.style.display = "block";
        customerDiv.style.display = "none";
        if (pledgeLabel) {
            pledgeLabel.textContent = "Select Employee Code";
        }
    } else if (irregularityType !== "0") { // Other options except SELECT
        employeeDiv.style.display = "none";
        customerDiv.style.display = "block";
        if (pledgeLabelCustomer) {
            pledgeLabelCustomer.textContent = "Select Pledge No";
        }
    } else { // SELECT option
        employeeDiv.style.display = "none";
        customerDiv.style.display = "none";
    }
}
async function validateCusChequeDate() {
    // Get the input dates as strings
    const reportDate = document.getElementById('in_dt').value;
    const chequeDate = document.getElementById('chdt2').value;
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.getDate().toString().padStart(2, '0') + '-' +
        currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase() + '-' +
        currentDate.getFullYear();

    try {
        // Convert dates to Date objects for comparison
        const reportDateObj = new Date(reportDate);
        const chequeDateObj = new Date(chequeDate);
        const currentDateObj = new Date(formattedCurrentDate);

        // Validate input dates
        if (isNaN(reportDateObj) || isNaN(chequeDateObj)) {
            await showAlert('Invalid date format. Please enter valid dates.');
            document.getElementById('chdt2').value = '';
            return;
        }

        // Validate date range
        if (chequeDateObj < reportDateObj || chequeDateObj > currentDateObj) {
            await showAlert('Cheque Date must be between the Reported date and the Current Date');
            document.getElementById('chdt2').value = '';
        }
    } catch (error) {
        
        await showAlert('An error occurred while validating the cheque date.');
        document.getElementById('chdt2').value = '';
    }
}
async function validateEmpChequeDate() {
    // Get the input dates as strings
    const reportDate = document.getElementById('emp_dt').value;
    const chequeDate = document.getElementById('chdt1').value;
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.getDate().toString().padStart(2, '0') + '-' +
        currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase() + '-' +
        currentDate.getFullYear();

    try {
        // Convert dates to Date objects for comparison
        const reportDateObj = new Date(reportDate);
        const chequeDateObj = new Date(chequeDate);
        const currentDateObj = new Date(formattedCurrentDate);

        // Validate input dates
        if (isNaN(reportDateObj) || isNaN(chequeDateObj)) {
            await showAlert('Invalid date format. Please enter valid dates.');
            document.getElementById('chdt1').value = '';
            return;
        }

        // Validate date range
        if (chequeDateObj < reportDateObj || chequeDateObj > currentDateObj) {
            await showAlert('Cheque Date must be between the Reported date and the Current Date');
            document.getElementById('chdt1').value = '';
        }
    } catch (error) {
       
        await showAlert('An error occurred while validating the cheque date.');
        document.getElementById('chdt1').value = '';
    }
}
function formatToCustomDate(dateStr) {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj)) return '';
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
}
function Radio1_onclick() {
    document.getElementById("div25").style.display = "none";
    document.getElementById("div26").style.display = "block";
}
function Radio2_onclick() {
    document.getElementById("div25").style.display = "block";
    document.getElementById("div26").style.display = "none";
}
function Radio3_onclick() {
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "block";
}
function Radio4_onclick() {
    document.getElementById("div1").style.display = "block";
    document.getElementById("div2").style.display = "none";
}
function clearAllFields() {


    document.getElementById("DrpCat").selectedIndex = 0; 
    document.getElementById("DrpPledgeEmp").selectedIndex = 0; 
    document.getElementById("emp_name").value = ""; 
    document.getElementById("phone_no").value = ""; 
    document.getElementById("desg").value = ""; 
    document.getElementById("br_name").value = ""; 
    document.getElementById("br_id").value = ""; 
    document.getElementById("ar_name").value = ""; 
    document.getElementById("rg_name").value = ""; 
    document.getElementById("zone").value = ""; 
    document.getElementById("amount").value = ""; 
    document.getElementById("emp_add").value = ""; 
    document.getElementById("emp_dt").value = "";
    document.getElementById("chdt1").value = ""; 
    document.getElementById("RadioButton3").checked = false; 
    document.getElementById("RadioButton4").checked = false; 
    document.getElementById("emp_status").selectedIndex = 0; 
    document.getElementById("FileUpload2").value = ""; 
    document.getElementById("Remark2").value = ""; 
    document.getElementById("div1").style.display = "none"; 
    document.getElementById("div2").style.display = "none"; 
  

    // Reset Customer Details section
    document.getElementById("DrpPledgeCust").selectedIndex = 0; 
    document.getElementById("cust_id").value = "";
    document.getElementById("cust_name").value = ""; 
    document.getElementById("con_num").value = "";
    document.getElementById("in_dt").value = "";
    document.getElementById("gr_wt").value = ""; 
    document.getElementById("loss").value = ""; 
    document.getElementById("br_id1").value = ""; 
    document.getElementById("br_name1").value = ""; 
    document.getElementById("ar_name1").value = ""; 
    document.getElementById("rg_name1").value = ""; 
    document.getElementById("zone1").value = ""; 
    document.getElementById("add1").value = ""; 
    document.getElementById("chdt2").value = ""; 
    document.getElementById("Radio1").checked = false; 
    document.getElementById("Radio2").checked = false;
    document.getElementById("cus_status").selectedIndex = 0; 
    document.getElementById("FileUpload1").value = "";
    document.getElementById("Remark1").value = "";
    document.getElementById("div25").style.display = "none"; 
    document.getElementById("div26").style.display = "none"; 
}
function cleardiv() {
    
    document.getElementById("emp_name").value = "";
    document.getElementById("phone_no").value = "";
    document.getElementById("desg").value = "";
    document.getElementById("br_name").value = "";
    document.getElementById("br_id").value = "";
    document.getElementById("ar_name").value = "";
    document.getElementById("rg_name").value = "";
    document.getElementById("zone").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("emp_add").value = "";
    document.getElementById("emp_dt").value = "";
    document.getElementById("chdt1").value = "";
    document.getElementById("RadioButton3").checked = false;
    document.getElementById("RadioButton4").checked = false;
    document.getElementById("emp_status").selectedIndex = -1;
    document.getElementById("FileUpload2").value = "";
    document.getElementById("Remark2").value = "";
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "none";


    // Reset Customer Details section
    
    document.getElementById("cust_id").value = "";
    document.getElementById("cust_name").value = "";
    document.getElementById("con_num").value = "";
    document.getElementById("in_dt").value = "";
    document.getElementById("gr_wt").value = "";
    document.getElementById("loss").value = "";
    document.getElementById("br_id1").value = "";
    document.getElementById("br_name1").value = "";
    document.getElementById("ar_name1").value = "";
    document.getElementById("rg_name1").value = "";
    document.getElementById("zone1").value = "";
    document.getElementById("add1").value = "";
    document.getElementById("chdt2").value = "";
    document.getElementById("Radio1").checked = false;
    document.getElementById("Radio2").checked = false;
    document.getElementById("cus_status").selectedIndex = -1;
    document.getElementById("FileUpload1").value = "";
    document.getElementById("Remark1").value = "";
    document.getElementById("div25").style.display = "none";
    document.getElementById("div26").style.display = "none";
}
function radioclear() {
    document.getElementById("emp_status").selectedIndex = -1;
    document.getElementById("FileUpload2").value = "";
    document.getElementById("Remark2").value = "";
    document.getElementById("cus_status").selectedIndex = -1;
    document.getElementById("FileUpload1").value = "";
    document.getElementById("Remark1").value = "";
}
