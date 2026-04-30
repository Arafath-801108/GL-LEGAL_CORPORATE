// Toggle section visibility
function toggleSection(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('show');
}

// Check if personal section is completed
function isPersonalSectionComplete() {
    const personalSection = document.getElementById('personalSection');
    const requiredFields = personalSection.querySelectorAll('input[required], select[required], textarea[required]');
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            return false;
        }
    }
    return true;
}

// Handle section completion and auto-progress
function onPersonalSectionComplete() {
    if (isPersonalSectionComplete()) {
        // Collapse personal section content only
        const personalContent = document.getElementById('personalSection1');
        personalContent.classList.remove('show');

        // Show professional section
        const professionalWrapper = document.getElementById('professionalSectionWrapper');
        const professionalContent = document.getElementById('professionalSection');

        professionalWrapper.style.display = 'block';
        professionalContent.classList.add('show');
    } else {
        alert('Please fill all required fields before continuing.');
    }
}

// Function to close all previous sections
function closeAllPreviousSections() {
    const personalContent = document.getElementById('personalSection1');
    if (personalContent) personalContent.classList.remove('show');

    const professionalContent = document.getElementById('professionalSection');
    if (professionalContent) professionalContent.classList.remove('show');

    const additionalContent = document.getElementById('additional');
    if (additionalContent) additionalContent.classList.remove('show');
}

// Add a "Continue" button at the end of personal section
function addContinueButton() {
    const personalSection = document.getElementById('personalSection1');
    const continueBtn = document.createElement('button');
    continueBtn.textContent = 'Continue to Professional Details';
    continueBtn.className = 'continue-btn';
    continueBtn.onclick = onPersonalSectionComplete;
    personalSection.appendChild(continueBtn);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("caseam").addEventListener("input", function () {
        // Remove any non-digit characters
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    // Make headers clickable - FIXED: Stop propagation from content
    const personalHeader = document.querySelector('#personalSection h2');
    const personalSection1 = document.getElementById('personalSection1');

    if (personalHeader) {
        personalHeader.onclick = function (e) {
            // Only toggle if clicking directly on header, not on child elements
            if (e.target === personalHeader || e.target.tagName === 'H2') {
                toggleSection(this);
            }
        };
    }

    // Prevent clicks inside the section content from bubbling to header
    if (personalSection1) {
        personalSection1.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    const professionalHeader = document.getElementById('toggleProfessional');
    const professionalSection = document.getElementById('professionalSection');

    if (professionalHeader) {
        professionalHeader.onclick = function (e) {
            if (e.target === professionalHeader || e.target.tagName === 'H2') {
                toggleSection(this);
            }
        };
    }

    if (professionalSection) {
        professionalSection.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    const additionalHeader = document.getElementById('toggleadditional');
    const additionalSection = document.getElementById('additional');

    if (additionalHeader) {
        additionalHeader.onclick = function (e) {
            if (e.target === additionalHeader || e.target.tagName === 'H2') {
                toggleSection(this);
            }
        };
    }

    if (additionalSection) {
        additionalSection.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    const documentHeader = document.getElementById('Document1');
    const documentSection = document.getElementById('DocumentDetails');

    if (documentHeader) {
        documentHeader.onclick = function (e) {
            if (e.target === documentHeader || e.target.tagName === 'H2') {
                closeAllPreviousSections();
                toggleSection(this);
            }
        };
    }

    if (documentSection) {
        documentSection.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Add Continue button
    addContinueButton();
});

document.addEventListener("DOMContentLoaded", function () {
    // Initialize - Load states on page load
    subcategory.StateLoadDropdown();

    $(document).on('click', '#exit1', function () {
        redirectToDashboard();
    });
    $(document).on('click', '#exit2', function () {
        redirectToDashboard();
    });
    $(document).on('click', '#exit3', function () {
        redirectToDashboard();
    });
    $(document).on('click', '#exit4', function () {
        redirectToDashboard();
    });

    // Attach change event to ddlchoice
    document.getElementById("ddlchoice").addEventListener("change", function () {
        clearAllFormFields1();
        const selectedValue = this.value;
        const advocateGroup = document.getElementById("advocateGroup");

        advocateGroup.style.display = (selectedValue === "2") ? "block" : "none";

        if (selectedValue === "2") {
            subcategory.GetAdvocateName();
        }
    });

    document.getElementById("sublas").addEventListener("click", function (e) {
        e.preventDefault();

        if (validateDocumentSection()) {
            Swal.fire({
                icon: 'success',
                title: 'Validation Passed!',
                text: 'Document details are valid. You can now proceed.',
                confirmButtonColor: '#28a745'
            });
            subcategory.documentDetailsSubmit();
        }
    });

    const regYes = document.getElementById("regYes");
    const regNo = document.getElementById("regNo");
    const partnerDetails = document.getElementById("partnerDetails");

    regYes.addEventListener("click", function () {
        partnerDetails.style.display = "block";
    });

    regNo.addEventListener("click", function () {
        partnerDetails.style.display = "none";
    });

    // ddlAdvocate change
    document.getElementById("ddlAdvocate").addEventListener("change", function () {
        subcategory.personalDetaildata();
        subcategory.profeesionalDetaildata();
        subcategory.AdditionalDetaildata();
        subcategory.DocDetaildata();
        clearAllFormFields2();
    });

    // drp_state change
    document.getElementById("drp_state").addEventListener("change", function () {
        const districtDropdown = document.getElementById('drp_dis');
        districtDropdown.innerHTML = '<option value="-1">-- Select District --</option>';
        subcategory.DistrictLoadDropdown();
    });

    document.getElementById("btnSave").addEventListener("click", function (e) {
        e.preventDefault();

        if (validatePersonalSection()) {
            const advocatecat = document.getElementById("ddlchoice");
            const selectedValue = advocatecat.value;
            var flag;
            if (selectedValue === "2") {
                flag = 4;
                subcategory.personalDetailsSubmit(flag);
            } else {
                flag = 1;
                subcategory.personalDetailsSubmit(flag);
            }
        }
    });

    document.getElementById("profbtn").addEventListener("click", function (e) {
        e.preventDefault();

        if (validateProfessionalSection()) {
            Swal.fire({
                icon: 'success',
                title: 'Validation Passed!',
                text: 'Professional details are valid. You can now proceed.',
                confirmButtonColor: '#28a745'
            });
        }
    });

    // Toggle sections - Professional Details (Alternative method using display)
    const toggleProfessional = document.getElementById("toggleProfessional");
    const professionalSectionAlt = document.getElementById("professionalSection");
    if (toggleProfessional && professionalSectionAlt) {
        toggleProfessional.style.cursor = "pointer";
        toggleProfessional.addEventListener("click", function (e) {
            // Prevent toggling if clicking on child elements like inputs
            if (e.target === toggleProfessional || e.target.tagName === 'H2') {
                if (professionalSectionAlt.style.display === "none") {
                    professionalSectionAlt.style.display = "block";
                } else {
                    professionalSectionAlt.style.display = "none";
                }
            }
        });
    }

    // Toggle sections - Additional Details
    const toggleAdditional = document.getElementById("toggleadditional");
    const additionalSectionAlt = document.getElementById("additional");
    if (toggleAdditional && additionalSectionAlt) {
        toggleAdditional.style.cursor = "pointer";
        toggleAdditional.addEventListener("click", function (e) {
            if (e.target === toggleAdditional || e.target.tagName === 'H2') {
                if (additionalSectionAlt.style.display === "none") {
                    additionalSectionAlt.style.display = "block";
                } else {
                    additionalSectionAlt.style.display = "none";
                }
            }
        });
    }

    // Toggle sections - Document Details
    const toggleDocument = document.getElementById("Document1");
    const documentSectionAlt = document.getElementById("DocumentDetails");
    if (toggleDocument && documentSectionAlt) {
        toggleDocument.style.cursor = "pointer";
        toggleDocument.addEventListener("click", function (e) {
            if (e.target === toggleDocument || e.target.tagName === 'H2') {
                if (documentSectionAlt.style.display === "none") {
                    documentSectionAlt.style.display = "block";
                } else {
                    documentSectionAlt.style.display = "none";
                }
            }
        });
    }

    // Case Number Table functionality
    const addBtn = document.getElementById("addBtn");
    const caseNumberInput = document.getElementById("caseNumberInput");

    if (addBtn && caseNumberInput) {
        addBtn.addEventListener("click", function () {
            subcategory.addCaseNumber();
        });

        caseNumberInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                subcategory.addCaseNumber();
            }
        });
    }

    // Case Type Table functionality
    const addtypeBtn = document.getElementById("addtypeBtn");
    const ddltype = document.getElementById("ddltype");

    if (addtypeBtn && ddltype) {
        addtypeBtn.addEventListener("click", function () {
            subcategory.addCaseType();
        });
    }

    const caseTableBody = document.getElementById("caseTableBody");
    if (caseTableBody) {
        caseTableBody.addEventListener("click", function (e) {
            // Check if clicked element or its parent is the remove button
            const removeBtn = e.target.closest(".btn-remove-case");
            if (removeBtn) {
                e.preventDefault();
                e.stopPropagation(); // Stop event from bubbling to section toggle
                const index = parseInt(removeBtn.getAttribute("data-index"));
                subcategory.removeCaseNumber(index);
            }
        });
    }

    // For Case Type table
    const caseTypeTableBody = document.getElementById("caseTypeTableBody");
    if (caseTypeTableBody) {
        caseTypeTableBody.addEventListener("click", function (e) {
            const removeBtn = e.target.closest(".btn-remove-type");
            if (removeBtn) {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(removeBtn.getAttribute("data-index"));
                subcategory.removeCaseType(index);
            }
        });
    }

    //document.addEventListener("click", function (e) {
    //    // Stop propagation to prevent section toggle interference
    //    if (e.target.classList.contains("btn-remove-case")) {
          
    //        e.preventDefault();
    //        const index = parseInt(e.target.getAttribute("data-index"));
    //        subcategory.removeCaseNumber(index);
    //    }

    //    if (e.target.classList.contains("btn-remove-type")) {
          
    //        e.preventDefault();
    //        const index = parseInt(e.target.getAttribute("data-index"));
    //        subcategory.removeCaseType(index);
    //    }
    //});
});
var subcategory = {

    caseNumbers: [],
    caseTypes: [],

    addCaseNumber: function () {
        const input = document.getElementById("caseNumberInput");
        const caseNumber = input.value.trim();
        const errorMessage = document.querySelector(".case-error-message");

        if (!caseNumber) {
            errorMessage.textContent = "Please enter a case number";
            errorMessage.style.display = "block";
            return;
        }

        const validPattern = /^[0-9a-zA-Z\s\-\/\\_\.\,\:\;\(\)\[\]\{ \ } \@\#\$\%\&\*\+\=\|\~\`\'\"\<\>\?]+$/;

        if (!validPattern.test(caseNumber)) {
            errorMessage.textContent = "Case number can only contain digits and symbols (no letters)";
            errorMessage.style.display = "block";
            return;
        }

        if (this.caseNumbers.some(item => item.toLowerCase() === caseNumber.toLowerCase())) {
            errorMessage.textContent = "This case number already exists";
            errorMessage.style.display = "block";
            return;
        }

        this.caseNumbers.push(caseNumber);
        input.value = "";
        errorMessage.style.display = "none";
        this.updateCaseNumberTable();
    },

    removeCaseNumber: function (index) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove this case number?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.caseNumbers.splice(index, 1);
                this.updateCaseNumberTable();
                Swal.fire({
                    icon: 'success',
                    title: 'Removed!',
                    text: 'Case number has been removed.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    },

    updateCaseNumberTable: function () {
        const tbody = document.getElementById("caseTableBody");
        const caseCount = document.getElementById("caseCount");

        if (this.caseNumbers.length === 0) {
            tbody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-message">
                    No case numbers added yet.<br>
                    Enter a case number above and click "Add to Table"
                </td>
            </tr>`;
            caseCount.textContent = "0";
        } else {
            let html = "";
            this.caseNumbers.forEach((caseNum, index) => {
                html += `
                <tr>
                    <td class="serial-column">${index + 1}</td>
                    <td>${caseNum}</td>
                    <td class="action-column">
                        <button type="button" class="btn-remove btn-remove-case" data-index="${index}">
                            ✕ Remove
                        </button>
                    </td>
                </tr>`;
            });
            tbody.innerHTML = html;
            caseCount.textContent = this.caseNumbers.length;
        }
    },

    addCaseType: function () {
        const dropdown = document.getElementById("ddltype");
        const selectedValue = dropdown.value;
        const selectedText = dropdown.options[dropdown.selectedIndex].text;

        if (!selectedValue || selectedValue === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Select Case Type',
                text: 'Please select a case type from the dropdown.',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (this.caseTypes.some(item => item.value === selectedValue)) {
            Swal.fire({
                icon: 'warning',
                title: 'Already Added',
                text: 'This case type is already in the list.',
                confirmButtonText: 'OK'
            });
            return;
        }

        this.caseTypes.push({ value: selectedValue, text: selectedText });
        dropdown.selectedIndex = 0;
        this.updateCaseTypeTable();
    },

    removeCaseType: function (index) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove this case type?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.caseTypes.splice(index, 1);
                this.updateCaseTypeTable();
                Swal.fire({
                    icon: 'success',
                    title: 'Removed!',
                    text: 'Case type has been removed.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    },

    updateCaseTypeTable: function () {
        const tbody = document.getElementById("caseTypeTableBody");
        const caseTypeCount = document.getElementById("caseTypeCount");

        if (this.caseTypes.length === 0) {
            tbody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-message">
                    No case types added yet.<br>
                    Select a case type above and click "Add to Table"
                </td>
            </tr>`;
            caseTypeCount.textContent = "0";
        } else {
            let html = "";
            this.caseTypes.forEach((caseType, index) => {
                html += `
                <tr>
                    <td class="serial-column">${index + 1}</td>
                    <td>${caseType.text}</td>
                    <td class="action-column">
                        <button type="button" class="btn-remove btn-remove-type" data-index="${index}">
                            ✕ Remove
                        </button>
                    </td>
                </tr>`;
            });
            tbody.innerHTML = html;
            caseTypeCount.textContent = this.caseTypes.length;
        }
    },

    GetAdvocateName: async function () {
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
                Flag: encryptAES("2")
            };

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const outResult = JSON.parse(customes.out_result);

            const selectElement1 = document.getElementById('ddlAdvocate');
            selectElement1.innerHTML = '<option value="0">-- Select Advocate --</option>';

            outResult.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.ID;
                option.textContent = item.ADV_NAME;
                selectElement1.appendChild(option);
            });

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

    StateLoadDropdown: async function () {
        try {
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
            selectElement1.innerHTML = '<option value="-1">-- Select State --</option>';

            parsedInner.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.STATE_ID;
                option.textContent = item.STATE_NAME;
                selectElement1.appendChild(option);
            });

            const districtDropdown = document.getElementById('drp_dis');
            districtDropdown.innerHTML = '<option value="-1">-- Select District --</option>';

        } catch (error) {
            console.error('Error loading states:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load states: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    DistrictLoadDropdown: async function () {
        try {
            const state = document.getElementById('drp_state').value;
            if (state === "-1" || !state) {
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
            selectElement1.innerHTML = '<option value="-1">-- Select District --</option>';

            parsedInner.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.DISTRICT_ID;
                option.textContent = item.DISTRICT_NAME;
                selectElement1.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading districts:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load districts: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    personalDetailsSubmit: async function (flag) {
        try {
            const fullName = document.getElementById("fullName").value.trim();
            const relativeName = document.getElementById("relativeName").value.trim();
            const mobileNumber = document.getElementById("mobileNumber").value.trim();
            const email = document.getElementById("emailInput").value.trim();

            if (!fullName || !relativeName || !mobileNumber || !email) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Required Fields',
                    text: 'Please fill in all required fields.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const stateDropdown = document.getElementById("drp_state");
            const districtDropdown = document.getElementById("drp_dis");
            const stateText = stateDropdown.options[stateDropdown.selectedIndex].text;
            const districtText = districtDropdown.options[districtDropdown.selectedIndex].text;
            const ddlCategory = document.getElementById("ddlCategory");
            const selectedValuever = ddlCategory.value;

            const residence = document.getElementById("Residence").value.trim();
            const officeAddress = document.getElementById("Ofceadrs").value.trim();
            const dob = document.getElementById("dob").value;
            const gender = document.getElementById("gender").value;
            const occupation = document.getElementById("ocupdtls").value.trim();
            const nationality = document.getElementById("nation").value.trim();
            const landline = document.getElementById("landline").value.trim();
            const whatsappNumber = document.getElementById("whatsappNumber").value.trim();
            const panNumber = document.getElementById("panNumber").value.trim();
            const socialContact = document.getElementById("sociacnt").value.trim();

            let data;
            let combined;

            if (flag === 1) {
                data = "1";
                combined = fullName + "^" + relativeName + "^" + residence + "^" + officeAddress + "^" +
                    dob + "^" + gender + "^" + landline + "^" + mobileNumber + "^" + whatsappNumber + "^" +
                    email + "^" + socialContact + "^" + occupation + "^" + selectedValuever + "^" +
                    panNumber + "^" + stateText + "^" + districtText + "^" + nationality;
            } else {
                const ddlAdvocate = document.getElementById("ddlAdvocate").value;
                let hiddenValue = document.getElementById("hiddenField").value;
                let advid = hiddenValue ? hiddenValue : ddlAdvocate;

                if (!ddlAdvocate || ddlAdvocate === "0") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning!',
                        text: 'Please select advocate name',
                        confirmButtonColor: '#d33'
                    });
                    return;
                }

                data = "4";
                combined = fullName + "^" + relativeName + "^" + residence + "^" + officeAddress + "^" +
                    dob + "^" + gender + "^" + landline + "^" + mobileNumber + "^" + whatsappNumber + "^" +
                    email + "^" + socialContact + "^" + occupation + "^" + selectedValuever + "^" +
                    panNumber + "^" + stateText + "^" + districtText + "^" + nationality + "^" + advid;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(combined),
                Flag: encryptAES(data)
            };

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedResult = JSON.parse(customes.out_result);
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            document.getElementById("hiddenField").value = parsedResult.Table[0].ID;

            if (errorStatus === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'warning!',
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
                })
                   .then(() => {
                       // Hide the save button
                       document.getElementById('btnSave').style.display = 'none';

                       // Collapse the personal section content (keep header visible)
                       const personalContent = document.querySelector('#personalSection .section-content');
                       if (personalContent) {
                           personalContent.classList.remove('show');
                       }

                       // Show and expand professional section
                       const professionalWrapper = document.getElementById('professionalSectionWrapper');
                       const professionalContent = document.getElementById('professionalSection');

                       if (professionalWrapper) {
                           professionalWrapper.style.display = 'block';
                       }
                       if (professionalContent) {
                           professionalContent.classList.add('show');
                       }

                       // Scroll to professional section
                       if (professionalWrapper) {
                           professionalWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                       }
                   });
               
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to submit form: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    personalDetaildata: async function () {
        try {
            const ddlAdvocate = document.getElementById("ddlAdvocate").value;

            if (!ddlAdvocate || ddlAdvocate === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Please select advocate name',
                    confirmButtonColor: '#d33'
                });
                return;
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
                    title: '!warning!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
                return;
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
            }

            await assignValues(userData);

        } catch (error) {
            console.error('Error loading personal details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load personal details: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    profeesionalDetaildata: async function () {
        try {
            let hiddenValue = document.getElementById("hiddenField").value;
            let ddl = document.getElementById("ddlAdvocate");
            let selectedValue = ddl.value;
            let advid = hiddenValue ? hiddenValue : selectedValue;

            if (!selectedValue || selectedValue === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Please select advocate name',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(advid),
                Flag: encryptAES("6")
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
                    title: '!warning!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
                return;
            }

            const data1 = parsedResult.Table[0];
            populateForm(data1);

        } catch (error) {
            console.error('Error loading professional details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load professional details: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    AdditionalDetaildata: async function () {
        try {
            let hiddenValue = document.getElementById("hiddenField").value;
            let ddl = document.getElementById("ddlAdvocate");
            let selectedValue = ddl.value;
            let advid = hiddenValue ? hiddenValue : selectedValue;

            if (!selectedValue || selectedValue === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: '!Warning!',
                    text: 'Please select advocate name',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(advid),
                Flag: encryptAES("8")
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
                    title: 'warning!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
                return;
            }

            const data2 = parsedResult.Table[0];
            populateAdditionalDetails(data2);

        } catch (error) {
            console.error('Error loading additional details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load additional details: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    documentDetailsSubmit: async function () {
        try {
            const fileInput1 = document.getElementById("mainFileInput");
            const file = fileInput1.files[0];
            let hiddenValue = document.getElementById("hiddenField").value;
            let ddl = document.getElementById("ddlAdvocate");
            let selectedValue = ddl.value;
            let advid = hiddenValue ? hiddenValue : selectedValue;

            if (!advid || advid === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Please select advocate name',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            if (!file) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Please select a file to upload',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            const allIds = [
                'doc1', 'doc3', 'doc5', 'doc7', 'doc8',
                'comp1', 'comp3', 'comp5', 'comp6', 'comp7', 'comp8', 'comp10', 'comp11',
                'part1', 'part2', 'part3', 'part5', 'part6', 'part7', 'part8'
            ];

            const allValues = allIds.map(id => {
                const elem = document.getElementById(id);
                return elem && elem.checked ? 1 : 0;
            });

            const indta = [advid, ...allValues].join(' ^ ');

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

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(indta),
                img: img,
                Flag: encryptAES("9")
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
                    title: '!warning!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
                return;
            }

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
                document.getElementById("additional").classList.remove("show");
                const documentSection = document.getElementById("Document1").nextElementSibling;
                if (documentSection) {
                    documentSection.classList.add("show");
                }
                document.getElementById("Document1").scrollIntoView({ behavior: "smooth" });
            });

        } catch (error) {
            console.error('Error submitting document details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to submit document details: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    DocDetaildata: async function () {
        try {
            let hiddenValue = document.getElementById("hiddenField").value;
            let ddl = document.getElementById("ddlAdvocate");
            let selectedValue = ddl.value;
            let advid = hiddenValue ? hiddenValue : selectedValue;

            console.log('Step 1: Advocate ID:', advid);

            if (!selectedValue || selectedValue === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Please select advocate name',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(advid),
                Flag: encryptAES("10")
            };

            console.log('Step 2: Request data prepared:', {
                employeeId: requestData.employeeId,
                hasToken: !!requestData.token,
                hasIndata: !!requestData.indata,
                hasFlag: !!requestData.Flag
            });

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);

            console.log('Step 3: Raw response received:', response);
            console.log('Step 3a: Response type:', typeof response);
            console.log('Step 3b: Response is null?', response === null);
            console.log('Step 3c: Response is undefined?', response === undefined);

            // Check if response is valid
            if (!response) {
                throw new Error('Empty response received from server - response is null or undefined');
            }

            console.log('Step 4: Attempting decryption...');
            const decryptedText = decryptAES(response);

            console.log('Step 5: Decrypted text:', decryptedText);
            console.log('Step 5a: Decrypted text type:', typeof decryptedText);
            console.log('Step 5b: Decrypted text length:', decryptedText ? decryptedText.length : 0);

            // Check if decrypted text is valid
            if (!decryptedText || decryptedText.trim() === '') {
                throw new Error('First decryption (decryptAES) failed or returned empty data. Raw response was: ' + JSON.stringify(response));
            }

            console.log('Step 6: Parsing first JSON (customes)...');
            const customes = JSON.parse(decryptedText);

            console.log('Step 7: Customes object:', customes);
            console.log('Step 7a: out_result exists?', 'out_result' in customes);
            console.log('Step 7b: out_result value:', customes.out_result);

            // Check if out_result exists and is not empty
            if (!customes.out_result || customes.out_result.trim() === '') {
                throw new Error('No result data found in out_result field. Customes object: ' + JSON.stringify(customes));
            }

            console.log('Step 8: Parsing second JSON (parsedResult)...');
            const parsedResult = JSON.parse(customes.out_result);

            console.log('Step 9: Parsed result:', parsedResult);

            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            console.log('Step 10: Error status:', errorStatus, 'Error message:', errorMsg);

            if (errorStatus === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'warning!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
                return;
            }

            // Check if Table exists and has data
            if (!parsedResult.Table || parsedResult.Table.length === 0) {
                console.log('Step 11: No table data found');
                Swal.fire({
                    icon: 'info',
                    title: 'No Data',
                    text: 'No document details found for this advocate.',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }

            console.log('Step 12: Table data found, count:', parsedResult.Table.length);
            const data2 = parsedResult.Table[0];
            console.log('Step 13: First table row:', data2);

            docsection(data2);
            console.log('Step 14: docsection called successfully');

        } catch (error) {
            console.error('❌ ERROR occurred at some step');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Error name:', error.name);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load document details: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    }
};
function docsection(data2) {
    
   

    // Reassign DB values to checkboxes (0/1 expected from DB)
    document.getElementById('doc1').checked = data2.PANCARD === 1;
    document.getElementById('doc3').checked = data2.PASSPORT === 1;
    document.getElementById('doc5').checked = data2.DRIVING === 1;
    document.getElementById('doc7').checked = data2.BANK_STMT === 1;
    document.getElementById('doc8').checked = data2.INDIVI_SIGNATURE_VERI === 1;

    document.getElementById('comp1').checked = data2.COMPANY_PAN === 1;
    document.getElementById('comp3').checked = data2.MOA === 1;
    document.getElementById('comp5').checked = data2.BOARD_RESOL === 1;
    document.getElementById('comp6').checked = data2.LIST_DIRECTORS === 1;
    document.getElementById('comp7').checked = data2.LIST_SHAREHOLDERS === 1;
    document.getElementById('comp8').checked = data2.BALANCE_SHEET === 1;
    document.getElementById('comp10').checked = data2.ADDRESS_PROOF === 1;
    document.getElementById('comp11').checked = data2.PROOF_BUSINESS === 1;

    document.getElementById('part1').checked = data2.FIRM_PAN === 1;
    document.getElementById('part2').checked = data2.PARNERSHIP_DEED === 1;
    document.getElementById('part3').checked = data2.REGI_CERTIFICATE === 1;
    document.getElementById('part5').checked = data2.FIRM_ADD_PROOF === 1;
    document.getElementById('part6').checked = data2.FIRM_PARNER_PAN === 1;
    document.getElementById('part7').checked = data2.FIRM_SIGNATURE_VERIFICATION === 1;

    document.getElementById('part8').checked = data2.LAWYER === 1;

}
function populateAdditionalDetails(data) {
    // General details
    document.getElementById("jnradv").value = data.NO_JUNIOR || "";
    document.getElementById("othrbranches").value = data.THER_BRANCH || "";
    document.getElementById("mode").value = data.MODE_COMMU || "";

    // Primary Bank Account
    document.getElementById("acholder1").value = data.ACC_HOLD_NAME1 || "";
    document.getElementById("bnknm1").value = data.BANK_NAME1 || "";
    document.getElementById("acno1").value = data.ACC_NO1 || "";
    document.getElementById("ifsc1").value = data.IFSC1 || "";

    document.getElementById("micr1").value = data.MICR_NO1 || "";
    document.getElementById("brcode1").value = data.BRANCH_CODE1 || "";
    document.getElementById("brnm1").value = data.BRANCH_NAME1 || "";
    const normalizeType = (val) => {
        if (!val) return "-- Select --";
        val = val.toUpperCase();
        if (val.includes("SAVINGS")) return "Savings Account";
        if (val.includes("CURRENT")) return "Current Account";
        return "-- Select --";
    };

    document.getElementById("actype1").value = normalizeType(data.ACC_TYPE1);
    document.getElementById("actype2").value = normalizeType(data.ACC_TYPE2);

    // Secondary Bank Account
    document.getElementById("acholder2").value = data.ACC_HOLD_NAME2 || "";
    document.getElementById("bnknm2").value = data.BANK_NAME2 || "";
    document.getElementById("acno2").value = data.ACC_NO2 || "";
    document.getElementById("ifsc2").value = data.IFSC2 || "";
  
    document.getElementById("micr2").value = data.MICR_NO2 || "";
    document.getElementById("brcode2").value = data.BRANCH_CODE2 || "";
    document.getElementById("brnm2").value = data.BRANCH_NAME2 || "";
}
function populateForm(data) {
    // Company types
    document.getElementById("chk1").checked = data.PUBLIC_LIMITED == 1;
    document.getElementById("chk2").checked = data.PRIVATE_LIMITED == 1;
    document.getElementById("chk3").checked = data.INDIVIDUAL_PRACTITIONER == 1;
    document.getElementById("chk4").checked = data.PROPRIETORSHIP == 1;
    document.getElementById("chk5").checked = data.PARNERSHIP_FIRM == 1;

    // Specializations
    let specs = data.FEILD_SPECIAL ? data.FEILD_SPECIAL.split(",") : [];
    document.getElementById("spec1").checked = specs.includes("CIVIL");
    document.getElementById("spec2").checked = specs.includes("Criminal");
    document.getElementById("spec3").checked = specs.includes("safaesi");
    document.getElementById("spec4").checked = specs.includes("consumer");
    document.getElementById("spec5").checked = specs.includes("arbitration");
    
    if (specs.some(s => !["CIVIL", "Criminal", "safaesi", "consumer", "arbitration"].includes(s))) {
        document.getElementById("spec12").checked = true;
        const otherSpecs = specs.filter(s => !["CIVIL", "Criminal", "safaesi", "consumer", "arbitration"].includes(s));
        document.getElementById("otherText").value = otherSpecs.join(",");
    }

    // Basic details
    document.getElementById("yearOfInception").value = data.YEAR_INCEPTION || "";
    document.getElementById("regnum").value = data.REG_NO || "";
    document.getElementById("txtpractice").value = data.PLACES_OF_PRACTICE || "";
    
    const experienceInput = document.querySelector("input[placeholder='Years']");
    if (experienceInput) {
        experienceInput.value = data.EXPERIENCE || "";
    }
    
    document.getElementById("MemNo").value = data.BAR_ASS_MEM_NO || "";
    document.getElementById("ref1").value = data.REFERANCE_1 || "";
    document.getElementById("ref2").value = data.REFERANCE_2 || "";
    document.getElementById("part1").value = data.NUMBEROFPARTNERS || "";
    document.getElementById("firm").value = data.REPRESENT_FIRM || "";
    document.getElementById("empdate").value = data.EMPANELED_DATE?.split("T")[0] || "";

    // Regulatory
    document.getElementById("regYes").checked = data.REGI_REGULATORY == "1";
    document.getElementById("regNo").checked = data.REGI_REGULATORY == "0";
    document.getElementById("partnerDetails").style.display = data.REGI_REGULATORY == "1" ? "block" : "none";

    // Partner 1
    document.getElementById("fname").value = data.DP_NAME1 || "";
    document.getElementById("age").value = data.DP_AGE1 || "";
    document.getElementById("Pan1").value = data.DP_PAN1 || "";
    document.getElementById("adrs1").value = data.DP_ADDRESS1 || "";

    // Partner 2
    document.getElementById("fname1").value = data.DP_NAME2 || "";
    document.getElementById("age1").value = data.DP_AGE2 || "";
    document.getElementById("Pan2").value = data.DP_PAN2 || "";
    document.getElementById("adrs2").value = data.DP_ADRESS2 || "";
    document.getElementById("caseam").value = data.CASE_AMOUNT || "0";
    // Grade dropdown
    const ddlGrade = document.getElementById("ddlgrade");
    if (ddlGrade && data.GRADE) {
        for (let i = 0; i < ddlGrade.options.length; i++) {
            if (ddlGrade.options[i].text === data.GRADE) {
                ddlGrade.selectedIndex = i;
                break;
            }
        }
    }

    // ============================================
    // CASE NUMBERS - Add to subcategory array and update table
    // ============================================
    const caseNumbers = data.CASE_NUMBER ? data.CASE_NUMBER.split(",") : [];
    
    // IMPORTANT: Only clear array if it's empty (first load)
    // This allows users to add more data when updating
    if (!subcategory.caseNumbers) {
        subcategory.caseNumbers = [];
    }
    
    // Add each case number to the array (avoiding duplicates)
    caseNumbers.forEach(caseNum => {
        const trimmedCase = caseNum.trim();
        if (trimmedCase) {
            // Check if case number already exists (case-insensitive)
            const exists = subcategory.caseNumbers.some(
                existing => existing.toLowerCase() === trimmedCase.toLowerCase()
            );
            
            if (!exists) {
                subcategory.caseNumbers.push(trimmedCase);
            }
        }
    });
    
    // Update the case numbers table
    subcategory.updateCaseNumberTable();

    // ============================================
    // CASE TYPES - Add to subcategory array and update table
    // ============================================
    const caseTypes = data.CASE_TYPES ? data.CASE_TYPES.split(",") : [];
    
    // IMPORTANT: Only initialize array if it doesn't exist
    // This allows users to add more data when updating
    if (!subcategory.caseTypes) {
        subcategory.caseTypes = [];
    }
    
    // Add each case type to the array (avoiding duplicates)
    // Assuming case types are stored as text values in the database
    caseTypes.forEach(caseType => {
        const trimmedType = caseType.trim();
        if (trimmedType) {
            // Map the text to the dropdown value if needed
            const typeMapping = {
                "Closure Petition": "1",
                "Writ Petition": "2",
                "Execution Petition": "3",
                "Private Complaint": "4",
                "Custody Petition": "5",
                "Direction Petition": "6",
                "Consumer Case": "7",
                "Labor Case & Other Civil Case": "8"
            };
            
            // If the type is in the mapping, use it; otherwise use the text as-is
            const typeValue = typeMapping[trimmedType] || trimmedType;
            
            // Check if case type already exists
            const exists = subcategory.caseTypes.some(
                existing => existing.text.toLowerCase() === trimmedType.toLowerCase()
            );
            
            if (!exists) {
                subcategory.caseTypes.push({
                    value: typeValue,
                    text: trimmedType
                });
            }
        }
    });
    
    // Update the case types table
    subcategory.updateCaseTypeTable();
}


function setDropdownByText(dropdownId, textToFind) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !textToFind) return;

    for (let i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].text.toLowerCase() === textToFind.toLowerCase()) {
            dropdown.selectedIndex = i;
            break;
        }
    }
}

async function assignValues(data) {
    document.getElementById("ddlCategory").value = data.category;
    document.getElementById("fullName").value = data.fullName;
    document.getElementById("relativeName").value = data.fatherName;
    document.getElementById("Residence").value = data.residenceAddress;
    document.getElementById("Ofceadrs").value = data.officeAddress;
    document.getElementById("dob").value = data.dob;
    setDropdownByText("gender", data.gender);

    // Load states first, then set the state value
    await subcategory.StateLoadDropdown();
    setDropdownByText("drp_state", data.state);

    // After state is set, load districts for that state
    if (data.state) {
        await subcategory.DistrictLoadDropdown();
        setDropdownByText("drp_dis", data.district);
    }

    document.getElementById("ocupdtls").value = data.occupation;
    document.getElementById("nation").value = data.nation;
    document.getElementById("landline").value = data.landline;
    document.getElementById("mobileNumber").value = data.mobile;
    document.getElementById("whatsappNumber").value = data.whatsapp;
    document.getElementById("emailInput").value = data.email;
    document.getElementById("panNumber").value = data.pan;
    document.getElementById("sociacnt").value = data.socialMedia;
}



// ============================================
// UPDATE THE EXISTING btnSave CLICK EVENT
// ============================================

// Replace the existing btnSave event listener with this:

// ============================================
// ADD THESE NEW EVENT LISTENERS FOR OTHER SECTIONS
// ============================================

// Section 2: Professional Details

// Section 4: Document Submission

// ============================================
// VALIDATION FUNCTIONS
// ============================================

function validatePersonalSection() {
    let errors = [];
    let isValid = true;

    // Clear previous errors
    clearSectionErrors('personal');

    // Application Type
    const appType = document.getElementById('ddlchoice').value;
    if (!appType || appType === '0') {
        showError('ddlchoice', 'Application Type is required');
        errors.push('Application Type is required');
        isValid = false;
    }

    // Vertical Name
    const category = document.getElementById('ddlCategory').value;
    if (!category || category === '0') {
        showError('ddlCategory', 'Vertical Name is required');
        errors.push('Vertical Name is required');
        isValid = false;
    }

    // Advocate Name (if Update or Remove selected)
    if (appType === '2' || appType === '3') {
        const advocate = document.getElementById('ddlAdvocate').value;
        if (!advocate || advocate === '0') {
            showError('ddlAdvocate', 'Advocate Name is required');
            errors.push('Advocate Name is required');
            isValid = false;
        }
    }

    // Full Name
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) {
        showError('fullName', 'Full Name is required');
        errors.push('Full Name is required');
        isValid = false;
    } else if (fullName.length < 3) {
        showError('fullName', 'Full Name must be at least 3 characters');
        errors.push('Full Name must be at least 3 characters');
        isValid = false;
    } else if (/\d/.test(fullName)) {
        showError('fullName', 'Full Name cannot contain numbers');
        errors.push('Full Name cannot contain numbers');
        isValid = false;
    }

    // Father's/Spouse Name
    const relativeName = document.getElementById('relativeName').value.trim();
    if (!relativeName) {
        showError('relativeName', "Father's/Spouse Name is required");
        errors.push("Father's/Spouse Name is required");
        isValid = false;
    } else if (/\d/.test(relativeName)) {
        showError('relativeName', "Father's/Spouse Name cannot contain numbers");
        errors.push("Father's/Spouse Name cannot contain numbers");
        isValid = false;
    }

    // Residence Address
    const residence = document.getElementById('Residence').value.trim();
    if (!residence) {
        showError('Residence', 'Residence Address is required');
        errors.push('Residence Address is required');
        isValid = false;
    }

    // Office Address
    const office = document.getElementById('Ofceadrs').value.trim();
    if (!office) {
        showError('Ofceadrs', 'Office Address is required');
        errors.push('Office Address is required');
        isValid = false;
    }

    // Date of Birth
    const dob = document.getElementById('dob').value;
    if (!dob) {
        showError('dob', 'Date of Birth is required');
        errors.push('Date of Birth is required');
        isValid = false;
    } else {
        const dobDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        if (age < 21 || age > 100) {
            showError('dob', 'Advocate must be between 21 and 100 years old');
            errors.push('Advocate must be between 21 and 100 years old');
            isValid = false;
        }
    }

    // Gender
    const gender = document.getElementById('gender').value;
    if (!gender || gender === '-- Select Gender --') {
        showError('gender', 'Gender is required');
        errors.push('Gender is required');
        isValid = false;
    }

    // State
    const state = document.getElementById('drp_state').value;
    if (!state || state === '-1') {
        showError('drp_state', 'State is required');
        errors.push('State is required');
        isValid = false;
    }

    // District
    const district = document.getElementById('drp_dis').value;
    if (!district || district === '-1') {
        showError('drp_dis', 'District is required');
        errors.push('District is required');
        isValid = false;
    }

    // Occupation
    const occupation = document.getElementById('ocupdtls').value.trim();
    if (!occupation) {
        showError('ocupdtls', 'Occupation is required');
        errors.push('Occupation is required');
        isValid = false;
    }

    // Nationality
    const nation = document.getElementById('nation').value.trim();
    if (!nation) {
        showError('nation', 'Nationality is required');
        errors.push('Nationality is required');
        isValid = false;
    }

    // Landline
    const landline = document.getElementById('landline').value.trim();
    if (!landline) {
        showError('landline', 'Landline is required');
        errors.push('Landline is required');
        isValid = false;
    } else {
        const landlineRegex = /^\d{3,5}-\d{6,8}$/;
        if (!landlineRegex.test(landline)) {
            showError('landline', 'Invalid landline format (e.g., 0471-2345678)');
            errors.push('Invalid landline format (use format: 0XXX-XXXXXXX)');
            isValid = false;
        }
    }

    // Mobile Number
    const mobileInput = document.getElementById('mobileNumber').value.trim();
    let mobile = mobileInput;

    if (!mobile) {
        showError('mobileNumber', 'Mobile Number is required');
        errors.push('Mobile Number is required');
        isValid = false;
    } else {
        // Regex: must start with 6–9 and be 10 digits, with optional +91 prefix
        const mobileRegex = /^(\+91[\s]?)?[6-9]\d{9}$/;

        if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
            showError('mobileNumber', 'Invalid mobile number format');
            errors.push('Invalid mobile number (must start with 6-9 and be 10 digits)');
            isValid = false;
        } else {
            // Normalize: ensure +91 prefix is added
            mobile = mobile.replace(/\s/g, ''); // remove spaces
            if (!mobile.startsWith('+91')) {
                mobile = '+91' + mobile;
            }
        }
    }


    // WhatsApp Number
    const whatsappInput = document.getElementById('whatsappNumber').value.trim();
    let whatsapp = whatsappInput;

    if (!whatsapp) {
        showError('whatsappNumber', 'WhatsApp Number is required');
        errors.push('WhatsApp Number is required');
        isValid = false;
    } else {
        // Regex: must start with 6–9 and be 10 digits, with optional +91 prefix
        const whatsappRegex = /^(\+91[\s]?)?[6-9]\d{9}$/;

        if (!whatsappRegex.test(whatsapp.replace(/\s/g, ''))) {
            showError('whatsappNumber', 'Invalid WhatsApp number format');
            errors.push('Invalid WhatsApp number (must start with 6-9 and be 10 digits)');
            isValid = false;
        } else {
            // Normalize: ensure +91 prefix is added
            whatsapp = whatsapp.replace(/\s/g, ''); // remove spaces
            if (!whatsapp.startsWith('+91')) {
                whatsapp = '+91' + whatsapp;
            }
        }
    }

    // Email
    const email = document.getElementById('emailInput').value.trim();
    if (!email) {
        showError('emailInput', 'Email Address is required');
        const errorMsg = document.getElementById('errorMessage');
        if (errorMsg) {
            errorMsg.textContent = 'Email Address is required';
            errorMsg.style.display = 'block';
        }
        errors.push('Email Address is required');
        isValid = false;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('emailInput', 'Invalid email format');
            const errorMsg = document.getElementById('errorMessage');
            if (errorMsg) {
                errorMsg.textContent = 'Please enter a valid email address';
                errorMsg.style.display = 'block';
            }
            errors.push('Invalid email format');
            isValid = false;
        }
    }

    // PAN Number
    const pan = document.getElementById('panNumber').value.trim().toUpperCase();
    if (!pan) {
        showError('panNumber', 'PAN Number is required');
        const errorSpan = document.getElementById('panError');
        if (errorSpan) errorSpan.textContent = 'PAN Number is required';
        errors.push('PAN Number is required');
        isValid = false;
    } else {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(pan)) {
            showError('panNumber', 'Invalid PAN format');
            const errorSpan = document.getElementById('panError');
            if (errorSpan) errorSpan.textContent = 'Invalid PAN format (e.g., ABCDE1234F)';
            errors.push('Invalid PAN format (e.g., ABCDE1234F)');
            isValid = false;
        }
    }

    // Social Media Contact
    const social = document.getElementById('sociacnt').value.trim();
    if (!social) {
        showError('sociacnt', 'Social Media Contact is required');
        errors.push('Social Media Contact is required');
        isValid = false;
    }

    // Show result
    if (!isValid) {
        showErrorAlert('Personal & Contact Details', errors);
    }

    return isValid;
}

function validateProfessionalSection() {
    let errors = [];
    let isValid = true;

    clearSectionErrors('professional');

    // Legal Entity Type
    const legalTypes = ['chk1', 'chk2', 'chk3', 'chk4', 'chk5'];
    const legalSelected = legalTypes.some(id => document.getElementById(id)?.checked);
    if (!legalSelected) {
        errors.push('Select at least one Legal Entity Type');
        isValid = false;
    }

    // Field of Specialization
    const specs = ['spec1', 'spec2', 'spec3', 'spec4', 'spec5', 'spec12'];
    const specSelected = specs.some(id => document.getElementById(id)?.checked);
    if (!specSelected) {
        errors.push('Select at least one Field of Specialization');
        isValid = false;
    }

    // If "Others" is checked
    if (document.getElementById('spec12')?.checked) {
        const otherText = document.getElementById('otherText').value.trim();
        if (!otherText) {
            showError('otherText', 'Please specify other areas');
            errors.push('Other specialization details required');
            isValid = false;
        }
    }

    // Year of Inception
    const yearInception = document.getElementById('yearOfInception').value;
    if (!yearInception) {
        showError('yearOfInception', 'Year of Inception is required');
        errors.push('Year of Inception is required');
        isValid = false;
    } else {
        const currentYear = new Date().getFullYear();
        const year = parseInt(yearInception);
        if (year < 1900 || year > currentYear) {
            showError('yearOfInception', `Year must be between 1900 and ${currentYear}`);
            errors.push(`Year must be between 1900 and ${currentYear}`);
            isValid = false;
        }
    }

    // Grade
    const grade = document.getElementById('ddlgrade').value;
    if (!grade || grade === '0') {
        showError('ddlgrade', 'Grade is required');
        errors.push('Grade of the Advocate is required');
        isValid = false;
    }
    const empdate = document.getElementById('empdate').value;
    if (empdate === "") {
        errors.push('Select Empanelment Date');
        isValid = false;
    }

    // Regulatory Body
    const regYes = document.getElementById('regYes')?.checked;
    const regNo = document.getElementById('regNo')?.checked;
    if (!regYes && !regNo) {
        errors.push('Select Regulatory Body Registration status');
        isValid = false;
    }
    if (regYes) { 
    // Partner validations
    const partnerCount = document.getElementById('part1').value;
    if (partnerCount && parseInt(partnerCount) > 0) {
        const fname = document.getElementById('fname').value.trim();
        const age = document.getElementById('age').value;
        const pan1 = document.getElementById('Pan1').value.trim();

        if (!fname) {
            showError('fname', 'Partner 1 Name is required');
            errors.push('Partner 1 Full Name is required');
            isValid = false;
        } else if (/\d/.test(fname)) {
            showError('fname', 'Name cannot contain numbers');
            errors.push('Partner 1 Name cannot contain numbers');
            isValid = false;
        }

        if (!age) {
            showError('age', 'Age is required');
            errors.push('Partner 1 Age is required');
            isValid = false;
        } else if (age < 18 || age > 100) {
            showError('age', 'Age must be 18-100');
            errors.push('Partner 1 Age must be between 18-100');
            isValid = false;
        }

        if (pan1) {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (pan1.toUpperCase() !== "NIL" && !panRegex.test(pan1.toUpperCase())) {
                showError('Pan1', 'Invalid PAN format');
                const errorSpan = document.getElementById('pan1Error');
                if (errorSpan) errorSpan.textContent = 'Invalid PAN format';
                errors.push('Invalid PAN format for Partner 1');
                isValid = false;
            }
        }

        if (parseInt(partnerCount) > 1) {
            const fname1 = document.getElementById('fname1').value.trim();
            const age1 = document.getElementById('age1').value;
            const pan2 = document.getElementById('Pan2').value.trim();

            if (!fname1) {
                showError('fname1', 'Partner 2 Name is required');
                errors.push('Partner 2 Full Name is required');
                isValid = false;
            } else if (/\d/.test(fname1)) {
                showError('fname1', 'Name cannot contain numbers');
                errors.push('Partner 2 Name cannot contain numbers');
                isValid = false;
            }

            if (!age1) {
                showError('age1', 'Age is required');
                errors.push('Partner 2 Age is required');
                isValid = false;
            } else if (age1 < 18 || age1 > 100) {
                showError('age1', 'Age must be 18-100');
                errors.push('Partner 2 Age must be between 18-100');
                isValid = false;
            }

            if (pan2) {
                const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                if (pan2.toUpperCase() !== "NIL" && !panRegex.test(pan2.toUpperCase())) {
                    showError('Pan2', 'Invalid PAN format');
                    const errorSpan = document.getElementById('pan2Error');
                    if (errorSpan) errorSpan.textContent = 'Invalid PAN format';
                    errors.push('Invalid PAN format for Partner 2');
                    isValid = false;
                }
            }
        }
        }
    }

    // Case Numbers
    const caseCount = parseInt(document.getElementById('caseCount')?.textContent || '0');
    if (caseCount === 0) {
        errors.push('Add at least one Case Number');
        isValid = false;
    }

    // Case Types
    const caseTypeCount = parseInt(document.getElementById('caseTypeCount')?.textContent || '0');
    if (caseTypeCount === 0) {
        errors.push('Add at least one Case Type');
        isValid = false;
    }

    if (!isValid) {
        showErrorAlert('Professional Details & Specialization', errors);
    }

    return isValid;
}

function validateAdditionalSection() {
    let errors = [];
    let isValid = true;

    clearSectionErrors('additional');

    // Junior Advocates
    const juniorAdv = document.getElementById('jnradv').value.trim();
    if (!juniorAdv) {
        showError('jnradv', 'This field is required');
        errors.push('Number of Junior Advocates is required');
        isValid = false;
    }

    // Branches
    const branches = document.getElementById('othrbranches').value.trim();
    if (!branches) {
        showError('othrbranches', 'This field is required');
        errors.push('Any Other Branches field is required');
        isValid = false;
    }

    // Mode of Communication
    const mode = document.getElementById('mode').value.trim();
    if (!mode) {
        showError('mode', 'This field is required');
        errors.push('Mode of Communication is required');
        isValid = false;
    }

    // Account Holder Name
    const acholder1 = document.getElementById('acholder1').value.trim();
    if (!acholder1) {
        showError('acholder1', 'Account Holder Name is required');
        errors.push('Account Holder Name is required');
        isValid = false;
    } else if (/\d/.test(acholder1)) {
        showError('acholder1', 'Name cannot contain numbers');
        errors.push('Account Holder Name cannot contain numbers');
        isValid = false;
    }

    // Bank Name
    const bankName1 = document.getElementById('bnknm1').value.trim();
    if (!bankName1) {
        showError('bnknm1', 'Bank Name is required');
        errors.push('Bank Name is required');
        isValid = false;
    }

    // Account Number
    const acno1 = document.getElementById('acno1').value.trim();
    if (!acno1) {
        showError('acno1', 'Account Number is required');
        errors.push('Account Number is required');
        isValid = false;
    } else if (acno1.length < 9 || acno1.length > 18) {
        showError('acno1', 'Account Number must be 9-18 digits');
        errors.push('Account Number must be 9-18 digits');
        isValid = false;
    } else if (!/^\d+$/.test(acno1)) {
        showError('acno1', 'Only digits allowed');
        errors.push('Account Number must contain only digits');
        isValid = false;
    }

    // IFSC Code
    const ifsc1 = document.getElementById('ifsc1').value.trim().toUpperCase();
    if (!ifsc1) {
        showError('ifsc1', 'IFSC Code is required');
        errors.push('IFSC Code is required');
        isValid = false;
    } else {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(ifsc1)) {
            showError('ifsc1', 'Invalid IFSC format');
            errors.push('Invalid IFSC Code format (e.g., SBIN0001234)');
            isValid = false;
        }
    }

    // Account Type
    const actype1 = document.getElementById('actype1').value;
    if (!actype1 || actype1 === '-- Select --') {
        showError('actype1', 'Account Type is required');
        errors.push('Account Type is required');
        isValid = false;
    }

    // Secondary Account validations (if provided)
    const acholder2 = document.getElementById('acholder2').value.trim();
    if (acholder2 && /\d/.test(acholder2)) {
        showError('acholder2', 'Name cannot contain numbers');
        errors.push('Secondary Account Holder Name cannot contain numbers');
        isValid = false;
    }

    const acno2 = document.getElementById('acno2').value.trim();
    if (acno2) {
        if (acno2.length < 9 || acno2.length > 18 || !/^\d+$/.test(acno2)) {
            showError('acno2', 'Invalid account number');
            errors.push('Secondary Account Number must be 9-18 digits');
            isValid = false;
        }
    }

    const ifsc2 = document.getElementById('ifsc2').value.trim().toUpperCase();
    if (ifsc2) {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(ifsc2)) {
            showError('ifsc2', 'Invalid IFSC format');
            errors.push('Invalid Secondary IFSC Code format');
            isValid = false;
        }
    }

    if (!isValid) {
        showErrorAlert('Additional & Bank Details', errors);
    }

    return isValid;
}

function validateDocumentSection() {
    let errors = [];
    let isValid = true;

    clearSectionErrors('document');

    // Check document checkboxes
   const individualDocs = ['doc1', 'doc3', 'doc5', 'doc7', 'doc8'];
const companyDocs = ['comp1', 'comp3', 'comp5', 'comp6', 'comp7', 'comp8', 'comp10', 'comp11'];
const partnershipDocs = ['part1', 'part2', 'part3', 'part5', 'part6', 'part7'];
const lawyer = ['part8'];

const allDocs = [...individualDocs, ...companyDocs, ...partnershipDocs];

const docSelected = allDocs.some(id => {
  const elem = document.getElementById(id);
  return elem?.checked;
});

const doclawyer = lawyer.some(id => {
  const elem = document.getElementById(id);
  return elem?.checked;
});

if (!docSelected) {
  errors.push('Select at least one required document');
  isValid = false;
}
if (!doclawyer) {
  errors.push('Lawyer verification is mandatory');
  isValid = false;
}

    // File Upload
    const fileInput = document.getElementById('mainFileInput');
    if (!fileInput || fileInput.files.length === 0) {
        showError('mainFileInput', 'Please upload a document');
        errors.push('Document upload is required');
        isValid = false;
    } else {
        const file = fileInput.files[0];

        if (file.type !== 'application/pdf') {
            showError('mainFileInput', 'Only PDF files allowed');
            errors.push('Only PDF files are allowed');
            isValid = false;
        }

       
        if (file.size > 5242880) {  // 5 * 1024 * 1024
            showError('mainFileInput', 'File size exceeds 5 MB');
            errors.push('File size must not exceed 5 MB');
            isValid = false;
        }

    }

    if (!isValid) {
        showErrorAlert('Document Submission & Verification', errors);
    }

    return isValid;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#dc3545';
        field.style.borderWidth = '2px';
    }
}

function clearSectionErrors(section) {
    const selectors = {
        'personal': '#fullName, #relativeName, #Residence, #Ofceadrs, #dob, #gender, #drp_state, #drp_dis, #ocupdtls, #nation, #landline, #mobileNumber, #whatsappNumber, #emailInput, #panNumber, #sociacnt, #ddlchoice, #ddlCategory, #ddlAdvocate',
        'professional': '#yearOfInception, #ddlgrade, #otherText, #fname, #age, #Pan1, #fname1, #age1, #Pan2, #part1',
        'additional': '#jnradv, #othrbranches, #mode, #acholder1, #bnknm1, #acno1, #ifsc1, #actype1, #acholder2, #bnknm2, #acno2, #ifsc2',
        'document': '#mainFileInput'
    };

    const fields = document.querySelectorAll(selectors[section] || 'input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.borderWidth = '';
    });

    // Clear error messages
    const errorSpans = document.querySelectorAll('.text-danger, .error-message, .case-error-message');
    errorSpans.forEach(span => {
        span.textContent = '';
        span.style.display = 'none';
    });
}

function showErrorAlert(sectionName, errors) {
    let errorMessage = `<div style="text-align: left;">`;
    errorMessage += `<strong>Please fix the following errors in ${sectionName}:</strong>`;
    errorMessage += `<ul style="margin-top: 10px; padding-left: 20px;">`;
    errors.forEach(error => {
        errorMessage += `<li style="margin: 5px 0;">${error}</li>`;
    });
    errorMessage += `</ul></div>`;

    Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        html: errorMessage,
        confirmButtonColor: '#dc3545',
        width: '600px'
    });
}

// ============================================
// REAL-TIME VALIDATIONS
// ============================================

// Setup real-time validation on page load
document.addEventListener('DOMContentLoaded', function () {
    setupRealtimeValidation();
});

function setupRealtimeValidation() {
    // Name fields - prevent digits
    const nameFields = ['fullName', 'relativeName', 'fname', 'fname1', 'acholder1', 'acholder2'];
    nameFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', function () {
                this.value = this.value.replace(/\d/g, '');
            });
        }
    });

    // PAN fields - auto uppercase
    const panFields = ['panNumber', 'Pan1', 'Pan2'];
    panFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', function () {
                this.value = this.value.toUpperCase();
            });
        }
    });

    // IFSC fields - auto uppercase
    ['ifsc1', 'ifsc2'].forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', function () {
                this.value = this.value.toUpperCase();
            });
        }
    });

    // Account Number - only digits
    ['acno1', 'acno2'].forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '');
            });
        }
    });
}

// Clear function for Advocate Empanelment Form
function clearAllFormFields() {
    // Clear dropdown selections
    $('#ddlchoice').val('0');
    $('#ddlAdvocate').val('0');
    $('#ddlCategory').val('0');
    $('#ddlgrade').val('0');
    $('#ddltype').val('0');

    // Hide advocate dropdown
    $('#advocateGroup').hide();

    // Clear all text inputs
    $('#fullName, #relativeName, #Residence, #Ofceadrs, #ocupdtls, #nation').val('');
    $('#landline, #mobileNumber, #whatsappNumber, #emailInput, #sociacnt').val('');
    $('#panNumber, #otherText, #regnum, #txtpractice, #MemNo').val('');
    $('#ref1, #ref2, #firm').val('');
    $('#fname, #fname1, #Pan1, #Pan2').val('');
    $('#jnradv, #othrbranches, #mode').val('');
    $('#caseNumberInput').val('');

    // Clear textareas
    $('#adrs1, #adrs2').val('');

    // Clear date inputs
    $('#dob, #empdate').val('');

    // Clear number inputs
    $('#yearOfInception, #part1, #age, #age1').val('');

    // Reset select dropdowns
    $('#gender').val('-- Select Gender --');
    $('#drp_state, #drp_dis').val('0');
    $('#actype1, #actype2').val('-- Select --');

    // Clear bank details
    $('#acholder1, #bnknm1, #acno1, #ifsc1, #micr1, #brcode1, #brnm1').val('');
    $('#acholder2, #bnknm2, #acno2, #ifsc2, #micr2, #brcode2, #brnm2').val('');

    // Uncheck all checkboxes - Legal Entity Type
    $('#chk1, #chk2, #chk3, #chk4, #chk5').prop('checked', false);

    // Uncheck all checkboxes - Specialization
    $('#spec1, #spec2, #spec3, #spec4, #spec5, #spec12').prop('checked', false);

    // Uncheck all checkboxes - Individual Documents
    $('#doc1, #doc3, #doc5, #doc7, #doc8').prop('checked', false);

    // Uncheck all checkboxes - Company Documents
    $('#comp1, #comp3, #comp5, #comp6, #comp7, #comp8, #comp10, #comp11').prop('checked', false);

    // Uncheck all checkboxes - Partnership Documents
    $('#part1, #part2, #part3, #part5, #part6, #part7, #part8').prop('checked', false);

    // Uncheck radio buttons
    $('input[name="regulatory"]').prop('checked', false);

    // Clear file input
    $('#mainFileInput').val('');

    // Clear error messages
    $('#panError, #pan1Error, #pan2Error, #errorMessage').text('');
    $('.error-message').hide();

    // Clear case number table
    $('#caseTableBody').html(`
        <tr>
            <td colspan="3" class="empty-message">
                No case numbers added yet.<br>
                Enter a case number above and click "Add to Table"
            </td>
        </tr>
    `);
    $('#caseCount').text('0');

    // Clear case type table
    $('#caseTypeTableBody').html(`
        <tr>
            <td colspan="3" class="empty-message">
                No case numbers added yet.<br>
                Enter a case Type above and click "Add to Table"
            </td>
        </tr>
    `);
    $('#caseTypeCount').text('0');

    // Hide partner details section
    $('#partnerDetails').hide();

    // Clear hidden field
    $('#hiddenField').val('');

    // Show success message (optional)
    swal({
        title: "Form Cleared!",
        text: "All fields have been reset successfully.",
        icon: "success",
        timer: 2000,
        buttons: false
    });

    // Scroll to top
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

function clearAllFormFields1() {
    // Clear dropdown selections
    subcategory.caseNumbers = [];
    subcategory.caseTypes = [];
    $('#ddlAdvocate').val('0');
    $('#ddlCategory').val('0');
    $('#ddlgrade').val('0');
    $('#ddltype').val('0');

    // Hide advocate dropdown
    $('#advocateGroup').hide();

    // Clear all text inputs
    $('#fullName, #relativeName, #Residence, #Ofceadrs, #ocupdtls, #nation').val('');
    $('#landline, #mobileNumber, #whatsappNumber, #emailInput, #sociacnt').val('');
    $('#panNumber, #otherText, #regnum, #txtpractice, #MemNo').val('');
    $('#ref1, #ref2, #firm').val('');
    $('#fname, #fname1, #Pan1, #Pan2').val('');
    $('#jnradv, #othrbranches, #mode').val('');
    $('#caseNumberInput').val('');

    // Clear textareas
    $('#adrs1, #adrs2').val('');

    // Clear date inputs
    $('#dob, #empdate').val('');

    // Clear number inputs
    $('#yearOfInception, #part1, #age, #age1').val('');

    // Reset select dropdowns
    $('#gender').val('-- Select Gender --');
    $('#drp_state, #drp_dis').val('0');
    $('#actype1, #actype2').val('-- Select --');

    // Clear bank details
    $('#acholder1, #bnknm1, #acno1, #ifsc1, #micr1, #brcode1, #brnm1').val('');
    $('#acholder2, #bnknm2, #acno2, #ifsc2, #micr2, #brcode2, #brnm2').val('');

    // Uncheck all checkboxes - Legal Entity Type
    $('#chk1, #chk2, #chk3, #chk4, #chk5').prop('checked', false);

    // Uncheck all checkboxes - Specialization
    $('#spec1, #spec2, #spec3, #spec4, #spec5, #spec12').prop('checked', false);

    // Uncheck all checkboxes - Individual Documents
    $('#doc1, #doc3, #doc5, #doc7, #doc8').prop('checked', false);

    // Uncheck all checkboxes - Company Documents
    $('#comp1, #comp3, #comp5, #comp6, #comp7, #comp8, #comp10, #comp11').prop('checked', false);

    // Uncheck all checkboxes - Partnership Documents
    $('#part1, #part2, #part3, #part5, #part6, #part7, #part8').prop('checked', false);

    // Uncheck radio buttons
    $('input[name="regulatory"]').prop('checked', false);

    // Clear file input
    $('#mainFileInput').val('');

    // Clear error messages
    $('#panError, #pan1Error, #pan2Error, #errorMessage').text('');
    $('.error-message').hide();

    // Clear case number table
    $('#caseTableBody').html(`
        <tr>
            <td colspan="3" class="empty-message">
                No case numbers added yet.<br>
                Enter a case number above and click "Add to Table"
            </td>
        </tr>
    `);
    $('#caseCount').text('0');

    // Clear case type table
    $('#caseTypeTableBody').html(`
        <tr>
            <td colspan="3" class="empty-message">
                No case numbers added yet.<br>
                Enter a case Type above and click "Add to Table"
            </td>
        </tr>
    `);
    $('#caseTypeCount').text('0');

    // Hide partner details section
    $('#partnerDetails').hide();

    // Clear hidden field
    $('#hiddenField').val('');

    // Show success message (optional)


    // Scroll to top
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}
// Alternative: If you want confirmation dialog, use this instead:

$(document).ready(function () {
    checkAccess("47");


    $('#subclear').click(function(e) {
        e.preventDefault();
        swal({
            title: "Clear All Fields?",
            text: "Are you sure you want to clear all form data?",
            icon: "warning",
            buttons: ["Cancel", "Yes, Clear All"],
            dangerMode: true,
        }).then((willClear) => {
            if (willClear) {
                clearAllFormFields();
            }
        });
    });
});
function clearAllFormFields2() {
    // Clear dropdown selections
    

    subcategory.caseNumbers = [];
    subcategory.caseTypes = [];

    $('#ddlCategory').val('0');
    $('#ddlgrade').val('0');
    $('#ddltype').val('0');

    // Hide advocate dropdown
   

    // Clear all text inputs
    $('#fullName, #relativeName, #Residence, #Ofceadrs, #ocupdtls, #nation').val('');
    $('#landline, #mobileNumber, #whatsappNumber, #emailInput, #sociacnt').val('');
    $('#panNumber, #otherText, #regnum, #txtpractice, #MemNo').val('');
    $('#ref1, #ref2, #firm').val('');
    $('#fname, #fname1, #Pan1, #Pan2').val('');
    $('#jnradv, #othrbranches, #mode').val('');
    $('#caseNumberInput').val('');

    // Clear textareas
    $('#adrs1, #adrs2').val('');

    // Clear date inputs
    $('#dob, #empdate').val('');

    // Clear number inputs
    $('#yearOfInception, #part1, #age, #age1').val('');

    // Reset select dropdowns
    $('#gender').val('-- Select Gender --');
    $('#drp_state, #drp_dis').val('0');
    $('#actype1, #actype2').val('-- Select --');

    // Clear bank details
    $('#acholder1, #bnknm1, #acno1, #ifsc1, #micr1, #brcode1, #brnm1').val('');
    $('#acholder2, #bnknm2, #acno2, #ifsc2, #micr2, #brcode2, #brnm2').val('');

    // Uncheck all checkboxes - Legal Entity Type
    $('#chk1, #chk2, #chk3, #chk4, #chk5').prop('checked', false);

    // Uncheck all checkboxes - Specialization
    $('#spec1, #spec2, #spec3, #spec4, #spec5, #spec12').prop('checked', false);

    // Uncheck all checkboxes - Individual Documents
    $('#doc1, #doc3, #doc5, #doc7, #doc8').prop('checked', false);

    // Uncheck all checkboxes - Company Documents
    $('#comp1, #comp3, #comp5, #comp6, #comp7, #comp8, #comp10, #comp11').prop('checked', false);

    // Uncheck all checkboxes - Partnership Documents
    $('#part1, #part2, #part3, #part5, #part6, #part7, #part8').prop('checked', false);

    // Uncheck radio buttons
    $('input[name="regulatory"]').prop('checked', false);

    // Clear file input
    $('#mainFileInput').val('');

    // Clear error messages
    $('#panError, #pan1Error, #pan2Error, #errorMessage').text('');
    $('.error-message').hide();

    // Clear case number table
    $('#caseTableBody').html(`
        <tr>
            <td colspan="3" class="empty-message">
                No case numbers added yet.<br>
                Enter a case number above and click "Add to Table"
            </td>
        </tr>
    `);
    $('#caseCount').text('0');

    // Clear case type table
    $('#caseTypeTableBody').html(`
        <tr>
            <td colspan="3" class="empty-message">
                No case numbers added yet.<br>
                Enter a case Type above and click "Add to Table"
            </td>
        </tr>
    `);
    $('#caseTypeCount').text('0');

    // Hide partner details section
    $('#partnerDetails').hide();

    // Clear hidden field
    $('#hiddenField').val('');

   
    // Scroll to top
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}