
var ProfessionalDetails = {
    ProfessionalDetailsValidate: async function () {
        // Try multiple ways to find the checkboxes
        let companyCheckboxes = document.querySelectorAll('#lawForm input[id^="chk"]');
        let specCheckboxes = document.querySelectorAll('#lawForm input[id^="spec"]');
        const othersCheckbox = document.getElementById('spec12');
        const othersTextbox = document.querySelector('input[placeholder="Specify other areas of specialization"]');
        const yearOfInception = document.getElementById('yearOfInception');
        const RegisterNumber = document.getElementById('regnum');
        const practice = document.getElementById('txtpractice');
        const experience = document.querySelector('input[placeholder="Years"][max="60"]');
        const ddlgrade = document.getElementById('ddlgrade');
        const Barassociation = document.getElementById('MemNo');
        let ref1 = document.getElementById("ref1").value.trim();
        let ref2 = document.getElementById("ref2").value.trim();
        let partnersCount = document.getElementById("part1").value.trim();
        let firmName = document.getElementById("firm").value.trim();
        let empDate = document.getElementById("empdate").value.trim();
        let regulatoryYes = document.getElementById("regYes").checked;
        let regulatoryNo = document.getElementById("regNo").checked;
        let panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        let tableBody = document.getElementById("caseTableBody");
        let rows = tableBody.getElementsByTagName("tr");
        let tableBody1 = document.getElementById("caseTypeTableBody");
        let rows1 = tableBody1.getElementsByTagName("tr");

        if (companyCheckboxes.length === 0) {
            companyCheckboxes = document.querySelectorAll('input[id^="chk"]');
        }
        if (specCheckboxes.length === 0) {
            specCheckboxes = document.querySelectorAll('input[id^="spec"]');
        }

        // Debug logging
        companyCheckboxes.forEach((cb, i) => {
            console.log(`Company checkbox ${i} (${cb.id}):`, cb.checked);
        });
        specCheckboxes.forEach((cb, i) => {
            console.log(`Spec checkbox ${i} (${cb.id}):`, cb.checked);
        });

        const companySelected = Array.from(companyCheckboxes).some(cb => cb.checked);
        const specSelected = Array.from(specCheckboxes).some(cb => cb.checked);

        // Validation checks
        if (!companySelected) {
            Swal.fire({
                icon: 'warning',
                title: 'Legal Entity Type Required',
                text: 'Please select at least one Legal Entity Type!',
            });
            return false;
        }

        if (!specSelected) {
            Swal.fire({
                icon: 'warning',
                title: 'Specialization Required',
                text: 'Please select at least one Field of Specialization!',
            });
            return false;
        }

        // Validate "Others" textbox if checkbox is checked
        if (othersCheckbox && othersCheckbox.checked && othersTextbox.value.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Specify Other Specialization',
                text: 'You selected "Others" — please specify your area of specialization in the textbox.',
            });
            return false;
        }

        if (!yearOfInception || !yearOfInception.value || yearOfInception.value.trim() === '') {
            Swal.fire('Missing Field', 'Please select Year of Inception.', 'warning');
            return false;
        }

        if (!RegisterNumber.value) {
            Swal.fire('Missing Field', 'Please Enter Register number.', 'warning');
            return false;
        }

        if (!practice.value) {
            Swal.fire('Missing Field', 'Please Enter Place of Practice.', 'warning');
            return false;
        }

        if (!experience.value || experience.value < 0 || experience.value > 60) {
            Swal.fire('Invalid Experience', 'Please enter valid Total Years of Experience (0–60).', 'warning');
            return false;
        }

        if (ddlgrade.value === "0") {
            Swal.fire('Missing Grade', 'Please select Grade of the Advocate.', 'warning');
            return false;
        }

        if (!Barassociation.value) {
            Swal.fire('Missing Membership', 'Please Enter Bar Association Number.', 'warning');
            return false;
        }

        if (ref1 === "") {
            Swal.fire("Validation Error", "Please enter Reference 1 (Name, Contact in Bank/NBFC).", "error");
            return false;
        }

        if (ref2 === "") {
            Swal.fire("Validation Error", "Please enter Reference 2 (Name, Contact in Bank/NBFC).", "error");
            return false;
        }

        if (partnersCount === "" || parseInt(partnersCount) < 0) {
            Swal.fire("Validation Error", "Please enter a valid number of Partners/Directors.", "error");
            return false;
        }

        if (firmName === "") {
            Swal.fire("Validation Error", "Firm name is required.", "error");
            return false;
        }

        if (empDate === "") {
            Swal.fire("Validation Error", "Please select Date of Empanelment.", "error");
            return false;
        }

        if (!regulatoryYes && !regulatoryNo) {
            Swal.fire("Validation Error", "Please select if registered with Regulatory Body.", "error");
            return false;
        }

        if (regulatoryYes) {
            // Partner 1
            let fname = document.getElementById("fname").value.trim();
            let age = document.querySelector("#partnerDetails input[min='18']").value.trim();
            let pan1 = document.getElementById("Pan1").value.trim();
            let adrs1 = document.getElementById("adrs1").value.trim();
            // Partner 2
            let fname1 = document.getElementById("fname1").value.trim();
            let age1 = document.getElementById("age1").value.trim();
            let pan2 = document.getElementById("Pan2").value.trim();
            let adrs2 = document.getElementById("adrs2").value.trim();

            // Partner 1 validation
            if (fname === "" || age === "" || adrs1 === "") {
                Swal.fire("Validation Error", "Please fill all details for Partner 1.", "error");
                return false;
            }
            // PAN1 is required - either valid PAN or NIL
            if (pan1 === "") {
                Swal.fire("Validation Error", "Please enter PAN for Partner 1 or enter 'NIL' if not available.", "error");
                return false;
            }
            if (pan1.toUpperCase() !== "NIL" && !panRegex.test(pan1)) {
                Swal.fire("Validation Error", "Enter valid PAN for Partner 1 (ABCDE1234F) or 'NIL' if not available.", "error");
                return false;
            }

            // Partner 2 validation
            if (fname1 === "" || age1 === "" || adrs2 === "") {
                Swal.fire("Validation Error", "Please fill all details for Partner 2.", "error");
                return false;
            }
            // PAN2 is required - either valid PAN or NIL
            if (pan2 === "") {
                Swal.fire("Validation Error", "Please enter PAN for Partner 2 or enter 'NIL' if not available.", "error");
                return false;
            }
            if (pan2.toUpperCase() !== "NIL" && !panRegex.test(pan2)) {
                Swal.fire("Validation Error", "Enter valid PAN for Partner 2 (ABCDE1234F) or 'NIL' if not available.", "error");
                return false;
            }
        }

        let hasValidCases = false;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] && rows[i].querySelector('td[colspan]') === null) {
                // If row doesn't have a colspan td (which indicates empty message), it's a valid row
                hasValidCases = true;
                break;
            }
        }
        if (!hasValidCases) {
            Swal.fire("Validation Error", "Please add at least one case number to the table.", "error");
            return false;
        }

        // Validate case type table - check if table has actual data rows (not just empty message)
        let hasValidCaseTypes = false;
        for (let i = 0; i < rows1.length; i++) {
            if (rows1[i] && rows1[i].querySelector('td[colspan]') === null) {
                // If row doesn't have a colspan td (which indicates empty message), it's a valid row
                hasValidCaseTypes = true;
                break;
            }
        }
        if (!hasValidCaseTypes) {
            Swal.fire("Validation Error", "Please add at least one case type to the table.", "error");
            return false;
        }
        // Validate case type table - should have at least one valid row


        return true;
    },
    ProfessionalDetailsSubmit: async function () {
        try {
            let companyTypes = {
                publicLimited: document.getElementById("chk1").checked ? 1 : 0,
                privateLimited: document.getElementById("chk2").checked ? 1 : 0,
                individualPractitioner: document.getElementById("chk3").checked ? 1 : 0,
                partnership: document.getElementById("chk4").checked ? 1 : 0,
                partnershipFirm: document.getElementById("chk5").checked ? 1 : 0
            };

            let otherText = document.querySelector("input[placeholder='Specify other areas of specialization']").value.trim();

            let specializations = {
                civilLaw: document.getElementById("spec1").checked ? "CIVIL" : 0,
                criminalLaw: document.getElementById("spec2").checked ? "Criminal" : 0,
                sarfaesiAct: document.getElementById("spec3").checked ? "safaesi" : 0,
                consumerProtection: document.getElementById("spec4").checked ? "consumer" : 0,
                arbitrationMediation: document.getElementById("spec5").checked ? "arbitration" : 0,
                others: document.getElementById("spec12").checked
                    ? (otherText !== "" ? otherText : "Others")
                    : 0
            };

            // Convert to comma-separated string (skip 0 values)
            let specializationList = Object.values(specializations)
                .filter(val => val !== 0)
                .join(",");

            let yearOfInception = document.getElementById("yearOfInception").value.trim();
            let regNumber = document.getElementById("regnum").value.trim();
            let placeOfPractice = document.getElementById("txtpractice").value.trim();
            let caseam = document.getElementById("caseam").value.trim();
            let yearsOfExperience = document.querySelector("input[placeholder='Years']").value.trim();
            let ddl1 = document.getElementById("ddlgrade");

            
            let gradeValue = ddl1.value;


            let grade = ddl1.options[ddl1.selectedIndex].text;
           
            let membershipNo = document.getElementById("MemNo").value.trim();

            // References
            let reference1 = document.getElementById("ref1").value.trim();
            let reference2 = document.getElementById("ref2").value.trim();

            // Firm details
            let partnersCount = document.getElementById("part1").value.trim();
            let firmName = document.getElementById("firm").value.trim();
            let empDate = document.getElementById("empdate").value.trim();

            // Regulatory body
            let regulatory = document.getElementById("regYes").checked ? "1" :
                document.getElementById("regNo").checked ? "0" : "";

            // Partner 1 details
            let partner1 = {
                fullName: document.getElementById("fname").value.trim(),
                age: document.getElementById("age").value.trim(), /*document.querySelector("#partnerDetails input[min='18']").value.trim(),*/
                pan: document.getElementById("Pan1").value.trim(),
                address: document.getElementById("adrs1").value.trim()
            };

            // Partner 2 details
            let partner2 = {
                fullName: document.getElementById("fname1").value.trim(),
                age: document.getElementById("age1").value.trim(),
                pan: document.getElementById("Pan2").value.trim(),
                address: document.getElementById("adrs2").value.trim()
            };

            // Extract case numbers
            let tableBody = document.getElementById("caseTableBody");
            let rows = tableBody.getElementsByTagName("tr");
            let caseNumbers = [];

            for (let i = 0; i < rows.length; i++) {
                if (rows[i].classList.contains("empty-message")) {
                    continue;
                }
                let cells = rows[i].getElementsByTagName("td");
                if (cells.length > 1) {
                    caseNumbers.push(cells[1].innerText.trim());
                }
            }

            // Extract case types
            let tableBody1 = document.getElementById("caseTypeTableBody");
            let rows1 = tableBody1.getElementsByTagName("tr");
            let caseTypes = [];

            for (let i = 0; i < rows1.length; i++) {
                if (rows1[i].classList.contains("empty-message")) {
                    continue;
                }
                let cells = rows1[i].getElementsByTagName("td");
                if (cells.length > 1) {
                    caseTypes.push(cells[1].innerText.trim());
                }
            }

            // Validation
            if (caseTypes.length === 0) {
                Swal.fire("Validation Error", "Please enter at least one case type.", "error");
                return null;
            }
            let hiddenField = document.getElementById("hiddenField");
            let ddl = document.getElementById("ddlAdvocate");

            // Get values with fallbacks
            let hiddenValue = hiddenField?.value || "";
            let selectedValue = ddl?.value || "";

            // Return the first non-empty value
            let advid = hiddenValue || selectedValue;


            let professionalData = {
                advocateId: advid,
                publicLimited: companyTypes.publicLimited,
                privateLimited: companyTypes.privateLimited,
                individualPractitioner: companyTypes.individualPractitioner,
                partnership: companyTypes.partnership,
                partnershipFirm: companyTypes.partnershipFirm,
                specializations: specializationList,
                yearOfInception,
                regNumber,
                yearsOfExperience,
                reference1,
                reference2,
                regulatory,
                firmName,
                partnersCount,
                partner1FullName: partner1.fullName,
                partner1Age: partner1.age,
                partner1Pan: partner1.pan,
                partner1Address: partner1.address,
                partner2FullName: partner2.fullName,
                partner2Age: partner2.age,
                partner2Pan: partner2.pan,
                partner2Address: partner2.address,
                placeOfPractice,
                membershipNo,
                caseNumbers,
                caseTypes,
                grade,
                empDate,
                caseam
                
            };
           
            let joinedData = Object.values(professionalData).join("^");
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("5"),
                indata: encryptAES(joinedData)
            };

           

            // FIXED: Using custom fetch function properly
            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedResult = JSON.parse(customes.out_result);
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            if (errorStatus === 0) {
                // Failure alert
                Swal.fire({
                    icon: 'warning',
                    title: '!warning',
                    text: errorMsg,
                    footer: '<b>Please check your details and try again.</b>',
                    background: '#fff0f0',
                    color: '#d33',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Retry',
                    showClass: {
                        popup: 'animate__animated animate__shakeX'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
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
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                }).then(() => {
                    const professionalSaveButton = document.querySelector('#professionalSection .profbtn');
                    if (professionalSaveButton) {
                        professionalSaveButton.style.display = 'none';
                    }

                    // Collapse professional section
                    const professionalContent = document.getElementById('professionalSection');
                    professionalContent.classList.remove('show');

                    // Show and open additional section
                    const additionalHeader = document.getElementById('toggleadditional');
                    const additionalContent = document.getElementById('additional');
                    const additionalSection = additionalHeader.parentElement;

                    additionalSection.style.display = 'block';
                    additionalContent.classList.add('show');

                    // Smooth scroll to additional section
                    additionalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }





        } catch (error) {
            console.error("Error in ProfessionalDetailsSubmit:", error);
            Swal.fire("Error", "Something went wrong while submitting professional details.", "error");
            return null;
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
  
  


    document.getElementById("profbtn").addEventListener("click", function (e) {
        e.preventDefault();

        if (validateProfessionalSection()) {
            // Add your submit logic here
            ProfessionalDetails.ProfessionalDetailsSubmit();
            // subcategory.professionalDetailsSubmit(); // Uncomment when backend is ready
        }
    });

    // ============================================
    // INPUT VALIDATION FUNCTIONS (Real-time)
    // ============================================

    // Account Holder Name and Bank Name Validation (letters and spaces only)
    function validateTextWithSpaces(inputElement) {
        inputElement.value = inputElement.value.replace(/[^A-Za-z\s]/g, '');
    }

    // Numbers Only Validation
    function validateNumbers(inputElement) {
        inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    }

    // Account Number Validation
    function validateAccountNumber(inputElement) {
        inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    }

    function validateAccountNumberLength(inputElement) {
        const value = inputElement.value;
        if (value.length > 0 && value.length < 9) {
            inputElement.setCustomValidity('Account number must be at least 9 digits');
        } else {
            inputElement.setCustomValidity('');
        }
    }

    // IFSC Code Validation
    function validateIFSC(inputElement) {
        let value = inputElement.value.toUpperCase();
        value = value.replace(/[^A-Z0-9]/g, '');

        if (value.length > 0) {
            if (value.length <= 4) {
                value = value.replace(/[^A-Z]/g, '');
            } else if (value.length === 5) {
                if (value[4] !== '0') {
                    value = value.substring(0, 4);
                }
            } else if (value.length > 5) {
                let firstPart = value.substring(0, 4).replace(/[^A-Z]/g, '');
                let fifthChar = value[4] === '0' ? '0' : '';
                let lastPart = value.substring(5).replace(/[^A-Z0-9]/g, '');
                value = firstPart + fifthChar + lastPart;
            }
        }

        inputElement.value = value;
    }

    function validateIFSCComplete(inputElement) {
        const value = inputElement.value;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

        if (value.length > 0 && !ifscRegex.test(value)) {
            inputElement.setCustomValidity('Invalid IFSC code format (e.g., SBIN0001234)');
        } else {
            inputElement.setCustomValidity('');
        }
    }

    // MICR Code Validation
    function validateMICR(inputElement) {
        inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    }

    function validateMICRLength(inputElement) {
        const value = inputElement.value;
        if (value.length > 0 && value.length !== 9) {
            inputElement.setCustomValidity('MICR code must be exactly 9 digits');
        } else {
            inputElement.setCustomValidity('');
        }
    }

    // Branch Code Validation (alphanumeric)
    function validateBranchCode(inputElement) {
        let value = inputElement.value.toUpperCase();
        value = value.replace(/[^A-Z0-9]/g, '');
        inputElement.value = value;
    }

    // ============================================
    // ATTACH EVENT LISTENERS
    // ============================================

    // Number of Junior Advocates
    const jnradv = document.getElementById('jnradv');
    if (jnradv) {
        jnradv.addEventListener('input', function () {
            validateNumbers(this);
        });
    }

    // Primary Bank Account - Account Holder Name
    const acholder1 = document.getElementById('acholder1');
    if (acholder1) {
        acholder1.addEventListener('input', function () {
            validateTextWithSpaces(this);
        });
    }

    // Primary Bank Account - Bank Name
    const bnknm1 = document.getElementById('bnknm1');
    if (bnknm1) {
        bnknm1.addEventListener('input', function () {
            validateTextWithSpaces(this);
        });
    }

    // Primary Bank Account - Account Number
    const acno1 = document.getElementById('acno1');
    if (acno1) {
        acno1.addEventListener('input', function () {
            validateAccountNumber(this);
        });
        acno1.addEventListener('blur', function () {
            validateAccountNumberLength(this);
        });
    }

    // Primary Bank Account - IFSC Code
    const ifsc1 = document.getElementById('ifsc1');
    if (ifsc1) {
        ifsc1.addEventListener('input', function () {
            validateIFSC(this);
        });
        ifsc1.addEventListener('blur', function () {
            validateIFSCComplete(this);
        });
    }

    // Primary Bank Account - MICR Code
    const micr1 = document.getElementById('micr1');
    if (micr1) {
        micr1.addEventListener('input', function () {
            validateMICR(this);
        });
        micr1.addEventListener('blur', function () {
            validateMICRLength(this);
        });
    }

    // Primary Bank Account - Branch Code
    const brcode1 = document.getElementById('brcode1');
    if (brcode1) {
        brcode1.addEventListener('input', function () {
            validateBranchCode(this);
        });
    }

    // Secondary Bank Account - Account Holder Name
    const acholder2 = document.getElementById('acholder2');
    if (acholder2) {
        acholder2.addEventListener('input', function () {
            validateTextWithSpaces(this);
        });
    }

    // Secondary Bank Account - Bank Name
    const bnknm2 = document.getElementById('bnknm2');
    if (bnknm2) {
        bnknm2.addEventListener('input', function () {
            validateTextWithSpaces(this);
        });
    }

    // Secondary Bank Account - Account Number
    const acno2 = document.getElementById('acno2');
    if (acno2) {
        acno2.addEventListener('input', function () {
            validateAccountNumber(this);
        });
        acno2.addEventListener('blur', function () {
            validateAccountNumberLength(this);
        });
    }

    // Secondary Bank Account - IFSC Code
    const ifsc2 = document.getElementById('ifsc2');
    if (ifsc2) {
        ifsc2.addEventListener('input', function () {
            validateIFSC(this);
        });
        ifsc2.addEventListener('blur', function () {
            validateIFSCComplete(this);
        });
    }

    // Secondary Bank Account - MICR Code
    const micr2 = document.getElementById('micr2');
    if (micr2) {
        micr2.addEventListener('input', function () {
            validateMICR(this);
        });
        micr2.addEventListener('blur', function () {
            validateMICRLength(this);
        });
    }

    // Secondary Bank Account - Branch Code
    const brcode2 = document.getElementById('brcode2');
    if (brcode2) {
        brcode2.addEventListener('input', function () {
            validateBranchCode(this);
        });
    }

    // ============================================
    // FORM SUBMISSION VALIDATION
    // ============================================

    const additionalButton = document.querySelector('#additionalsave.save-button');

    if (additionalButton) {
        additionalButton.addEventListener('click', function (e) {
            e.preventDefault();

            if (validateAdditionalSection()) {
                saveAdditionalSection();
            }
        });
    }

    function validateAdditionalSection() {
        let isValid = true;
        let errors = [];

        clearAllErrors();

        // ============================================
        // GET ALL FIELD VALUES
        // ============================================

        // Additional Information
        const jnradvVal = document.getElementById('jnradv').value.trim();
        const othrbranchesVal = document.getElementById('othrbranches').value.trim();
        const modeVal = document.getElementById('mode').value.trim();

        // Primary Bank Account Details
        const acholder1Val = document.getElementById('acholder1').value.trim();
        const bnknm1Val = document.getElementById('bnknm1').value.trim();
        const acno1Val = document.getElementById('acno1').value.trim();
        const ifsc1Val = document.getElementById('ifsc1').value.trim();
        const actype1Val = document.getElementById('actype1').value;
        const micr1Val = document.getElementById('micr1').value.trim();
        const brcode1Val = document.getElementById('brcode1').value.trim();
        const BranchName = document.getElementById('brnm1').value.trim();

        // Secondary Bank Account Details
        const acholder2Val = document.getElementById('acholder2').value.trim();
        const bnknm2Val = document.getElementById('bnknm2').value.trim();
        const acno2Val = document.getElementById('acno2').value.trim();
        const ifsc2Val = document.getElementById('ifsc2').value.trim();
        const actype2Val = document.getElementById('actype2').value;
        const micr2Val = document.getElementById('micr2').value.trim();
        const brcode2Val = document.getElementById('brcode2').value.trim();
        const BranchName2 = document.getElementById('brnm2').value.trim();
        // ============================================
        // VALIDATE ADDITIONAL INFORMATION
        // ============================================

        if (!jnradvVal) {
            showError('jnradv', 'Number of Junior Advocates is required');
            errors.push('Number of Junior Advocates is required');
            isValid = false;
        }

        if (!othrbranchesVal) {
            showError('othrbranches', 'Any Other Branches is required');
            errors.push('Any Other Branches is required');
            isValid = false;
        }

        if (!modeVal) {
            showError('mode', 'Mode Of Communication is required');
            errors.push('Mode Of Communication is required');
            isValid = false;
        }

        // ============================================
        // VALIDATE PRIMARY BANK ACCOUNT DETAILS
        // ============================================

        if (!acholder1Val) {
            showError('acholder1', 'Account Holder Name is required');
            errors.push('Primary Account Holder Name is required');
            isValid = false;
        }

        if (!bnknm1Val) {
            showError('bnknm1', 'Bank Name is required');
            errors.push('Primary Bank Name is required');
            isValid = false;
        }

        if (!acno1Val) {
            showError('acno1', 'Account Number is required');
            errors.push('Primary Account Number is required');
            isValid = false;
        } else if (acno1Val.length < 9) {
            showError('acno1', 'Account Number must be at least 9 digits');
            errors.push('Primary Account Number must be at least 9 digits');
            isValid = false;
        }

        if (!ifsc1Val) {
            showError('ifsc1', 'IFSC Code is required');
            errors.push('Primary IFSC Code is required');
            isValid = false;
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc1Val)) {
            showError('ifsc1', 'Invalid IFSC Code format (e.g., SBIN0001234)');
            errors.push('Primary IFSC Code format is invalid');
            isValid = false;
        }

        if (!actype1Val || actype1Val === '-- Select --') {
            showError('actype1', 'Account Type is required');
            errors.push('Primary Account Type is required');
            isValid = false;
        }

        // FIX 1: Corrected MICR validation logic (was using ! instead of && for both conditions)
        if (!micr1Val && micr1Val.length !== 9) {
            showError('micr1', 'MICR Code must be exactly 9 digits');
            errors.push('Primary MICR Code must be exactly 9 digits');
            isValid = false;
        }

        if (!brcode1Val) {
            // FIX 2: Corrected element ID (was 'brcode1Val' instead of 'brcode1')
            showError('brcode1', 'Branch Code must be filled');
            errors.push('Primary Branch Code must be filled');
            isValid = false;
        }
        if (!BranchName) {
            // FIX 2: Corrected element ID (was 'brcode1Val' instead of 'brcode1')
            showError('brnm1', 'Please Enter Branch Name');
            errors.push('Please Enter Branch Name');
            isValid = false;
        }


        // ============================================
        // VALIDATE SECONDARY BANK ACCOUNT DETAILS
        // ============================================

        // FIX 3: Re-enabled conditional validation - secondary bank is now optional
        // Check if ANY secondary bank field is filled
        const hasSecondaryData = acholder2Val || bnknm2Val || acno2Val || ifsc2Val ||
            (actype2Val && actype2Val !== '-- Select --') ||
            micr2Val || brcode2Val;

            if (!acholder2Val) {
                showError('acholder2', 'Secondary Account Holder Name is required');
                errors.push('Secondary Account Holder Name is required');
                isValid = false;
            }

            if (!bnknm2Val) {
                showError('bnknm2', 'Secondary Bank Name is required');
                errors.push('Secondary Bank Name is required');
                isValid = false;
            }

            if (!acno2Val) {
                showError('acno2', 'Secondary Account Number is required');
                errors.push('Secondary Account Number is required');
                isValid = false;
            } else if (acno2Val.length < 9) {
                showError('acno2', 'Secondary Account Number must be at least 9 digits');
                errors.push('Secondary Account Number must be at least 9 digits');
                isValid = false;
            }

            if (!ifsc2Val) {
                showError('ifsc2', 'Secondary IFSC Code is required');
                errors.push('Secondary IFSC Code is required');
                isValid = false;
            } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc2Val)) {
                showError('ifsc2', 'Invalid Secondary IFSC Code format (e.g., SBIN0001234)');
                errors.push('Secondary IFSC Code format is invalid');
                isValid = false;
            }

            if (!actype2Val || actype2Val === '-- Select --') {
                showError('actype2', 'Secondary Account Type is required');
                errors.push('Secondary Account Type is required');
                isValid = false;
            }

            // FIX 4: Corrected MICR validation logic (was using ! instead of && for both conditions)
            if (!micr2Val && micr2Val.length !== 9) {
                showError('micr2', 'Secondary MICR Code must be exactly 9 digits');
                errors.push('Secondary MICR Code must be exactly 9 digits');
                isValid = false;
            }

            if (!brcode2Val) {
                // FIX 5: Corrected element ID (was 'brcode2Val' instead of 'brcode2')
                showError('brcode2', 'Secondary Branch Code must be filled');
                errors.push('Secondary Branch Code must be filled');
                isValid = false;
            }
        
        if (!BranchName) {
            // FIX 2: Corrected element ID (was 'brcode1Val' instead of 'brcode1')
            showError('brnm2', 'Please Enter Branch Name');
            errors.push('Please Enter Branch Name');
            isValid = false;
        }
        // ============================================
        // SHOW VALIDATION ERRORS
        // ============================================

        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: '<div style="text-align: left; max-height: 400px; overflow-y: auto;">' +
                    errors.map(err => '• ' + err).join('<br>') +
                    '</div>',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33',
                width: '600px'
            });
        }

        return isValid;
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.style.borderColor = '#dc3545';
        element.style.backgroundColor = '#fff5f5';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.fontWeight = '500';
        errorDiv.textContent = message;

        const existingError = element.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        element.parentElement.appendChild(errorDiv);

        // Scroll to first error
        if (document.querySelectorAll('.error-message').length === 1) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function clearAllErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        const inputs = document.querySelectorAll('#additional input, #additional select');
        inputs.forEach(input => {
            input.style.borderColor = '';
            input.style.backgroundColor = '';
        });
    }

    async function saveAdditionalSection() {
        // Helper to get trimmed value
        const getVal = (id) => document.getElementById(id).value.trim();

        // Collect all data
        const formData = {
            additionalInfo: {
                jnradv: getVal('jnradv'),
                othrbranches: getVal('othrbranches'),
                mode: getVal('mode')
            },
            primaryBank: {
                acholder: getVal('acholder1'),
                bnknm: getVal('bnknm1'),
                acno: getVal('acno1'),
                ifsc: getVal('ifsc1'),
                actype: getVal('actype1'),
                micr: getVal('micr1'),
                brcode: getVal('brcode1'),
                branchName: getVal('brnm1')
            }
        };

        // Add secondary bank only if any field is filled
        const acholder2Val = getVal('acholder2');
        const bnknm2Val = getVal('bnknm2');
        const acno2Val = getVal('acno2');
        const ifsc2Val = getVal('ifsc2');
        const actype2Val = getVal('actype2');
        const micr2Val = getVal('micr2');
        const brcode2Val = getVal('brcode2');
        const branchName2 = getVal('brnm2'); // FIX 1: Added const/let/var declaration

        if (
            acholder2Val || bnknm2Val || acno2Val ||
            ifsc2Val || actype2Val || micr2Val || brcode2Val
        ) {
            formData.secondaryBank = {
                acholder: acholder2Val,
                bnknm: bnknm2Val,
                acno: acno2Val,
                ifsc: ifsc2Val,
                actype: actype2Val,
                micr: micr2Val,
                brcode: brcode2Val,
                branchName: branchName2 // FIX 2: Changed key from branchName2 to branchName for consistency
            };
        }

        let hiddenValue = document.getElementById("hiddenField").value;
        let ddl = document.getElementById("ddlAdvocate");
        let selectedValue = ddl.value;

        let advid = hiddenValue ? hiddenValue : selectedValue;

        // Build string safely (include secondary only if exists)
        const allDataString = [
            advid,
            formData.additionalInfo.jnradv,
            formData.additionalInfo.othrbranches,
            formData.additionalInfo.mode,
            formData.primaryBank.acholder,
            formData.primaryBank.bnknm,
            formData.primaryBank.acno,
            formData.primaryBank.brcode,
            formData.primaryBank.actype,
            formData.primaryBank.branchName, // FIX 3: Changed formdata to formData (case-sensitive)
            formData.primaryBank.micr,
            formData.primaryBank.ifsc,

            formData.secondaryBank?.acholder || "",
            formData.secondaryBank?.bnknm || "",
            formData.secondaryBank?.acno || "",
            formData.secondaryBank?.brcode || "",
            formData.secondaryBank?.actype || "",
            formData.secondaryBank?.branchName || "", // FIX 4: Changed branchName2 to branchName
            formData.secondaryBank?.micr || "",
            formData.secondaryBank?.ifsc || ""
            // FIX 5: Removed duplicate micr line
        ].join("^");

        const alldata = allDataString;

        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            Flag: encryptAES("7"),
            indata: encryptAES(alldata)
        };

        try {
            // FIX 6: Added async/await for fetch operation
            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedResult = JSON.parse(customes.out_result);
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            if (errorStatus === 0) {
                // Failure alert
                Swal.fire({
                    icon: 'warning',
                    title: '!warning',
                    text: errorMsg,
                    footer: '<b>Please check your details and try again.</b>',
                    background: '#fff0f0',
                    color: '#d33',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Retry',
                    showClass: {
                        popup: 'animate__animated animate__shakeX'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
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
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                }).then(() => {
                   
                    // Hide the additional save button if it exists
                    const additionalSaveButton = document.querySelector('#additionalsave .save-button');
                    if (additionalSaveButton) {
                        additionalSaveButton.style.display = 'none';
                    }

                    // Collapse additional section
                    const additionalContent = document.getElementById('additional');
                    additionalContent.classList.remove('show');

                    // Show and open document section
                    const documentHeader = document.getElementById('Document1');
                    const documentContent = document.getElementById('DocumentDetails');
                    const documentSection = documentHeader.parentElement;

                    documentSection.style.display = 'block';
                    documentContent.classList.add('show');

                    // Smooth scroll to document section
                    documentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                
            }
        } catch (error) {
            // FIX 7: Added error handling for fetch operation
            console.error('Error saving data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An unexpected error occurred. Please try again.',
                confirmButtonColor: '#d33'
            });
        }
    }
    // Optional: Clear form function
    function clearForm() {
        document.getElementById('jnradv').value = '';
        document.getElementById('othrbranches').value = '';
        document.getElementById('mode').value = '';

        // Clear primary bank
        document.getElementById('acholder1').value = '';
        document.getElementById('bnknm1').value = '';
        document.getElementById('acno1').value = '';
        document.getElementById('ifsc1').value = '';
        document.getElementById('actype1').value = '-- Select --';
        document.getElementById('micr1').value = '';
        document.getElementById('brcode1').value = '';

        // Clear secondary bank
        document.getElementById('acholder2').value = '';
        document.getElementById('bnknm2').value = '';
        document.getElementById('acno2').value = '';
        document.getElementById('ifsc2').value = '';
        document.getElementById('actype2').value = '-- Select --';
        document.getElementById('micr2').value = '';
        document.getElementById('brcode2').value = '';

        clearAllErrors();
    }

});