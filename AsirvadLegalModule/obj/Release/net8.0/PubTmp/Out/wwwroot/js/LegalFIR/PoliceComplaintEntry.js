$(document).ready(async function () {
    checkAccess("37");
    _load.loadBranchs();
    _load.StateLoadDropdown();
});
let img = "";

var _load = {
    loadBranchs: async function () {
        try {
            clearForm();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("BRANCH")
            };

            const response = await fetch('/PoliceComplaintEntry/Branchfetch', "POST", requestData);
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

            if (branch === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Select a Branch',
                    text: 'Please choose a branch before proceeding.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(branch),
                Flag: encryptAES("1")
            };

            const response = await fetch('/PoliceComplaintEntry/Branchfetch', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(customes.Query_result);

            const selectElement1 = document.getElementById('drp_cust');
            selectElement1.innerHTML = '';

            parsedInner.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.CUST_ID;
                option.textContent = item.CUST_IDS;
                selectElement1.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading branches:', error);
        }
    },

    populatePledgeGrid: async function (data) {
        try {
            const custId = document.getElementById('drp_cust').value;
            if (custId === "-1") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Select a Customer ID',
                    text: 'Please choose a Customer ID before proceeding.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const branch = document.getElementById('drp_branch').value;
            if (branch === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Select a Branch',
                    text: 'Please choose a branch before proceeding.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const existingRow = document.querySelector(`#pledgeGridBody tr[data-custid="${custId}"]`);
            if (existingRow) {
                Swal.fire({
                    icon: 'info',
                    title: 'Customer Already Added',
                    text: 'This customer\'s pledge details are already populated in the grid.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(branch),
                cust_id: encryptAES(custId),
                Flag: encryptAES("2")
            };

            const response = await fetch('/PoliceComplaintEntry/Branchfetch', "POST", requestData);
            const decryptedText = decryptAES(response);
            const pledges = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(pledges.Query_result);
            const pledgeRecords = parsedInner.Table;
            const tbody = document.getElementById('pledgeGridBody');
            let totalLoss = parseFloat(document.getElementById('txt_case').value) || 0;

            if (Array.isArray(pledgeRecords) && pledgeRecords.length > 0) {
                pledgeRecords.forEach((item, index) => {
                    totalLoss += parseFloat(item.LOSS) || 0;

                    const row = document.createElement('tr');
                    row.setAttribute('data-custid', item.CUST_ID);
                    row.innerHTML = `
    <td>${item.CUST_ID}</td>
    <td>${item.PLEDGENO}</td>
    <td>${item.PLEDGEVAL}</td>
    <td class="loss-cell">${item.LOSS}</td>
    <td>${item.IRR}</td>
    <td>${item.GOLD_WEIGHT}</td>
    <td>
        <select class="form-control status-dropdown" name="status_${index}" data-pledge="${item.PLEDGENO}">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
    </td>
    <td>
        <button type="button" class="btn btn-danger btn-sm remove-row">Remove</button>
    </td>
`;
                    tbody.appendChild(row);
                });

                document.getElementById('txt_case').value = totalLoss.toFixed(2);
                attachRowRemovalHandlers();
                attachStatusDropdownHandlers();
            } else {
                tbody.innerHTML += '<tr><td colspan="8" style="color:#6c757d; padding: 20px;">No pledge details found</td></tr>';
            }
        } catch (error) {
            console.error('Error populating pledge grid:', error);
            document.getElementById('pledgeGridBody').innerHTML = '<tr><td colspan="8" style="color:#dc3545; padding: 20px;">An error occurred while loading pledge data</td></tr>';
        }
    },

    StateLoadDropdown: async function () {
        try {
            const branch = document.getElementById('drp_state').value;
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("SELECTSTATE")
            };

            const response = await fetch('/PoliceComplaintEntry/Branchfetch', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(customes.Query_result);

            const selectElement1 = document.getElementById('drp_state');
            selectElement1.innerHTML = '';

            parsedInner.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.STATE_ID;
                option.textContent = item.STATE_NAME;
                selectElement1.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading branches:', error);
        }
    },

    DistrictLoadDropdown: async function () {
        try {
            const state = document.getElementById('drp_state').value;
            if (state === "-1") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Select a State',
                    text: 'Please choose a state before proceeding.',
                    confirmButtonText: 'OK'
                });
                return;
            }
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                state: encryptAES(state),
                Flag: encryptAES("SELECTDIST")
            };

            const response = await fetch('/PoliceComplaintEntry/Branchfetch', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(customes.Query_result);

            const selectElement1 = document.getElementById('drp_dis');
            selectElement1.innerHTML = '';

            parsedInner.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.DISTRICT_ID;
                option.textContent = item.DISTRICT_NAME;
                selectElement1.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading branches:', error);
        }
    },

    Submit: async function () {
        try {
            let hasValidationError = false;
            let indata1 = '';
            let globalSelectedStatus = '';

            const rows = document.querySelectorAll('#pledgeGridBody tr');

            // Check if there are rows
            if (rows.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Data',
                    text: 'Please add pledge details before submitting.',
                    confirmButtonColor: '#2c5aa0'
                });
                return;
            }

            // First pass: Check all statuses and build data string
            rows.forEach((row, index) => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 6) {
                    const cust_id = cells[0].textContent.trim();
                    const pledgeNumber = cells[1].textContent.trim();
                    const amount = cells[2].textContent.trim();
                    const lossAmount = cells[3].textContent.trim();
                    const irregularity = cells[4].textContent.trim();
                    const dropdown = row.querySelector('.status-dropdown');
                    const selectedStatus = dropdown ? dropdown.value.trim() : '';

                    // Store the first status
                    if (index === 0) {
                        globalSelectedStatus = selectedStatus;
                    }

                    if (selectedStatus === '' || selectedStatus === 'Select') {
                        hasValidationError = true;
                        dropdown.classList.add('is-invalid');
                    } else {
                        dropdown.classList.remove('is-invalid');
                    }

                    indata1 += `${cust_id}^${pledgeNumber}^${amount}^${lossAmount}^${irregularity}^${selectedStatus}`;
                    if (index < rows.length - 1) {
                        indata1 += '!';
                    }
                }
            });

            // Check for status validation errors
            if (hasValidationError) {
                const firstInvalid = document.querySelector('.status-dropdown.is-invalid');
                if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });

                Swal.fire({
                    icon: 'error',
                    title: 'Missing Status',
                    text: 'Please select a valid status for all rows.',
                    confirmButtonColor: '#2c5aa0'
                });
                return;
            }

            // Validate form fields only if status is "Yes"
            if (globalSelectedStatus === 'Yes') {
                if (!validateFormFields()) {
                    return;
                }

                if (!validateFileUpload()) {
                    return;
                }
            }

            const drp_branch = document.getElementById('drp_branch').value;
            const drpElement = document.getElementById('drp_dis');
            const drpStateElement = document.getElementById('drp_state');

            const drp_state = (drpStateElement && drpStateElement.selectedIndex >= 0)
                ? drpStateElement.options[drpStateElement.selectedIndex].text : '';
            const txt_police = document.getElementById('txt_police').value || '';
            const drp_dis = (drpElement && drpElement.selectedIndex >= 0)
                ? drpElement.options[drpElement.selectedIndex].text : '';
            const txt_date = document.getElementById('txt_date').value || '';
            const TXT_RMK = document.getElementById('TXT_RMK').value || '';
            const txt_case = document.getElementById('txt_case').value;
            const fileInput1 = document.getElementById("file1");
            const file = fileInput1.files[0];

            // Only validate remark length if status is "Yes"
            if (globalSelectedStatus === 'Yes' && TXT_RMK.length < 300) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Remark Too Short',
                    text: 'Please enter at least 300 characters in remarks.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const indata = `${drp_branch}~${drp_state}~${txt_police}~${drp_dis}~${txt_date}~${TXT_RMK}~${txt_case}~${indata1}~1`;

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(indata),
                Flag: encryptAES("INSERT")
            };

            const response = await fetch('/PoliceComplaintEntry/Branchfetch', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(customes.Query_result);

            // Handle response based on status
            if (globalSelectedStatus === 'Yes') {
                if (parsedInner && parsedInner.Table && Array.isArray(parsedInner.Table) && parsedInner.Table.length > 0) {
                    const item = parsedInner.Table[0];
                    const uniqueid = item.UNIQUEID;

                    img = await new Promise((resolve, reject) => {
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

                    const requestData2 = {
                        employeeId: sessionStorage.getItem("EmployeeId"),
                        token: sessionStorage.getItem("Token"),
                        ReqId: encryptAES(uniqueid),
                        Flag: encryptAES("UpdateDoc"),
                        img: img
                    };

                    const response1 = await fetch('/PoliceComplaintEntry/Branchfetch', "POST", requestData2);
                    const decryptedText1 = decryptAES(response1);
                    const customes1 = JSON.parse(decryptedText1);
                    const parsedInner1 = JSON.parse(customes1.Query_result);

                    if (parsedInner1 && parsedInner1.Table && Array.isArray(parsedInner1.Table) && parsedInner1.Table.length > 0) {
                        const item = parsedInner1.Table[0];
                        const success = item.SUCCESS;

                        if (success == '111' || success == 111) {
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
                                title: 'Failed',
                                text: 'Failed to update document.',
                                confirmButtonColor: '#2c5aa0'
                            });
                        }
                    }
                }
            } else {
                if (parsedInner && parsedInner.Table && Array.isArray(parsedInner.Table) && parsedInner.Table.length > 0) {
                    const item = parsedInner.Table[0];
                    const success = item.SUCCESS;

                    if (success == 1) {
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
                            title: 'Failed',
                            text: 'Failed to submit data.',
                            confirmButtonColor: '#2c5aa0'
                        });
                    }
                }
            }

        } catch (error) {
            console.error('Error in Submit function:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred during submission: ' + error.message,
                confirmButtonColor: '#2c5aa0'
            });
        } finally {
            $('#btn_sub').prop('disabled', false);
        }
    }
};

function attachRowRemovalHandlers() {
    document.querySelectorAll('.remove-row').forEach(button => {
        button.addEventListener('click', function () {
            const clickedRow = this.closest('tr');
            const custId = clickedRow.getAttribute('data-custid');

            const rowsToRemove = document.querySelectorAll(`#pledgeGridBody tr[data-custid="${custId}"]`);
            rowsToRemove.forEach(row => row.remove());

            updateTotalLoss();
        });
    });
}

// FIXED: Removed duplicate function definition
function updateTotalLoss() {
    let total = 0;
    document.querySelectorAll('#pledgeGridBody .loss-cell').forEach(cell => {
        const value = parseFloat(cell.textContent) || 0;
        total += value;
    });
    document.getElementById('txt_case').value = total.toFixed(2);
}

function attachStatusDropdownHandlers() {
    const dropdowns = document.querySelectorAll('.status-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function () {
            const selectedValue = this.value;

            // Sync all dropdowns to the selected value
            if (selectedValue === "Yes" || selectedValue === "No") {
                dropdowns.forEach(d => {
                    d.value = selectedValue;
                });
            }

            // Show or hide the divs based on selection
            const part1 = document.getElementById('part1');
            const part2 = document.getElementById('part2');
            const part3 = document.getElementById('part3');
            const part4 = document.getElementById('part4');

            if (selectedValue === "No") {
                part1.style.display = 'none';
                part2.style.display = 'none';
                part3.style.display = 'none';
                part4.style.display = 'none';
            } else if (selectedValue === "Yes") {
                part1.style.display = 'flex';
                part2.style.display = 'flex';
                part3.style.display = 'flex';
                part4.style.display = 'flex';
            }
        });
    });
}

function validateFileUpload() {
    const fileInput1 = document.getElementById("file1");
    const file = fileInput1.files[0];

    if (!file) {
        Swal.fire({
            icon: 'warning',
            title: 'No File Selected',
            text: 'Please upload a file before proceeding.'
        });
        return false;
    }

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ];

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'
        });
        return false;
    }

    if (file.size > maxSizeBytes) {
        Swal.fire({
            icon: 'error',
            title: 'File Too Large',
            text: 'File size must be 5 MB or less.'
        });
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("txt_date");
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

function validateFormFields() {
    const drp_branch = document.getElementById("drp_branch");
    const drp_cust = document.getElementById("drp_cust");
    const drp_state = document.getElementById("drp_state");
    const drp_dis = document.getElementById("drp_dis");
    const txt_police = document.getElementById("txt_police");
    const txt_date = document.getElementById("txt_date");
    const TXT_RMK = document.getElementById("TXT_RMK");

    if (drp_branch.selectedIndex === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'WARNING',
            text: 'Please Select Branch'
        });
        return false;
    } else if (drp_cust.selectedIndex === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'WARNING',
            text: 'Please Select Customer Id'
        });
        return false;
    } else if (drp_state.selectedIndex === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'WARNING',
            text: 'Please Select State'
        });
        return false;
    } else if (drp_dis.selectedIndex === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'WARNING',
            text: 'Please Select District'
        });
        return false;
    } else if (txt_police.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'WARNING',
            text: 'Please Enter Police Station Details'
        });
        return false;
    } else if (txt_date.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'WARNING',
            text: 'Please Select Date'
        });
        return false;
    } else if (TXT_RMK.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'WARNING',
            text: 'Please Enter Case Remarks'
        });
        return false;
    }

    return true;
}

$(document).on('change', '#drp_branch', function () {
    _load.CustomerDropdown(this.value);
});

$(document).on('change', '#drp_cust', function () {
    _load.populatePledgeGrid();
});

$(document).on('change', '#drp_state', function () {
    _load.DistrictLoadDropdown();
});

$(document).on('click', '#btn_sub', function () {
    if (!$(this).prop('disabled')) {
        $(this).prop('disabled', true);
        _load.Submit();
    }
});

$(document).on('click', '#btn_exit', function () {
    redirectToDashboard();
});

$(document).on('input', '#txt_police', function () {
    let sanitized = $(this).val().replace(/[^a-zA-Z\s]/g, '');
    $(this).val(sanitized);
});

$(document).on('blur', '#TXT_RMK', function () {
    const remarks = $(this).val().trim();
    if (remarks.length < 300) {
        $('#rmk_error').text('Remark must be at least 300 characters.').show();
    } else {
        $('#rmk_error').hide();
    }
});

$(document).on('input', '#TXT_RMK', function () {
    let cleaned = $(this).val().replace(/[^a-zA-Z\s.]/g, '');
    $(this).val(cleaned);
});

function clearForm() {
    document.getElementById('drp_cust').selectedIndex = 0;
    document.getElementById('drp_state').selectedIndex = 0;
    document.getElementById('drp_dis').selectedIndex = 0;
    document.getElementById('txt_police').value = '';
    document.getElementById('txt_date').value = '';
    document.getElementById('txt_case').value = '';
    document.getElementById('file1').value = '';
    document.getElementById('TXT_RMK').value = '';

    const charCountElement = document.getElementById('charCount');
    if (charCountElement) {
        charCountElement.innerText = '0 / 300';
    }

    document.getElementById('pledgeGridBody').innerHTML = '';
}
 
function clearForm1() {
    document.getElementById('drp_cust').selectedIndex = 0;
    document.getElementById('drp_dis').selectedIndex = 0;
    document.getElementById('txt_police').value = '';
    document.getElementById('txt_date').value = '';
    document.getElementById('txt_case').value = '';
    document.getElementById('file1').value = '';
    document.getElementById('TXT_RMK').value = '';

    const charCountElement = document.getElementById('charCount');
    if (charCountElement) {
        charCountElement.innerText = '0 / 300';
    }

    document.getElementById('pledgeGridBody').innerHTML = '';
}