document.addEventListener("DOMContentLoaded", async function () {
    checkAccess("52");
    try {
        // Load branches
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_indata: encryptAES(""),
            as_optflag: encryptAES("1")
        };

        let Res = await fetch("/GetBranches", "POST", requestData);
        Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData == "666") {
            await showLoadAlert("Alert!", "No data found..!!", "warning");
            return;
        }

        const branchSelect = document.getElementById("branchId");
        const irrSelect = document.getElementById("irrCode");

        branchSelect.innerHTML = "<option value=''>-- Select Branch --</option>";
        responseData.forEach(branch => {
            branchSelect.innerHTML += `<option value="${branch.BRANCH_ID}">${branch.BRANCH_NAME}</option>`;
        });

        // Branch change → load irregularity codes
        branchSelect.addEventListener("change", async function () {
            const branchId = branchSelect.value;
            if (!branchId) return;

            const requestData1 = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(branchId),
                p_indata: encryptAES(""),
                as_optflag: encryptAES("2")
            };

            let custRes = await fetch("/GetIrrCodes", "POST", requestData1);
            custRes = decryptAES(custRes);
            const customers = JSON.parse(custRes);

            irrSelect.innerHTML = "<option value=''>-- Select irregularity Code --</option>";
            customers.forEach(cust => {
                irrSelect.innerHTML += `<option value="${cust.IRR_CODE}">${cust.IRR_CODE}</option>`;
            });
        });

        // Irregularity change → load pledge details
        irrSelect.addEventListener("change", async function () {
            const irrCode = irrSelect.value;
            if (!irrCode) return;

            const requestData2 = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                irrCode: encryptAES(irrCode),
                p_indata: encryptAES(""),
                as_optflag: encryptAES("3")
            };

            let custRes = await fetch("/GetIrrCustomerDetails", "POST", requestData2);
            custRes = decryptAES(custRes);
            const customers = JSON.parse(custRes);

            if (customers.length > 0) {
                const cust = customers[0];
                document.getElementById("customerName").value = cust.cust_name;
                document.getElementById("customerId").value = cust.cust_id;
                document.getElementById("pledgeNumber").value = cust.pledge_no;
                document.getElementById("irregularityStatus").value = cust.status;
            }
        });

        // Form submit → validation + file upload
        const form = document.getElementById("explainationForm");
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Validation
            const branchId = document.getElementById("branchId").value.trim();
            const irrCode = document.getElementById("irrCode").value.trim();
            const customerName = document.getElementById("customerName").value.trim();
            const customerId = document.getElementById("customerId").value.trim();
            const pledgeNumber = document.getElementById("pledgeNumber").value.trim();
            const irregularityStatus = document.getElementById("irregularityStatus").value.trim();
            const remark = document.getElementById("remark").value.trim();
            const files = document.getElementById("documents").files;

            let missing = [];
            if (!branchId) missing.push("Branch");
            if (!irrCode) missing.push("Irregularity Code");
            if (!customerName) missing.push("Customer Name");
            if (!customerId) missing.push("Customer ID");
            if (!pledgeNumber) missing.push("Pledge Number");
            if (!irregularityStatus) missing.push("Irregularity Status");
            if (!remark) missing.push("Remark");
            if (files.length === 0) missing.push("Document");

            if (missing.length > 0) {
                await showAlert("Alert!", "Please fill in the following fields before submitting:\n- " + missing.join("\n- "), "warning");
                return; // stop submission
            }

            // Handle single file upload
            const file = files[0];
            const fileType = file.type; // MIME type
            const reader = new FileReader();

            reader.onload = async function () {
                const base64File = reader.result.split(",")[1];
                //const postId = sessionStorage.getItem('')
                const requestData3 = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branchId: encryptAES(branchId),
                    irregularityCode: encryptAES(irrCode),
                    customerName: encryptAES(customerName),
                    customerId: encryptAES(customerId),
                    pledgeNumber: encryptAES(pledgeNumber),
                    irregularityStatus: encryptAES(irregularityStatus),
                    remark: encryptAES(remark),
                    documentsBase64: encryptAES(base64File),
                    docType: encryptAES(fileType),
                    as_optflag: encryptAES("4"),
                    
                };

                let res = await fetch("/UpdateModule", "POST", requestData3);
                res = decryptAES(res);
                console.log("Saved:", res);
                if (res === '"SUCCESS"') {
                    form.reset();
                    await showLoadAlert("Success!", "Updated Successfully", "success");
                }
            };

            reader.readAsDataURL(file);
        });

    } catch (error) {
        console.error("Error loading branches:", error);
    }
});
