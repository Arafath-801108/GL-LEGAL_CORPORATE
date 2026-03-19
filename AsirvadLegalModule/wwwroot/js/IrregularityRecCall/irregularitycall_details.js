
$(document).ready(async function () {

    checkAccess("33");
    _irr.getCallReasons();
    
});

$(document).on('change', '#cmb_category1', function () {
    _irr.getcategoryDetails();
});

$(document).on('change', '#cmb_call1', function () {
    _irr.getCallDetails();
});

$(document).on('change', '#cmb_custid1', function () {
    _irr.getCustomerDetails();
});

$(document).on('click', '#rad_yes', function () {
    _irr.callradioclick();
});

$(document).on('click', '#rad_no', function () {
    _irr.callradioclick();
});

$(document).on('click', '#btn_exit', function () {
    redirectToDashboard();
});

$(document).on('click', '#btn_Confirm', function () {
    _irr.btnSubmitclick();
});

$(document).on('change', '#txt_date', function () {
    _irr.validateDates();
});

$(document).on('input', '#txt_amt', function () {
    this.value = this.value.replace(/[^0-9\s()]/g, '');
});

$(document).on('input', '#txt_cust_ph2', function () {
    this.value = this.value.replace(/[^0-9\s()]/g, '');
});

$(document).on('input', '#txt_cust_ph1', function () {
    this.value = this.value.replace(/[^0-9\s()]/g, '');
});

$(document).on('change', '#fileInput1', function () {
    UploadFN(this);
});

$(document).on('change', '#FileUpload2', function () {
    UploadFN(this);
});

var _irr = {
    async getCallReasons() {
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(""),
            as_optflag: encryptAES("1")
        };
        var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {
            const selectElement = document.getElementById('cmb_attended_sts1');
            selectElement.innerHTML = '';

            outdata = JSON.parse(responseData.outdata);

            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                outdata.Table.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.ID1;
                    option.textContent = item.REASON;
                    selectElement.appendChild(option);
                });

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Call reasons.", "warning");
        }
    },
    async getcategoryDetails() {
        
        if (document.getElementById("cmb_category1").value == "-1") {
            window.location.reload();

        }
        else {
            const cmbCall1 = document.getElementById("cmb_call1");
            cmbCall1.value = "-1";
            _irr.allClear();

            const callSelect = document.getElementById("cmb_call1").value;
            if (callSelect == 1 || callSelect == 2) {
                div_call.style.display = "block";
                div_home.style.display = "none";
            }
            else if (callSelect == 3) {
                div_call.style.display = "none";
                div_home.style.display = "block";
            }
            else {
                div_call.style.display = "none";
                div_home.style.display = "none";
            }
        }

    },
    async getCallDetails() {

        if (document.getElementById("cmb_call1").value == "-1") {
            window.location.reload();

        }
        else {
            _irr.allClear();

        }
        const callSelect = document.getElementById("cmb_call1").value;
        if (callSelect == 1 || callSelect == 2) {
            div_call.style.display = "block";
            div_home.style.display = "none";
        }
        else if (callSelect == 3) {
            div_call.style.display = "none";
            div_home.style.display = "block";
        }
        else {
            div_call.style.display = "none";
            div_home.style.display = "none";
        }
        const input_value = document.getElementById("cmb_category1").value + "~" + document.getElementById("cmb_call1").value;

        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(input_value),
            as_optflag: encryptAES("2")
        };
        var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {
            const selectElement = document.getElementById('cmb_custid1');
            selectElement.innerHTML = '';

            outdata = JSON.parse(responseData.outdata);

            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                outdata.Table.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.ID1;
                    option.textContent = item.CUS;
                    selectElement.appendChild(option);
                });

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Customer List.", "warning");
        }
    },
    async getCustomerDetails() {
        
        if (document.getElementById("cmb_custid1").value == "-1") {
            _irr.allClear();

        }
        else {
            var cmbCustId = document.getElementById("cmb_custid1");
            var cmbCategory = document.getElementById("cmb_category1");
            var cmbCall = document.getElementById("cmb_call1");

            var selectedText = cmbCustId.selectedOptions[0].text;
            var parts = selectedText.split("~");
            var seq_id = parts.length > 1 ? parts[1] : "";
            const input_value = `${cmbCustId.value}~${cmbCall.value}~${seq_id}~${cmbCategory.value}`
            
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(input_value),
                as_optflag: encryptAES("3")
            };
            var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {

                outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    var data = outdata.Table[0];
                    document.getElementById("txt_custname").value = data.CUST_NAME;
                    document.getElementById("txt_cust_ph1").value = data.PHONE1;
                    document.getElementById("txt_cust_ph2").value = data.PHONE2;
                    document.getElementById("txt_amt").value = data.AMOUNT;

                }
            }
            else {
                await showAlert("Alert!", "Unable to load the Customer Details.", "warning");
            }
        }
    },
    async callradioclick() {
        const yesRadio = document.querySelector('input[value="Yes"]');
        const noRadio = document.querySelector('input[value="No"]');

        if (yesRadio.checked == true) {
            document.getElementById("txt_cust_response1").value = "";
            document.getElementById("txt_rmrks").value = "";
            div_res.style.display = "block";
            div_reason.style.display = "none";
        }
        else if (noRadio.checked == true) {
            document.getElementById("cmb_attended_sts1").value = -1;
            document.getElementById("txt_rmrks").value = "";
            div_res.style.display = "none";
            div_reason.style.display = "block";
        }

    },
    async btnSubmitclick() {
        try {
           
            var cmbCategory = document.getElementById("cmb_category1");
            var cmbCall = document.getElementById("cmb_call1");
            if (cmbCategory.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Category Type", "warning");
                return;
            } else if (cmbCall.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Call Type", "warning");
                return;
            }
            var cmbCustId = document.getElementById("cmb_custid1");
            var selectedText = cmbCustId.selectedOptions[0].text;
            var parts = selectedText.split("~");
            var seq_id = parts.length > 1 ? parts[1] : "";
            var radYes = document.getElementById("rad_yes");
            var radNo = document.getElementById("rad_no");
            var cus_res = document.getElementById("txt_cust_response1");
            var reason = document.getElementById("cmb_attended_sts1");
            var remark = document.getElementById("txt_rmrks");
            var radRent = document.getElementById("rad_rent");
            var radOwn = document.getElementById("rad_own");
            var radYesHome = document.getElementById("rad_yes_home");
            var radNoHome = document.getElementById("rad_no_home");
            var cmbSts = document.getElementById("cust_sts1");
            var txtHomeRmrk = document.getElementById("txt_home_rmrk");
            var fileUpload1 = document.getElementById("fileInput1");
            var fileUpload2 = document.getElementById("fileInput2");
            var commdate = document.getElementById("txt_date");


            if (cmbCustId.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Customer ID", "warning");
                return;
            }
            else if (cmbCall.value === "1" || cmbCall.value === "2") {
                if (!radYes.checked && !radNo.checked) {
                    await showAlert("Alert!", "Please Select Call Attended Status", "warning");
                    return;
                }
                else if (radYes.checked && cus_res.value === "") {
                    await showAlert("Alert!", "Please Enter Customer Response After Attend Call", "warning");
                    return;
                }
                else if (radNo.checked && reason.selectedIndex === 0) {

                    await showAlert("Alert!", "Please Select Call Not Attended Reason", "warning");
                    return;
                }
                else if (remark.value === "") {
                    await showAlert("Alert!", "Please Enter Call Remarks", "warning");
                    return;
                }
            }
            else if (cmbCall.value === "3") {
                if (!radRent.checked && !radOwn.checked) {
                    await showAlert("Alert!", "Please select rent status", "warning");
                    return;
                }

                else if (!radYesHome.checked && !radNoHome.checked) {
                    await showAlert("Alert!", "Please select ownership status", "warning");
                    return;
                }
                else if ((!fileUpload1.value) && (!fileUpload2.value)) {
                    await showAlert("Alert!", "Please Upload Documnet!!!", "warning");
                    return;
                }
                else if (cmbSts.selectedIndex === 0) {
                    await showAlert("Alert!", "Please Select Customer Status", "warning");
                    return;
                }
                else if (commdate.value === "") {
                    await showAlert("Alert!", "Please Select the Date", "warning");
                    return;
                }
                else if (txtHomeRmrk.value === "") {
                    await showAlert("Alert!", "Please Enter Remarks", "warning");
                    return;
                }
                
                const allowedExtensions = ["pdf", "docx", "xlsx", "xls", "doc"];

                if (fileUpload1.value || fileUpload2.value) {
                    const files = [
                        { element: fileUpload1, inputId: "fileInput1" },
                        { element: fileUpload2, inputId: "fileInput2" }
                    ];

                    for (const file of files) {
                        if (file.element && file.element.value) {
                            const filePath = file.element.value;
                            const fileExtension = filePath.trim().toLowerCase().split('.').pop();

                            if (!allowedExtensions.includes(fileExtension)) {
                                await showAlert(
                                    "Alert!",
                                    "Only PDF, Word (.doc, .docx), and Excel (.xls, .xlsx) files are allowed!",
                                    "warning"
                                );
                                document.getElementById(file.inputId).value = "";
                                return;
                            }
                        }
                    }
                }

                else if (cmbSts.selectedIndex === 0) {
                    await showAlert("Alert!", "Please Select Customer Status", "warning");
                    return;
                }
                else if (txtHomeRmrk.value.trim() === "") {
                    await showAlert("Alert!", "Please enter home visit remarks", "warning");
                    return;
                }
            }
            let sts = (radYes.checked || cmbCall.value === "3") ? 1 : 0;
            let attend_sts = (reason.value === "-1") ? 0 : parseInt(reason.value);
            let owner_sts = 0;
            let home_sts = 0;
            let home_data = "";
            fileData1 = "";
            fileData2 = "";
            if (cmbCall.value === "3") {
                debugger;
                home_sts = radOwn.checked ? 1 : 0;
                home_sts = radRent.checked ? 0 : 1;

                owner_sts = radYesHome.checked ? 1 : 0;
                owner_sts = radNoHome.checked ? 0 : 1;

                
                const document1 = document.getElementById('fileInput1');
                const document2 = document.getElementById('fileInput2');
                const filePath1 = fileUpload1.value
                const filePath2 = fileUpload2.value;
                const fileExtension1 = filePath1.trim().toLowerCase().split('.').pop();
                const fileExtension2 = filePath2.trim().toLowerCase().split('.').pop();
                let img1, img2;

                // Read file 1 only if present
                if (document1 && document1.files && document1.files[0]) {
                    img1 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64String = e.target.result.split(',')[1];
                            if (!base64String) {
                                reject(new Error('Invalid Base64 string for file 1'));
                            }
                            resolve(base64String);
                        };
                        reader.onerror = () => reject(new Error('Failed to read file 1'));
                        reader.readAsDataURL(document1.files[0]);
                    });
                }

                // Read file 2 only if present
                if (document2 && document2.files && document2.files[0]) {
                    img2 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64String = e.target.result.split(',')[1];
                            if (!base64String) {
                                reject(new Error('Invalid Base64 string for file 2'));
                            }
                            resolve(base64String);
                        };
                        reader.onerror = () => reject(new Error('Failed to read file 2'));
                        reader.readAsDataURL(document2.files[0]);
                    });
                }
                const ext1 = fileExtension1 || "NIL";
                const ext2 = fileExtension2 || "NIL"; 
                debugger;
                home_data = `${home_sts}~${owner_sts}~${txtHomeRmrk.value}~${cmbSts.value}`;
                var flag = "3";
                inputData = `${cmbCustId.value}*${cmbCall.value}*${sts}*${""}*${""}*${""}*${cmbCategory.value}*${""}*${""}*${seq_id}*${commdate.value}*${ext1}*${ext2}`
                fileData1 = `${img1 ?? ''}`;
                fileData2 = `${img2 ?? ''}`;

            }
            else if (cmbCall.value === "1" || cmbCall.value === "2") {

                home_data = "";
                var flag = "1";
                inputData = `${cmbCustId.value}*${cmbCall.value}*${sts}*${cus_res.value}*${attend_sts}*${remark.value}*${cmbCategory.value}*${""}*${""}*${seq_id}*${""}`
                fileData1 = "";
                fileData2 = "";
            }


            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(inputData + "|" + home_data + "|" + fileData1 + "|" + fileData2),
                as_optflag: encryptAES(flag)
            };
            var Res = await fetch("/IrregularityConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            
            if ((responseData).err_code == "1") {
                await showLoadAlert("Success!", "Confirmed Successfully", "success");

            }
            else {
                await showLoadAlert("Alert!", "Failed..", "warning");

            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");

        }
    },
    async validateDates(){ 
       
        const fromdtElement = document.getElementById("txt_date");
        const fromdt = fromdtElement.value;
        const fromDate = new Date(fromdt);
            const today = new Date();


     if (fromDate < today) {
    await showAlert("Alert!", "Future dates are only allowed....", "warning");
    fromdtElement.value = "";
    todtElement.value = "";
    return false;
        }

        return true; // Validation passed
    },
    allClear: async function () {
       
        const selectElement = document.getElementById('cmb_custid1');
        selectElement.innerHTML = '';
       
        document.getElementById("txt_custname").value = "";
        document.getElementById("txt_cust_ph1").value = "";
        document.getElementById("txt_cust_ph2").value = "";
        document.getElementById("txt_amt").value = "";
        const yesRadio = document.querySelector('input[value="Yes"]');
        const noRadio = document.querySelector('input[value="No"]');

        yesRadio.checked = false;
        noRadio.checked = false;
        document.getElementById("cmb_attended_sts1").value = -1;
        document.getElementById("txt_rmrks").value = "";
        document.getElementById("txt_cust_response1").value = "";

        var radRent = document.getElementById("rad_rent");
        var radOwn = document.getElementById("rad_own");
        var radYesHome = document.getElementById("rad_yes_home");
        var radNoHome = document.getElementById("rad_no_home");

        radRent.checked = false;
        radOwn.checked = false;
        radYesHome.checked = false;
        radNoHome.checked = false;

        var fileUpload1 = document.getElementById("fileInput1");
        var fileUpload2 = document.getElementById("fileInput2");
        var commdate = document.getElementById("txt_date"); 

        fileUpload1.value = "";
        fileUpload2.value = "";
        commdate.value = "";
        document.getElementById("txt_home_rmrk").value = "";
        document.getElementById("cust_sts1").value = -1;

    }

}