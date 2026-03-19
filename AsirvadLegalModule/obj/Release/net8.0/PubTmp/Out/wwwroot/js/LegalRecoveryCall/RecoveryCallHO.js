$(document).ready(async function () {
    checkAccess("26");
   
});

$(document).on('change', '#drp_callType', function () {
    _Recovery.LoadZonalDropdown(this);
});

$(document).on('change', '#drp_zone', function () {
    _Recovery.LoadRegionDropdown(this);
});
$(document).on('change', '#drp_region', function () {
    _Recovery.LoadAreaDropdown(this);
});
$(document).on('change', '#drp_area', function () {
    _Recovery.LoadBranchDropdown(this);
});

$(document).on('click', '#btnsubmit', function () {
    _Recovery.ButtonGoClick(this);
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});


var _Recovery = {
    async clearDropdown(id) 
    {
        const element = document.getElementById(id);
        if (element)
        {
             element.innerHTML = "";
        };
    },

    async LoadZonalDropdown() {

        if (document.getElementById("drp_callType").selectedIndex === 0) {
           _Recovery.clearDropdown("drp_zone");
            _Recovery.clearDropdown("drp_region");
            _Recovery.clearDropdown("drp_area");
            _Recovery.clearDropdown("drp_branch");
        }
        else {
            _Recovery.clearDropdown("drp_region");
            _Recovery.clearDropdown("drp_area");
            _Recovery.clearDropdown("drp_branch");
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_indata: "",
                    as_optflag: encryptAES("1")
                };

                var Res = await fetch("/GetRecoverycallDetailsHO", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {
                    const selectElement = document.getElementById('drp_zone');
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
                    await showAlert("Alert!", "Unable to load the Zonal List.", "warning");
                }
            }
            catch
            {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },
    
    async LoadRegionDropdown() {
       
        if (document.getElementById("drp_zone").selectedIndex === 0) {
            _Recovery.clearDropdown("drp_region");
            _Recovery.clearDropdown("drp_area");
            _Recovery.clearDropdown("drp_branch");
        }
        else {
            _Recovery.clearDropdown("drp_area");
            _Recovery.clearDropdown("drp_branch");
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_indata: encryptAES(document.getElementById('drp_zone').value),
                    as_optflag: encryptAES("2")
                };

                var Res = await fetch("/GetRecoverycallDetailsHO", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {
                    const selectElement = document.getElementById('drp_region');
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
                    await showAlert("Alert!", "Unable to load the Region List.", "warning");
                }
            }
            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
        },

    async LoadAreaDropdown() {
        if (document.getElementById("drp_region").selectedIndex === 0) {
            _Recovery.clearDropdown("drp_area");
            _Recovery.clearDropdown("drp_branch");
        }
        else {
            _Recovery.clearDropdown("drp_branch");
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_indata: encryptAES(document.getElementById('drp_region').value),
                    as_optflag: encryptAES("3")
                };

                var Res = await fetch("/GetRecoverycallDetailsHO", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {
                    const selectElement = document.getElementById('drp_area');
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
                    await showAlert("Alert!", "Unable to load the Area List.", "warning");
                }
            }
            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },

    async LoadBranchDropdown() {
        const dropdown = document.getElementById('drp_area');
        const selectedIndex = dropdown.selectedIndex;
        if (selectedIndex == "0") {
            document.getElementById('drp_branch').innerHTML = '';
        }
        else {
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_indata: encryptAES(document.getElementById('drp_area').value + "~" + selectedIndex),
                    as_optflag: encryptAES("4")
                };

                var Res = await fetch("/GetRecoverycallDetailsHO", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {
                    const selectElement = document.getElementById('drp_branch');
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
                    await showAlert("Alert!", "Unable to load the Branch List.", "warning");
                }
            }
            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },

    async ButtonGoClick()
    {
      
        if (document.getElementById("drp_callType").selectedIndex === 0) {
            await showAlert("Alert!", "Please Select Call type!!!", "warning");
            return;
        } else if (document.getElementById("drp_zone").selectedIndex === 0) {
            await showAlert("Alert!", "Please Select Zone!!!", "warning");
            return;
        } else if (document.getElementById("drp_region").selectedIndex === 0) {
            await showAlert("Alert!", "Please Select Region!!!", "warning");
            return;
        } else if (document.getElementById("drp_area").selectedIndex === 0) {
            await showAlert("Alert!", "Please Select Area!!!", "warning");
            return;
        } else if (document.getElementById("drp_branch").selectedIndex === 0) {
            await showAlert("Alert!", "Please Select Branch!!!", "warning");
            return;
        }
        else {
            const br = document.getElementById('drp_branch').value;
            const call = document.getElementById('drp_callType').value;
            const isDevelopment = window.location.hostname === 'localhost';
            const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';
            window.location.href = liveurl + `/RecoveryCallDetail/RecoveryCallDetail?branch=${encodeURIComponent(br)}&call=${encodeURIComponent(call)}`;

        }

    },

}