$(document).ready(async function () {

    checkAccess("6");
    
    let currentDocUrl = null;
});

$(document).on('change', '#casecatdrp', function () {
    $("#globalLoader").show();
    clearAllFields();
    LO9.SendCaseCat(this.value);
});

$(document).on('change', '#pledg_drp', function () {
    debugger;
    $("#globalLoader").show();
    clearAllFields();
    LO9.GetPledgeDetails(this.value);
});

$(document).on('change', '#Lo9_upload', async function () {
    debugger;
    const file = this.files[0];
    if (file) {
        const fileSize = file.size / 1024 / 1024; // Size in MB
        const maxSize = 5; // 5MB max

        if (fileSize > maxSize) {

            await showAlert("Alert!", "File size should not exceed 5MB!", "warning");
            this.value = ''; // Clear the input
            return;
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png,', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            await showAlert("Alert!", "Only PDF, JPG, JPEG,DOC,DOCX and PNG files are allowed!", "warning");
            this.value = ''; // Clear the input
            return;
        }
    }
   // UploadFN(this);
});

$(document).on('click', '#Lo9submit', function () {
    $("#globalLoader").show();
    LO9.uploadLo9Document(this.value);
});

$(document).on('click', '#btn_exit', function () {
    redirectToDashboard();
});

var LO9 = {
    SendCaseCat: async function () {
       
        $('#docDiv').hide();
        const caseCatValue = document.getElementById('casecatdrp').value;

        if (caseCatValue === "0") {
            document.getElementById('pledg_drp').innerHTML = '';

        }
        else {
            try {

                const caseCatValue = document.getElementById('casecatdrp').value;

                if (caseCatValue === "0") {
                    await showAlert("Alert!", "Please select a Case Category.", "warning");
                    return;
                }
                else if (caseCatValue === "2") {
                    $('#docDiv').hide();
                }
                else {
                    $('#docDiv').show();
                }
                const requestData = {
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(document.getElementById('casecatdrp').value),
                    Flag: "1"
                };

                var Res = await fetch("/PledgeLoad", "POST", requestData);
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
        }
        $("#globalLoader").hide();
    },
    GetPledgeDetails: async function () {
        const pledgeValue = document.getElementById('pledg_drp').value;

        if (pledgeValue === "-1") {
            clearAllFields();
        }
        else {
            try {
                const requestData = {
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(pledgeValue),
                    Flag: "2"
                };
                var Res = await fetch("/Lo9GetDetails", "POST", requestData);

                Res = decryptAES(Res);
                
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {
                    debugger;
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
                    if (data.AUCTION_PLEDGE === "Y") {
                        document.getElementById("case_typ").value = "YES";
                    } else {
                        document.getElementById("case_typ").value = "NO";
                    }

                    async function handleFileDownload(base64String, filename) {

                        $("#globalLoader").show();
                        if (!base64String || base64String.trim() === "" || base64String === "AA==") {
                            $("#globalLoader").hide();
                            await showAlert("No document available.");
                            return;
                        }

                        try {
                            debugger;
                            

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
                            //VIEWING --START
                            const mimeType1 = "application/pdf";
                            const blob1 = base64ToBlob(base64String, mimeType1);
                            currentDocUrl = URL.createObjectURL(blob1);

                            viewDocument(currentDocUrl, mimeType1);
                            //--END
                        } catch (error) {
                            $("#globalLoader").hide();
                            await showAlert("Error processing document. It might be corrupted or an unsupported format.");
                        }
                        $("#globalLoader").hide();
                    }
                    // Event listeners for PDF document views only
                    document.getElementById("viewKYC").addEventListener("click", () => handleFileDownload(data.KYC, "KYC_Document.pdf"));
                    document.getElementById("viewFIR").addEventListener("click", () => handleFileDownload(data.FIR_ATT, "FIR_Document.pdf"));
                    document.getElementById("view91").addEventListener("click", () => handleFileDownload(data.NOTICE_91, "91_Notice.pdf"));
                    document.getElementById("viewPawn").addEventListener("click", () => handleFileDownload(data.PWAN_TICKET, "Pawn_Ticket.pdf"));
                    document.getElementById("viewDpn").addEventListener("click", () => handleFileDownload(data.DPN, "DPN_Document.pdf"));
                    document.getElementById("viewSeiz").addEventListener("click", () => handleFileDownload(data.SEIZURE_ATT, "Seizure_Document.pdf"));
                    document.getElementById("viewCon").addEventListener("click", () => handleFileDownload(data.CONFESS_STATEMENT, "Confession_Statement.pdf"));



                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to load Details..", "warning");
                }
            }
            catch {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
        $("#globalLoader").hide();
    },
    uploadLo9Document: async function () {
        debugger;
        $("#globalLoader").show();
        try {
            const fileInput = document.getElementById('Lo9_upload');
            const caseCatDrp = document.getElementById('casecatdrp').value;
            const pledgDrp = document.getElementById('pledg_drp').value;
            let img2, img3,filecode;
            

            if (!caseCatDrp || caseCatDrp.trim() === "" || caseCatDrp === "0") {
                $("#globalLoader").hide();
                await showAlert("Error!", "Please select a case category before submitting.", "error");
                return;
            }


            if (!pledgDrp || pledgDrp.trim() === "" || pledgDrp === "-1") {
                $("#globalLoader").hide();
                await showAlert("Error!", "Please select a pledge number before submitting.", "error");
                return;
            }
           
            if (!fileInput.files || fileInput.files.length === 0) {
                $("#globalLoader").hide();
                await showAlert("Error!", "Please Upload Lo9/ Lo5 Document before proceeding.", "error");
                return;
            }
            const fileC = fileInput.files[0];
            const extension3 = fileC.name.split('.').pop().toLowerCase();
            if (extension3 !== "pdf") {
                $("#globalLoader").hide();
                document.getElementById('Lo9_upload').value = '';
                await showAlert("Error!", "Document must be in pdf.", "error");
                return;
            }
            if (caseCatDrp === "1") {

                const fileInput1 = document.getElementById('receipt_upload');
                const fileInput2 = document.getElementById('draft_upload');
                if (!fileInput1.files || fileInput1.files.length === 0) {
                    $("#globalLoader").hide();
                    await showAlert("Error!", "Please Upload Cheating Complaint Receipt Document before proceeding.", "error");
                    return;
                }
                const fileA = fileInput1.files[0];
                const extension1 = fileA.name.split('.').pop().toLowerCase();
                if (extension1 !== "pdf") {
                    $("#globalLoader").hide();
                    document.getElementById('receipt_upload').value = '';
                    await showAlert("Error!", "Document must be in pdf.", "error");
                    return;
                }
                if (!fileInput2.files || fileInput2.files.length === 0) {
                    $("#globalLoader").hide();
                    await showAlert("Error!", "Please Upload Cheating Complaint Signed Draft Document before proceeding.", "error");
                    return;
                }
                
                const fileB = fileInput2.files[0];
                const extension2 = fileB.name.split('.').pop().toLowerCase();
               
               if (extension2 !== "pdf") {
                    $("#globalLoader").hide();
                    document.getElementById('draft_upload').value = '';
                    await showAlert("Error!", "Document must be in pdf.", "error");
                    return;
                }
                else
                {
                    //upload receipt
                    
                     file2 = $('#receipt_upload')[0];
                    if (file2 && file2.files && file2.files[0]) {
                        img2 = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const base64String = e.target.result.split(',')[1];
                                if (!base64String) {
                                    reject(new Error('Invalid Base64 string for file 1'));
                                } else {
                                    resolve(base64String);
                                }
                            };
                            reader.onerror = () => reject(new Error('Failed to read file 1'));
                            reader.readAsDataURL(file2.files[0]);
                        });
                    }
                    //upload draft
                     file3 = $('#draft_upload')[0];
                    if (file3 && file3.files && file3.files[0]) {
                        img3 = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const base64String = e.target.result.split(',')[1];
                                if (!base64String) {
                                    reject(new Error('Invalid Base64 string for file 1'));
                                } else {
                                    resolve(base64String);
                                }
                            };
                            reader.onerror = () => reject(new Error('Failed to read file 1'));
                            reader.readAsDataURL(file3.files[0]);
                        });
                    }

                    filecode = "2";
                    // fileB = file2.files[0];
                    // fileC = file3.files[0];
                    // extension2 = fileB.name.split('.').pop().toLowerCase();
                    //extension3 = fileC.name.split('.').pop().toLowerCase();
                    //fileCode2 = getAllowedExtensions(extension2);
                    //fileCode3 = getAllowedExtensions(extension3);                   
                  
                }
                   
            }
            // Validate file content based on type//upload lo9
            let img1;
            const fileInput1 = $('#Lo9_upload')[0];
            if (fileInput1 && fileInput1.files && fileInput1.files[0]) {
                img1 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const base64String = e.target.result.split(',')[1];
                        if (!base64String) {
                            reject(new Error('Invalid Base64 string for file 1'));
                        } else {
                            resolve(base64String);
                        }
                    };
                    reader.onerror = () => reject(new Error('Failed to read file 1'));
                    reader.readAsDataURL(fileInput1.files[0]);
                });
            }



            //const fileA = fileInput1.files[0];
            //const extension1 = fileA.name.split('.').pop().toLowerCase();
            //function getAllowedExtensions(extension) {
            //    const extensions = {
            //        pdf: '2',
            //        doc: '3',
            //        docx: '4',
            //        jpeg: '1',
            //        jpg: '1'
            //    };

            //    // Return the code for the given extension, or null if not found
            //    return extensions[extension] || null;
            //}

            //const fileCode1 = getAllowedExtensions(extension1);
            

            debugger;
            const data = {
                Indata: encryptAES(document.getElementById('irr_type').value) ,
                CaseCategory: encryptAES(caseCatDrp),
                PledgeNo: encryptAES(pledgDrp),
                Lo9Doc: img1,
                Lo9Ex: encryptAES("2"),
                RecDoc: img2 || "",
                RecEx: encryptAES(filecode || ""),
                DraftDoc: img3 || "",
                DraftEx: encryptAES(filecode || ""),
                EmpId: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token")
            };

            var Res = await fetch("/SubmitDetails", "POST", data);
            debugger;
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if (responseData.err_code === "1") {
                $("#globalLoader").hide();
                await showLoadAlert("Success!", "LO9/LO5 Updated Successfully.", "success");
            } else {
                $("#globalLoader").hide();
                await showLoadAlert("Error!", "Submission failed: " + responseData.err_sts, "error");
            }

        } catch (error) {
            $("#globalLoader").hide();
            await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");
           
        }
        $("#globalLoader").hide();
    },
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
    document.getElementById('Lo9_upload').value = '';
    document.getElementById('receipt_upload').value = '';
    document.getElementById('draft_upload').value = '';
       const elements = [
           "viewKYC", "viewFIR", "view91", "viewPawn",
           "viewDpn", "viewSeiz", "viewCon"
       ];

       elements.forEach(id => {
           let elem = document.getElementById(id);
           let newElem = elem.cloneNode(true); 
           elem.parentNode.replaceChild(newElem, elem);
       });
}
