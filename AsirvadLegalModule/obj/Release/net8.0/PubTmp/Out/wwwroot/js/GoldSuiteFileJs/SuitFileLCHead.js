$(document).ready(async function () {

    checkAccess("13");
    _Result.LoadbranchDropdown();


});

$(document).on('change', '#cmbBranch', function () {
    _Result.complaintDropdown(this);
});

$(document).on('click', '#btnShowPledge', function () {
    Result.ShowPledgeList();
});

$(document).on('change', '#cmbComplaintNo', function () {
    _Result.GetcomplaintDeatails(this);
});
$(document).on('click', '#btnCancel', function () {
    _Result.ButtonRejectClick();
});



$(document).on('click', '#btntopview', function () {
    _Result.Download_Pledge_photos(this.value);
});
$(document).on('click', '#btnbottomview', function () {
    _Result.Download_Pledge_photos1(this.value);
});

$(document).on('click', '#btnExit', function () {
    redirectToDashboard();
});

$(document).on('input', '#txt_rm', function () {
    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');
});

$(document).on('click', '#btnConfirm', function () {
    _Result.ButtonConfirmClick();
});

$(document).on('input', '#txtLawyer', function () {
    this.value = this.value.replace(/[^a-zA-Z\s()]/g, '');
});

$(document).on('input', '#txt_rm', function () {
    this.value = this.value.replace(/[^a-zA-Z\s()]/g, '');
});
$(document).on('input', '#txt_rm', function () {
    this.value = this.value.replace(/[^a-zA-Z\s()]/g, '');
});
var _Result = {

    async LoadbranchDropdown() {
       
        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(""),
                p_indata: encryptAES(""),
                as_optflag: encryptAES("11")
            };

            var Res = await fetch("/GetDetailsLegalHead", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('cmbBranch');
                selectElement.innerHTML = '';

                outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.BRANCH_ID;
                        option.textContent = item.BRANCH_NAME;
                        selectElement.appendChild(option);
                    });
                }
                document.getElementById("cmbComplaintNo").innerHTML = "";
            }
            else {
                await showAlert("Alert!", "Unable to load the BranchList.", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
           
        }
    },
    async complaintDropdown() {

       
        if (document.getElementById("cmbBranch").value == "-1") {
            document.getElementById("cmbComplaintNo").innerHTML = "";
            _Result.allClear();
        }
        else {
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: encryptAES(""),
                    p_indata: encryptAES(document.getElementById("cmbBranch").value),
                    as_optflag: encryptAES("12")
                };

                var Res = await fetch("/GetDetailsLegalHead", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {
                    const selectElement = document.getElementById('cmbComplaintNo');
                    selectElement.innerHTML = '';

                    outdata = JSON.parse(responseData.outdata);
                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.LEGALID;
                            option.textContent = item.COMPLAINT;
                            selectElement.appendChild(option);
                        });

                    }
                    
                }
                else {
                    await showAlert("Alert!", "Unable to load the Comlaint List..", "warning");
                }


            }
            catch {
                await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
               
            }
        }
    },
    async GetcomplaintDeatails() {
        
        if (document.getElementById("cmbComplaintNo").value == "-1") {
            _Result.allClear();
        }
        else {
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: encryptAES(""),
                    p_indata: encryptAES( $("#cmbComplaintNo option:selected").val()),
                    as_optflag: encryptAES("13")
                };

                var Res = await fetch("/GetDetailsLegalHead", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {
                   
                    const parsedOutdata = JSON.parse(responseData.outdata);
                    const data = parsedOutdata.Table[0];

                    async function handleFileDownload(base64String, filename) {
                        if (!base64String || base64String.trim() === "" || base64String === "AA==") {
                            await showAlert("No document available.");
                            return;
                        }

                        try {
                            const byteCharacters = atob(base64String);
                            const byteNumbers = new Array(byteCharacters.length);

                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }

                            const byteArray = new Uint8Array(byteNumbers);
                            const mimeType = "application/pdf";
                            const blob = new Blob([byteArray], { type: mimeType });
                            const url = URL.createObjectURL(blob);

                            const a = document.createElement("a");
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();

                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        } catch (error) {
                            await showAlert("Error processing document. It might be corrupted or an unsupported format.");
                        }
                    }


                    document.getElementById("btn_cmp").addEventListener("click", () => handleFileDownload(data.COMP_ATTCH, data.COMP_ATTCH_NAME));
                    document.getElementById("btn_police").addEventListener("click", () => handleFileDownload(data.SEIZER_MAHAR, data.SEIZER_MAHAR_NME));

                    document.getElementById("txtcomplaint").value = data.COMPLAINT;
                    document.getElementById("txtCompDoc").value = data.COMP_ATTCH_NAME;
                    document.getElementById("txtRmComment").value = data.APPR_RMRKS;
                    document.getElementById("txtNotice").value = data.NOTICE_TYPE;
                    document.getElementById("txtCaseType").value = data.CASE_TYPE;
                    document.getElementById("txtLawyer").value = data.LAWYER_NAME;
                    document.getElementById("txtCourt").value = data.COURT_NAME;
                    document.getElementById("txtCase").value = data.CASE_NO;
                    document.getElementById("txt_case_cat").value = data.TYPE;
                    document.getElementById("txt_time").value = data.TIMELINE + " Days";

                    if (data.LAWYER_NAME == "") {
                        document.getElementById("TextBox1").value = "NIL";
                    }
                    else if (data.GOLD_AVL_PLACE == "Another Branch") {
                        document.getElementById("TextBox1").value = "Branch";
                    }
                    else {
                        document.getElementById("TextBox1").value = data.GOLD_AVL_PLACE;
                    }
                    
                    if (data.GOLD_AVL_PLACE == "Police Station") {
                        document.getElementById("TextBox3").value = data.POLICESTAT_NAME;
                        document.getElementById("TextBox2").value = data.SEIZER_MAHAR_NME;
                        div_ps.style.display = "flex";
                        div_ps1.style.display = "flex";
                        div_br.style.display = "none";
                        div_ab.style.display = "none";
                    }
                    else if (data.GOLD_AVL_PLACE == "Branch") {
                        div_br.style.display = "block";
                        div_ps.style.display = "none";
                        div_ps1.style.display = "none";
                        div_ab.style.display = "none";


                        const requestData1 = {
                            employeeId: sessionStorage.getItem("EmployeeId"),
                            token: sessionStorage.getItem("Token"),
                            branch: "",
                            p_indata: data.CURRENT_BRANCH,
                            as_optflag: "14"
                        };

                        var Res1 = await fetch("/GetDetailsLegalHead", "POST", requestData1);
                        Res1 = decryptAES(Res1);
                        const responseData1 = JSON.parse(Res1);
                        const parsedOutdata1 = JSON.parse(responseData1.outdata);
                        const data1 = parsedOutdata1.Table[0];
                        console.log(data.CURRENT_BRANCH, data1.BRANCH_NAME);
                        document.getElementById("TextBox4").value = data.CURRENT_BRANCH + " ~ " + data1.BRANCH_NAME;
                    }

                    else if (data.GOLD_AVL_PLACE == "Another Branch") {
                        div_br.style.display = "none";
                        div_ps.style.display = "none";
                        div_ps1.style.display = "none";
                        div_ab.style.display = "flex";

                        const requestData2 = {
                            employeeId: sessionStorage.getItem("EmployeeId"),
                            token: sessionStorage.getItem("Token"),
                            branch: encryptAES(""),
                            p_indata: encryptAES(data.OTHER_BRANCH_ID),
                            as_optflag: encryptAES("15")
                        };

                        var Res2 = await fetch("/GetDetailsLegalHead    ", "POST", requestData2);
                        Res2 = decryptAES(Res2);
                        const responseData2 = JSON.parse(Res2);
                        const parsedOutdata2 = JSON.parse(responseData2.outdata);
                        const data2 = parsedOutdata2.Table[0];
                        document.getElementById("TextBox5").value = data.OTHER_BRANCH_ID + " ~ " + data2.BRANCH_NAME;

                    }
                    else {
                        div_br.style.display = "none";
                        div_ps.style.display = "none";
                        div_ps1.style.display = "none";
                        div_ab.style.display = "none";
                    }
                    if (data.RESON_SUIT_FILE == "") {
                        document.getElementById("TextBox7").value = "NIL";
                    }
                    else {
                        document.getElementById("TextBox7").value = data.RESON_SUIT_FILE;
                    }

                    if (data.RESON_SUIT_FILE == "Burglary Gold") {
                        document.getElementById("TextBox8").value = data.GOLDINBRANCH;
                        div_bg.style.display = "flex";
                    }
                    else {
                        div_bg.style.display = "none";
                    }

                    if (data.PREVIOUS_ENTERED_OR_NOT == "") {
                        document.getElementById("TextBox9").value = "NIL"
                    }
                    else {
                        document.getElementById("TextBox9").value = data.PREVIOUS_ENTERED_OR_NOT;
                    }
                }
                else {
                    await showAlert("Alert!", "Unable to load the Compalaint Details..", "warning");
                }

            }
            catch {
                await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
                
            }
        }
    },
async ShowPledgeList() {
        debugger;
        if (document.getElementById("cmbComplaintNo") == "-1") {
            await showAlert("Alert!", "Please select the complaint id..", "warning");
        }
        else {
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: encryptAES(""),
                    p_indata: encryptAES($("#cmbComplaintNo option:selected").val()),
                    as_optflag: encryptAES("16")
                };

                var Res = await fetch("/GetDetailsLegalHead", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                debugger;
                if (responseData.err_code === "1") {
                    // Parse `outdata` since it's a JSON string
                    let parsedData = JSON.parse(responseData.outdata);

                    // Get reference to the table body
                    let tableBody = document.querySelector(".gridview tbody");

                    parsedData.Table.forEach(function (item) {
                        let row = document.createElement("tr");
                        let cell = document.createElement("td");
                        cell.textContent = item.PLEDGE_NO;
                        row.appendChild(cell);
                        tableBody.appendChild(row);
                    });

                    // Make the table visible
                    document.getElementById("div_grid").style.display = "flex";

                }
                else {
                    await showAlert("Alert!", "Unable to load the Pledge List..", "warning");
                }
            }
            catch {
                await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
               
            }
        }
    },
    ButtonConfirmClick: async function () {

        debugger;
        if (document.getElementById("cmbBranch").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a Branch type!!", "warning");
            return;
        }
        if (document.getElementById("cmbComplaintNo").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a COMPLAINT type!!", "warning");
            return;
        }
        if (document.querySelector(".gridview tbody").children.length <= 0) {
            await showAlert("Alert!", "Please check the pledge list..", "warning");
            return;
        }
        if (document.getElementById("txt_rm").value == "") {
            await showAlert("Alert!", "Please enter remarks..", "warning");
            $('#txt_rm').addClass('border-danger');
            return;
        }

        let casetype = document.getElementById("cmbComplaintNo").value.split("~")[0];
        let combinedValue = "";
        const rows = document.querySelectorAll(".gridview tbody tr");
        rows.forEach((row) => {
            const pledgeNumber = row.cells[0].textContent.replace("^", " "); // Get text from first cell and replace any "^" with space
            combinedValue += pledgeNumber + "~"; // Add pledge number and separator
        });


        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(""),
                p_indata: encryptAES(document.getElementById('cmbComplaintNo').value + "!" + sessionStorage.getItem("EmployeeId") + "!" + sessionStorage.getItem("BranchId") + "!" + casetype + "!" + "AGM" + "!" + combinedValue + "!" + document.getElementById("txt_rm").value) ,
                as_optflag: encryptAES("2")
            };


            var Res = await fetch("/LegalHeadConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            console.log(responseData)
            debugger;
            if ((responseData).status == "True") {
                await showLoadAlert("Success!", "Approved Successfully", "success");
               //_Result.allClear();
               //_Result.LoadbranchDropdown();
               // return;
            }
            else {
                await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                //_Result.allClear();
                //_Result.LoadbranchDropdown();
                //return;
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
            
        }

    },
    ButtonRejectClick: async function () {
        debugger;

        if (document.getElementById("cmbBranch").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a Branch type!!", "warning");
            return;
        }
        if (document.getElementById("cmbComplaintNo").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a COMPLAINT type!!", "warning");
            return;
        }
        if (document.querySelector(".gridview tbody").children.length <= 0) {
            await showAlert("Alert!", "Please check the pledge list..", "warning");
            return;
        }
     if (document.getElementById("txt_rm").value == "") {
            await showAlert("Alert!", "Please enter remarks..", "warning");
            $('#txt_rm').addClass('border-danger');
            return;
        }

        let casetype = document.getElementById("cmbComplaintNo").value.split("~")[0];
        let combinedValue = "";
        const rows = document.querySelectorAll(".gridview tbody tr");
        rows.forEach((row, index) => {
            const pledgeNumber = row.cells[0].textContent.replace("^", " "); // Get text from first cell and replace any "^" with space
            combinedValue += pledgeNumber;
            if (index < rows.length - 1) {
                combinedValue += "~"; // Add separator except for the last row
            }
        });


        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(""),
                p_indata: encryptAES(document.getElementById('cmbComplaintNo').value + "!" + sessionStorage.getItem("EmployeeId") + "!" + sessionStorage.getItem("BranchId") + "!" + casetype + "!" + "AGM" + "!^" + combinedValue + "!" + document.getElementById("txt_rm").value,
                as_optflag: encryptAES("5"),
               
            };


            var Res = await fetch("/LegalHeadConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            console.log(responseData)
            debugger;
            if ((responseData).status == "True") {
                await showLoadAlert("Success!", "Rejected Successfully", "success");
                //_Result.allClear();
                //_Result.LoadbranchDropdown();
                //return;
            }
            else {
                await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                //_Result.allClear();
                //_Result.LoadbranchDropdown();
                //return;
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
            //_Result.allClear();
            //_Result.LoadbranchDropdown();
            //return;
        }


    },
    allClear: async function () {

       
        document.querySelector(".gridview tbody").innerHTML = "";
        document.getElementById("txtcomplaint").value = "";
        document.getElementById("txtCompDoc").value = "";
        document.getElementById("txtRmComment").value = "";
        document.getElementById("txtNotice").value = "";
        document.getElementById("txtCaseType").value = "";
        document.getElementById("txtLawyer").value = "";
        document.getElementById("txtCourt").value = "";
        document.getElementById("txtCase").value = "";
        document.getElementById("txt_case_cat").value = "";
        document.getElementById("txt_time").value = "";
        document.getElementById("TextBox1").value = "";
        document.getElementById("TextBox7").value = "";
        document.getElementById("TextBox8").value = "";
        document.getElementById("TextBox9").value = "";      
        div_ps.style.display = "none";
        div_ps1.style.display = "none";
        div_br.style.display = "none";
        div_ab.style.display = "none";
        div_bg.style.display = "none";
        div_grid.style.display = "none";

    },
    async Download_Pledge_photos() {
        debugger;
        if (document.getElementById("cmbComplaintNo") == "-1") {
            await showAlert("Alert!", "Please select the complaint id..", "warning");
        }
        debugger;
        try {
            const requestData = {
                "indata": encryptAES($("#cmbComplaintNo").val()),
                "flag": encryptAES("2"),
                "img1": '',
                "img2": '',
                "encrypt_data": sessionStorage.getItem("EmployeeId"),
                "empId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
            };
            var Res = await fetch("/pdf_view", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length === 0) {
                console.error('Error: No valid result found in API response.');
                await showAlert("Alert!", "No Data Found!!!!!", "Warning");
                return;
            }
            //Swal.fire({
            //    title: "Document",
            //    html: `
            //    <h3>Document</h3>
            //    ${getFileType(data).startsWith("image") ?
            //            `<img src="data:${getFileType(data)};base64,${data}" alt=" Document" width="100%"><br>`
            //        : `<iframe src="data:${getFileType(data)};base64,${data}" width="100%" max-height:"50vh"></iframe><br>`}
            //    <a href="data:${getFileType(data)};base64,${data}" download="Document.${getFileExtension(getFileType(data))}" style="text-decoration: none; color: #007bff;">CLICK TO DOWNLOAD THE DOCUMENT</a><br><br>
            //   `,
            //    width: "800px",
            //    showCloseButton: true
            //});

            Swal.fire({
                title: "Document",
                html: `
    <h3>Document</h3>
    ${getFileType(data).startsWith("image") ?
                        `<img src="data:${getFileType(data)};base64,${data}" alt="Document" style="width: 100%; max-height: 70vh;"><br>`
                        : `<iframe src="data:${getFileType(data)};base64,${data}" style="width: 100%; max-height: 70vh;" frameborder="0"></iframe><br>`}
    <a href="data:${getFileType(data)};base64,${data}" download="Document.${getFileExtension(getFileType(data))}" style="text-decoration: none; color: #007bff;">CLICK TO DOWNLOAD THE DOCUMENT</a><br><br>
  `,
                width: "50vw", // Half of the screen width
                showCloseButton: true
            });



        } catch (error) {
            console.error("Error fetching documents:", error);
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }

        function getFileType(base64String) {
            if (base64String.startsWith("/9j")) return "image/jpeg"; // JPG
            if (base64String.startsWith("iVBORw0")) return "image/png"; // PNG
            if (base64String.startsWith("JVBER")) return "application/pdf"; // PDF
            return "application/octet-stream"; // Default (DOC, etc.)
        }

        function getFileExtension(mimeType) {
            switch (mimeType) {
                case "image/jpeg":
                    return "jpg";
                case "image/png":
                    return "png";
                case "application/pdf":
                    return "pdf";
                default:
                    return "bin"; // Default for unknown types
            }
        }

    },

    async Download_Pledge_photos1() {
        debugger;
        if (document.getElementById("cmbComplaintNo") == "-1") {
            await showAlert("Alert!", "Please select the complaint id..", "warning");
        }
        debugger;
        try {
            const requestData = {
                "indata": encryptAES($("#cmbComplaintNo").val()),
                "flag": encryptAES("3"),
                "img1": '',
                "img2": '',
                "encrypt_data": sessionStorage.getItem("EmployeeId"),
                "empId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
            };
            var Res = await fetch("/pdf_view", "POST", requestData);
            Res = decryptAES(Res);
            let data = JSON.parse(Res).outdata;
            if (!data || data.length === 0) {
                console.error('Error: No valid result found in API response.');
                await showAlert("Alert!", "No Data Found!!!!!", "Warning");
                return;
            }
            //Swal.fire({
            //    title: "Document",
            //    html: `
            //    <h3>Document</h3>
            //    ${getFileType(data).startsWith("image") ?
            //            `<img src="data:${getFileType(data)};base64,${data}" alt=" Document" width="100%"><br>`
            //        : `<iframe src="data:${getFileType(data)};base64,${data}" width="100%" max-height:"50vh"></iframe><br>`}
            //    <a href="data:${getFileType(data)};base64,${data}" download="Document.${getFileExtension(getFileType(data))}" style="text-decoration: none; color: #007bff;">CLICK TO DOWNLOAD THE DOCUMENT</a><br><br>
            //   `,
            //    width: "800px",
            //    showCloseButton: true
            //});

            Swal.fire({
                title: "Document",
                html: `
    <h3>Document</h3>
    ${getFileType(data).startsWith("image") ?
                        `<img src="data:${getFileType(data)};base64,${data}" alt="Document" style="width: 100%; max-height: 70vh;"><br>`
                        : `<iframe src="data:${getFileType(data)};base64,${data}" style="width: 100%; max-height: 70vh;" frameborder="0"></iframe><br>`}
    <a href="data:${getFileType(data)};base64,${data}" download="Document.${getFileExtension(getFileType(data))}" style="text-decoration: none; color: #007bff;">CLICK TO DOWNLOAD THE DOCUMENT</a><br><br>
  `,
                width: "50vw", // Half of the screen width
                showCloseButton: true
            });



        } catch (error) {
            console.error("Error fetching documents:", error);
            Swal.fire({
                icon: "error",
                title: "Unexpected Error",
                text: `An error occurred: ${error.message}`,
            });
        }

        function getFileType(base64String) {
            if (base64String.startsWith("/9j")) return "image/jpeg"; // JPG
            if (base64String.startsWith("iVBORw0")) return "image/png"; // PNG
            if (base64String.startsWith("JVBER")) return "application/pdf"; // PDF
            return "application/octet-stream"; // Default (DOC, etc.)
        }

        function getFileExtension(mimeType) {
            switch (mimeType) {
                case "image/jpeg":
                    return "jpg";
                case "image/png":
                    return "png";
                case "application/pdf":
                    return "pdf";
                default:
                    return "bin"; // Default for unknown types
            }
        }

    },
}