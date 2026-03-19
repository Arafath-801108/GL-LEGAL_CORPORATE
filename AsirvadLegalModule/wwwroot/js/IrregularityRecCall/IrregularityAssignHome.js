$(document).ready(async function () {

    checkAccess("35");
    _assign.getotherBranchDeatils()
});

$(document).on('change', '#cmb_category1', function () {
    _assign.getBranchDetails();
});

$(document).on('change', '#cmb_branch1', function () {
    _assign.getCustomerDetails();
});

$(document).on('change', '#cmb_custid1', function () {
    _assign.getallDetails();
});

$(document).on('click', '#btn_Confirm', function () {
    _assign.btnsubmitclick();
});

$(document).on('click', '#btn_exit', function () {
    redirectToDashboard();
});



var _assign = {
    
    async getBranchDetails() {
       

        const input_value = document.getElementById("cmb_category1").value 
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(input_value),
            as_optflag: encryptAES("4")
        };
        var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {
            const selectElement = document.getElementById('cmb_branch1');
            selectElement.innerHTML = '';

            outdata = JSON.parse(responseData.outdata);

            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                outdata.Table.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.ID;
                    option.textContent = item.NAME;
                    selectElement.appendChild(option);
                });

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Call reasons.", "warning");
        }
    },
    async getCustomerDetails() {

        const input_value = document.getElementById("cmb_category1").value + "~" + document.getElementById('cmb_branch1').value
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(input_value),
            as_optflag: encryptAES("5")
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
                    option.value = item.ID;
                    option.textContent = item.NAME;
                    selectElement.appendChild(option);
                });

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Call reasons.", "warning");
        }
    },
    async getallDetails() {
        if (document.getElementById("cmb_custid1").value == "-1") {
            window.location.reload();

        }

        var cmbCustId = document.getElementById("cmb_custid1");
        var cmbCategory = document.getElementById("cmb_category1");
        var cmbCall = document.getElementById("cmb_call1");

        var selectedText = cmbCustId.selectedOptions[0].text;
        var parts = selectedText.split("~");
        var seq_id = parts.length > 1 ? parts[1] : "";
        const input_value = `${cmbCustId.value}~${"3"}~${seq_id}~${cmbCategory.value}`

        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(input_value),
                as_optflag: encryptAES("6")
        };
        var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {

            outdata = JSON.parse(responseData.outdata);

            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                var data = outdata.Table[0];
                document.getElementById("txt_custname").value = data.CUST_NAME;
                document.getElementById("txt_state1").value = data.STATE_NAME;
                document.getElementById("txt_cust_ph1").value = data.PHONE1;
                document.getElementById("txt_cust_ph2").value = data.PHONE2;
                document.getElementById("txt_irr1").value = data.TOTAL;
                document.getElementById("txt_amt").value = data.AMOUNT;

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Customer Details.", "warning");
        }
    },
    async getotherBranchDeatils() {
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(""),
            as_optflag: encryptAES("7")
        };

        var Res = await fetch("/getIrregularityCustomer", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {
            const selectElement = document.getElementById('cmb_nearbranch1');
            selectElement.innerHTML = '';

            outdata = JSON.parse(responseData.outdata);
            console.log(outdata);
            if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                outdata.Table.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.ID1;
                    option.textContent = item.BR;
                    selectElement.appendChild(option);
                });

            }
        }
        else {
            await showAlert("Alert!", "Unable to load the Nearest Branch List.", "warning");
        }
    
    },
    async btnsubmitclick() {
        try {
            
            var cmbCategory = document.getElementById("cmb_category1");
            var cmbbr = document.getElementById("cmb_branch1");
            if (cmbCategory.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Category Type", "warning");
                return;
            } else if (cmbbr.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Branch", "warning");
                return;
            }
            var cmbCustId = document.getElementById("cmb_custid1");
            var selectedText = cmbCustId.selectedOptions[0].text;
            var parts = selectedText.split("~");
            var seq_id = parts.length > 1 ? parts[1] : "";
            var cmbnear = document.getElementById("cmb_nearbranch1");

            if (cmbCustId.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Customer ID", "warning");
                return;
            } else if (cmbnear.selectedIndex === 0) {
                await showAlert("Alert!", "Please Select Near Branch to assign", "warning");
                return;
            }
            
            inputData = `${cmbCustId.value}*${cmbCategory.value}*${cmbnear.value}*${seq_id}`
            home_data = "";
            fileData1 = "";
            fileData2 = "";
            var flag = "2";
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
            debugger;
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
}
