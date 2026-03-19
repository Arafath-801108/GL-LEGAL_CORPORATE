$(document).ready(async function () {
    // Initialize dropdowns and tables
    checkAccess("48");
    await subcategory.GetAdvocateName1();


    // Initialize case number table and bind events
    initializeCaseNumberTable();
    bindCaseNumberEvents();

    // Initialize case type table
    updateCaseTypeTable();
});

$(document).on('click', '#exit', function () {
    redirectToDashboard();
});

var subcategory = {
   
    GetAdvocateName1: async function () {
        clearFormApprove();
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
                Flag: encryptAES("25")
            };

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const outResult = JSON.parse(customes.out_result);

            const selectElement1 = document.getElementById('ddlAdvocate');
          

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

    GetPersonalDetails1: async function () {
        try {
            const ddlAdvocateid = document.getElementById("ddlAdvocate").value;

            if (!ddlAdvocateid || ddlAdvocateid === '0') {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Selection',
                    text: 'Please select an advocate first',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("3"),
                indata: encryptAES(ddlAdvocateid)
            };

            Swal.fire({
                title: 'Loading Personal Details...',
                text: 'Please wait while we fetch the details',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedResult = JSON.parse(customes.out_result);
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            if (errorStatus === 1) {
                if (!parsedResult.Table || parsedResult.Table.length === 0) {
                    Swal.close();
                    Swal.fire({
                        icon: 'info',
                        title: 'No Data',
                        text: 'No details found for this advocate',
                        confirmButtonColor: '#007bff'
                    });
                    return;
                }

                const dataObject = parsedResult.Table[0];
                let dataString = null;

                // Find the data string with ^ delimiter
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
                        category: dataArray[15] || '',
                        pan: dataArray[12] || '',
                        state: dataArray[14] || '',
                        district: dataArray[13] || '',
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
                        category: dataObject.VERTICAL_NAME || '',
                        pan: dataObject.PAN_NO || '',
                        state: dataObject.STATE || '',
                        district: dataObject.DISTRICT || '',
                        nation: dataObject.NATION || ''
                    };
                }

                // Populate fields
                await this.populateFormFields1(userData);

                Swal.close();
                

            } else {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
            }

        } catch (error) {
            console.error('Error in GetPersonalDetails:', error);
            Swal.close();
           
        }
    },

    populateFormFields1: async function (userData) {
        const setFieldValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value || '';
            }
        };

        setFieldValue('fullName', userData.fullName);
        setFieldValue('relativeName', userData.fatherName);
        setFieldValue('dob', userData.dob);
        setFieldValue('landline', userData.landline);
        setFieldValue('mobileNumber', userData.mobile);
        setFieldValue('whatsappNumber', userData.whatsapp);
        setFieldValue('emailInput', userData.email);
        setFieldValue('panNumber', userData.pan);
        if (userData.category === '1') {   // check string "1"
            setFieldValue('ddlCategory', 'GOLD LOAN');
        } else {
            setFieldValue('ddlCategory', 'MSME & MFI');
        }


        setFieldValue('nation', userData.nation);
        setFieldValue('Residence', userData.residenceAddress);
        setFieldValue('Ofceadrs', userData.officeAddress);
        setFieldValue('ocupdtls', userData.occupation);
        setFieldValue('sociacnt', userData.socialMedia);

        const genderSelect = document.getElementById('gender');
        if (genderSelect) genderSelect.value = userData.gender || '';

        const stateSelect = document.getElementById('drp_state');
        if (stateSelect) stateSelect.value = userData.state || '';

        const districtSelect = document.getElementById('drp_dis');
        if (districtSelect) districtSelect.value = userData.district || '';
    },

    GetProffessionalDetails1: async function () {
        try {
            const ddlAdvocateid = document.getElementById("ddlAdvocate").value;

            if (!ddlAdvocateid || ddlAdvocateid === '0') {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Selection',
                    text: 'Please select an advocate first',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("6"),
                indata: encryptAES(ddlAdvocateid)
            };

            Swal.fire({
                title: 'Loading Professional Details...',
                text: 'Please wait while we fetch the details',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

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

            if (errorStatus === 1) {
                if (!parsedResult.Table || parsedResult.Table.length === 0) {
                    Swal.close();
                    Swal.fire({
                        icon: 'info',
                        title: 'No Data',
                        text: 'No professional details found',
                        confirmButtonColor: '#007bff'
                    });
                    return;
                }

                const data = parsedResult.Table[0];

                // Entity Type Checkboxes
                document.getElementById("chk1").checked = data.PUBLIC_LIMITED == 1;
                document.getElementById("chk2").checked = data.PRIVATE_LIMITED == 1;
                document.getElementById("chk3").checked = data.INDIVIDUAL == 1;
                document.getElementById("chk4").checked = data.PROPRIETORSHIP == 1;
                document.getElementById("chk5").checked = data.PARNERSHIP_FIRM == 1;

                // Specialization Checkboxes
                const specialization = data.FEILD_SPECIAL || "";
                const specArray = specialization.split(",").map(s => s.trim());

                document.getElementById("spec1").checked = specArray.includes("CIVIL");
                document.getElementById("spec2").checked = specArray.includes("Criminal");
                document.getElementById("spec3").checked = specArray.includes("safaesi");
                document.getElementById("spec4").checked = specArray.includes("consumer");
                document.getElementById("spec5").checked = specArray.includes("arbitration");

                if (specArray.some(s => !["CIVIL", "Criminal", "safaesi", "consumer", "arbitration"].includes(s))) {
                    document.getElementById("spec12").checked = true;
                    const otherSpecs = specArray.filter(s => !["CIVIL", "Criminal", "safaesi", "consumer", "arbitration"].includes(s));
                    document.getElementById("otherText").value = otherSpecs.join(",");
                }

                // Other Professional Details
                document.getElementById("yearOfInception").value = data.YEAR_INCEPTION || "";
                document.getElementById("regnum").value = data.REG_NO || "";
                document.getElementById("txtpractice").value = data.PLACES_OF_PRACTICE || "";

                const experienceField = document.querySelector("input[placeholder='Years']");
                if (experienceField) experienceField.value = data.EXPERIENCE || "";

                document.getElementById("MemNo").value = data.BAR_ASS_MEM_NO || "";
                document.getElementById("ref1").value = data.REFERANCE_1 || "";
                document.getElementById("ref2").value = data.REFERANCE_2 || "";
                document.getElementById("part1").value = data.NUMBEROFPARTNERS || "";
                document.getElementById("firm").value = data.REPRESENT_FIRM || "";
                document.getElementById("caseam").value = data.CASE_AMOUNT || "0";
                // Empaneled Date
                let dbDate = data.EMPANELED_DATE || "";
                if (dbDate.includes("T")) dbDate = dbDate.split("T")[0];
                if (dbDate.includes("/")) {
                    let parts = dbDate.split("/");
                    dbDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
                }
                document.getElementById("empdate").value = dbDate;

                // Regulatory Registration
                const regiRegulatory = data.REGI_REGULATORY || 0;
                if (regiRegulatory == 1) {
                    document.getElementById("regYes").checked = true;
                    document.getElementById("partnerDetails").style.display = "block";
                    document.getElementById("fname").value = data.DP_NAME1 || "";
                    document.getElementById("age").value = data.DP_AGE1 || "";
                    document.getElementById("Pan1").value = data.DP_PAN1 || "";
                    document.getElementById("adrs1").value = data.DP_ADDRESS1 || "";
                    document.getElementById("fname1").value = data.DP_NAME2 || "";
                    document.getElementById("age1").value = data.DP_AGE2 || "";
                    document.getElementById("Pan2").value = data.DP_PAN2 || "";
                    document.getElementById("adrs2").value = data.DP_ADRESS2 || "";
                } else {
                    document.getElementById("regNo").checked = true;
                    document.getElementById("partnerDetails").style.display = "none";
                }

                // Grade Selection
                const ddlGrade = document.getElementById("ddlgrade");
                const gradeText = data.GRADE || "";
                ddlGrade.value = gradeText;

                // Load Case Numbers and Case Types
                const caseNumbers = data.CASE_NUMBER || "";
                const caseTypes = data.CASE_TYPES || "";

                loadCaseNumbersFromDB(caseNumbers);
                loadCaseTypesFromDB(caseTypes);

                Swal.close();
               

            } else {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMsg || 'Failed to load professional details',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (err) {
            console.error('Error in GetProffessionalDetails:', err);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Exception',
                text: err.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    GetAdditionalDetails1: async function () {
        try {
            const ddlAdvocateid = document.getElementById("ddlAdvocate").value;
            if (!ddlAdvocateid || ddlAdvocateid === '0') {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Selection',
                    text: 'Please select an advocate first',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("8"),
                indata: encryptAES(ddlAdvocateid)
            };

            Swal.fire({
                title: 'Loading Additional Details...',
                text: 'Please wait while we fetch the details',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsed = customes.out_result;
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;
            const parsedResult = JSON.parse(parsed);

            if (errorStatus === 0) {
                Swal.close();
                Swal.fire({
                    icon: 'warning',
                    title: 'warning!',
                    text: errorMsg || 'Failed to fetch additional details',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            if (parsedResult.Table && parsedResult.Table.length > 0) {
                const row = parsedResult.Table[0];

                document.getElementById('jnradv').value = row.NO_JUNIOR || "";
                document.getElementById('othrbranches').value = row.THER_BRANCH || "";
                document.getElementById('mode').value = row.MODE_COMMU || "";

                // Bank Account 1
                document.getElementById('acholder1').value = row.ACC_HOLD_NAME1 || "";
                document.getElementById('bnknm1').value = row.BANK_NAME1 || "";
                document.getElementById('acno1').value = row.ACC_NO1 || "";
                document.getElementById('brcode1').value = row.BRANCH_CODE1 || "";
                document.getElementById('actype1').value = row.ACC_TYPE1 || "";
                document.getElementById('brnm1').value = row.BRANCH_NAME1 || "";
                document.getElementById('micr1').value = row.MICR_NO1 || "";
                document.getElementById('ifsc1').value = row.IFSC1 || "";

                // Bank Account 2
                document.getElementById('acholder2').value = row.ACC_HOLD_NAME2 || "";
                document.getElementById('bnknm2').value = row.BANK_NAME2 || "";
                document.getElementById('acno2').value = row.ACC_NO2 || "";
                document.getElementById('brcode2').value = row.BRANCH_CODE2 || "";
                document.getElementById('actype2').value = row.ACC_TYPE2 || "";
                document.getElementById('brnm2').value = row.BRANCH_NAME2 || "";
                document.getElementById('micr2').value = row.MICR_NO2 || "";
                document.getElementById('ifsc2').value = row.IFSC2 || "";

                Swal.close();
               
            } else {
                Swal.close();
                Swal.fire({
                    icon: 'info',
                    title: 'No Data',
                    text: 'No additional details found',
                    confirmButtonColor: '#007bff'
                });
            }

        } catch (error) {
            console.error('Error fetching additional details:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An unexpected error occurred: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    GetLastSection1: async function () {
        try {
            const ddlAdvocateid = document.getElementById("ddlAdvocate").value;
            if (!ddlAdvocateid || ddlAdvocateid === '0') {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Selection',
                    text: 'Please select an advocate first',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                Flag: encryptAES("10"),
                indata: encryptAES(ddlAdvocateid)
            };

            Swal.fire({
                title: 'Loading Document Details...',
                text: 'Please wait while we fetch the details',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsed = customes.out_result;
            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;
            const parsedResult = JSON.parse(parsed);

            if (errorStatus === 0) {
                Swal.close();
                Swal.fire({
                    icon: 'warning',
                    title: 'warning!',
                    text: errorMsg || 'Failed to fetch document details',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            if (parsedResult.Table && parsedResult.Table.length > 0) {
                const row = parsedResult.Table[0];

                // Individual Documents
                document.getElementById("doc1").checked = row.PANCARD == 1;
                document.getElementById("doc3").checked = row.PASSPORT == 1;
                document.getElementById("doc5").checked = row.DRIVING == 1;
                document.getElementById("doc7").checked = row.BANK_STMT == 1;
                document.getElementById("doc8").checked = row.INDIVI_SIGNATURE_VERI == 1;

                // Company Documents
                document.getElementById("comp1").checked = row.COMPANY_PAN == 1;
                document.getElementById("comp3").checked = row.MOA == 1;
                document.getElementById("comp5").checked = row.BOARD_RESOL == 1;
                document.getElementById("comp6").checked = row.LIST_DIRECTORS == 1;
                document.getElementById("comp7").checked = row.LIST_SHAREHOLDERS == 1;
                document.getElementById("comp8").checked = row.BALANCE_SHEET == 1;
                document.getElementById("comp10").checked = row.ADDRESS_PROOF == 1;
                document.getElementById("comp11").checked = row.PROOF_BUSINESS == 1;

                // Partnership Firm Documents
                document.getElementById("part1").checked = row.FIRM_PAN == 1;
                document.getElementById("part2").checked = row.PARNERSHIP_DEED == 1;
                document.getElementById("part3").checked = row.REGI_CERTIFICATE == 1;
                document.getElementById("part5").checked = row.FIRM_ADD_PROOF == 1;
                document.getElementById("part6").checked = row.FIRM_PARNER_PAN == 1;
                document.getElementById("part7").checked = row.FIRM_SIGNATURE_VERIFICATION == 1;
                document.getElementById("part8").checked = row.LAWYER == 1;

                Swal.close();
               
            } else {
                Swal.close();
                Swal.fire({
                    icon: 'info',
                    title: 'No Data',
                    text: 'No document details found',
                    confirmButtonColor: '#007bff'
                });
            }

        } catch (error) {
            console.error('Error fetching document details:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An unexpected error occurred: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    },

    personaldtlsInsert: async function (val) {
        const fullName = document.getElementById("fullName").value;
        const relativeName = document.getElementById("relativeName").value;
        const Residence = document.getElementById("Residence").value;
        const Ofceadrs = document.getElementById("Ofceadrs").value;
        const dobValue = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;
        const landline = document.getElementById("landline").value;
        const mobileNumber = document.getElementById("mobileNumber").value;
        const whatsappNumber = document.getElementById("whatsappNumber").value;
        const emailInput = document.getElementById("emailInput").value;
        const sociacnt = document.getElementById("sociacnt").value;
        const ocupdtls = document.getElementById("ocupdtls").value;
        const ddlCategory = document.getElementById("ddlCategory").value;
        const panNumber = document.getElementById("panNumber").value;
        const drp_stateElement = document.getElementById("drp_state");
        const drp_disElement = document.getElementById("drp_dis");
        const ddlAdvocate = document.getElementById("ddlAdvocate").value;
        const nation = document.getElementById("nation").value;
        const drp_state = drp_stateElement.options[drp_stateElement.selectedIndex].text;
        const drp_dis = drp_disElement.options[drp_disElement.selectedIndex].text;

        const ddltype = document.getElementById('ddltype');
        const reasonInput = document.getElementById('rjt_reason');

        if (ddltype.value === "0") {
            alert("Please select an action.");
            return;
        }

        if (ddltype.value === "1") {
            if (!reasonInput.value.trim()) {
                alert("Please enter Approved reason.");
                return;
            }
        }

        if (ddltype.value === "2") {
            if (!reasonInput.value.trim()) {
                alert("Please enter Reject reason.");
                return;
            }
        }

        let values = [];

        if (val === "1") {
            values = [
                fullName, relativeName, Residence, Ofceadrs, dobValue, gender,
                landline, mobileNumber, whatsappNumber, emailInput, sociacnt,
                ocupdtls, ddlCategory, panNumber, drp_state, drp_dis, nation
            ];
        }

        if (val === "4") {
            values = [
                fullName, relativeName, Residence, Ofceadrs, dobValue, gender,
                landline, mobileNumber, whatsappNumber, emailInput, sociacnt,
                ocupdtls, ddlCategory, panNumber, drp_state, drp_dis, nation, ddlAdvocate
            ];
        }

        const safeValues = values.map(v => v ?? "");
        const joinedString = safeValues.join("^");

        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            Flag: encryptAES(val),
            indata: encryptAES(joinedString)
        };

        Swal.fire({
            title: 'Submitting...',
            text: 'Please wait while we save your data',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const outResult = JSON.parse(customes.out_result);
            const adid = outResult.Table[0][":B1"];
            document.getElementById("hiddenField").value = adid;

            const errorStatus = customes.Error_status;
            const errorMsg = customes.Error_msg;

            Swal.close();

            if (errorStatus === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: errorMsg,
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    }
};

// ==============================================
// CASE NUMBER TABLE MANAGEMENT
// ==============================================

let caseNumbers = [];
const caseNumberPattern = /^[0-9\-_#\/]+$/;

function initializeCaseNumberTable() {
    updateCaseCount();
}

function bindCaseNumberEvents() {
    const input = $('#caseNumberInput');
    const errorMessage = $('#errorMessage');
    const addBtn = $('#addBtn');

    input.on('input', function () {
        const value = $(this).val();

        if (value === '') {
            $(this).removeClass('valid invalid');
            errorMessage.removeClass('show');
            addBtn.prop('disabled', false);
            return;
        }

        if (validateCaseNumber(value)) {
            $(this).removeClass('invalid').addClass('valid');
            errorMessage.removeClass('show');
            addBtn.prop('disabled', false);
        } else {
            $(this).removeClass('valid').addClass('invalid');
            errorMessage.text('Invalid format. Use numbers, -, _, #, /').addClass('show');
            addBtn.prop('disabled', true);
        }
    });

    addBtn.on('click', function (e) {
        e.preventDefault();
        addCaseNumber();
    });

    input.on('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!addBtn.prop('disabled')) {
                addCaseNumber();
            }
        }
    });
}

function validateCaseNumber(value) {
    return value.trim() !== '' && caseNumberPattern.test(value);
}

function addCaseNumber() {
    const input = $('#caseNumberInput');
    const caseNumber = input.val().trim();
    const errorMessage = $('#errorMessage');

    if (caseNumber === '') {
        errorMessage.text('Please enter a case number').addClass('show');
        input.focus();
        return;
    }

    if (!validateCaseNumber(caseNumber)) {
        errorMessage.text('Invalid case number format').addClass('show');
        input.focus();
        return;
    }

    if (caseNumbers.some(item => item.caseNumber === caseNumber)) {
        errorMessage.text('This case number already exists').addClass('show');
        input.focus();
        return;
    }

    const now = new Date();
    caseNumbers.push({
        caseNumber: caseNumber,
        addedDate: now.toLocaleDateString('en-GB'),
        addedTime: now.toLocaleTimeString('en-IN')
    });

    renderCaseTable();
    updateCaseCount();

    input.val('').removeClass('valid invalid');
    errorMessage.removeClass('show');
    input.focus();

    Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Case number added successfully',
        timer: 1500,
        showConfirmButton: false
    });
}

function loadCaseNumbersFromDB(caseNumString) {
    if (!caseNumString) {
        caseNumbers = [];
        renderCaseTable();
        updateCaseCount();
        return;
    }

    const fetchedCaseNumbers = caseNumString
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

    caseNumbers = [];

    const now = new Date();
    fetchedCaseNumbers.forEach(caseNum => {
        caseNumbers.push({
            caseNumber: caseNum,
            addedDate: now.toLocaleDateString('en-GB'),
            addedTime: now.toLocaleTimeString('en-IN')
        });
    });

    renderCaseTable();
    updateCaseCount();

    console.log(`Loaded ${caseNumbers.length} case numbers from database`);
}

function renderCaseTable() {
    const tbody = $('#caseTableBody');

    // Update table header if it exists
    const tableHeader = $('#caseTableBody').closest('table').find('thead');
    if (tableHeader.length > 0) {
        tableHeader.html(`
            <tr>
                <th>S.No</th>
                <th>Case Number</th>
            </tr>
        `);
    }

    if (caseNumbers.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="2" class="empty-message">
                    No case numbers added yet.<br>
                    Enter a case number above and click "Add to Table"
                </td>
            </tr>
        `);
        return;
    }

    let html = '';
    caseNumbers.forEach((item, index) => {
        html += `
            <tr>
                <td class="serial-column">${index + 1}</td>
                <td><strong>${item.caseNumber}</strong></td>
            </tr>
        `;
    });

    tbody.html(html);
}

function updateCaseCount() {
    $('#caseCount').text(caseNumbers.length);
}

function getAllCaseNumbers() {
    return caseNumbers.map(item => item.caseNumber);
}

function getCaseNumbersData() {
    return {
        caseNumbers: caseNumbers.map(item => item.caseNumber),
        totalCount: caseNumbers.length
    };
}

function validateCaseNumbers() {
    if (caseNumbers.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No Cases Added',
            text: 'Please add at least one case number before submitting',
            confirmButtonColor: '#007bff'
        });
        return false;
    }
    return true;
}

// ==============================================
// CASE TYPE TABLE MANAGEMENT
// ==============================================

let caseTypeData = [];
let caseTypeCounter = 0;

function addCaseType() {
    const caseTypeDropdown = $('#ddltype');
    const selectedValue = caseTypeDropdown.val();
    const selectedText = caseTypeDropdown.find('option:selected').text();

    if (!selectedValue || selectedValue === '0') {
        showError('Please select a case type');
        caseTypeDropdown.focus();
        return;
    }

    const isDuplicate = caseTypeData.some(item => item.value === selectedValue);
    if (isDuplicate) {
        showError('This case type has already been added');
        return;
    }

    caseTypeCounter++;
    const caseTypeItem = {
        id: caseTypeCounter,
        value: selectedValue,
        text: selectedText
    };
    caseTypeData.push(caseTypeItem);

    updateCaseTypeTable();
    caseTypeDropdown.val('0');
    showSuccess('Case type added successfully');
}

function loadCaseTypesFromDB(caseTypesString) {
    if (!caseTypesString) {
        caseTypeData = [];
        caseTypeCounter = 0;
        updateCaseTypeTable();
        return;
    }

    const fetchedCaseTypes = caseTypesString
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

    caseTypeData = [];
    caseTypeCounter = 0;

    fetchedCaseTypes.forEach(caseType => {
        caseTypeCounter++;
        caseTypeData.push({
            id: caseTypeCounter,
            value: caseType,
            text: caseType
        });
    });

    updateCaseTypeTable();
    console.log(`Loaded ${caseTypeData.length} case types from database`);
}

function updateCaseTypeTable() {
    const tableBody = $('#caseTypeTableBody');
    tableBody.empty();

    // Update table header if it exists
    const tableHeader = $('#caseTypeTableBody').closest('table').find('thead');
    if (tableHeader.length > 0) {
        tableHeader.html(`
            <tr>
                <th>S.No</th>
                <th>Case Type</th>
            </tr>
        `);
    }

    if (caseTypeData.length === 0) {
        tableBody.append(`
            <tr>
                <td colspan="2" class="empty-message">
                    No case types added yet.<br>
                    Select a case type above and click "Add to Table"
                </td>
            </tr>
        `);

    } else {
        caseTypeData.forEach((item, index) => {
            const row = $(`
                <tr data-id="${item.id}">
                    <td class="serial-column">${index + 1}</td>
                    <td>${item.text}</td>
                </tr>
            `);

            tableBody.append(row);
        });
    }

    $('#caseTypeCount').text(caseTypeData.length);
}

function clearCaseTypes() {
    if (caseTypeData.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'No Case Types',
            text: 'No case types to clear',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    Swal.fire({
        title: 'Clear All Case Types?',
        text: `This will remove all ${caseTypeData.length} case types from the table.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c41e3a',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, clear all!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            caseTypeData = [];
            caseTypeCounter = 0;
            updateCaseTypeTable();

            Swal.fire({
                title: 'Cleared!',
                text: 'All case types have been removed.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

function getCaseTypes() {
    return caseTypeData.map(item => item.value);
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#c41e3a'
    });
}

function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        timer: 1500,
        showConfirmButton: false
    });
}

// ==============================================
// DROPDOWN LOADERS
// ==============================================

var _load = {

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
        } catch (error) {
            console.error('Error loading states:', error);
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
            selectElement1.innerHTML = '<option value="-1">-- Select District --</option>';

            parsedInner.Table.forEach(item => {
                const option = document.createElement('option');
                option.value = item.DISTRICT_ID;
                option.textContent = item.DISTRICT_NAME;
                selectElement1.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading districts:', error);
        }
    }
};

// ==============================================
// FORM SUBMISSION
// ==============================================

//var _submit = {
//    Submitdata: async function () {
//        const ddl = document.getElementById("ddlchoice");
//        const selectedValue = ddl.value;

//        const isValid = Validate.ValidateRequest();
//        if (!isValid) {
//            return;
//        }

//        let value;
//        if (selectedValue === "1") {
//            value = "1";
//            subcategory.personaldtlsInsert(value);
//        }
//        if (selectedValue === "2") {
//            value = "4";
//            subcategory.personaldtlsInsert(value);
//        }
//    }
//};

// ==============================================
// EVENT LISTENERS
// ==============================================

var _submit = {
    Submitdatalast: async function () {
        try {
            let indata;
            let data;

            const ddltype = document.getElementById("ddltype");
            const selectedValue = ddltype.value;
        

            if (selectedValue === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please select any action',
                    text: 'You must choose a valid option before continuing.',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
   
            const ddlAdvocate = document.getElementById("ddlAdvocate");

            const selectedValue1 = ddlAdvocate.value;
            
            const textbox = document.getElementById("rjt_reason");
            const inputValue = textbox ? textbox.value.trim() : "";

            if (!inputValue) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid Input',
                    text: 'Please enter a value in the textbox.'
                    
                });
                return;
            }
            // Decide data based on ddltype
            if (selectedValue === "1") {
                data = 1;
            } else {
                data = 2;
            }

            // Build indata string
            indata = inputValue + "^" + data + "^" + selectedValue1;

            // Prepare request payload
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                indata: encryptAES(indata),
                
                Flag: encryptAES("17")
            };

            const response = await fetch('/EmpanelmentDetails', "POST", requestData);
           

            const decryptedText = decryptAES(response);
            const customes = JSON.parse(decryptedText);
            const parsedResult = JSON.parse(customes.out_result);
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
                    location.reload();
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

document.addEventListener("DOMContentLoaded", function () {

    // Toggle sections
    const toggleHeader = document.getElementById("toggleProfessional");
    const section = document.getElementById("professionalSection");
    const toggleadditionl = document.getElementById("toggleadditional");
    const sectionadditionla = document.getElementById("additional");
    const Document1 = document.getElementById("Document1");
    const DocumentDetails = document.getElementById("DocumentDetails");

    if (toggleHeader && section) {
        toggleHeader.addEventListener("click", function () {
            if (section.style.display === "none" || section.style.display === "") {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });
    }

    if (toggleadditionl && sectionadditionla) {
        toggleadditionl.addEventListener("click", function () {
            if (sectionadditionla.style.display === "none" || sectionadditionla.style.display === "") {
                sectionadditionla.style.display = "block";
            } else {
                sectionadditionla.style.display = "none";
            }
        });
    }

    if (Document1 && DocumentDetails) {
        Document1.addEventListener("click", function () {
            if (DocumentDetails.style.display === "none" || DocumentDetails.style.display === "") {
                DocumentDetails.style.display = "block";
            } else {
                DocumentDetails.style.display = "none";
            }
        });
    }

    // Save button
    const saveBtn = document.getElementById("btnSave");
    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            _submit.Submitdata();
        });
    }
    document.getElementById("ddltype").addEventListener("change", function () {
        const selectedValue = this.value;
        const rejectDiv = document.getElementById("reject");

        if (rejectDiv) {
            if (selectedValue === "2") {
                
                rejectDiv.style.display = "block";
                actionLabel.innerText = "Reject Reason";
            }
                else if (selectedValue === "1") {
                rejectDiv.style.display = "block";
                actionLabel.innerText = "Approval Note";
                }
            else {
               
                rejectDiv.style.display = "none";
            }
        }

       






    });
    // }Last section submit
    const sublasBtn = document.getElementById("sublas");
    if (sublasBtn) {
        sublasBtn.addEventListener("click", async function () {
            const selectedValue = ddlAdvocate.value;
            const selectedIndex = ddlAdvocate.selectedIndex;

            if (selectedIndex === 0 || selectedValue === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Selection',
                    text: 'Please select an advocate from the dropdown.'
                });
                return;
            }
            

            _submit.Submitdatalast();

           
            
        });
    }

    // Advocate dropdown change
    const ddlAdvocate = document.getElementById("ddlAdvocate");
    if (ddlAdvocate) {
        ddlAdvocate.addEventListener("change", function () {
            const selectedValue = this.value;

            if (selectedValue === "0") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please select an Advocate Name',
                    text: 'You must choose an Advocate Name'
                });
            } else {
                subcategory.GetPersonalDetails1();
                subcategory.GetProffessionalDetails1();
                subcategory.GetAdditionalDetails1();
                subcategory.GetLastSection1();
            }
        });
    }

    // State dropdown change
    $(document).on('change', '#drp_state', function () {
        _load.DistrictLoadDropdown();
    });
});


// ==============================================
// CLEAR FORM FUNCTION
// ==============================================

function clearAllFormData() {
    // Clear dropdown selections
    document.getElementById('ddlAdvocate').value = '0';

    // Clear text inputs
    const textInputs = [
        'ddlCategory', 'fullName', 'relativeName', 'Residence', 'Ofceadrs',
        'dob', 'gender', 'drp_state', 'drp_dis', 'ocupdtls', 'nation',
        'landline', 'mobileNumber', 'whatsappNumber', 'emailInput', 'panNumber',
        'sociacnt', 'otherText', 'yearOfInception', 'regnum', 'txtpractice',
        'ddlgrade', 'MemNo', 'ref1', 'ref2', 'part1', 'firm', 'empdate',
        'fname', 'age', 'Pan1', 'adrs1', 'fname1', 'age1', 'Pan2', 'adrs2',
        'jnradv', 'othrbranches', 'mode', 'acholder1', 'bnknm1', 'acno1',
        'ifsc1', 'actype1', 'micr1', 'brcode1', 'brnm1', 'acholder2',
        'bnknm2', 'acno2', 'ifsc2', 'actype2', 'micr2', 'brcode2', 'brnm2'
    ];

    textInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });

    // Clear experience field (by placeholder)
    const experienceField = document.querySelector("input[placeholder='Years']");
    if (experienceField) experienceField.value = '';

    // Uncheck all checkboxes - Legal Entity Type
    const entityCheckboxes = ['chk1', 'chk2', 'chk3', 'chk4', 'chk5'];
    entityCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = false;
    });

    // Uncheck all checkboxes - Specialization
    const specCheckboxes = ['spec1', 'spec2', 'spec3', 'spec4', 'spec5', 'spec12'];
    specCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = false;
    });

    // Uncheck all checkboxes - Individual Documents
    const docCheckboxes = ['doc1', 'doc3', 'doc5', 'doc7', 'doc8'];
    docCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = false;
    });

    // Uncheck all checkboxes - Company Documents
    const compCheckboxes = ['comp1', 'comp3', 'comp5', 'comp6', 'comp7', 'comp8', 'comp10', 'comp11'];
    compCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = false;
    });

    // Uncheck all checkboxes - Partnership Firm Documents
    const partCheckboxes = ['part1', 'part2', 'part3', 'part5', 'part6', 'part7', 'part8'];
    partCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = false;
    });

    // Clear radio buttons - Regulatory
    const regYes = document.getElementById('regYes');
    const regNo = document.getElementById('regNo');
    if (regYes) regYes.checked = false;
    if (regNo) regNo.checked = false;

    // Hide partner details section
    const partnerDetails = document.getElementById('partnerDetails');
    if (partnerDetails) partnerDetails.style.display = 'none';

    // Clear hidden field
    const hiddenField = document.getElementById('hiddenField');
    if (hiddenField) hiddenField.value = '';

    // Clear case numbers table
    caseNumbers = [];
    renderCaseTable();
    updateCaseCount();

    // Clear case types table
    caseTypeData = [];
    caseTypeCounter = 0;
    updateCaseTypeTable();

    // Clear error messages
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) errorMessage.classList.remove('show');

    const panError = document.getElementById('panError');
    if (panError) panError.textContent = '';

    const pan1Error = document.getElementById('pan1Error');
    if (pan1Error) pan1Error.textContent = '';

    const pan2Error = document.getElementById('pan2Error');
    if (pan2Error) pan2Error.textContent = '';

    console.log('Form cleared successfully');
}

// Clear form with confirmation
function clearFormWithConfirmation() {
    Swal.fire({
        title: 'Clear Form?',
        text: 'Are you sure you want to clear all form data? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, clear it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            clearAllFormData();

            Swal.fire({
                icon: 'success',
                title: 'Cleared!',
                text: 'All form data has been cleared.',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// ==============================================
// EXIT BUTTON HANDLER
// ==============================================

document.addEventListener("DOMContentLoaded", function () {
    // Exit button - Clear form and redirect
    const exitBtn = document.getElementById("exit");
    if (exitBtn) {
        exitBtn.addEventListener("click", function () {
            Swal.fire({
                title: 'Exit Form?',
                text: 'Do you want to exit? All unsaved data will be lost.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, exit!',
                cancelButtonText: 'Stay'
            }).then((result) => {
                if (result.isConfirmed) {
                    clearAllFormData();

                    // Redirect to another page or close
                    // window.location.href = '/Home/Index'; // Uncomment and update URL

                    Swal.fire({
                        icon: 'success',
                        title: 'Exited!',
                        text: 'Form has been cleared.',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // Additional exit logic here
                        console.log('Form exited');
                    });
                }
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
 

    document.getElementById("subdoc").addEventListener("click", () => {
        documnetsubcategory.document_view();
    });
});

var documnetsubcategory = {

    document_view: async function () {
        try {


            const ddlAdvocateid = document.getElementById("ddlAdvocate").value;


            if (!ddlAdvocateid) {
                console.warn('Missing required input values');
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),

                indata: encryptAES(ddlAdvocateid),
                Flag: encryptAES("12")
            };


            const response = await fetch('/EmpanelmentDetails', "POST", requestData);

            // Step 1: Decrypt and parse the response
            const decryptedText = decryptAES(response);
            const docs = JSON.parse(decryptedText);
            const parsedInner = JSON.parse(docs.out_result);
            const detaildoc = parsedInner.Table || [];

            // Step 2: Extract base64 document
            const base64Data = detaildoc[0].DOCUMENT;

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
    }
   
}




function clearFormApprove() {
    // Clear dropdown selections
  
    $('#ddltype').val('0').trigger('change');

    // Clear text inputs
    $('#ddlCategory').val('');
    $('#fullName').val('');
    $('#relativeName').val('');
    $('#Residence').val('');
    $('#Ofceadrs').val('');
    $('#gender').val('');
    $('#drp_state').val('');
    $('#drp_dis').val('');
    $('#ocupdtls').val('');
    $('#nation').val('');
    $('#landline').val('');
    $('#mobileNumber').val('');
    $('#whatsappNumber').val('');
    $('#emailInput').val('');
    $('#panNumber').val('');
    $('#sociacnt').val('');
    $('#otherText').val('');
    $('#yearOfInception').val('');
    $('#regnum').val('');
    $('#txtpractice').val('');
    $('#ddlgrade').val('');
    $('#MemNo').val('');
    $('#ref1').val('');
    $('#ref2').val('');
    $('#part1').val('');
    $('#firm').val('');
    $('#caseam').val('');
    $('#rjt_reason').val('');

    // Clear date inputs
    $('#dob').val('');
    $('#empdate').val('');

    // Clear number inputs
    $('input[type="number"]').val('');

    // Uncheck all checkboxes
    $('#chk1, #chk2, #chk3, #chk4, #chk5').prop('checked', false);
    $('#spec1, #spec2, #spec3, #spec4, #spec5, #spec12').prop('checked', false);
    $('#doc1, #doc3, #doc5, #doc7, #doc8').prop('checked', false);
    $('#comp1, #comp3, #comp5, #comp6, #comp7, #comp8, #comp10, #comp11').prop('checked', false);
    $('#part1, #part2, #part3, #part5, #part6, #part7, #part8').prop('checked', false);

    // Clear radio buttons
    $('input[name="regulatory"]').prop('checked', false);

    // Clear partner details
    $('#fname').val('');
    $('#age').val('');
    $('#Pan1').val('');
    $('#adrs1').val('');
    $('#fname1').val('');
    $('#age1').val('');
    $('#Pan2').val('');
    $('#adrs2').val('');

    // Clear bank details
    $('#acholder1, #bnknm1, #acno1, #ifsc1, #actype1, #micr1, #brcode1, #brnm1').val('');
    $('#acholder2, #bnknm2, #acno2, #ifsc2, #actype2, #micr2, #brcode2, #brnm2').val('');

    // Clear additional fields
    $('#jnradv, #othrbranches, #mode').val('');

    // Clear error messages
    $('#errorMessage').hide();
    $('#panError, #pan1Error, #pan2Error').text('');

    // Clear case tables
    $('#caseTableBody').html(`
        <tr>
            <td colspan="3" class="empty-message">
                No case numbers added yet.<br>
                Enter a case number above and click "Add to Table"
            </td>
        </tr>
    `);
    $('#caseCount').text('0');

    $('#caseTypeTableBody').html(`
        <tr>
            <td colspan="3" class="empty-message">
                No case types added yet.<br>
                Enter a case Type above and click "Add to Table"
            </td>
        </tr>
    `);
    $('#caseTypeCount').text('0');

    // Hide reject reason field
    $('#reject').hide();

    // Hide partner details section
    $('#partnerDetails').hide();

    // Clear hidden field
    $('#hiddenField').val('');

    // Optional: Show success message
    // swal("Cleared!", "Form has been cleared successfully.", "success");
}

// Attach to exit button
$('#exit').on('click', function () {
    clearForm();
    // Optional: Add navigation logic
    // window.location.href = '/YourController/YourAction';
});