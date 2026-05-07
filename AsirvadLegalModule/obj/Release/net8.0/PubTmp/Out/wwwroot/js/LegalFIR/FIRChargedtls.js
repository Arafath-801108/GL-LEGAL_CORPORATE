$(document).ready(async function () {
    checkAccess("38");

});
let img = "";
var _load = {
    
    CustomerDropdown: async function () {
        try {
            
            clearForm(); 
            const type = document.getElementById('drp_branch').value;
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                ReqId: encryptAES(type),
                Flag: encryptAES("selectreqid")
            };

            const response = await fetch('/FIRChargeDetails/FIRCHARGES', "POST", requestData);

            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(customes.Query_result);

            const selectElement1 = document.getElementById('drp_cust');
            selectElement1.innerHTML = '';

            parsedInner.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.REQ_ID;
                option.textContent = item.REQ_IDS;
                selectElement1.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading branches:', error);
        }
    },

    populatePledgeGrid: async function () {
        try {
            const ReqId = document.getElementById('drp_cust').value;
            const branch = document.getElementById('drp_branch').value;

            if (!ReqId || !branch) {
                console.warn('Missing required input values');
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(branch),
                ReqId: encryptAES(ReqId),
                Flag: encryptAES("SELECTPLEDGE")
            };

            const response = await fetch('/FIRRegistration/FIRfetch', "POST", requestData);


            const decryptedText = decryptAES(response);
            const pledges = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(pledges.Query_result);
            const pledgeRecords = parsedInner.Table || [];

            const tbody = document.getElementById('pledgeGridBody');
            tbody.innerHTML = ''; // Clear previous rows

            let totalLoss = parseFloat(document.getElementById('txt_case').value) || 0;

            if (pledgeRecords.length > 0) {
                pledgeRecords.forEach(item => {
                    totalLoss += parseFloat(item.LOSS) || 0;

                    const row = document.createElement('tr');
                    row.setAttribute('data-custid', item.CUST_ID);

                    row.innerHTML = `
                    <td>${item.CUST_ID || ''}</td>
                    <td>${item.PLEDGENO || ''}</td>
                    <td>${item.PLEDGEVAL || ''}</td>
                    <td class="loss-cell">${item.LOSS || '0.00'}</td>
                    <td>${item.IRR || ''}</td>
                    <td>${item.GOLD_WEIGHT || ''}</td>
                `;

                    tbody.appendChild(row);
                });

                document.getElementById('txt_case').value = totalLoss.toFixed(2);
            } else {
                tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="color:#6c757d; padding: 20px;">No pledge details found</td>
                </tr>
            `;
            }
            const requestData1 = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(branch),
                ReqId: encryptAES(ReqId),
                Flag: encryptAES("GETDETAILS")
            };

            const response1 = await fetch('/FIRRegistration/FIRfetch', "POST", requestData1);


            const decryptedText1 = decryptAES(response1);
            const pledges1 = JSON.parse(decryptedText1);
            const parsedInner1 = JSON.parse(pledges1.Query_result);
            const pledgeRecords1 = parsedInner1.Table || [];
            document.getElementById('txt_complainted_by').value = pledgeRecords1[0].REQ_BY || '';
            document.getElementById('txt_complainted_date').value = pledgeRecords1[0].REQ_DT || '';
            document.getElementById('txt_state').value = pledgeRecords1[0].POLICE_STATE || '';
            document.getElementById('txt_dis').value = pledgeRecords1[0].POLICE_DISTRICT || '';
            document.getElementById('txt_police').value = pledgeRecords1[0].POLICE_NAME || '';
            document.getElementById('txt_date').value = pledgeRecords1[0].FILED_DT || '';
            document.getElementById('txt_remark').value = pledgeRecords1[0].BH_RMK;

            if (pledgeRecords.length > 0 && branch=="1") {
              
                document.getElementById('txt_private_complaint_number').value = pledgeRecords1[0].NUMBER_ID || '';
                document.getElementById('txt_sp_date').value = pledgeRecords1[0].SPDATE || '';
                document.getElementById('txt_sp_remark').value = pledgeRecords1[0].SPREMARKS;
                document.getElementById('txt_advname').value = pledgeRecords1[0].ADV_NAME || '';
                document.getElementById('txt_district').value = pledgeRecords1[0].DISTRICT;
                document.getElementById('txt_court_name').value = pledgeRecords1[0].CRT_NAME;

            }

           else if (pledgeRecords.length > 0 && branch == "2") {

                document.getElementById('txt_private_complaint_number').value = pledgeRecords1[0].FIR_NO || '';
                document.getElementById('txt_sp_date').value = pledgeRecords1[0]. FIR_DATE;
                document.getElementById('txt_sp_remark').value = pledgeRecords1[0].REMARKS;
               
               

            }



        } catch (error) {
            console.error('Error populating pledge grid:', error);
            document.getElementById('pledgeGridBody').innerHTML = `
            <tr>
                <td colspan="6" style="color:#dc3545; padding: 20px;">An error occurred while loading pledge data</td>
            </tr>
        `;
        }
    },

    document_view: async function () {
        try {


            const ReqId = document.getElementById('drp_cust').value;


            if (!ReqId) {
                console.warn('Missing required input values');
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),

                ReqId: encryptAES(ReqId),
                Flag: encryptAES("DocView")
            };


            const response = await fetch('/FIRRegistration/FIRfetch', "POST", requestData);



            // Step 1: Decrypt and parse the response
            const decryptedText = decryptAES(response);
            const docs = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(docs.Query_result);
            const detaildoc = parsedInner.Table || [];

            // Step 2: Extract base64 document
            const base64Data = detaildoc[0].DOCVIEW;

            // Step 3: Detect MIME type from base64 prefix
            let mimeType = "";

            if (base64Data.startsWith("JVBER")) {
                mimeType = "application/pdf";
            } else if (base64Data.startsWith("iVBOR")) {
                mimeType = "image/png";
            } else if (base64Data.startsWith("/9j/")) {
                mimeType = "image/jpeg";
            } else if (base64Data.startsWith("UEsDB")) {
                mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // .docx
            } else {
                mimeType = "application/octet-stream"; // fallback
            }

            // Step 4: Create a data URL
            const dataUrl = `data:${mimeType};base64,${base64Data}`;

            // Step 5: Open the document in a new tab
            const newTab = window.open();
            if (newTab) {
                newTab.document.write(`
    <html>
      <head><title>Document Preview</title></head>
      <body style="margin:0">
        ${mimeType.startsWith("image/")
                        ? `<img src="${dataUrl}" style="width:100%;height:auto;">`
                        : `<iframe src="${dataUrl}" width="100%" height="100%" style="border:none;"></iframe>`}
      </body>
    </html>
  `);
                newTab.document.close();
            } else {
                alert("Popup blocked. Please allow popups for this site to view the document.");
            }



        } catch (error) {
            console.error('Error loading branches:', error);
        }
    },
    document_viewes: async function () {
        try {


            const ReqId = document.getElementById('drp_cust').value;


            if (!ReqId) {
                console.warn('Missing required input values');
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),

                ReqId: encryptAES(ReqId),
                Flag: encryptAES("Report_DocView")
            };


            const response = await fetch('/FIRRegistration/FIRfetch', "POST", requestData);



            // Step 1: Decrypt and parse the response
            const decryptedText = decryptAES(response);
            const docs = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(docs.Query_result);
            const detaildoc = parsedInner.Table || [];

            // Step 2: Extract base64 document
            const base64Data = detaildoc[0].DOCVIEW;

            // Step 3: Detect MIME type from base64 prefix
            let mimeType = "";

            if (base64Data.startsWith("JVBER")) {
                mimeType = "application/pdf";
            } else if (base64Data.startsWith("iVBOR")) {
                mimeType = "image/png";
            } else if (base64Data.startsWith("/9j/")) {
                mimeType = "image/jpeg";
            } else if (base64Data.startsWith("UEsDB")) {
                mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // .docx
            } else {
                mimeType = "application/octet-stream"; // fallback
            }

            // Step 4: Create a data URL
            const dataUrl = `data:${mimeType};base64,${base64Data}`;

            // Step 5: Open the document in a new tab
            const newTab = window.open();
            if (newTab) {
                newTab.document.write(`
    <html>
      <head><title>Document Preview</title></head>
      <body style="margin:0">
        ${mimeType.startsWith("image/")
                        ? `<img src="${dataUrl}" style="width:100%;height:auto;">`
                        : `<iframe src="${dataUrl}" width="100%" height="100%" style="border:none;"></iframe>`}
      </body>
    </html>
  `);
                newTab.document.close();
            } else {
                alert("Popup blocked. Please allow popups for this site to view the document.");
            }



        } catch (error) {
            console.error('Error loading branches:', error);
        }
    },
    submit: async function () {
        try {
            // Validate branch selection
            const drp_branch = document.getElementById('drp_branch').value;
            if (drp_branch == "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Incomplete Information',
                    text: 'Please select Branch!',
                    confirmButtonColor: '#2c5aa0'
                });
                return false;
            }

            // Validate customer selection
            const drp_cust = document.getElementById('drp_cust').value;
            if (drp_cust == "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Incomplete Information',
                    text: 'Please select Customer!',
                    confirmButtonColor: '#2c5aa0'
                });
                return false;
            }

         

            const Request = drp_cust;
            let requestData = {};

            // Handle SP office complaint
        
            // Handle FIR Status
          
                // Read and convert file to base64
               
             
            const drp_date = document.getElementById('txt_flpdt').value;
            const StatusRemarks = document.getElementById('txt_follow_remark').value;
                if (!drp_date) {
                    alert("Please select the FIR date.");
                 
                    return;
                }

                // You can add additional validation for StatusRemarks if needed
                if (!StatusRemarks) {
                    alert("Please enter status remarks.");
                   
                    return;
                }
                const indata1 = `${drp_date}~${drp_cust}~${StatusRemarks}`;

                requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    indata: encryptAES(indata1),
                   
                    Flag: encryptAES("INSERTFOLLOWUP")
                };
            

            // Make API call using custom fetch function
            const response = await fetch('/SpComplaintUpdation/SpUpdation', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(customes.Query_result);

            // Check for successful response
            if (parsedInner && parsedInner.Table && Array.isArray(parsedInner.Table) && parsedInner.Table.length > 0) {
                const item = parsedInner.Table[0];
                const success = item.SUCCESS;

                if (success == '111') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Data submitted successfully!',
                        confirmButtonColor: '#2c5aa0'
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: item.MESSAGE || 'Failed to submit data. Please try again.',
                        confirmButtonColor: '#2c5aa0'
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Invalid response from server.',
                    confirmButtonColor: '#2c5aa0'
                });
            }

        } catch (error) {
            console.error('Error submitting data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while submitting data. Please try again.',
                confirmButtonColor: '#2c5aa0'
            });
        }
    }

}

$(document).on('change', '#drp_branch', function () {
    if ($(this).val() === "1") {
        $('#dates').show();
        $('#dates1').show();
        
        // Show the SP Complaint section
    } else {
        $('#dates').hide();
        $('#dates1').hide();
      
    }
});

function updateLabel() {
    const branchSelect = document.getElementById("drp_branch");
    const label = document.getElementById("lbl_FIRNumber");

    if (branchSelect.value === "1") {
        label.textContent = "Private Complaint Number";
    } else {
        label.textContent = "FIR Number";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const branchDropdown = document.getElementById("drp_branch");
    const label = document.getElementById("lbl_FIRNumber");
    const label1 = document.getElementById("lbl_dt");
    const label2 = document.getElementById("firview");
    const label3 = document.getElementById("sp_rmks")
    if (!label) {
        console.error("Label element not found");
        return;
    }

    if (!label1) {
        console.error("Label element not found");
        return;
    }
    if (!label2) {
        console.error("Label element not found");
        return;
    }
    if (!label3) {
        console.error("Label element not found");
        return;
    }
    branchDropdown.addEventListener("change", function () {
        label.textContent = branchDropdown.value === "1"
            ? "Private Complaint Number"
            : "FIR Number";
        label1.textContent = branchDropdown.value === "1"
            ? "Sp Complaint Date"
            : "FIR Filed Date";
        label2.textContent = branchDropdown.value === "1"
            ? "SP FIR Copy"
            : "FIR Copy";
        label3.textContent = branchDropdown.value === "1"
            ? "SP FIR Remarks"
            : "FIR Remarks";
    });
});

$(document).on('change', '#drp_branch', function () {
    _load.CustomerDropdown(this.value);
})

$(document).on('change', '#drp_cust', function () {
    _load.populatePledgeGrid();
});
$(document).on('click', '#btn_view_complaint', function () {
    _load.document_view();
});

$(document).on('click', '#btn_sub', function () {
    _load.submit();
});

$(document).on('click', '#btn_exit', function () {
    redirectToDashboard();
});
$(document).on('click', '#btn_view_sp_fir', function () {
    _load.document_viewes();
});
$(document).on('input', '#txt_follow_remark', function () {
    let cleaned = $(this).val().replace(/[^a-zA-Z\s]/g, '');
    $(this).val(cleaned);
});
$(document).on('change', '#txt_flpdt', function () {
    DateValidate1(this);
});
function clearForm() {
    // Clear the select dropdowns
    // Reset to first option
    document.getElementById('drp_cust').selectedIndex = 0; // Reset to first option

    // Clear input fields
    document.getElementById('txt_case').value = '';
    document.getElementById('txt_state').value = '';
    document.getElementById('txt_dis').value = '';
    document.getElementById('txt_police').value = '';
    document.getElementById('txt_date').value = '';
    document.getElementById('txt_complainted_by').value = '';
    document.getElementById('txt_complainted_date').value = '';
    document.getElementById('txt_private_complaint_number').value = '';
    document.getElementById('txt_sp_date').value = '';
    document.getElementById('txt_advname').value = '';
    document.getElementById('txt_district').value = '';
    document.getElementById('txt_court_name').value = '';
    document.getElementById('txt_remark').value = '';
    document.getElementById('txt_sp_remark').value = '';
    document.getElementById('txt_sp_status_remark').value = '';
    document.getElementById('txt_follow_remark').value = '';
    document.getElementById('txt_flpdt').value = '';

    // Hide specific sections if necessary
    document.getElementById('privateComplaintDiv').style.display = 'none';
    document.getElementById('spRemarksDiv').style.display = 'none';
    document.getElementById('spStatusRemarksDiv').style.display = 'none';

    // Reset button states or views if needed
    // You may add code here if there are any specific buttons or views you want to reset

    // Optionally, you can restore the readonly state for specific inputs
    let readOnlyFields = [
        'txt_case',
        'txt_state',
        'txt_dis',
        'txt_police',
        'txt_date',
        'txt_complainted_by',
        'txt_complainted_date',
        'txt_private_complaint_number',
        'txt_advname',
        'txt_district',
        'txt_court_name',
        'txt_remark',
        'txt_sp_remark',
        'txt_sp_status_remark'
    ];

    readOnlyFields.forEach(function (id) {
        document.getElementById(id).readOnly = true;
    });

}

function DateValidate1(txt) {
    const selectedDate = new Date(txt.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Date',
            text: 'Please enter a valid date.'
        });
        txt.value = '';
        return;
    }

    if (selectedDate > today) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Cannot use a future date!'
        });
        txt.value = '';
        return;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("txt_flpdt");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("max", today);

        dateInput.addEventListener("blur", function () {
            DateValidate1(this);
        });
    }
});

function DateValidate1(txt) {
    const selectedDate = new Date(txt.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Date',
            text: 'Please enter a valid date.'
        });
        txt.value = '';
        return;
    }
}
