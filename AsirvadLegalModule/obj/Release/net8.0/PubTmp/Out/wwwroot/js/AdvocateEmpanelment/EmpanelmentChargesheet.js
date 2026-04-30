$(document).ready(async function () {
    checkAccess("47");
    // Initialize dropdowns and tables
    await subcategory.GetAdvocateName2();
});

$(document).on('click', '#exit', function () {
    redirectToDashboard();
});

let fullNameField = "";
let addressField = "";

var subcategory = {
    GetAdvocateName2: async function () {
        // Show loading
        Swal.fire({
            title: 'Loading Advocates...',
            text: 'Please wait while we fetch advocate names',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("16")
            };

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const outResult = JSON.parse(customes.out_result);

            const selectElement1 = document.getElementById('ddlChoice');

            outResult.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.ID;
                option.textContent = item.ADV_NAME;
                selectElement1.appendChild(option);
            });

            // Close loading
            Swal.close();

        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load advocates: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },
}

function toggleControls() {
    var printRadioButton = document.getElementById('RadioButton2');
    var advocateDocsRadioButton = document.getElementById('RadioButton3');
    var annexure1RadioButton = document.getElementById('RadioButton4');
    var annexure2RadioButton = document.getElementById('RadioButton5');
    var addEditChargeRadioButton = document.getElementById('RadioButton1');

    var printButtonSection = document.getElementById("printButtonSection");
    var fileUploadSectionAdvocateDocs = document.getElementById("fileUploadSectionAdvocateDocs");
    var fileUploadSectionAnnexure1 = document.getElementById("fileUploadSectionAnnexure1");
    var fileUploadSectionAnnexure2 = document.getElementById("fileUploadSectionAnnexure2");
    var addEditChargeSection = document.getElementById("addEditChargeSection");

    // Hide all sections first
    printButtonSection.style.display = "none";
    fileUploadSectionAdvocateDocs.style.display = "none";
    fileUploadSectionAnnexure1.style.display = "none";
    fileUploadSectionAnnexure2.style.display = "none";
    addEditChargeSection.style.display = "none";

    // Show the selected section
    if (printRadioButton.checked) {
        printButtonSection.style.display = "block";
    } else if (advocateDocsRadioButton.checked) {
        fileUploadSectionAdvocateDocs.style.display = "block";
    } else if (annexure1RadioButton.checked) {
        fileUploadSectionAnnexure1.style.display = "block";
    } else if (annexure2RadioButton.checked) {
        fileUploadSectionAnnexure2.style.display = "block";
    } else if (addEditChargeRadioButton.checked) {
        addEditChargeSection.style.display = "block";
    }
}

// Attach onchange listeners to all radios
document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll('input[name="SelectedOption"]');
    radios.forEach(radio => {
        radio.addEventListener("change", toggleControls);
    });

    toggleControls();
});

$(document).ready(function () {
    // Print button click event
    $('#Print').on('click', function (e) {
        e.preventDefault();
        printEmpanelmentLetter();
    });

    // Upload button click event
    $('#UploadAdvocateDoc').on('click', function (e) {
        e.preventDefault();
        Fileupload.AdvocateDocuments();
    });

    $('#SaveAnnexure1').on('click', function (e) {
        e.preventDefault();
        Fileupload.Annexure1();
    });

    $('#SaveAnnexure2').on('click', function (e) {
        e.preventDefault();
        Fileupload.Annexure2();
    });

    $('#SaveChargeDetails').on('click', function (e) {
        e.preventDefault();
        chargeDeatils.Savechargedetails();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Attach to both inputs
    document.getElementById("ChargeDetails").addEventListener("input", function () {
        checkPositive(this);
    });

    document.getElementById("CompanyCharge").addEventListener("input", function () {
        checkPositive(this);
    });
});

var chargeDeatils = {
    Savechargedetails: async function () {
        try {
            let ddl = document.getElementById("ddlChoice");
            let selectedValue = ddl.value;
            let selectedIndex = ddl.selectedIndex;

            if (selectedIndex === 0 || selectedValue === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Selection',
                    text: 'Please select an option from the dropdown.'
                });
                return;
            }

            const chargeDetails = document.getElementById("ChargeDetails").value;
            const companyCharge = document.getElementById("CompanyCharge").value;

            if (!chargeDetails || !companyCharge) {
                swal("Validation Error", "Both ChargeDetails and CompanyCharge must be entered!", "error");
                return;
            }

            // Optional: check positive number for ChargeDetails
            if (isNaN(chargeDetails) || Number(chargeDetails) <= 0) {
                swal("Invalid Input", "ChargeDetails must be a positive number!", "warning");
                return;
            }

            var advocateId = document.getElementById('ddlChoice').value;
            // Append with ^ separator
            const combined = chargeDetails + "^" + companyCharge + "^" + advocateId;
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(combined),
                Flag: encryptAES("18")
            };

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const outResult = JSON.parse(customes.out_result);

            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            if (errorStatus === 0) {
                // Failure alert
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: errorMsg,
                    footer: '<b>Please check your details and try again.</b>',
                    background: '#fff0f0',
                    color: '#d33',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Retry',
                    showClass: { popup: 'animate__animated animate__shakeX' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                });
            } else {
                // Success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: errorMsg,
                    background: '#f0fff0',
                    color: '#28a745',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Great!',
                    timer: 3000,
                    timerProgressBar: true,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                }).then(() => {
                    document.getElementById('CompanyCharge').value = "";
                    document.getElementById('ChargeDetails').value = "";
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save charge details: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    personalDetaildata: async function () {
        try {
            const ddlAdvocate = document.getElementById('ddlChoice').value;

            if (!ddlAdvocate || ddlAdvocate === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Please select advocate name',
                    confirmButtonColor: '#d33'
                });
                return null;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(ddlAdvocate),
                Flag: encryptAES("3")
            };

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedResult = JSON.parse(customes.out_result);
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            if (errorStatus === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
                return null;
            }

            const dataObject = parsedResult.Table[0];
            let dataString = null;

            for (let key in dataObject) {
                if (typeof dataObject[key] === 'string' && dataObject[key].includes('^')) {
                    dataString = dataObject[key];
                    break;
                }
            }

            let userData = {};

            if (dataString) {
                const dataArray = dataString.split('^');
                userData = {
                    fullName: dataArray[0] || '',
                    fatherName: dataArray[1] || '',
                    residenceAddress: dataArray[2] || '',
                    officeAddress: dataArray[3] || '',
                    dob: dataArray[4] || '',
                    gender: dataArray[5] || '',
                    landline: dataArray[6] || '',
                    mobile: dataArray[7] || '',
                    whatsapp: dataArray[8] || '',
                    email: dataArray[9] || '',
                    socialMedia: dataArray[10] || '',
                    occupation: dataArray[11] || '',
                    pan: dataArray[12] || '',
                    state: dataArray[13] || '',
                    district: dataArray[14] || '',
                    category: dataArray[15] || '',
                    nation: dataArray[16] || ''
                };

                // Update global variables
                fullNameField = dataArray[0] || '';
                addressField = dataArray[2] || '';
            } else {
                userData = {
                    fullName: dataObject.FULL_NAME || '',
                    fatherName: dataObject.FATHER_NAME || '',
                    residenceAddress: dataObject.RESI_ADDRESS || '',
                    officeAddress: dataObject.CORRES_ADDRE || '',
                    dob: dataObject.DOB || '',
                    gender: dataObject.GENDER || '',
                    landline: dataObject.LANDLINE || '',
                    mobile: dataObject.MOBILE || '',
                    whatsapp: dataObject.WHATSAPP || '',
                    email: dataObject.EMAIL || '',
                    socialMedia: dataObject.SOCIAL_CONTACT || '',
                    occupation: dataObject.OCCU_DTL || '',
                    pan: dataObject.PAN_NO || '',
                    state: dataObject.STATE || '',
                    district: dataObject.DISTRICT || '',
                    category: dataObject.VERTICAL_NAME || '',
                    nation: dataObject.NATION || ''
                };

                // Update global variables
                fullNameField = dataObject.FULL_NAME || '';
                addressField = dataObject.RESI_ADDRESS || '';
            }

            return userData;

        } catch (error) {
            console.error('Error loading personal details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load personal details: ' + error.message,
                confirmButtonColor: '#d33'
            });
            return null;
        }
    }
}

function checkPositive(input) {
    // Remove anything that's not a digit or decimal point
    input.value = input.value.replace(/[^0-9.]/g, '');

    // Convert to number
    const num = parseFloat(input.value);

    // If not positive, clear the field
    if (isNaN(num) || num <= 0) {
        input.value = '';
    }
}

async function printEmpanelmentLetter() {
    // Get the selected advocate ID
    var advocateId = document.getElementById('ddlChoice').value;

    if (advocateId === "0" || !advocateId) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning!',
            text: 'Please select an advocate first',
            confirmButtonColor: '#f0ad4e'
        });
        return;
    }

    // Await the data fetch
    const personalData = await chargeDeatils.personalDetaildata();

    if (!personalData) {
        return; // Error already shown in personalDetaildata
    }

    const isDevelopment = window.location.hostname === 'localhost';
    const baseUrl = window.location.origin;
    const livePath = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';

    // Build the final URL
    const url = baseUrl + livePath + '/EmpanelmentRequest/EmpanelmentLetter' + '?fullname=' + encodeURIComponent(fullNameField) + '&address=' + encodeURIComponent(addressField);

    // Navigate to the print page
    window.location.href = url;
}

var Fileupload = {
    AdvocateDocuments: async function () {
        try {
            let ddl = document.getElementById("ddlChoice");
            let selectedValue = ddl.value;
            let selectedIndex = ddl.selectedIndex;

            if (selectedIndex === 0 || selectedValue === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Selection',
                    text: 'Please select an option from the dropdown.'
                });
                return;
            }

            // File handling with validation
            const fileInput1 = document.getElementById("AdvocateDocument");

            if (!fileInput1 || !fileInput1.files || !fileInput1.files[0]) {
                Swal.fire({
                    icon: 'warning',
                    title: 'File Required',
                    text: 'Please select a file to upload.',
                    confirmButtonColor: '#f39c12'
                });
                return;
            }

            const file = fileInput1.files[0];

            // Optional: Add file size validation (e.g., 5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                Swal.fire({
                    icon: 'warning',
                    title: 'File Too Large',
                    text: 'File size should not exceed 5MB.',
                    confirmButtonColor: '#f39c12'
                });
                return;
            }

            // Convert file to Base64
            const img = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64String = e.target.result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = function () {
                    reject(new Error('Failed to read file'));
                };
                reader.readAsDataURL(file);
            });

            const indata = selectedValue;
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(indata),
                img: img,
                Flag: encryptAES("13")
            };

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(customes.out_result);
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            if (errorStatus === 0) {
                // Failure alert
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: errorMsg,
                    footer: '<b>Please check your details and try again.</b>',
                    background: '#fff0f0',
                    color: '#d33',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Retry',
                    showClass: { popup: 'animate__animated animate__shakeX' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                });
            } else {
                // Success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: errorMsg,
                    background: '#f0fff0',
                    color: '#28a745',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Great!',
                    timer: 3000,
                    timerProgressBar: true,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                }).then(() => {
                    fileInput1.value = '';
                });
            }
        } catch (error) {
            // Catch unexpected errors
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: error.message,
                confirmButtonColor: '#d33'
            });
            console.error("File upload failed:", error);
        }
    },

    Annexure1: async function () {
        try {
            let ddl = document.getElementById("ddlChoice");
            let selectedValue = ddl.value;
            let selectedIndex = ddl.selectedIndex;

            if (selectedIndex === 0 || selectedValue === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Selection',
                    text: 'Please select an option from the dropdown.'
                });
                return;
            }

            // File handling with validation
            const fileInput1 = document.getElementById("Annexure1");

            if (!fileInput1 || !fileInput1.files || !fileInput1.files[0]) {
                Swal.fire({
                    icon: 'warning',
                    title: 'File Required',
                    text: 'Please select a file to upload.',
                    confirmButtonColor: '#f39c12'
                });
                return;
            }

            const file = fileInput1.files[0];

            // Optional: Add file size validation (e.g., 5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                Swal.fire({
                    icon: 'warning',
                    title: 'File Too Large',
                    text: 'File size should not exceed 5MB.',
                    confirmButtonColor: '#f39c12'
                });
                return;
            }

            // Convert file to Base64
            const img1 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64String = e.target.result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = function () {
                    reject(new Error('Failed to read file'));
                };
                reader.readAsDataURL(file);
            });

            const indata1 = selectedValue;
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(indata1),
                img: img1,
                Flag: encryptAES("21")
            };

            const response1 = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText1 = decryptAES(response1);
            const customes1 = JSON.parse(decryptedText1);
            const parsedInne1 = JSON.parse(customes1.out_result);
            const errorStatus1 = customes1.Error_status;
            const errorMsg1 = customes1.Error_msg;

            if (errorStatus1 === 0) {
                // Failure alert
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: errorMsg1,
                    footer: '<b>Please check your details and try again.</b>',
                    background: '#fff0f0',
                    color: '#d33',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Retry',
                    showClass: { popup: 'animate__animated animate__shakeX' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                });
            } else {
                // Success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: errorMsg1,
                    background: '#f0fff0',
                    color: '#28a745',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Great!',
                    timer: 3000,
                    timerProgressBar: true,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                }).then(() => {
                    fileInput1.value = ''; // Clear file input
                });
            }
        } catch (error) {
            // Catch unexpected errors
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: error.message,
                confirmButtonColor: '#d33'
            });
            console.error("File upload failed:", error);
        }
    },

    Annexure2: async function () {
        try {
            let ddl = document.getElementById("ddlChoice");
            let selectedValue = ddl.value;
            let selectedIndex = ddl.selectedIndex;

            if (selectedIndex === 0 || selectedValue === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Selection',
                    text: 'Please select an option from the dropdown.'
                });
                return;
            }

            // File handling with validation
            const fileInput1 = document.getElementById("Annexure2");

            if (!fileInput1 || !fileInput1.files || !fileInput1.files[0]) {
                Swal.fire({
                    icon: 'warning',
                    title: 'File Required',
                    text: 'Please select a file to upload.',
                    confirmButtonColor: '#f39c12'
                });
                return;
            }

            const file = fileInput1.files[0];

            // Optional: Add file size validation (e.g., 5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                Swal.fire({
                    icon: 'warning',
                    title: 'File Too Large',
                    text: 'File size should not exceed 5MB.',
                    confirmButtonColor: '#f39c12'
                });
                return;
            }

            // Convert file to Base64
            const img1 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64String = e.target.result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = function () {
                    reject(new Error('Failed to read file'));
                };
                reader.readAsDataURL(file);
            });

            const indata1 = selectedValue;
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(indata1),
                img: img1,
                Flag: encryptAES("22")
            };

            const response1 = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText1 = decryptAES(response1);
            const customes1 = JSON.parse(decryptedText1);
            const parsedInne1 = JSON.parse(customes1.out_result);
            const errorStatus1 = customes1.Error_status;
            const errorMsg1 = customes1.Error_msg;

            if (errorStatus1 === 0) {
                // Failure alert
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: errorMsg1,
                    footer: '<b>Please check your details and try again.</b>',
                    background: '#fff0f0',
                    color: '#d33',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Retry',
                    showClass: { popup: 'animate__animated animate__shakeX' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                });
            } else {
                // Success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: errorMsg1,
                    background: '#f0fff0',
                    color: '#28a745',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Great!',
                    timer: 3000,
                    timerProgressBar: true,
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                }).then(() => {
                    fileInput1.value = ''; // Clear file input
                });
            }
        } catch (error) {
            // Catch unexpected errors
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: error.message,
                confirmButtonColor: '#d33'
            });
            console.error("File upload failed:", error);
        }
    }
};