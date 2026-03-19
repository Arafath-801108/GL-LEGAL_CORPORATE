$(document).ready(async function () {

    checkAccess("7");


});

$(document).on('change', '#casecatdrp', function () {
    clearAllFields();
    Class.CaseCat(this.value);
});

$(document).on('change', '#pledg_drp', function () {
    clearFieldsExceptCaseCat();
    Class.PledgeDetails(this.value);;
});

$(document).on('click', '#class_sub', function () {
    Class.ClassConfirmSubmit(this.value);
});
$(document).on('click', '#btnreject', function () {
    Class.ClassRejectSubmit(this.value);
});
$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

window.Class = {

    CaseCat: async function () {
       
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
                Flag: "3"
            };

            var Res = await fetch("/ClassPledgeLoad", "POST", requestData);
            const responseData = JSON.parse(Res);

            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('pledg_drp');
                selectElement.innerHTML = '';

                const outdata = JSON.parse(responseData.outdata);
               
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.PL_ID; 
                        option.textContent = item.PLEDGE_NO; 
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

    PledgeDetails: async function () {
        const PledgeValue = document.getElementById('pledg_drp').value;

        if (PledgeValue === "-1") {
            await showAlert("Alert!", "Please select a Pledge Number.", "warning");
            return;
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: document.getElementById('pledg_drp').value,
                Flag: "4"
            };
            var Res = await fetch("/ClassGetDetails", "POST", requestData);

            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {

                const parsedOutdata = JSON.parse(responseData.outdata);
                
                const data = parsedOutdata.Table[0];
               
                document.getElementById("cus_name").value = data.CUST_NAME;
                document.getElementById("cus_id").value = data.CUST_ID;
                document.getElementById("pledg_val").value = data.PLEDGE_VAL;
                document.getElementById("gross_wt").value = data.ACT_WEIGHT;
                document.getElementById("stone_wt").value = data.STONE_WEIGHT;
                document.getElementById("net_wt").value = data.NET_WEIGHT;
                document.getElementById("paper_id").value = data.PAPERLESS_ID;
                document.getElementById("man_id").value = data.MANUAL_ID;
                document.getElementById("irr_type").value = data.STATUS;
                document.getElementById("irr_code").value = data.IRR_CODE;
                document.getElementById("irr_status").value = data.STATUS_ID;

              
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

     ClassConfirmSubmit: async function () {

         try {
          
            const caseCatDrp = document.getElementById('casecatdrp').value;
            const pledgDrp = document.getElementById('pledg_drp').value;
            const remark = document.getElementById('class_rmk').value;


            if (!caseCatDrp || caseCatDrp.trim() === "" || caseCatDrp === "0") {
                await showAlert("Error!", "Please select a case category before submitting.", "error");
                return;
            }


            if (!pledgDrp || pledgDrp.trim() === "" || pledgDrp === "-1") {
                await showAlert("Error!", "Please select a pledge number before submitting.", "error");
                return;
            }
             if (!remark || remark.trim() === "") {
                 await showAlert("Error!", "Please enter the remarks before submitting.", "error");
                 return;
             }
          
            // Prepare data for request
            const data = {
                Indata: document.getElementById('irr_code').value + '~' + document.getElementById('pledg_drp').value + '~' + document.getElementById('irr_status').value + '~' + document.getElementById('class_rmk').value,
                Flag:"2",
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token")
            };

             var Res = await fetch("/ClassSeizedSubmit", "POST", data);

            const responseData = JSON.parse(Res);

             if (typeof responseData.message === "string" && responseData.message.trim() !== "") {
                 
                 await showLoadAlert("Success!", responseData.message, "success");
             } else {
               
                 await showLoadAlert("Error!", "Submission failed: No message provided", "error");
             }

        } catch (error) {
             await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");
           
        }
    },

     ClassRejectSubmit: async function () {

        try {

            const caseCatDrp = document.getElementById('casecatdrp').value;
            const pledgDrp = document.getElementById('pledg_drp').value;
            const remark = document.getElementById('class_rmk').value;


            if (!caseCatDrp || caseCatDrp.trim() === "" || caseCatDrp === "0") {
                await showAlert("Error!", "Please select a case category before submitting.", "error");
                return;
            }


            if (!pledgDrp || pledgDrp.trim() === "" || pledgDrp === "-1") {
                await showAlert("Error!", "Please select a pledge number before submitting.", "error");
                return;
            }
            if (!remark || remark.trim() === "") {
                await showAlert("Error!", "Please enter the remarks before submitting.", "error");
                return;
            }

            // Prepare data for request
            const data = {
                Indata: document.getElementById('pledg_val').value + '~' +  document.getElementById('irr_code').value + '~' + document.getElementById('pledg_drp').value + '~' + document.getElementById('irr_status').value + '~' + document.getElementById('class_rmk').value,
                Flag: "3",
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token")
            };

            var Res = await fetch("/ClassSeizedReject", "POST", data);

            const responseData = JSON.parse(Res);

            if (typeof responseData.message === "string" && responseData.message.trim() !== "") {
               
                await showLoadAlert("Success!", responseData.message, "success");
            } else {
               
                await showLoadAlert("Error!", "Submission failed: No message provided", "error");
            }

        } catch (error) {
            await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");
           
        }
    }
}

function clearAllFields() {
    document.getElementById('cus_name').value = '';
    document.getElementById('cus_id').value = '';
    document.getElementById('pledg_val').value = '';
    document.getElementById('gross_wt').value = '';
    document.getElementById('stone_wt').value = '';
    document.getElementById('net_wt').value = '';
    document.getElementById('paper_id').value = '';
    document.getElementById('man_id').value = '';
    document.getElementById('irr_type').value = '';
    document.getElementById('pledg_drp').value = '';
    document.getElementById('irr_code').value = '';
    document.getElementById('irr_status').value = '';
    document.getElementById('class_rmk').value = '';
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
    document.getElementById('pledg_val').value = '';
    document.getElementById('gross_wt').value = '';
    document.getElementById('stone_wt').value = '';
    document.getElementById('net_wt').value = '';
    document.getElementById('paper_id').value = '';
    document.getElementById('man_id').value = '';
    document.getElementById('irr_type').value = '';
    document.getElementById('irr_code').value = '';
    document.getElementById('irr_status').value = '';
    document.getElementById('class_rmk').value = '';
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


