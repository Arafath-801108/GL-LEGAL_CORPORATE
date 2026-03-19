$(document).ready(async function () {
    checkAccess("39");
    _load.loadBranchs();

});
let img = "";
var _load = {
    loadBranchs: async function () {
        try {

            clearForm();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("policeComplaintbranch")
            };

            const response = await fetch('/SpComplaint/SPfetch', "POST", requestData);

            const decryptedText = decryptAES(response);
            const branches = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(branches.Query_result);

            const selectElement1 = document.getElementById('drp_branch');
            selectElement1.innerHTML = '';

            parsedInner.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.BRANCH_ID;
                option.textContent = item.BRANCH_NAME;
                selectElement1.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading branches:', error);
        }
    },
    CustomerDropdown: async function () {

        try {

            clearForm();
            const branch = document.getElementById('drp_branch').value;
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(branch),
                Flag: encryptAES("policeComplaintRequestid")
            };

            const response = await fetch('/SpComplaint/SPfetch', "POST", requestData);

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


            if (pledgeRecords.length > 0) {

                document.getElementById('txt_complainted_by').value = pledgeRecords1[0].REQ_BY || '';
                document.getElementById('txt_complainted_date').value = pledgeRecords1[0].REQ_DT || '';
                document.getElementById('txt_state').value = pledgeRecords1[0].POLICE_STATE || '';
                document.getElementById('txt_dis').value = pledgeRecords1[0].POLICE_DISTRICT || '';
                document.getElementById('txt_police').value = pledgeRecords1[0].POLICE_NAME || '';
                document.getElementById('txt_date').value = pledgeRecords1[0].FILED_DT || '';
                document.getElementById('txt_remark').value = pledgeRecords1[0].BH_RMK;


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

            // Validate filed status
            const drp_dis_element = document.getElementById('drp_dis');
            const drp_dis = drp_dis_element.options[drp_dis_element.selectedIndex].text;
            if (drp_dis == '-- Select --') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Incomplete Information',
                    text: 'Please select Filed Status!',
                    confirmButtonColor: '#2c5aa0'
                });
                return false;
            }

            const Request = drp_cust;
            let requestData = {};

            // Handle SP office complaint
            if (drp_dis == "No") {
                requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    ReqId: encryptAES(Request),
                    Flag: encryptAES("spComplaintdataupdate")
                };
            }
            // Handle FIR Status
            else if (drp_dis == "Yes") {

                const CaswNumber = document.getElementById('txt_FIRNumber').value.trim();
                const CaseDate = document.getElementById('txt_FIR_date').value;
                const Advname = document.getElementById('txt_advname').value;
                const courtname = document.getElementById('txt_crt_name').value;
                const spRMK = document.getElementById('txt_fir_remark').value.trim();
                const Spdistrict = document.getElementById('txt_dis').value.trim();
                // Validate FIR Number
                if (!CaswNumber) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Incomplete Information',
                        text: 'Please enter Case  Number!',
                        confirmButtonColor: '#2c5aa0'
                    });
                    return false;
                }

                // Validate FIR Date
                if (!CaseDate) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Incomplete Information',
                        text: 'Please select complaint filed Date!',
                        confirmButtonColor: '#2c5aa0'
                    });
                    return false;
                }
                if (!Advname) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Incomplete Information',
                        text: 'Please select complaint filed Date!',
                        confirmButtonColor: '#2c5aa0'
                    });
                    return false;
                }
                if (!courtname) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Incomplete Information',
                        text: 'Please enter Complaint Remark!',
                        confirmButtonColor: '#2c5aa0'
                    });
                    return false;
                }
                // Validate FIR Remark
                if (!spRMK) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Incomplete Information',
                        text: 'Please enter Complaint Remark!',
                        confirmButtonColor: '#2c5aa0'
                    });
                    return false;
                }

                // Read and convert file to base64
                const fileInput1 = document.getElementById("file1");

                if (!fileInput1 || !fileInput1.files || fileInput1.files.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Missing File',
                        text: 'Please select a file to upload!',
                        confirmButtonColor: '#2c5aa0'
                    });
                    return false;
                }

                const file = fileInput1.files[0];

                const img = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const base64String = e.target.result.split(',')[1];
                        resolve(base64String);
                    };
                    reader.onerror = function (e) {
                        reject(new Error('Failed to read file'));
                    };
                    reader.readAsDataURL(file);
                });

                const indata1 = `${drp_cust}~${CaswNumber}~${CaseDate}~${Advname}~${courtname}~${spRMK}~${Spdistrict}`;

                requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    indata: encryptAES(indata1),
                    img: img,
                    Flag: encryptAES("UPDATESpRegister")
                };
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid Selection',
                    text: 'Please select a valid Filed Status option!',
                    confirmButtonColor: '#2c5aa0'
                });
                return false;
            }

            // Make API call using custom fetch function
            const response = await fetch('/SpComplaint/SPfetch', "POST", requestData);
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
$(document).on('change', '#drp_dis', function () {
    const firDiv = $('#firNumberDiv');
    const firDiv1 = $('#firNumberDiv1');
    const firDiv2 = $('#firNumberDiv2');
    const firDiv3 = $('#firNumberDiv3');
    if ($(this).val() === "1") {
        firDiv.show();
        firDiv1.show();
        firDiv2.show();
        firDiv3.show();
    } else {
        firDiv.hide();
        firDiv1.hide();
        firDiv2.hide();
        firDiv3.hide();
    }
});


function clearForm() {
    // Clear the select dropdowns
   // Reset to the first option
    document.getElementById('drp_cust').selectedIndex = 0; // Reset to the first option
    document.getElementById('drp_dis').selectedIndex = 0; // Reset to the first option

    // Clear input fields
    document.getElementById('txt_case').value = '';
    document.getElementById('txt_state').value = '';
    document.getElementById('txt_dis').value = '';
    document.getElementById('txt_police').value = '';
    document.getElementById('txt_date').value = '';
    document.getElementById('txt_complainted_by').value = '';
    document.getElementById('txt_complainted_date').value = '';
    document.getElementById('txt_FIRNumber').value = '';
    document.getElementById('txt_FIR_date').value = '';
    document.getElementById('txt_advname').value = '';
    document.getElementById('txt_dis').value = ''; // Make sure the ID is unique; otherwise, this will overwrite the previous line.
    document.getElementById('txt_crt_name').value = '';
    document.getElementById('file1').value = ''; // Clear the file input
    document.getElementById('txt_remark').value = '';
    document.getElementById('txt_fir_remark').value = '';

    // Hide optional sections
    document.getElementById('firNumberDiv').style.display = 'none';
    document.getElementById('firNumberDiv3').style.display = 'none';
    document.getElementById('firNumberDiv1').style.display = 'none';
    document.getElementById('firNumberDiv2').style.display = 'none';
}

$(document).on('change', '#drp_branch', function () {
    _load.CustomerDropdown(this.value);
})

$(document).on('change', '#drp_cust', function () {
    _load.populatePledgeGrid();
});
$(document).on('click', '#btn_view', function () {
    _load.document_view();
});

$(document).on('click', '#btn_sub', function () {
    _load.submit();
});
$(document).on('click', '#btn_exit', function () {
    redirectToDashboard();
});
$(document).on('input', '#txt_FIRNumber', function () {
    let cleaned = $(this).val().replace(/[^a-zA-Z0-9/]/g, '');
    $(this).val(cleaned);
});
$(document).on('input', '#txt_advname', function () {
    let cleaned = $(this).val().replace(/[^a-zA-Z\s]/g, '');
    $(this).val(cleaned);
});
$(document).on('input', '#txt_dis', function () {
    let cleaned = $(this).val().replace(/[^a-zA-Z\s]/g, '');
    $(this).val(cleaned);
});
$(document).on('input', '#txt_crt_name', function () {
    let cleaned = $(this).val().replace(/[^a-zA-Z\s]/g, '');
    $(this).val(cleaned);
});
$(document).on('input', '#txt_fir_remark', function () {
    let cleaned = $(this).val().replace(/[^a-zA-Z\s]/g, '');
    $(this).val(cleaned);
});
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("txt_FIR_date");
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