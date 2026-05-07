$(document).ready(async function () {
    btnExit.style.display = "flex";
    checkAccess("15");
    _Removal.LoadLegalID();

});

$(document).on('change', '#ddllegalid', function () {
    _Removal.Pledge_Details(this);
});

$(document).on('click', '#btnExit', function () {
    redirectToDashboard();
});

$(document).on('click', '#chkSelectAll', function () {
    _Removal.setupSelectAll();
});
$(document).on('click', '#btnExit2', function () {
    redirectToDashboard();
});

$(document).on('click', '#btnRemove', function () {
    _Removal.RemovalSubmit();
});
var _Removal = {
   
    async LoadLegalID() {
        
        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(""),
                p_indata: encryptAES("FORAPPROVAL" + "~" + "" + "~" + 0 + "~" + "" + "~" + "" + "~" + ""),
                 as_optflag: encryptAES(""),
            };

            var Res = await fetch("/GetDetailsRemovals", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1")
            {
                const selectElement = document.getElementById('ddllegalid');
                selectElement.innerHTML = '';

                outdata = JSON.parse(responseData.outdata);
                
                if (outdata && outdata.Table.Table && Array.isArray(outdata.Table.Table) && outdata.Table.Table.length > 0) {
                    outdata.Table.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.LEGALID; // Set the value of the option
                        option.textContent = item.LEGAL; // Set the display text of the option
                        selectElement.appendChild(option); // Append to the select element
                    });
                }
                else {

                }
              
            }
            else {
                await showAlert("Alert!", "Unable to load the LegalIds.", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            
        }
    },
    async Pledge_Details() {
        
        if (document.getElementById("ddllegalid").value == "1") {
            const gridView = document.getElementById('GridView1');
            while (gridView.rows.length > 1) {
                gridView.deleteRow(1); 
            }
            div_pledge.style.display = "none";
            div_btn.style.display = "none";
        }
        else
        {
            try
            {

                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: encryptAES(""),
                    p_indata: encryptAES("FORAPPROVALDTL" + "~" + "" + "~" + 0 + "~" + document.getElementById('ddllegalid').value + "~" + "" + "~" + ""),
                    as_optflag: encryptAES(""),
                };

                var Res = await fetch("/GetDetailsRemoval", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {
                    btnExit.style.display = "none";
                    outdata = JSON.parse(responseData.outdata);
                    div_pledge.style.display = "flex";
                    div_btn.style.display = "flex";
                    const tbody = document.querySelector("#GridView1 tbody");

                    tbody.innerHTML = "";

                    outdata.Table.Table.forEach((item, index) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
            <td>${item.PLEDGE_NO}</td>
            <td>${item.LEGAL_ID}</td>
            <td>${item.COMPLAINT}</td>
            <td>${item.CASE_NO}</td>
            <td><input type="checkbox" id="chkSelect_${index}" class="chkItem" /></td>
        `;
                        tbody.appendChild(row);
                    });
                }
                else {
                    await showAlert("Alert!", "Please check the legal id..", "warning");
                }
            }
            catch {
                await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
                
            }
        }
    },
    async setupSelectAll() {
        const chkSelectAll = document.querySelector("#chkSelectAll");
        if (chkSelectAll) {
            chkSelectAll.addEventListener("change", function () {
                const chkItems = document.querySelectorAll(".chkItem");
                chkItems.forEach(chk => {
                    chk.checked = chkSelectAll.checked;
                });
            });
        }
    },
    async RemovalSubmit() {
        try {
            if (document.getElementById("ddllegalid").value == "1") {
                await showAlert("Alert!", "Please select the legal id..", "warning");
                return;
            }
            else {
                
                const pledges = await _Removal.processSelectedRows();
                if (!pledges) {
                    await showAlert("Alert!", "No pledges selected. Please select at least one pledge..", "warning");
                    return;  
                }
                else {
                    const requestData = {
                        employeeId: sessionStorage.getItem("EmployeeId"),
                        token: sessionStorage.getItem("Token"),
                        branch: encryptAES(""),
                        p_indata: encryptAES("NA" + "!" + sessionStorage.getItem("EmployeeId") + "!" + sessionStorage.getItem("BranchId") + "!" + "NA" + "!" + "APPROVE_REMOVE" + "!" + "NA"),
                        as_optflag: encryptAES(pledges)
                    };

                    var Res = await fetch("/RemovalApprDetails", "POST", requestData);
                    Res = decryptAES(Res);
                    const responseData = JSON.parse(Res);
                    if (responseData.status === "True") {
                        await showLoadAlert("Success!", "Approved Removal Request", "success");
                    }

                    else {
                        await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                        return;
                    }
                }
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");    
        }
    },
    async processSelectedRows() {
        
        let pledges = '';
        const rows = document.querySelectorAll('#GridView1 tbody tr');

        rows.forEach(row => {
         const checkbox = row.querySelector('input[type="checkbox"][class="chkItem"]');
         if (checkbox && checkbox.checked) {
        const cells = row.querySelectorAll('td');
        const pledgeNo = cells[0].textContent.trim();
        const legalId = cells[1].textContent.trim();
        pledges += (pledges ? '' : '') + pledgeNo + '^' + legalId + '~';
                }
        });

        return pledges;
    }
}