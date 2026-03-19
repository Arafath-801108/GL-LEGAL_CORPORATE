$(document).ready(async function () {
    checkAccess("29");
    _verify.LoadEmployee();
});

$(document).on('change', '#employeeCode', function () {
    _verify.LoadEmployeeDetails(this);
});

$(document).on('click', '#btnsubmit', function () {
    _verify.ButtonConfirmClick(this);
});
$(document).on('click', '#btnreject', function () {
    _verify.ButtonRejectClick(this);
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

var _verify = {
    async LoadEmployee() {

        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(""),
                as_optflag: encryptAES("15")
            };

            var Res = await fetch("/GetRecoverycallDetailsHO", "POST", requestData);

            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('employeeCode');
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
       
        if (document.getElementById("employeeCode").value == "-1") {
            window.location.reload();

        }
        else {
            try {
                var imgphoto= "";
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_indata: encryptAES(document.getElementById('employeeCode').value),
                    as_optflag: encryptAES("16")
                };

                var Res = await fetch("/EmployeeGetDetails", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {

                    outdata = JSON.parse(responseData.outdata);
                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        var data = outdata.Table[0];
                        document.getElementById("employeeName").value = data.EMP_NAME;
                        document.getElementById("zone").value = data.ZONAL_NAME;
                        document.getElementById("region").value = data.REG_NAME;
                        document.getElementById("area").value = data.AREA_NAME;
                        document.getElementById("resignedBranch").value = data.BRANCH_NAME;
                        document.getElementById("phone1").value = data.RES_phone;
                        document.getElementById("phone2").value = data.CONT_phone;
                        document.getElementById("amount").value = data.AMOUNT;

                        document.getElementById("visitedEmployeeName").value = data.VISIT_EMP;
                        document.getElementById("branch").value = data.ASSIGN_BRANCH;
                        document.getElementById("date").value = data.VISIT_DT;
                        document.getElementById("rentOwn").value = data.RENTOROWN;
                        document.getElementById("remarks").value = data.VISIT_RMK;
                        
                        const tableBody = document.getElementById("gridview1")?.querySelector("tbody");
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
                        async function handleFileDownload(base64String, filename) {
                            
                            // Validate input
                            if (!base64String || base64String.trim().length < 50) {
                                await showAlert("No document available.");
                                return;
                            }

                            try {
                                // Extract file extension from filename or data.VISIT_PHOTO
                                let fileExtension = '';
                                if (filename && typeof filename === 'string') {
                                    const cleanedFileName = filename.trim().toLowerCase();
                                    const parts = cleanedFileName.split('.');
                                    if (parts.length > 1 && parts[parts.length - 1] !== '') {
                                        fileExtension = parts[parts.length - 1];
                                    }
                                }

                                // Map extensions to MIME types
                                const mimeTypes = {
                                    'jpg': 'image/jpeg',
                                    'jpeg': 'image/jpeg',
                                    'png': 'image/png'
                                };

                                // Default to JPEG if no valid extension is found
                                const mimeType = mimeTypes[fileExtension] || 'image/jpeg';
                                // Ensure filename has an extension
                                const finalFilename = fileExtension && filename.endsWith(`.${fileExtension}`)
                                    ? filename
                                    : `${filename}.${fileExtension || 'jpg'}`;

                                // Decode Base64 string
                                const byteCharacters = atob(base64String);
                                const byteNumbers = new Array(byteCharacters.length);

                                for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }

                                const byteArray = new Uint8Array(byteNumbers);
                                const blob = new Blob([byteArray], { type: mimeType });
                                const url = URL.createObjectURL(blob);

                                // Create and trigger download
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = finalFilename;
                                document.body.appendChild(a);
                                a.click();

                                // Clean up
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);

                            } catch (error) {
                              
                                await showAlert("Error processing image. It might be corrupted or in an unsupported format (only JPEG and PNG are supported).");
                                return;
                            }
                        }

                        async function showImageModal(base64String, filename) {
                            
                            // Validate input
                            if (!base64String || base64String.trim().length < 50) {
                                await showAlert("No image available.");
                                return;
                            }

                            try {
                                // Create modal container
                                const modal = document.createElement("div");
                                modal.id = "imageModal";

                                // Create image element
                                const img = document.createElement("img");
                                img.src = `data:image/jpeg;base64,${base64String}`;

                                // Create close button
                                const closeBtn = document.createElement("button");
                                closeBtn.textContent = "×";

                                // Add close functionality
                                closeBtn.onclick = () => modal.remove();

                                // Add click outside to close
                                modal.onclick = (e) => {
                                    if (e.target === modal) modal.remove();
                                };

                                // Append elements
                                modal.appendChild(img);
                                modal.appendChild(closeBtn);
                                document.body.appendChild(modal);
                            } catch (error) {
                               
                                await showAlert("Error displaying image. It might be corrupted or in an unsupported format.");
                                return;
                            }
                        }

                        // Attach event listener
                        document.getElementById("btn_dwn").onclick = () => {
                            imgphoto = data.VISIT_PHOTO;
                            handleFileDownload(imgphoto, "Visit_Doc");
                        };
                        document.getElementById("btn_photo").onclick = () => {
                            imgphoto = data.VISIT_PHOTO;
                            showImageModal(imgphoto, "Visit_Doc");
                        };
                    }
                    else {
                        await showAlert("Alert!", "Unable to load the Details.", "warning");
                        return;
                    }
                }
            }

            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },
    async ButtonConfirmClick() {
        try {
            const cmbCustId = document.getElementById("employeeCode");
            const txtRemarks = document.getElementById("hoRemarks");

            if (cmbCustId.selectedIndex === 0) {
                await showAlert("Alert!", "Please select Employee Code!!", "warning");
                return
            } else if (txtRemarks.value.trim() === "") {
                await showAlert("Alert!", "Please Enter Remarks!!", "warning");
                return
            }
            else {
                input_value = document.getElementById("employeeCode").value + "~" + document.getElementById("hoRemarks").value
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    p_indata: encryptAES(input_value),
                    as_optflag: encryptAES("4")
                };
                var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);


                if ((responseData).err_sts == "111") {
                    await showLoadAlert("Success!", "Confirmed Successfully", "success");
                    return;
                }
                else {
                    await showLoadAlert("Alert!", "Failed..", "warning");
                    return;
                }
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }

    },
    async ButtonRejectClick() {
        try {
            const cmbCustId = document.getElementById("employeeCode");
            const txtRemarks = document.getElementById("hoRemarks");

            if (cmbCustId.selectedIndex === 0) {
                await showAlert("Alert!", "Please select Employee Code!!", "warning");
                return
            } else if (txtRemarks.value.trim() === "") {
                await showAlert("Alert!", "Please Enter Remarks!!", "warning");
                return
            }
            else {
                input_value = document.getElementById("employeeCode").value + "~" + document.getElementById("hoRemarks").value 
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    p_indata: encryptAES(input_value),
                    as_optflag: encryptAES("5")
                };
                var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                if ((responseData).err_sts == "111") {
                    await showLoadAlert("Success!", "Rejected Successfully", "success");
                    return;
                }
                else {
                    await showLoadAlert("Alert!", "Failed..", "warning");
                    return;
                }
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }

    },
}