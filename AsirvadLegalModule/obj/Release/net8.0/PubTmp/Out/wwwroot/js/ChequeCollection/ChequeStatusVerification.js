$(document).ready(async function () {

   checkAccess("22");


});
$(document).on('change', '#DrpIrr', function () {
    Stverify.VeriIrrSelect(); validateirrgularity();
});

$(document).on('change', '#DrpPledgeEmp', function () {
    Stverify.Datafetch(); cleardiv();
});

$(document).on('change', '#DrpPledgeCust', function () {
    Stverify.Datafetch(); cleardiv();
});

$(document).on('click', '#btnsubmit1', function () {
    Stverify.VerifySubmit();
});

$(document).on('click', '#btnreject', function () {
    Stverify.VerifyReject();
});
$(document).on('click', '#btnexit', function () {
    redirectToDashboard()
});



var Stverify = {
    VeriIrrSelect: async function () {
        try {
            const irrdrp = document.getElementById('DrpIrr').value
            const requestData = {
                Br_id: sessionStorage.getItem("BranchId"),
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(irrdrp),
                Flag:18
            };

            var Res = await fetch("/IrrSelect1", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if (responseData.status === "1") {
                if (irrdrp === "4") {
                    const selectElement = document.getElementById('DrpPledgeEmp');
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
                    const selectElement = document.getElementById('DrpPledgeCust');
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
    Datafetch: async function () {
      
        //document.getElementById("reasonBox1").classList.add("hidden");

        const irrValue = document.getElementById('DrpIrr').value;
        const pledgeValue = document.getElementById('DrpPledgeCust').value;
        const EmpValue = document.getElementById('DrpPledgeEmp').value;

        // Common function to handle file download
        async function handleFileDownload(base64String, filename) {
            if (!base64String || base64String.trim() === "" || base64String === "AA==") {
                await showAlert("No document available.");
                return;
            }
            try {
                const byteCharacters = atob(base64String);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const mimeType = "application/pdf";
                const blob = new Blob([byteArray], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                await showAlert("Error processing document. It might be corrupted or an unsupported format.");
            }
        }

        // Handle Employee Data (irrValue === "4")
        if (irrValue === "4") {
            if (!EmpValue || EmpValue.trim() === "" || EmpValue === "-1") {
                await showAlert("Alert!", "Please select a Employee Code.", "warning");
                return;
            }
            try {
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(EmpValue + " ~ " + irrValue),
                    Flag:34
                };
                var Res = await fetch("/IrrSelection", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                if (responseData.status === "1") {
                    const parsedOutdata = JSON.parse(responseData.outdata);
                   
                    const data = parsedOutdata.Table[0];

                    // Assign values to form fields
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
                    document.getElementById("emp_cat").value = data.IRREGULARITY_STATUS;
                    document.getElementById("emp_status").value = data.CHEQUE_STS;

                    document.getElementById("emp_cheque").addEventListener("click", () => handleFileDownload(data.CHEQUE_DOC, 2, "Cheque_Document.pdf"));
                    document.getElementById("emp_challan").addEventListener("click", () => handleFileDownload(data.CHALLAN_DOC, 2, "Challan_Document.pdf"));
                    document.getElementById("emp_return").addEventListener("click", () => handleFileDownload(data.STATEMENT_DOC, 2, "Return Statement_Document.pdf"));
                    doc = document.getElementById("emp_status").value;
                   
                    if (data.CHEQ_STS === "E") {
                        document.getElementById("bounced_cheque_div").style.display = "none";
                    } 
                    document.getElementById("emp_bounce").addEventListener("click", () => handleFileDownload(data.BOUNCE_CHE_DOC, 2, "Return Statement_Document.pdf"));

                } else {
                    await showAlert("Alert!", "Unable to load Employee Details.", "warning");
                }
            } catch (error) {
                await showAlert("Error!", "An error occurred while fetching Employee data. Please try again.", "error");
            }
        }
        // Handle Customer Data (irrValue !== "4")
        else {
            if (!pledgeValue || pledgeValue.trim() === "" || pledgeValue === "-1") {
                await showAlert("Alert!", "Please select a pledge number.", "warning");
                return;
            }
            try {
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(pledgeValue + " ~ " + irrValue),
                    Flag:19
                };
                var Res = await fetch("/IrrSelection", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                if (responseData.status === "1") {
                    const parsedOutdata = JSON.parse(responseData.outdata);
                    const data = parsedOutdata.Table[0];
                    // Assign values to form fields
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
                    document.getElementById("add1").value = data.ADDRESS;
                    document.getElementById("cus_cat").value = data.IRREGULARITY_STATUS;
                    document.getElementById("cus_status").value = data.CHEQUE_STS
;

                    // Handle file download for customer
                    document.getElementById("cus_cheque").addEventListener("click", () => handleFileDownload(data.CHEQUE_DOC, 2, "Cheque_Document.pdf"));
                    document.getElementById("cus_challan").addEventListener("click", () => handleFileDownload(data.CHALLAN_DOC, 2, "Challan_Document.pdf"));
                    document.getElementById("cus_return").addEventListener("click", () => handleFileDownload(data.STATEMENT_DOC, 2, "Return Statement_Document.pdf"));
                  
                    if (data.CHEQ_STS === "E") {
                        document.getElementById("bounced_cheque_div1").style.display = "none";
                    }
                    document.getElementById("cus_bounce").addEventListener("click", () => handleFileDownload(data.BOUNCE_CHE_DOC, 2, "Return Statement_Document.pdf"));

                } else {
                    await showAlert("Alert!", "Unable to load Customer Details.", "warning");
                }
            } catch (error) {
                await showAlert("Error!", "An error occurred while fetching Customer data. Please try again.", "error");
            }
        }
    },
    VerifySubmit: async function () {
      
        const irrValue = document.getElementById('DrpIrr').value;
        const pledgeValue = document.getElementById('DrpPledgeCust').value;
        const EmpValue = document.getElementById('DrpPledgeEmp').value;
        const EmpRmk = document.getElementById('emp_rmk').value;
        const CusRmk = document.getElementById('cus_rmk').value;


        if (!irrValue || irrValue.trim() === "" || irrValue === "0") {
            await showAlert("Alert!", "Please select a Irregularity type .", "warning");
            return;
        }

        // Prepare data for request
        if (irrValue === "4") {
            if (!EmpValue || EmpValue.trim() === "" || EmpValue === "-1") {
                await showAlert("Alert!", "Please select a Employee code", "warning");
                return;
            }
            if (!EmpRmk || EmpRmk.trim() === "") {
                await showAlert("Alert!", "Please Enter Your Remarks .", "warning");
                return;
            }
            try {
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(EmpValue + " ~ " + EmpRmk),
                    Flag: 35
                };

                var Res = await fetch("/IrrSelect", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                if (responseData.status === "1") {

                    await showLoadAlert("Success!", "Successfully Cheque Status Verified", "success");

                } else {

                    await showLoadAlert("Error!", "Not Confirmed", "error");
                }

            }
            catch (error) {
                await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");

            }

        }
        else {
            if (!pledgeValue || pledgeValue.trim() === "" || pledgeValue === "-1") {
                await showAlert("Alert!", "Please select a pledge number.", "warning");
                return;
            }
            if (!CusRmk || CusRmk.trim() === "") {
                await showAlert("Alert!", "Please Enter Your Remarks .", "warning");
                return;
            }
            try {
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(pledgeValue + " ~ " + CusRmk),
                    Flag: 21
                };

                var Res = await fetch("/IrrSelect", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                if (responseData.status === "1") {

                    await showLoadAlert("Success!", "Successfully Cheque Status Verified", "success");

                } else {

                    await showLoadAlert("Error!", "Not Confirmed", "error");
                }

            }
            catch (error) {
                await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");

            }
        }
    },
    VerifyReject: async function () {
      
        const irrValue = document.getElementById('DrpIrr').value;
        const pledgeValue = document.getElementById('DrpPledgeCust').value;
        const EmpValue = document.getElementById('DrpPledgeEmp').value;
        const EmpRmk = document.getElementById('emp_rmk').value;
        const CusRmk = document.getElementById('cus_rmk').value;

        if (!irrValue || irrValue.trim() === "" || irrValue === "0") {
            await showAlert("Alert!", "Please select a Irregularity type .", "warning");
            return;
        }


        // Prepare data for request
        if (irrValue === "4") {
            if (!EmpValue || EmpValue.trim() === "" || EmpValue === "-1") {
                await showAlert("Alert!", "Please select a Employee Code.", "warning");
                return;
            }
            if (!EmpRmk || EmpRmk.trim() === "") {
                await showAlert("Alert!", "Please Enter Your Remarks .", "warning");
                return;
            }
            try {
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(EmpValue + " ~ " + EmpRmk),
                    Flag: 36
                };

                var Res = await fetch("/IrrSelect", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                if (responseData.status === "1") {

                    await showLoadAlert("Success!", "The Cheque Status is Rejected", "success");

                } else {

                    await showLoadAlert("Error!", "Not Confirmed", "error");
                }

            }
            catch (error) {
                await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");

            }

        }
        else {
            if (!pledgeValue || pledgeValue.trim() === "" || pledgeValue === "-1") {
                await showAlert("Alert!", "Please select a pledge number.", "warning");
                return;
            }
            if (!CusRmk || CusRmk.trim() === "") {
                await showAlert("Alert!", "Please Enter Your Remarks .", "warning");
                return;
            }
            try {
                const requestData = {
                    Br_id: sessionStorage.getItem("BranchId"),
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(pledgeValue + " ~ " + CusRmk),
                    Flag:20
                };

                var Res = await fetch("/IrrSelect", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                if (responseData.status === "1") {

                    await showLoadAlert("Success!", "The Cheque Status is Rejected", "success");

                } else {

                    await showLoadAlert("Error!", "Not Confirmed", "error");
                }

            }
            catch (error) {
                await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");

            }
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
function clearAllFields() {



    document.getElementById("DrpPledgeEmp").selectedIndex = 0;
    document.getElementById("emp_cat").value = "";
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
    document.getElementById("emp_reason").value = "";
    document.getElementById("emp_rmk").value = "";

    // Reset Customer Details section
    document.getElementById("DrpPledgeCust").selectedIndex = 0;
    document.getElementById("cus_cat").value = "";
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
    document.getElementById("cus_rmk").value = "";
    document.getElementById("cus_reason").value = "";
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
    document.getElementById("emp_status").value = "";
    document.getElementById("emp_rmk").value = "";



    document.getElementById("cus_cat").value = "";
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
    document.getElementById("cus_rmk").value = "";
    document.getElementById("cus_status").value = "";
    
    const elements = [
        "emp_bounce", "emp_return", "emp_challan", "emp_cheque",
        "cus_bounce", "cus_return", "cus_challan", "cus_cheque",
    ];

    elements.forEach(id => {
        let elem = document.getElementById(id);
        let newElem = elem.cloneNode(true); // Clone element without event listeners
        elem.parentNode.replaceChild(newElem, elem); // Replace old element with new one
    });
}