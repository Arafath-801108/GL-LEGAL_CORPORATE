$(document).ready(async function () {

    checkAccess("16");


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
                Indata: pledgeNo,
                Flag: "8"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
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
            await showAlert("Alert!", "Please select a Zone.", "warning");
            return;
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: zone,
                Flag: "10"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
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
            await showAlert("Alert!", "Please select a Region.", "warning");
            return;
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: region,
                Flag: "11"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
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
            await showAlert("Alert!", "Please select a Area.", "warning");
            return;
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: area,
                Flag: "12"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
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
                Indata: br_id + "~" + formattedFromDate + "~" +formattedToDate,
                Flag: "13"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
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
                Indata: pldg_no,
                Flag: "14"
            };
            var Res = await fetch("/PledgeLoad1", "POST", requestData);
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
    viewdocment: async function () {
        const pledgeRadio = document.getElementById('pldg_btn');
        const branchRadio = document.getElementById('br_btn');
        const docViewDiv = document.getElementById('docview');
    
        
        if (pledgeRadio.checked) {
          
            const pledgeNo = document.getElementById("pledgeNumber").value;
            if (pledgeNo === "") {
                await showAlert("Please enter a Pledge Number.");
                return;
            }

           
            try {
                const requestData = {
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: pledgeNo,
                    Flag: "15"
                };
                var Res = await fetch("/PledgeLoad1", "POST", requestData);
                const responseData = JSON.parse(Res);
               
                if (responseData.err_code === "1") {
                    const outdata = JSON.parse(responseData.outdata);
                   
                    const data = outdata.Table[0];
                    docViewDiv.style.display = 'block';
                    function handleFileView(base64String, fileTypeCode, filenamePrefix = "Document") {
                        return new Promise(async (resolve, reject) => {
                            if (!base64String || base64String.trim() === "" || base64String === "AA==") {
                                await showAlert("Error!", "No document available.", "error");
                                resolve();
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

                                let mimeType;
                                switch (fileTypeCode) {
                                    case 1:
                                        mimeType = "image/jpeg";
                                        break;
                                    case 2:
                                        mimeType = "application/pdf";
                                        break;
                                    case 3:
                                        mimeType = "application/msword";
                                        break;
                                    case 4:
                                        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                                        break;
                                    default:
                                        await showAlert("Error!", `Unsupported file type code: ${fileTypeCode}`, "error");
                                        resolve();
                                        return;
                                }

                                const blob = new Blob([byteArray], { type: mimeType });
                                const url = URL.createObjectURL(blob);

                                if (mimeType === "application/pdf" || mimeType === "image/jpeg") {
                                    // Open PDF or image in a new tab/window for viewing
                                    window.open(url, "_blank");
                                } else {
                                    // For unsupported viewable types (e.g., doc, docx), fallback to download
                                    const extension = mimeType === "application/msword" ? "doc" : "docx";
                                    const filename = `${filenamePrefix}.${extension}`;
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = filename;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    await showAlert("Warning!", "This file type cannot be viewed in the browser and will be downloaded instead.", "warning");
                                }

                                setTimeout(() => URL.revokeObjectURL(url), 1000);
                                resolve();
                            } catch (error) {
                                await showAlert("Error!", "Error processing document. It might be corrupted or in an unsupported format.", "error");
                                reject(error);
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
                    document.getElementById("viewCheat").addEventListener("click", () => handleFileView(data.CUSCMPLNT_ATT, "CheatingComplaintEntry_Document"));


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
                await showAlert(" Please select both dates before Submit.");
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
                    Indata: pldg_no,
                    Flag: "15"
                };
                var Res = await fetch("/PledgeLoad1", "POST", requestData);
                const responseData = JSON.parse(Res);
            
                if (responseData.err_code === "1") {

                    const outdata = JSON.parse(responseData.outdata);
                    const data = outdata.Table[0];
                    docViewDiv.style.display = 'block';
                    function handleFileView(base64String, fileTypeCode, filenamePrefix = "Document") {
                        return new Promise(async (resolve, reject) => {
                            if (!base64String || base64String.trim() === "" || base64String === "AA==") {
                                await showAlert("Error!", "No document available.", "error");
                                resolve();
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

                                let mimeType;
                                switch (fileTypeCode) {
                                    case 1:
                                        mimeType = "image/jpeg";
                                        break;
                                    case 2:
                                        mimeType = "application/pdf";
                                        break;
                                    case 3:
                                        mimeType = "application/msword";
                                        break;
                                    case 4:
                                        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                                        break;
                                    default:
                                        await showAlert("Error!", `Unsupported file type code: ${fileTypeCode}`, "error");
                                        resolve();
                                        return;
                                }

                                const blob = new Blob([byteArray], { type: mimeType });
                                const url = URL.createObjectURL(blob);

                                if (mimeType === "application/pdf" || mimeType === "image/jpeg") {
                                    // Open PDF or image in a new tab/window for viewing
                                    window.open(url, "_blank");
                                } else {
                                    // For unsupported viewable types (e.g., doc, docx), fallback to download
                                    const extension = mimeType === "application/msword" ? "doc" : "docx";
                                    const filename = `${filenamePrefix}.${extension}`;
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = filename;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    await showAlert("Warning!", "This file type cannot be viewed in the browser and will be downloaded instead.", "warning");
                                }

                                setTimeout(() => URL.revokeObjectURL(url), 1000);
                                resolve();
                            } catch (error) {
                                await showAlert("Error!", "Error processing document. It might be corrupted or in an unsupported format.", "error");
                                reject(error);
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
                    document.getElementById("viewCheat").addEventListener("click", () => handleFileView(data.CUSCMPLNT_ATT, "CheatingComplaintEntry_Document"));


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
    const fromdt = document.getElementById("from_dt").value;
    const todt = document.getElementById("to_dt").value;

   

    const fromDate = new Date(fromdt);
    const toDate = new Date(todt);
    const today = new Date();

    if (fromDate > today || toDate > today) {
        await showAlert("Future dates are not allowed.");
        fromdtElement.value = "";
        todtElement.value = "";
        return false;
    }
    // Ensure "To Date" is not earlier than "From Date"
    if (toDate < fromDate) {
        await showAlert("To Date cannot be earlier than From Date.");
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


