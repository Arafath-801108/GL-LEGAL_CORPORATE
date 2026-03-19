var branchId, callId,type;
$(document).ready(async function () {

    function getQueryParam(param) {
       var urlParams = new URLSearchParams(window.location.search);
       return urlParams.get(param);
    }

    branchId = getQueryParam('branch');
    callId = Number(getQueryParam('call'));
    
    _employee.LoadCallDetails();
});

$(document).on('change', '#employee-id', function () {
    _employee.LoadEmployeeDetails(this);
});

$(document).on('click', '#radioyes', function () {
    _employee.toggleSections();
});

$(document).on('click', '#radiono', function () {
    _employee.toggleSections();
});

$(document).on('click', '#confirm-btn', function () {
    _employee.ButtonConfirmClick(this);
});

$(document).on('click', '#exit-btn', function () {
    _employee.ExitClick(this);
});

var _employee = {
    async LoadCallDetails()
    {
       
        let requestData1;
        try {
            if (callId === 0) 
            {
                 requestData1 = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                     branch: sessionStorage.getItem("BranchId"),
                     p_indata: encryptAES(branchId + "~" + callId),
                     as_optflag: encryptAES("5")
                };
            }
            else {
                 requestData1 = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                     branch: sessionStorage.getItem("BranchId"),
                     p_indata: encryptAES(branchId + "~" + callId),
                     as_optflag: encryptAES("6")
                };
            }
            var Res = await fetch("/EmployeeGetDetails", "POST", requestData1);

            Res = decryptAES(Res);
            const responseData1 = JSON.parse(Res);
            if (responseData1.err_code === "1") {
                const selectElement = document.getElementById('employee-id');
                selectElement.innerHTML = '';

                outdata = JSON.parse(responseData1.outdata);
               
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
                await showAlert("Alert!", "Unable to load the Employee List .", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },

    async LoadEmployeeDetails() {
        if (document.getElementById("employee-id").value =="-1") {
            window.location.reload();
            
        }
        responsesection.style.display = "none";
        responseinput.style.display = "none";
        reasonsection1.style.display = "none";
        reasoninput1.style.display = "none";
        const yesRadio = document.querySelector('input[value="yes"]');
        const noRadio = document.querySelector('input[value="no"]');
        yesRadio.checked = false;
        noRadio.checked = false;
        try {
           
               const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                   branch: sessionStorage.getItem("BranchId"),
                   p_indata: encryptAES(document.getElementById('employee-id').value),
                   as_optflag: encryptAES("7")
                };
            
         var Res = await fetch("/EmployeeGetDetails", "POST", requestData);

            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
           
            if (responseData.err_code === "1")
            {
                
                outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    var data = outdata.Table[0];
                    document.getElementById("employee-name").value = data.EMP_NAME;
                    document.getElementById("phone1").value = data.RES_PHONE;
                    document.getElementById("phone2").value = data.CONT_PHONE;
                    document.getElementById("amount").value = data.AMOUNT;

                    
                    const tableBody = document.getElementById("gridView1")?.querySelector("tbody");
                    if (tableBody) {
                        tableBody.innerHTML = "";
                        outdata.Table.forEach((rowData, x) => {
                            const row = document.createElement("tr");
                            const columns = [
                                rowData.FATHER_NAME,
                                rowData.PERM_ADD1,
                                rowData.LANDMARK,
                                rowData.POST_OFFICE,
                                rowData.DISTRICT_NAME,
                                rowData.STATE_NAME,
                                rowData.PIN_CODE
                            ];
                            for (let i = 0; i < 7; i++) {
                                const cell = document.createElement("td");
                                cell.textContent = columns[i] ?? "N/A";
                                row.appendChild(cell);
                            }
                            tableBody.appendChild(row);
                        });
                    }

                }


            }
            else {
                await showAlert("Alert!", "Unable to load the Employee Details .", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },

    async toggleSections()
    {
        
        const yesRadio = document.querySelector('input[value="yes"]');
        const noRadio = document.querySelector('input[value="no"]');
       

    
        if (yesRadio.checked)
        {
            type = 1;
            document.getElementById("reason").value = "-1";
            responsesection.style.display = "flex";
            responseinput.style.display = "flex";
            reasonsection1.style.display = "none";
            reasoninput1.style.display = "none";
        }
        else if (noRadio.checked)
        {
            type = 0;
            document.getElementById("response").value = "";
            responsesection.style.display = "none";
            responseinput.style.display = "none";
            reasonsection1.style.display = "flex";
            reasoninput1.style.display = "flex";
        }
    },

    async ButtonConfirmClick() {
       
        const yesRadio = document.querySelector('input[value="yes"]');
        const noRadio = document.querySelector('input[value="no"]');
        
        const employeeIdElement = $("#employee-id option:selected").val()

        try {

            if (document.getElementById("employee-id").selectedIndex == 0)
            {
                await showAlert("Alert!", "SPlese Select Employee Code !!!", "warning");
                return;
            }
            else if (yesRadio.checked == false && noRadio.checked == false)
            {
                await showAlert("Alert!", "Plese Select Call attended!!!", "warning");
                return;
            }
            else if (yesRadio.checked == true && document.getElementById("response").value == "" )
            {
               
                    await showAlert("Alert!", "Please enter Customer Response!!!", "warning");
                
                
            }
            else if (noRadio.checked == true && document.getElementById("reason").value == "-1")
            {
                
                    await showAlert("Alert!", "Please select Reason!!!", "warning");
                    return;
                
                
            }


            else {
               
                const response1 = document.getElementById("response").value;
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    p_indata: encryptAES("" + "~" + type + "~" + response1 + "~" + reason.value + "~" + employeeIdElement),
                    as_optflag: encryptAES("1")
                };
           

                var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
               

                if ((responseData).err_sts == "111") {
                    await showLoadAlert("Success!", "Confirmed Successfully", "success");

                }
                else {
                    await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");

                }
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
            
        }

    },

    async ExitClick() {
        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';
        window.location.href = liveurl + '/RecoveryCallHO/RecoveryCallHO';
    }
    
}