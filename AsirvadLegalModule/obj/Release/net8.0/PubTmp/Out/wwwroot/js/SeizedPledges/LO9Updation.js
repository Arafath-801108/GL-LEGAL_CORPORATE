$(document).ready(async function () {

    checkAccess("6");
    

});
$(document).on('change', '#casecatdrp', function () {
    clearAllFields();
    LO9.SendCaseCat(this.value);
});

$(document).on('change', '#pledg_drp', function () {
    clearFieldsExceptCaseCat();
    LO9.GetPledgeDetails(this.value);
});

$(document).on('click', '#Lo9_upload', function () {
    UploadFN(this);
});

$(document).on('click', '#Lo9submit', function () {
    LO9.uploadLo9Document(this.value);
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

var LO9 = {
    SendCaseCat: async function () {

        const caseCatValue = document.getElementById('casecatdrp').value;

        if (caseCatValue === "0") {
            await showAlert("Alert!", "Please select a Case Category.", "warning");
            return;
        }

        try {
         
            const caseCatValue = document.getElementById('casecatdrp').value;

            if (caseCatValue === "0") {
                await showAlert("Alert!", "Please select a Case Category.", "warning");
                return;
            }
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: document.getElementById('casecatdrp').value,
                Flag: "1"
            };

            var Res = await fetch("/PledgeLoad", "POST", requestData);
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
    GetPledgeDetails: async function () {
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
                Flag: "2"
            };
            var Res = await fetch("/Lo9GetDetails", "POST", requestData);

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
                await showAlert("Alert!", "Unable to load Details..", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },
    uploadLo9Document: async function () {
    
        try {
            const fileInput = document.getElementById('Lo9_upload');
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
            // Validate file content based on type
            try {
                const fileReader = new FileReader();
                const validationPromise = new Promise((resolve, reject) => {
                    fileReader.onload = function (e) {
                        const arr = new Uint8Array(e.target.result);

                        if (file.type === "application/pdf") {
                            // Check PDF magic number (%PDF)
                            if (arr.length < 4 || arr[0] !== 0x25 || arr[1] !== 0x50 || arr[2] !== 0x44 || arr[3] !== 0x46) {
                                reject(new Error("Invalid PDF file."));
                            }
                        } else if (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                            // Basic DOC/DOCX validation (check for PKZIP signature for DOCX or D0CF for DOC)
                            if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                                if (arr.length < 4 || arr[0] !== 0x50 || arr[1] !== 0x4B || arr[2] !== 0x03 || arr[3] !== 0x04) {
                                    reject(new Error("Invalid DOCX file."));
                                }
                            } else if (file.type === "application/msword") {
                                if (arr.length < 8 || arr[0] !== 0xD0 || arr[1] !== 0xCF || arr[2] !== 0x11 || arr[3] !== 0xE0) {
                                    reject(new Error("Invalid DOC file."));
                                }
                            }
                        } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
                            // Check JPEG magic number (FFD8)
                            if (arr.length < 2 || arr[0] !== 0xFF || arr[1] !== 0xD8) {
                                reject(new Error("Invalid JPEG file."));
                            }
                        }
                        resolve();
                    };
                    fileReader.onerror = () => reject(new Error("Error reading file."));
                    fileReader.readAsArrayBuffer(file.slice(0, 8)); // Read first 8 bytes for broader compatibility
                });
                await validationPromise;
            } catch (error) {
                await showAlert("Error!", error.message || "Invalid file content. Please upload a valid file.", "error");
                fileInput.value = ""; // Reset input
                return;
            }

            
            let img = null;
            let fileTypeCode = null;

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const allowedTypes = {
                    "application/pdf": '2',
                    "application/msword": '3',
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": '4',
                    "image/jpeg": '1',
                    "image/jpg": '1'
                };

                
                if (!allowedTypes[file.type]) {
                    await showAlert("Error!", "Invalid file type! Please upload PDF, DOC, DOCX, JPG, or JPEG.", "error");
                    return;
                }

               
                fileTypeCode = allowedTypes[file.type];

                
                if (file.size > 2 * 1024 * 1024) {
                    await showAlert("Error!", "File size exceeds the 2MB limit.", "error");
                    return;
                }

             
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
                    reader.readAsDataURL(file);
                });
            } else {
                await showAlert("Error!", "Please select a file to upload.", "error");
                return;
            }
           
            const sanitizeInput = (input) => {
                return input.replace(/[<>"'&]/g, (match) => ({
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                })[match]);
            };
           
            const data = {
                Indata: sanitizeInput(document.getElementById('irr_type').value || ''),
                CaseCategory: sanitizeInput(document.getElementById('casecatdrp').value || ''),
                PledgeNo: sanitizeInput(document.getElementById('pledg_drp').value || ''),
                Lo9Doc: img,
                Lo9Ex: fileTypeCode,
                EmpId: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token")
            };

            var Res = await fetch("/SubmitDetails", "POST", data);

            const responseData = JSON.parse(Res);

            if (responseData.err_code === "1") {
              
                await showLoadAlert("Success!", "LO9/LO5 Updated Successfully.", "success");
            } else {
                
                await showLoadAlert("Error!", "Submission failed: " + responseData.err_sts, "error");
            }

        } catch (error) {
            await showLoadAlert("Error!", "Error occurred while uploading. Please try again.", "error");
           
        }
    },
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
    document.getElementById('Lo9_upload').value = '';
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
    document.getElementById('Lo9_upload').value = '';
    const elements = [
        "viewKYC", "viewFIR", "view91", "viewPawn",
        "viewDpn", "viewSeiz", "viewCon"
    ];

    elements.forEach(id => {
        let elem = document.getElementById(id);
        let newElem = elem.cloneNode(true); // Clone element without event listeners
        elem.parentNode.replaceChild(newElem, elem); // Replace old element with new one
    });
}