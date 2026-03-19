$(document).ready(async function () {

    checkAccess("8");


});

$(document).on('change', '#casecatdrp', function () {
    clearAllFields();
    set.SetCaseCat(this.value);;
});

$(document).on('change', '#pledg_drp', function () {
    clearFieldsExceptCaseCat();
    set.SetPledgeDetails(this.value);
});

$(document).on('click', '#set_btn', function () {
    set.SetAmountFetch(this.value);
});

$(document).on('click', '#btnsubmit', function () {
    set.SetSubmit(this.value);
});

$(document).on('click', '#btnreject', function () {
    set.SetReject(this.value);
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

var set = {
    SetCaseCat: async function () {
        const caseCatValue = document.getElementById('casecatdrp').value;

        if (caseCatValue === "0") {
            await showAlert("Alert!", "Please select a Case Category.", "warning");
            return;
        }
    try {

        const requestData = {
            Emp_id: sessionStorage.getItem("EmployeeId"),
            Token: sessionStorage.getItem("Token"),
            Indata: document.getElementById('casecatdrp').value,
            Flag: "5"
        };

        var Res = await fetch("/SettlePledgeLoad", "POST", requestData);
        const responseData = JSON.parse(Res);

        if (responseData.err_code === "1") {
            const selectElement = document.getElementById('pledg_drp');
            selectElement.innerHTML = '';

            const outdata = JSON.parse(responseData.outdata);
         
            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                outdata.Table.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.BR; // Assigning pledge_no as value
                    option.textContent = item.P; // Displaying pledge_no as text
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

    SetPledgeDetails: async function () {
     
        const PledgeValue = document.getElementById('pledg_drp').value;

        if (PledgeValue === "-1") {
            await showAlert("Alert!", "Please select a Pledge Number.", "warning");
            return;
        }
        try {
            let pledgValue = document.getElementById('pledg_drp').value;
            let splittedValues = pledgValue.split('~');
            let firstElement = splittedValues[0];
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: firstElement,
                Flag: "6"
            };
            var Res = await fetch("/SettleGetDetails", "POST", requestData);

            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                const parsedOutdata = JSON.parse(responseData.outdata);
               
                const data = parsedOutdata.Table[0];
               
                // Assign values from data object
                document.getElementById("cus_name").value = data.CUST_NAME;
                document.getElementById("cus_id").value = data.CUST_ID;
                document.getElementById("cus_add").value = data.CUSTOMER_ADDRESS;
                document.getElementById("loan_no").value = data.PLEDGE_NO;
                document.getElementById("loan_amount").value = data.PLEDGE_VAL;
                document.getElementById("gross_wt").value = data.ACT_WEIGHT;
                document.getElementById("stone_wt").value = data.STONE_WEIGHT;
                document.getElementById("net_wt").value = data.NET_WEIGHT;
                document.getElementById("entry_dt").value = data.TRA_DT;
                document.getElementById("br_name").value = data.BRANCH_NAME;
                document.getElementById("irr_type").value = data.STATUS;
                document.getElementById("paper_id").value = data.PAPERLESS_ID;
                document.getElementById("man_id").value = data.MANUAL_ID;
                function handleFileDownload(base64String, fileTypeCode, filenamePrefix = "Document") {
                    return new Promise(async (resolve, reject) => {
                        if (!base64String || base64String.trim() === "" || base64String === "AA==") {
                            await showAlert("Error!", "No document available.", "error");
                            resolve(); // Resolve to indicate completion, even on error
                            return;
                        }
                        if (!fileTypeCode || ![1, 2, 3, 4].includes(fileTypeCode)) {
                            await showAlert("Error!", "Invalid or unsupported file type code.", "error");
                            resolve();
                            return;
                        }

                        try {
                            const byteCharacters = atob(base64String);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);

                            let extension, mimeType;
                            switch (fileTypeCode) {
                                case 1:
                                    extension = "jpg";
                                    mimeType = "image/jpeg";
                                    break;
                                case 2:
                                    extension = "pdf";
                                    mimeType = "application/pdf";
                                    break;
                                case 3:
                                    extension = "doc";
                                    mimeType = "application/msword";
                                    break;
                                case 4:
                                    extension = "docx";
                                    mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                                    break;
                                default:
                                    await showAlert("Error!", `Unsupported file type code: ${fileTypeCode}`, "error");
                                    resolve();
                                    return;
                            }

                            const filename = `${filenamePrefix}.${extension}`;
                            const blob = new Blob([byteArray], { type: mimeType });
                            const url = URL.createObjectURL(blob);

                            const link = document.createElement("a");
                            link.href = url;
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            setTimeout(() => URL.revokeObjectURL(url), 1000);
                            resolve(); // Resolve on successful download
                        } catch (error) {
                            await showAlert("Error!", "Error processing document. It might be corrupted or in an unsupported format.", "error");
                            reject(error); // Reject on error for proper error handling
                        }
                    });
                }

                // Event listeners for document downloads
                document.getElementById("viewKYC").addEventListener("click", () => handleFileDownload(data.KYC, 2, "KYC_Document"));
                document.getElementById("viewFIR").addEventListener("click", () => handleFileDownload(data.FIR_ATT, 2, "FIR_Document"));
                document.getElementById("view91").addEventListener("click", () => handleFileDownload(data.NOTICE_91, 2, "91_Notice"));
                document.getElementById("viewPawn").addEventListener("click", () => handleFileDownload(data.PWAN_TICKET, 2, "Pawn_Ticket"));
                document.getElementById("viewDpn").addEventListener("click", () => handleFileDownload(data.DPN, 2, "DPN_Document"));
                document.getElementById("viewSeiz").addEventListener("click", () => handleFileDownload(data.SEIZURE_ATT, 2, "Seizure_Document"));
                document.getElementById("viewCon").addEventListener("click", () => handleFileDownload(data.CONFESS_STATEMENT, 2, "Confession_Statement"));
                document.getElementById("viewLO9").addEventListener("click", () => handleFileDownload(data.LO9_ATT, data.LO9_STATUS, "LO9_Document"));
            } else {
                await showAlert("Alert!", "Unable to load Details.", "warning");
            }
        } catch (error) {
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");

        }
    },


    SetAmountFetch: async function () {
       
        try {

            const caseCatDrp = document.getElementById('casecatdrp').value;
            const pledgDrp = document.getElementById('pledg_drp').value;



            if (!caseCatDrp || caseCatDrp.trim() === "" || caseCatDrp === "0") {
                await showAlert("Error!", "Please select a case category before submitting.", "error");
                return;
            }


            if (!pledgDrp || pledgDrp.trim() === "" || pledgDrp === "-1") {
                await showAlert("Error!", "Please select a pledge number before submitting.", "error");
                return;
            }

            // Prepare data for request
            const data = {
                loan_no: document.getElementById('loan_no').value,
                empId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token")
            };

            var Res = await fetch("/SettleAmountFetch", "POST", data);

            const responseData = JSON.parse(Res);
          
           
            if (typeof responseData.amount === "string" && responseData.amount.trim() !== "") {

                if (responseData.amount === "The pledge has inaccurate datas") {
                    await showAlert("Error!", "The pledge has ", "error");
                    return;
                }
                document.getElementById("set_amt").value = responseData.amount;
            } else {

                await showAlert("Error!", "Fetching settlement amount", "error");
                return;
            }

        } catch (error) {
            await showAlert("Error!", "Error occurred while uploading. Please try again.", "error");
            return;
        }


    },



    SetSubmit: async function () {
       
        try {

            const caseCatDrp = document.getElementById('casecatdrp').value;
            const pledgDrp = document.getElementById('pledg_drp').value;
            const SetAmount = document.getElementById('set_amt').value;
            const SetRmk = document.getElementById('set_rmk').value;

            if (!caseCatDrp || caseCatDrp.trim() === "" || caseCatDrp === "0") {
                await showAlert("Error!", "Please select a case category before submitting.", "error");
                return;
            }

            if (!pledgDrp || pledgDrp.trim() === "" || pledgDrp === "-1") {
                await showAlert("Error!", "Please select a pledge number before submitting.", "error");
                return;
            }

            if (!SetAmount || SetAmount.trim() === "") {
                await showAlert("Error!", "Please Click on Settlement Amount button before submitting.", "error");
                return;
            }

            if (!SetRmk || SetRmk.trim() === "") {
                await showAlert("Error!", "Please enter the remarks before submitting.", "error");
                return;
            }
            // Prepare data for request
            const data = {
                loan_no: document.getElementById('loan_no').value,
                remark: document.getElementById('set_rmk').value,
                empId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token")
            };

            var Res = await fetch("/SettleSubmit", "POST", data);

            const responseData = JSON.parse(Res);
           
            if (responseData.err_sts === "1") {
               
                await showLoadAlert("Success!", "Successfully Submitted", "success");

            } else {
               
                await showLoadAlert("Error!", "Not Confirmed", "error");
            }

        } catch (error) {
            await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");
          
        }

    },


    SetReject: async function () {
      
        try {

            const caseCatDrp = document.getElementById('casecatdrp').value;
            const pledgDrp = document.getElementById('pledg_drp').value;
            const SetAmount = document.getElementById('set_amt').value;
            const SetRmk = document.getElementById('set_rmk').value;


            if (!caseCatDrp || caseCatDrp.trim() === "" || caseCatDrp === "0") {
                await showAlert("Error!", "Please select a case category before submitting.", "error");
                return;
            }


            if (!pledgDrp || pledgDrp.trim() === "" || pledgDrp === "-1") {
                await showAlert("Error!", "Please select a pledge number before submitting.", "error");
                return;
            }

            if (!SetAmount || SetAmount.trim() === "") {
                await showAlert("Error!", "Please Click on Settlement Amount button before submitting.", "error");
                return;
            }

            if (!SetRmk || SetRmk.trim() === "") {
                await showAlert("Error!", "Please enter the remarks before submitting.", "error");
                return;
            }

            // Prepare data for request
            const data = {
                loan_no: document.getElementById('loan_no').value,
                EmpId: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token")
            };

            var Res = await fetch("/SettleReject", "POST", data);

            const responseData = JSON.parse(Res);
            
            if ( responseData.err_sts === "1") {
               
                await showLoadAlert("Success!Successfully Rejected",  "success");

            } else {
               
                await showLoadAlert("Error!", "Not Confrimed", "error");
            }
S
        } catch (error) {
            await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");
            
        }


    }


}


function clearAllFields() {
    document.getElementById('cus_name').value = '';
    document.getElementById('cus_id').value = '';
    document.getElementById('cus_add').value = '';
    document.getElementById('loan_no').value = '';
    document.getElementById('loan_amount').value = '';
    document.getElementById('gross_wt').value = '';
    document.getElementById('stone_wt').value = '';
    document.getElementById('net_wt').value = '';
    document.getElementById('entry_dt').value = '';
    document.getElementById('pledg_drp').value = '';
    document.getElementById('set_rmk').value = '';
    document.getElementById('br_name').value = '';
    document.getElementById('irr_type').value = '';
    document.getElementById('paper_id').value = '';
    document.getElementById('man_id').value = '';
    document.getElementById('set_amt').value = '';
    const elements = [
        "viewKYC", "viewFIR", "view91", "viewPawn",
        "viewDpn", "viewSeiz", "viewCon","viewLO9"
    ];

    elements.forEach(id => {
        let elem = document.getElementById(id);
        let newElem = elem.cloneNode(true);
        elem.parentNode.replaceChild(newElem, elem);
    });
}
function clearFieldsExceptCaseCat() {
    document.getElementById('cus_name').value = '';
    document.getElementById('cus_id').value = '';
    document.getElementById('cus_add').value = '';
    document.getElementById('loan_no').value = '';
    document.getElementById('loan_amount').value = '';
    document.getElementById('gross_wt').value = '';
    document.getElementById('stone_wt').value = '';
    document.getElementById('net_wt').value = '';
    document.getElementById('entry_dt').value = '';
    document.getElementById('set_rmk').value = '';
    document.getElementById('br_name').value = '';
    document.getElementById('irr_type').value = '';
    document.getElementById('paper_id').value = '';
    document.getElementById('man_id').value = '';
    document.getElementById('set_amt').value = '';
    const elements = [
        "viewKYC", "viewFIR", "view91", "viewPawn",
        "viewDpn", "viewSeiz", "viewCon","viewLO9"
    ];

    elements.forEach(id => {
        let elem = document.getElementById(id);
        let newElem = elem.cloneNode(true); // Clone element without event listeners
        elem.parentNode.replaceChild(newElem, elem); // Replace old element with new one
    });


}


