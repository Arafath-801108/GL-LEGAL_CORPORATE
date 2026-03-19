var empName;
$(document).ready(async function () {
    checkAccess("30");
    
});


$(document).on('click', '#btn1', function () {
    _recovery.searchBtnClick(this);
});

$(document).on('input', '#txt_amt', function () {
    _recovery.validateDecimalInput(this);
});

$(document).on('click', '#btn_Confirm', function () {
    _recovery.btnConfirmClick(this);
});
$(document).on('click', '#btn_exit', function () {
    redirectToDashboard();
});
var _recovery = {

    async searchBtnClick() {
        
        try {

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(document.getElementById('txt_custname').value),
                as_optflag: encryptAES("17")
            };

            var Res = await fetch("/EmployeeGetDetails", "POST", requestData);

            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                
                outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    GridView2.style.display = "flex";
                    var data = outdata.Table[0];
                    document.getElementById("txt_bal").value = data.AMOUNT;
                    const tableBody = document.getElementById("GridView2")?.querySelector("tbody");
                    empName = document.getElementById('txt_custname').value;
                    if (tableBody) {
                        tableBody.innerHTML = ""; 

                      if (outdata?.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                            outdata.Table.forEach(rowData => {
                                const row = document.createElement("tr");

                                const columns = [
                                    rowData.EMP_NAME ?? "N/A",
                                    rowData.BRANCH_NAME ?? "N/A",
                                    rowData.BRANCH_ID ?? "N/A",
                                    rowData.POST_NAME ?? "N/A"
                                ];

                                columns.forEach(col => {
                                    const cell = document.createElement("td");
                                    cell.textContent = col;
                                    row.appendChild(cell);
                                });

                                tableBody.appendChild(row);
                            });

                            document.getElementById("GridView2").style.display = "table";
                        } 
                    }

                }
                else {
                    await showLoadAlert("Alert!", "Please check the employee code...", "warning");
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
    },

    async validateDecimalInput(element) {
        let value = element.value;
        let cleanedValue = value.replace(/[^0-9.]/g, '');
        let parts = cleanedValue.split('.');
        if (parts.length > 2) {
            cleanedValue = parts[0] + '.' + parts.slice(1).join('');
        }

        if (parts.length === 2) {
            cleanedValue = parts[0] + '.' + parts[1].substring(0, 2);
        }

        let decimalIndex = cleanedValue.indexOf('.');
        if (decimalIndex === -1) {
             decimalIndex = cleanedValue.length;
        }
        let integerPartLength = decimalIndex;
            let decimalPartLength = cleanedValue.length - decimalIndex - 1;

       if (integerPartLength > 8) {
           cleanedValue = cleanedValue.substring(0, 10 + decimalPartLength);
        }

        element.value = cleanedValue;
    },
    
    async btnConfirmClick() {
        
        let txtCustName = document.getElementById("txt_custname").value.trim();
        let txtAmt = document.getElementById("txt_amt").value.trim();
        let txtBal = document.getElementById("txt_bal").value.trim();

        let value1 = parseFloat(txtAmt) || 0;
        let value2 = parseFloat(txtBal) || 0;

        let gridView2 = document.getElementById("GridView2");
        let gridCellValue = gridView2 && gridView2.rows.length > 1 ? gridView2.rows[1].cells[2].textContent.trim() : "N/A"; 

        if (txtCustName === "") {
            await showLoadAlert("Alert!", "Please enter employee code!!", "warning");

        } else if (txtCustName !== empName) {
            await showLoadAlert("Alert!", "Please check the Employee Code!!", "warning");

        } else if (txtAmt === "" || txtAmt === "0") {
            document.getElementById("txt_amt").value = "";
            
            await showAlert("Alert!", "Please enter Amount!!", "warning");
            return
        } else if (value1 > value2) {
            document.getElementById("txt_amt").value = "";
            await showAlert("Alert!", "Amount cannot be greater than Balance!!", "warning");
            return
        }
        else {
           
            let inputValue = `${txtCustName}~${gridCellValue}~${txtBal}~${txtAmt}`;

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                p_indata: encryptAES(inputValue),
                as_optflag: encryptAES("6")
            };
            var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if ((responseData).err_sts == "111") {
                await showLoadAlert("Success!", "Confirmed Successfully", "success");

            }
            else {
                await showLoadAlert("Alert!", "Confirmation Failed..", "warning");

            }
        }
        
    }
    
}