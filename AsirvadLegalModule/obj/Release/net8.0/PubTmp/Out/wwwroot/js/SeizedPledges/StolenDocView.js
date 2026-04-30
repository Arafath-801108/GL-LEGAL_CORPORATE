$(document).ready(async function () {
    
    checkAccess("16");

    togglePanelVisibility();
    clearFields();

});
$(document).on('change', 'input[name="pageSelection"]', function () {
    togglePanelVisibility();
    clearFields();

    if ($(this).val() === 'branch') {
        Doc.zoneload($(this).val());
    }
});
// Pledge Wise - Pledge Number field
$(document).on('input', '#pledgeNumber', function () {
    this.value = this.value.replace(/\D/g, '');
});

$(document).on('change', '#pledgeNumber', function () {
    Doc.pledgeDetails(this.value);
});

// Branch Wise cascading dropdowns
$(document).on('change', '#zone_drp', function () {
    Doc.regload(this.value);
});

$(document).on('change', '#reg_drp', function () {
    Doc.areaload(this.value);
});

$(document).on('change', '#area_drp', function () {
    Doc.branchload(this.value);
});

$(document).on('change', '#br_drp', function () {
    Doc.branchVal(this.value);
});

// Date validation in Branch Wise
$(document).on('change', '#from_dt,#to_dt', function () {
    validateDateSelection();
});

// Select Pledge button (Branch Wise)
$(document).on('click', '#pld_button', function () {
    Doc.loadpledge();               // or Doc.loadpledge(this.value); if your function expects it
});

// Pledge dropdown change (Branch Wise)
$(document).on('change', '#pld_drp', function () {
    Doc.loadcus(this.value);
});

// Main View & Exit buttons
$(document).on('click', '#btnSubmit', function () {
    Doc.viewdocment1();              // keep exact function name you already have
});

$(document).on('click', '#btnExit', function () {
    redirectToDashboard();
});

var Doc = {
    pledgeDetails: async function () {
    
        const docViewDiv = document.getElementById('docview');
        docViewDiv.style.display = 'none';
        document.getElementById("branchName").value = "";
        document.getElementById("customerName").value = "";
        const pledgeNo = document.getElementById("pledgeNumber").value;
    
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(pledgeNo),
                Flag: "8"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
          
            if (responseData.err_code === "1") {
                const outdata = JSON.parse(responseData.outdata);
               
                if (outdata.Table.length > 0) {
                    const data = outdata.Table[0];
                    // Assign values from data object
                    document.getElementById("branchName").value = data.BRANCH_NAME;
                    document.getElementById("customerName").value = data.CUST_NAME;
                } else {
                    await showAlert("Please enter a valid Pledge Number.");
                    document.getElementById("pledgeNumber").value = "";
                    document.getElementById("pledgeNumber").focus();
                    return;
                }
            } else {
                await showAlert("Alert!", "Unable to load Details..", "warning");
            }
        } catch (error) {
           
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }
    },
    zoneload: async function () {

            try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: "",
                Flag: "9"
            };
                var Res = await fetch("/PledgeLoad1", "POST", requestData);
                Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
          
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('zone_drp');
                selectElement.innerHTML = '';

                const outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID; 
                        option.textContent = item.BR; 
                        selectElement.appendChild(option);
                    });
                }
            
            } else {
                await showAlert("Alert!", "Unable to load Details..", "warning");
            }
        } catch (error) {
           
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }
    },
    regload: async function () {
        const docViewDiv = document.getElementById('docview');
        docViewDiv.style.display = 'none';
        document.getElementById("reg_drp").selectedIndex = 0;
        document.getElementById("area_drp").selectedIndex = 0;
        document.getElementById("br_drp").selectedIndex = 0;
        document.getElementById("from_dt").value = "";
        document.getElementById("to_dt").value = "";
        document.getElementById("pld_drp").selectedIndex = 0;
        document.getElementById("cus_name").value = "";
        const zone = document.getElementById("zone_drp").value;
        if (zone === "-1") {
            document.getElementById("pld_drp").innerHTML = "";
            document.getElementById("br_drp").innerHTML = "";
            document.getElementById("area_drp").innerHTML = "";
            document.getElementById("reg_drp").innerHTML = "";



        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(zone),
                Flag: "10"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('reg_drp');
                selectElement.innerHTML = '';

                const outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID;
                        option.textContent = item.BR;
                        selectElement.appendChild(option);
                    });
                }

            } else {
                await showAlert("Alert!", "Unable to load Details..", "warning");
            }
        } catch (error) {
        
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }
    },
    areaload: async function () {
        const docViewDiv = document.getElementById('docview');
        docViewDiv.style.display = 'none';
        document.getElementById("area_drp").selectedIndex = 0;
        document.getElementById("br_drp").selectedIndex = 0;
        document.getElementById("from_dt").value = "";
        document.getElementById("to_dt").value = "";
        document.getElementById("pld_drp").selectedIndex = 0;
        document.getElementById("cus_name").value = "";
        const region = document.getElementById("reg_drp").value;
        if (region === "-1") {
            document.getElementById("pld_drp").innerHTML = "";
            document.getElementById("br_drp").innerHTML = "";
            document.getElementById("area_drp").innerHTML = "";
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(region),
                Flag: "11"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
           
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('area_drp');
                selectElement.innerHTML = '';

                const outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID;
                        option.textContent = item.BR;
                        selectElement.appendChild(option);
                    });
                }

            } else {
                await showAlert("Alert!", "Unable to load Details..", "warning");
            }
        } catch (error) {
           
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }
    },
    branchload: async function () {
        const docViewDiv = document.getElementById('docview');
        docViewDiv.style.display = 'none';
        document.getElementById("br_drp").selectedIndex = 0;
        document.getElementById("from_dt").value = "";
        document.getElementById("to_dt").value = "";
        document.getElementById("pld_drp").selectedIndex = 0;
        document.getElementById("cus_name").value = "";
        const area = document.getElementById("area_drp").value;
        if (area === "-1") {
            document.getElementById("pld_drp").innerHTML = "";
            document.getElementById("br_drp").innerHTML = "";
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(area),
                Flag: "12"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
           
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('br_drp');
                selectElement.innerHTML = '';

                const outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID;
                        option.textContent = item.BR;
                        selectElement.appendChild(option);
                    });
                }

            } else {
                await showAlert("Alert!", "Unable to load Details..", "warning");
            }
        } catch (error) {
           
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }
    },
    loadpledge: async function () {
        const docViewDiv = document.getElementById('docview');
        docViewDiv.style.display = 'none';
        document.getElementById("cus_name").value = "";
        const fromdt = document.getElementById("from_dt").value;
        const todt = document.getElementById("to_dt").value;
        const formattedFromDate = formatDate(fromdt);
        const formattedToDate = formatDate(todt);
        const zone = document.getElementById("zone_drp").value;
        const region = document.getElementById("reg_drp").value;
        const area = document.getElementById("area_drp").value;
        
        const br_id = document.getElementById("br_drp").value;

        if (zone === "-1") {
            await showAlert("Alert!", "Please select a Zone.", "warning");
            return;
        }
        if (region === "-1") {
            await showAlert("Alert!", "Please select a Region.", "warning");
            return;
        }
        if (area === "-1") {
            await showAlert("Alert!", "Please select a Area.", "warning");
            return;
        }
        if (br_id === "-1") {
            await showAlert("Alert!", "Please select a Branch.", "warning");
            return;
        }
        if (!fromdt || !todt) {
            await showAlert(" Please select both dates before clicking select pledge button.");
            return;
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(br_id + "~" + formattedFromDate + "~" +formattedToDate),
                Flag: "13"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
           
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('pld_drp');
                selectElement.innerHTML = '';

                const outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID;
                        option.textContent = item.BR;
                        selectElement.appendChild(option);
                    });
                }

            } else {
                await showAlert("Alert!", "Unable to load Details..", "warning");
            }
        } catch (error) {
          
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }

    },
    loadcus: async function () {
        const docViewDiv = document.getElementById('docview');
        docViewDiv.style.display = 'none';
        document.getElementById("cus_name").value = "";

        const pldg_no = document.getElementById("pld_drp").value;

        if (!pldg_no || pldg_no === "" ) {
            await showAlert("Alert!", "Please Click on the Select Pledge Button to load options .", "warning");
            return;
        }
        if (pldg_no === "-1") {
            await showAlert("Alert!", "Please select a Pledge Number.", "warning");
            return;
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(pldg_no),
                Flag: "14"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
         
            if (responseData.err_code === "1") {
                const outdata = JSON.parse(responseData.outdata);
                const data = outdata.Table[0];
                document.getElementById("cus_name").value = data.CUST_NAME;

            } else {
                await showAlert("Alert!", "Unable to load customer name...", "warning");
            }
        } catch (error) {
          
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }

    },
    viewdocment1: async function () {
        const pledgeRadio = document.getElementById('pldg_btn');
        const branchRadio = document.getElementById('br_btn');
        const docViewDiv = document.getElementById('docview');
    
        
        if (pledgeRadio.checked) {
          
            const pledgeNo = document.getElementById("pledgeNumber").value;
            if (pledgeNo === "") {
                await showAlert("Please enter a Pledge Number.");
                return;
            }
            debugger;
           
            try {
                const requestData = {
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(pledgeNo),
                    Flag: "15"
                };
                var Res = await fetch("/PledgeLoad1", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
               
                if (responseData.err_code === "1") {
                    const outdata = JSON.parse(responseData.outdata);
                   
                    const data = outdata.Table[0];
                    docViewDiv.style.display = 'block';
                    function handleFileView(base64String, fileTypeCode, filenamePrefix = "Document") {
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

                    // Event listeners for document viewing
                    document.getElementById("viewKYC").addEventListener("click", () => handleFileView(data.KYC, 2, "KYC_Document"));
                    document.getElementById("viewFIR").addEventListener("click", () => handleFileView(data.FIR_ATT, 2, "FIR_Document"));
                    document.getElementById("view91").addEventListener("click", () => handleFileView(data.NOTICE_91, 2, "91_Notice"));
                    document.getElementById("viewPawn").addEventListener("click", () => handleFileView(data.PWAN_TICKET, 2, "Pawn_Ticket"));
                    document.getElementById("viewDpn").addEventListener("click", () => handleFileView(data.DPN, 2, "DPN_Document"));
                    document.getElementById("viewSeiz").addEventListener("click", () => handleFileView(data.SEIZURE_ATT, 2, "Seizure_Document"));
                    document.getElementById("viewCon").addEventListener("click", () => handleFileView(data.CONFESS_STATEMENT, 2, "Confession_Statement"));
                    document.getElementById("viewLO9").addEventListener("click", () => handleFileView(data.LO9_ATT, data.LO9_STATUS, "LO9_Document"));
                    document.getElementById("viewRec").addEventListener("click", () => handleFileView(data.COMPLNT_RECEIPT, data.COMPLNT_RECEIPT_EXT, "Cheating_Complaint_Receipt"));
                    document.getElementById("viewDra").addEventListener("click", () => handleFileView(data.COMPLNT_DRAFT, data.COMPLNT_DRAFT_EXT, "Cheating_Complaint_Signed_Draft"));


                } else {
                    await showAlert("Alert!", "Unable to load Details..", "warning");
                }
            } catch (error) {
             
                await showAlert("Alert!", "Error occurred. Please try again.", "warning");
                return;
            }
        }
        else if (branchRadio.checked) {
          
            const zone = document.getElementById("zone_drp").value;
            const region = document.getElementById("reg_drp").value;
            const area = document.getElementById("area_drp").value;
            const br_id = document.getElementById("br_drp").value;
            const fromdt = document.getElementById("from_dt").value;
            const todt = document.getElementById("to_dt").value;
            const pldg_no = document.getElementById("pld_drp").value;
           
            if (zone === "-1") {
                await showAlert("Alert!", "Please select a Zone.", "warning");
                return;
            }
            if (region === "-1") {
                await showAlert("Alert!", "Please select a Region.", "warning");
                return;
            }
            if (area === "-1") {
                await showAlert("Alert!", "Please select a Area.", "warning");
                return;
            }
            if ( br_id === "-1") {
                await showAlert("Alert!", "Please select a Branch.", "warning");
                return;
            }
            if (!fromdt || !todt) {
                await showAlert("Alert!", " Please select both dates before Submit.", "warning");
                return;
            }
   
            if (!pldg_no || pldg_no === "" || pldg_no === "-1") {
                await showAlert("Alert!", "Please Click on the Select Pledge Button to load options.", "warning");
                return;
            }
            if (pldg_no === "-1") {
                await showAlert("Alert!", "Please select a Pledge Number.", "warning");
                return;
            }
           
            try {
                const requestData = {
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(pldg_no),
                    Flag: "15"
                };
                var Res = await fetch("/PledgeLoad1", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
            
                if (responseData.err_code === "1") {

                    const outdata = JSON.parse(responseData.outdata);
                    const data = outdata.Table[0];
                    docViewDiv.style.display = 'block';
                    function handleFileView(base64String, fileTypeCode, filenamePrefix = "Document") {
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

                    // Event listeners for document viewing
                    document.getElementById("viewKYC").addEventListener("click", () => handleFileView(data.KYC, 2, "KYC_Document"));
                    document.getElementById("viewFIR").addEventListener("click", () => handleFileView(data.FIR_ATT, 2, "FIR_Document"));
                    document.getElementById("view91").addEventListener("click", () => handleFileView(data.NOTICE_91, 2, "91_Notice"));
                    document.getElementById("viewPawn").addEventListener("click", () => handleFileView(data.PWAN_TICKET, 2, "Pawn_Ticket"));
                    document.getElementById("viewDpn").addEventListener("click", () => handleFileView(data.DPN, 2, "DPN_Document"));
                    document.getElementById("viewSeiz").addEventListener("click", () => handleFileView(data.SEIZURE_ATT, 2, "Seizure_Document"));
                    document.getElementById("viewCon").addEventListener("click", () => handleFileView(data.CONFESS_STATEMENT, 2, "Confession_Statement"));
                    document.getElementById("viewLO9").addEventListener("click", () => handleFileView(data.LO9_ATT, data.LO9_STATUS, "LO9_Document"));
                    document.getElementById("viewRec").addEventListener("click", () => handleFileView(data.COMPLNT_RECEIPT, data.COMPLNT_RECEIPT_EXT, "Cheating_Complaint_Receipt"));
                    document.getElementById("viewDra").addEventListener("click", () => handleFileView(data.COMPLNT_DRAFT, data.COMPLNT_DRAFT_EXT, "Cheating_Complaint_Signed_Draft"));


                } else {
                    await showAlert("Alert!", "Unable to load Details..", "warning");
                }
            } catch (error) {
               
                await showAlert("Alert!", "Error occurred. Please try again.", "warning");
                return;
            }
        }
  
 
    },
    branchVal: async function () {
        const docViewDiv = document.getElementById('docview');
        document.getElementById("from_dt").value = "";
        document.getElementById("to_dt").value = "";
        document.getElementById("pld_drp").selectedIndex = 0;
        document.getElementById("cus_name").value = "";
        const br_id = document.getElementById("br_drp").value;
        if (br_id === "-1") {
            await showAlert("Alert!", "Please select a Branch.", "warning");
            return;
        }
    }
}

function formatDate(inputDate) {
    let date = new Date(inputDate);
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    let day = date.getDate().toString().padStart(2, '0');
    let year = date.getFullYear();

    return `${month}/${day}/${year}`;
}


function togglePanelVisibility() {
    const pledgePanel = document.getElementById("pnl_pldg");
    const branchPanel = document.getElementById("pnlNewPage");
    const isPledgeChecked = document.getElementById("pldg_btn").checked;

    pledgePanel.style.display = isPledgeChecked ? "block" : "none";
    branchPanel.style.display = isPledgeChecked ? "none" : "block";
    document.getElementById("docview").style.display = "none";
}

async function validateDateSelection() {


    const fromdtElement = document.getElementById("from_dt");
    const todtElement = document.getElementById("to_dt");

    const fromdt = fromdtElement.value;
    const todt = todtElement.value;

    const fromDate = new Date(fromdt);
    const toDate = new Date(todt);
    const today = new Date();

    // Ensure "From Date" and "To Date" are not in the future
    if (fromDate > today || toDate > today) {
        await showAlert("Alert!", "Future dates are not allowed.", "warning");
        fromdtElement.value = "";
        todtElement.value = "";
        return false;
    }

    // Ensure "To Date" is not earlier than "From Date"
    if (toDate < fromDate) {
        await showAlert("Alert!", "To Date cannot be earlier than From Date.", "warning");
        todtElement.value = "";
        return false;
    }

    return true; // Validation passed
}

function clearFields() {
    const docViewDiv = document.getElementById('docview');
    docViewDiv.style.display = 'none';
    document.getElementById("pledgeNumber").value = "";
    document.getElementById("branchName").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("zone_drp").selectedIndex = 0;
    document.getElementById("reg_drp").selectedIndex = 0;
    document.getElementById("area_drp").selectedIndex = 0;
    document.getElementById("br_drp").selectedIndex = 0;
    document.getElementById("from_dt").value = "";
    document.getElementById("to_dt").value = "";
    document.getElementById("pld_drp").selectedIndex = 0;
    document.getElementById("cus_name").value = "";
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