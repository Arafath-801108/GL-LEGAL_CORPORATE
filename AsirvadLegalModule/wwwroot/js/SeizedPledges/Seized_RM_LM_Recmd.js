$(document).ready(async function () {
   
    checkAccess("44");


});

$(document).on('change', '#casecatdrp', function () {
   
    Class.CaseCat(this.value);
});

$(document).on('change', '#pledg_drp', function () {
   
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
       
        $('#viewDra').hide();
        $('#viewRec').hide();
        const caseCatValue = document.getElementById('casecatdrp').value;
        document.getElementById('pledg_drp').innerHTML = '';
        clearAllFields();
        if (caseCatValue === "0") {
           
            clearAllFields();
            return;
        }
        else if (caseCatValue === "1") {
            $('#viewDra').show();
            $('#viewRec').show();
        }
        else {
            $('#viewDra').hide();
            $('#viewRec').hide();
        }
        try {

            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(document.getElementById('casecatdrp').value),
                Flag: "16"
            };

            var Res = await fetch("/ClassPledgeLoad", "POST", requestData);
            Res = decryptAES(Res);
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
            clearAllFields();
        }
        else {
            try {
                const requestData = {
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(document.getElementById('pledg_drp').value),
                    Flag: "17"
                };
                var Res = await fetch("/ClassGetDetails", "POST", requestData);
                Res = decryptAES(Res);
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
                    if (data.AUCTION_PLEDGE === "Y") {
                        document.getElementById("case_typ").value = "YES";
                    } else {
                        document.getElementById("case_typ").value = "NO";
                    }

                    function handleFileDownload(base64String, fileTypeCode, filenamePrefix = "Document") {
                        debugger;
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

                                const mimeType1 = detectMimeType(base64String);
                                const blob1 = base64ToBlob(base64String, mimeType1);
                                currentDocUrl = URL.createObjectURL(blob1);

                                viewDocument(currentDocUrl, mimeType1);

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
                    document.getElementById("viewRec").addEventListener("click", () => handleFileDownload(data.COMPLNT_RECEIPT, data.COMPLNT_RECEIPT_EXT, "Complaint_Receipt_Document"));

                    document.getElementById("viewDra").addEventListener("click", () => handleFileDownload(data.COMPLNT_DRAFT, data.COMPLNT_DRAFT_EXT, "Complaint_Draft_Document"));

                } else {
                    await showAlert("Alert!", "Unable to load Details.", "warning");
                }
            } catch (error) {
                await showAlert("Alert!", "Error occurred. Please try again.", "warning");

            }
        }
    },

    ClassConfirmSubmit: async function () {
        debugger;
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

            debugger;
            const data = {
                Indata: encryptAES(document.getElementById('irr_code').value + '~' + document.getElementById('pledg_drp').value + '~' + document.getElementById('irr_status').value + '~' + document.getElementById('class_rmk').value + '~' + caseCatDrp),
                Flag: "5",
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token")
            };
            debugger;
            var Res = await fetch("/ClassSeizedSubmit", "POST", data);
            Res = decryptAES(Res);
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
        debugger;
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
                Indata: encryptAES(document.getElementById('pledg_val').value + '~' + document.getElementById('irr_code').value + '~' + document.getElementById('pledg_drp').value + '~' + document.getElementById('irr_status').value + '~' + document.getElementById('class_rmk').value + '~' + caseCatDrp),
                Flag: "6",
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token")
            };

            var Res = await fetch("/ClassSeizedReject", "POST", data);
            Res = decryptAES(Res);
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
function detectMimeType(base64String) {
    debugger;
    const header = base64String.substring(0, 50); // read more bytes for DOC/DOCX

    if (header.indexOf('/9j/') === 0) return 'image/jpeg';
    if (header.indexOf('iVBORw0KG') === 0) return 'image/png';
    if (header.indexOf('JVBERi0') === 0) return 'application/pdf';
    if (header.indexOf('R0lGODl') === 0) return 'image/gif';

    // DOC files (binary OLE compound) usually start with D0 CF 11 E0
    if (base64String.startsWith('0M8R4KGx')) return 'application/msword';

    // DOCX files are ZIP archives, so they start with PK
    if (base64String.startsWith('UEsDB')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Default to PDF for documents
    return 'application/pdf';
}

function base64ToBlob(base64String, mimeType1) {
    debugger;
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType1 });
}
function viewDocument(url, mimeType1) {
    debugger;
    $('#documentModal').show();

    // For PDF or unknown, use iframe (note: iframe may not work perfectly for all PDFs in all browsers)
    $('#docViewer').attr('src', url).show();
    $('#imgViewer').hide();


}
$(document).on('click', '.close', function () {
    $('#documentModal').hide();
    $('#docViewer').attr('src', '');
    $('#imgViewer').attr('src', '').hide();
    $('#downloadDocBtn').hide(); // Hide download button
    if (currentDocUrl && currentDocUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentDocUrl);
    }
    currentDocUrl = null;
});
$(document).on('click', '#documentModal', function (e) {
    if (e.target === this) {
        $(this).hide();
        $('#docViewer').attr('src', '');
        $('#imgViewer').attr('src', '').hide();
        if (currentDocUrl && currentDocUrl.startsWith('blob:')) {
            URL.revokeObjectURL(currentDocUrl);
        }
        currentDocUrl = null;
    }
});
function clearAllFields() {
    document.getElementById("case_typ").value = '';
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
        "viewDpn", "viewSeiz", "viewCon", "viewLO9", "viewRec","viewDra"
    ];

    elements.forEach(id => {
        let elem = document.getElementById(id);
        let newElem = elem.cloneNode(true);
        elem.parentNode.replaceChild(newElem, elem);
    });
}



