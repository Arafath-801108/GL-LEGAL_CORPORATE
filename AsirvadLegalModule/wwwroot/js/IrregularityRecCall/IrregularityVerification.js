$(document).ready(async function () {

    checkAccess("34");
});


$(document).on('change', '#cmb_category', function () {
    _verify.getBranchDetails();
});

$(document).on('change', '#cmb_branchid', function () {
    _verify.getCustomerDetails();
});

$(document).on('change', '#cmb_custid', function () {
    _verify.getallDetails();
});

$(document).on('click', '#btn_confirm', function () {
    _verify.btnConfirmClick();
});

$(document).on('click', '#btn_exit', function () {
    redirectToDashboard();
});

$(document).on('click', '#btn_reject', function () {
    _verify.btnRejectClick();
});

var _verify = {
    async getBranchDetails() {

        if (document.getElementById("cmb_category").value == "-1") {
            window.location.reload();

        }
        
        const input_value = document.getElementById("cmb_category").value
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(input_value),
            as_optflag: encryptAES("8")
        };
        var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {
            const selectElement = document.getElementById('cmb_branchid');
            selectElement.innerHTML = '';

            outdata = JSON.parse(responseData.outdata);

            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                outdata.Table.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.ID;
                    option.textContent = item.NAME;
                    selectElement.appendChild(option);
                });

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Call reasons.", "warning");
        }
    },
    async getCustomerDetails() {
        if (document.getElementById("cmb_branchid").value == "-1") {
            window.location.reload();

        }
        const input_value = document.getElementById("cmb_category").value + "~" + document.getElementById('cmb_branchid').value
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(input_value),
            as_optflag: encryptAES("9")
        };
        var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {
            const selectElement = document.getElementById('cmb_custid');
            selectElement.innerHTML = '';

            outdata = JSON.parse(responseData.outdata);

            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                outdata.Table.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.ID;
                    option.textContent = item.NAME;
                    selectElement.appendChild(option);
                });

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Call reasons.", "warning");
        }
    },
    async getallDetails() {
        
        if (document.getElementById("cmb_custid").value == "-1") {
            window.location.reload();

        }

        const input_value = document.getElementById("cmb_custid").value

        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(input_value),
            as_optflag: encryptAES("10")
        };
        var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {

            outdata = JSON.parse(responseData.outdata);

            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                var data = outdata.Table[0];
                document.getElementById("txt_custname").value = data.CUST_NAME;
                document.getElementById("txt_state1").value = data.STATE_NAME;
                document.getElementById("txt_cust_ph1").value = data.PHONE1;
                document.getElementById("txt_cust_ph2").value = data.PHONE2;
                document.getElementById("txt_irr1").value = data.TOTAL;
                document.getElementById("txt_amt").value = data.AMOUNT;
                document.getElementById("txt_assignedbranch").value = data.ASSIGN_BRANCH;
                document.getElementById("txt_visitedemployee").value = data.EMPLOYEE;
                document.getElementById("txt_customerresponse").value = data.STATUS;
                document.getElementById("txt_customerhouse").value = data.HOME_STS;
                document.getElementById("txt_date1").value = data.COMDATE;
                
                debugger;
                let DOC1_MIME = "";  // use let so you can assign later
                const extension1 = data.EXT1;
                const extension2 = data.EXT2;

                // Determine MIME type
                if (extension1 === "pdf" || extension2 === "pdf") {
                    DOC1_MIME = "application/pdf";
                }
                else if (extension1 === "doc" || extension2 === "doc") {
                    DOC1_MIME = "application/msword";
                }
                else if (extension1 === "docx" || extension2 === "docx") {
                    DOC1_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                }
                else if (extension1 === "xls" || extension2 === "xls") {
                    DOC1_MIME = "application/vnd.ms-excel";
                }
                else if (extension1 === "xlsx" || extension2 === "xlsx") {
                    DOC1_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                }

                function downloadBase64File(base64Data, fileNameWithoutExt, mimeType, fileExtension) {
                    debugger;
                    if (!base64Data) {
                        showAlert("No file available to download.");
                        return;
                    }

                    // Determine extension
                    const ext = fileExtension || (mimeType ? mimeToExt[mimeType] : "bin");

                    // Decode Base64 to byte array
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);

                    // Create a blob and trigger download
                    const blob = new Blob([byteArray], { type: mimeType || "application/octet-stream" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `${fileNameWithoutExt}.${ext}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                document.getElementById("btn_doc1").addEventListener("click", () => {
                    downloadBase64File(
                        data.HOME_DOC1,
                        "Document1",
                        DOC1_MIME,  // Pass MIME if available
                        extension1    // Or extension if MIME not available
                    );
                });
                document.getElementById("btn_doc2").addEventListener("click", () => {
                    downloadBase64File(
                        data.HOME_DOC2,
                        "Document2",
                        DOC1_MIME,  // Pass MIME if available
                        extension2    // Or extension if MIME not available
                    );
                });
               

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Customer Details.", "warning");
        }
    },

    async btnRejectClick() {
        try {
            
            var cmbCategory = document.getElementById("cmb_category");
            var cmbbr = document.getElementById("cmb_branchid");
            var cmbCustId = document.getElementById("cmb_custid");
            var selectedText = cmbCustId.selectedOptions[0].text;
            var parts = selectedText.split("~");
            var seq_id = parts.length > 1 ? parts[1] : "";
            var cmbRmk = document.getElementById("txt_remark");
            if (cmbCategory.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Category Type", "warning");
                return;
            } else if (cmbbr.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Branch", "warning");
                return;
            } else if (cmbCustId.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Customer ID", "warning");
                return;
            } else if (cmbRmk.value=== "") {
                await showAlert("Alert!", "Please Enter remark", "warning");
                return;
            }
            debugger;
            inputData = `${cmbCustId.value}*${""}*${""}*${""}*${""}*${""}*${cmbCategory.value}*${""}*${""}*${seq_id}*${""}*${cmbRmk.value}`

            home_data = "";
            fileData1 = "";
            fileData2 = "";
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(inputData + "|" + home_data + "|" + fileData1 + "|" + fileData2),
                as_optflag: encryptAES("4")
            };

            var Res = await fetch("/IrregularityConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if ((responseData).err_code == "1") {
                await showLoadAlert("Success!", "Rejected Successfully", "success");

            }
            else {
                await showLoadAlert("Alert!", "Failed..", "warning");

            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");

        }
    },
    async btnConfirmClick() {
        try {
           
            var cmbCategory = document.getElementById("cmb_category");
            var cmbbr = document.getElementById("cmb_branchid");
            var cmbCustId = document.getElementById("cmb_custid");
            var selectedText = cmbCustId.selectedOptions[0].text;
            var parts = selectedText.split("~");
            var seq_id = parts.length > 1 ? parts[1] : "";
            var cmbRmk = document.getElementById("txt_remark");
            if (cmbCategory.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Category Type", "warning");
                return;
            } else if (cmbbr.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Branch", "warning");
                return;
            } else if (cmbCustId.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Customer ID", "warning");
                return;
            } else if (cmbRmk.value === "") {
                await showAlert("Alert!", "Please Enter remark", "warning");
                return;
            }
            
            inputData = `${cmbCustId.value}*${""}*${""}*${""}*${""}*${""}*${cmbCategory.value}*${""}*${""}*${seq_id}*${""}*${cmbRmk.value}`

            home_data = "";
            fileData1 = "";
            fileData2 = "";
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(inputData + "|" + home_data + "|" + fileData1 + "|" + fileData2),
                as_optflag:encryptAES("5")
            };

            var Res = await fetch("/IrregularityConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if ((responseData).err_code == "1") {
                await showLoadAlert("Success!", "Confirmed Successfully", "success");

            }
            else {
                await showLoadAlert("Alert!", "Failed..", "warning");

            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");

        }
    },
}