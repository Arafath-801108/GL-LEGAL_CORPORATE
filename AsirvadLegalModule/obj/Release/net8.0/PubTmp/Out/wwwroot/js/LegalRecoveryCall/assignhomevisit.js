$(document).ready(async function () {
    
    checkAccess("27");
    _assign.LoadEmployees();
});

$(document).on('click', '#drp_near', function () {
    _assign.LoadOtherBranchDetails(this);
});

$(document).on('change', '#DropDownList2', function () {
    Challan_Ah.getPledgeDetails();
});
$(document).on('click', '#drp_emp', function () {
    _assign.LoadEmployeeDetails(this);
});

$(document).on('change', '#DropDownList2', function () {
    Challan_Ah.getPledgeDetails();
});

var _assign = {

    async LoadEmployees()
    {
        
        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: "",
                as_optflag: encryptAES("8")
            };

            var Res = await fetch("/EmployeeGetDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('drp_emp');
                selectElement.innerHTML = '';

                outdata = JSON.parse(responseData.outdata);
              
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID1;
                        option.textContent = item.EMP;
                        selectElement.appendChild(option);
                    });

                }
            }
            else {
                await showAlert("Alert!", "Unable to load the Employee List.", "warning");
            }
        }
        catch
        {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },

    async LoadEmployeeDetails() {
       
        if (document.getElementById("drp_emp").value == "-1") {
            window.location.reload();

        }
        else
        {
            document.getElementById("drp_near").value = "-1"
            document.getElementById("branch-id").value = "";
            document.getElementById("branch-zone").value = "";
            document.getElementById("branch-region").value = "";
            document.getElementById("branch-area").value = "";
            document.getElementById("remarks").value = "";
            try {

                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_indata: encryptAES(document.getElementById('drp_emp').value),
                    as_optflag: encryptAES("9")
                };

                var Res = await fetch("/EmployeeGetDetails", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {

                    outdata = JSON.parse(responseData.outdata);
                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        var data = outdata.Table[0];
                        document.getElementById("employee-name").value = data.EMP_NAME;
                        document.getElementById("zone").value = data.ZONAL_NAME;
                        document.getElementById("region").value = data.REG_NAME;
                        document.getElementById("area").value = data.AREA_NAME;
                        document.getElementById("resigned-branch").value = data.BRANCH_NAME;
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
                        const requestData = {
                            employeeId: sessionStorage.getItem("EmployeeId"),
                            token: sessionStorage.getItem("Token"),
                            branch: sessionStorage.getItem("BranchId"),
                            p_indata: "",
                            as_optflag: encryptAES("10")
                        };

                        var Res = await fetch("/EmployeeGetDetails", "POST", requestData);
                        Res = decryptAES(Res);
                        const responseData = JSON.parse(Res);
                        if (responseData.err_code === "1") {
                            const selectElement = document.getElementById('drp_near');
                            selectElement.innerHTML = '';

                            outdata = JSON.parse(responseData.outdata);
                          
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
                    }

                }
                else {
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            }
       
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
            }
        }
    },

    async LoadOtherBranchDetails() {
        if (document.getElementById("drp_near").value == "-1") {
            
            document.getElementById("branch-id").value ="";
            document.getElementById("branch-zone").value = "";
            document.getElementById("branch-region").value = "";
            document.getElementById("branch-area").value = "";
            document.getElementById("remarks").value = "";
        }
        else {
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_indata: encryptAES(document.getElementById('drp_near').value),
                    as_optflag: encryptAES("11")
                };

                var Res = await fetch("/EmployeeGetDetails", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {


                    outdata = JSON.parse(responseData.outdata);
                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        var data = outdata.Table[0];

                        document.getElementById("branch-id").value = data.BRANCH_ID;
                        document.getElementById("branch-zone").value = data.ZONAL_NAME;
                        document.getElementById("branch-region").value = data.REG_NAME;
                        document.getElementById("branch-area").value = data.AREA_NAME;

                    }

                }
                else {
                    await showAlert("Alert!", "Unable to load the Branch Details..", "warning");
                }
            }
            catch
            {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },

    async btnSubmitClick() {
        try {
           
            const empSelect = document.getElementById("drp_emp").value;
            const branchSelect = document.getElementById("drp_near").value;
            const remarks = document.getElementById("remarks").value;
            const branchId = document.getElementById("branch-id").value;

            if (empSelect == -1 || empSelect == "") {
                await showAlert("Alert!", "Please Select Employee Code !!!", "warning");
                return
            } else if (branchSelect == -1 || branchSelect == "") {
                await showAlert("Alert!", "Please Select Branch to assign!!!", "warning");
                return
            } else if (remarks === "") {
                await showAlert("Alert!", "Please Enter remarks!!!", "warning");
                return
            }
            else {
                const input_value = empSelect + "~" + branchId + "~" + remarks;
              
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    p_indata: encryptAES(input_value),
                    as_optflag: encryptAES("2")
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
}