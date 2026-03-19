$(document).ready(async function () {

    checkAccess("12");
    _Legal.LoadbranchDropdown();
    

});

$(document).on('change', '#cmbBranch', function () {
    _Legal.complaintDropdown(this);
});

$(document).on('click', '#btnShowPledge', function () {
    _Legal.ShowPledgeList();
});

$(document).on('change', '#cmbComplaintNo', function () {
    _Legal.GetcomplaintDeatails(this);
});

$(document).on('click', '#btnCancel', function () {
    _Legal.ButtonRejectClick();
});



$(document).on('click', '#btntopview', function () {
    _Legal.Download_Pledge_photos(this.value);
});
$(document).on('click', '#btnbottomview', function () {
    _Legal.Download_Pledge_photos1(this.value);
});

$(document).on('click', '#btnExits', function () {
    redirectToDashboard();
});

$(document).on('input', '#txt_rm', function () {
    this.value.replace(/[^a-zA-Z0-9\s()/]/g, '');
});

$(document).on('click', '#btnConfirm', function () {
    _Legal.ButtonConfirmClick();
});

$(document).on('input', '#txtLawyer', function () {
    this.value = this.value.replace(/[^a-zA-Z\s()]/g, '');
});

$(document).on('input', '#txtCourt', function () {
    this.value = this.value.replace(/[^a-zA-Z\s()]/g, '');
});

$(document).on('input', '#txtCase', function () {
    this.value.replace(/[^a-zA-Z0-9\s()/]/g, '');

});


var _Legal = {

    async LoadbranchDropdown() {
        
        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch:"",
                p_indata:"",
                as_optflag:"1"
            };

            var Res = await fetch("/GetBranchDetailsLO", "POST", requestData);
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
            }
            else {
                await showAlert("Alert!", "Unable to load the BranchList.", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },

    async LoadnoticeDropdown() {
       
        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch:"",
                p_indata:"",
                as_optflag:"2"
            };

            var Res = await fetch("/GetBranchDetailsLO", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('cmbNotice');
                selectElement.innerHTML = '';

                outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID;
                        option.textContent = item.TYPE1;
                        selectElement.appendChild(option);
                    });
                }
            }
            else {
                await showAlert("Alert!", "Unable to load the BranchList.", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },

    async LoadcaseTypeDropdown() {
        
        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch:"",
                p_indata:"",
                as_optflag:"3"
            };

            var Res = await fetch("/GetBranchDetailsLO", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('cmbCaseType');
                selectElement.innerHTML = '';

                outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID;
                        option.textContent = item.TYPE1;
                        selectElement.appendChild(option);
                    });
                }
            }
            else {
                await showAlert("Alert!", "Unable to load the BranchList.", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },

    async LoadcomplaintTypeDropdown() {
       
        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: "",
                p_indata:"",
                as_optflag:"5"
            };

            var Res = await fetch("/GetBranchDetailsLO", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('cmb_casetype');
                selectElement.innerHTML = '';

                outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID;
                        option.textContent = item.TYPE1;
                        selectElement.appendChild(option);
                    });
                }
            }
            else {
                await showAlert("Alert!", "Unable to load the BranchList.", "warning");
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },

    async complaintDropdown() {
        
        
        if (document.getElementById("cmbBranch").value =="-1")
        {
            _Legal.allClear();
        }
        else {
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: "",
                    p_indata: document.getElementById('cmbBranch').value,
                    as_optflag:"4"
                };

                var Res = await fetch("/GetComplaintDetailsLO", "POST", requestData);
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
                    _Legal.LoadnoticeDropdown();
                    _Legal.LoadcaseTypeDropdown();
                    _Legal.LoadcomplaintTypeDropdown();
                }
                else {
                    await showAlert("Alert!", "Unable to load the Comlaint List..", "warning");
                }


            }
            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },

    async GetcomplaintDeatails() {
        debugger;
        if (document.getElementById("cmbComplaintNo").value == "-1") {
            _Legal.allClear();
        }
        else {
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch:"",
                    p_indata:$("#cmbComplaintNo option:selected").val(),
                    as_optflag:"6"
                };

                var Res = await fetch("/GetComplaintDetailsLO", "POST", requestData);
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                
                if (responseData.err_code === "1") {

                    const parsedOutdata = JSON.parse(responseData.outdata);
                    const data = parsedOutdata.Table[0];
                    async function handleFileDownload(base64String, filename) {
                        debugger;
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
                    console.log(data)
                    debugger;
                    document.getElementById("btn_cmp").addEventListener("click", () => handleFileDownload(data.COMP_ATTCH, data.COMP_ATTCH_NAME));
                    document.getElementById("btn_police").addEventListener("click", () => handleFileDownload(data.SEIZER_MAHAR, data.SEIZER_MAHAR_NME));


                    document.getElementById("txtcomplaint").value = data.COMPLAINT;
                    document.getElementById("txtCompDoc").value = data.COMP_ATTCH_NAME;
                    document.getElementById("txtRmComment").value = data.APPR_RMRKS;
                    document.getElementById("cmb_casetype").selectedIndex = data.TYPE_ID;
                    document.getElementById("txt_time").value = data.TIMELINE;

                    if (data.GOLD_AVL_PLACE == "") {
                        document.getElementById("TextBox1").value = "NIL";
                    }
                    else if (data.GOLD_AVL_PLACE == "Another Branch") {
                        document.getElementById("TextBox1").value = "Branch";
                    }
                    else {
                        document.getElementById("TextBox1").value = data.GOLD_AVL_PLACE;
                    }
                    debugger;
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
                            branch:"",
                            p_indata:data.CURRENT_BRANCH,
                            as_optflag:"7"
                        };

                        var Res1 = await fetch("/GetComplaintDetailsLO", "POST", requestData1);
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
                            branch:"",
                            p_indata:data.OTHER_BRANCH_ID,
                            as_optflag:"8"
                        };

                        var Res2 = await fetch("/GetComplaintDetailsLO", "POST", requestData2);
                        Res2 = decryptAES(Res2);
                        const responseData2 = JSON.parse(Res2);
                        const parsedOutdata2 = JSON.parse(responseData2.outdata);
                        const data2 = parsedOutdata2.Table[0];
                        document.getElementById("TextBox5").value = data.OTHER_BRANCH_ID + " ~ " + data2.BRANCH_NAME;

                    }
                    else {
                        div_br.style.display = "block";
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
                        document.getElementById("TextBox9").value = data.GOLDINBRANCH;
                    }
                    else {
                        document.getElementById("TextBox9").value = data.PREVIOUS_ENTERED_OR_NOT;
                    }
                }
                else {
                    await showAlert("Alert!", "Unable to load the Comlaint List..", "warning");
                }

            }
            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },

    async ShowPledgeList() {
        debugger;
        if (document.getElementById("cmbComplaintNo") == "-1")
        {
            await showAlert("Alert!", "Please select the complaint id..", "warning");
        }
        else
        {
            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch:"",
                    p_indata:$("#cmbComplaintNo option:selected").val(),
                    as_optflag:"9"
                };

                var Res = await fetch("/GetComplaintDetailsLO", "POST", requestData);
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
                    await showAlert("Alert!", "Unable to load the Comlaint List..", "warning");
                }
            }
            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },
   

    ButtonConfirmClick: async function () {
       
       
        if (document.getElementById("cmbBranch").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a Branch type!!", "warning");
            return;
        }
        if (document.getElementById("cmb_casetype").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a COMPLAINT type!!", "warning");
            return;
        }
        if (document.getElementById("cmbNotice").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a Notice type!!", "warning");
            return;
        }
        if (document.getElementById("cmbCaseType").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a Case type!!", "warning");
            return;
        }
        if (document.getElementById("txtLawyer").value.trim() === "") {
            await showAlert("Alert!", "Please enter Lawyer Name!!", "warning");
            return;
        }
        if (document.getElementById("txtCourt").value.trim() === "") {
            await showAlert("Alert!", "Please enter Court Name!!", "warning");
            return;
        }
        if (document.getElementById("txtCase").value.trim() === "") {
            await showAlert("Alert!", "Please enter Case Number!!", "warning");
            return;
        }
        if (document.getElementById("cmbComplaintNo").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a valid Compaint number!!", "warning");
            return;
        }
        if (document.getElementById("txt_rm").value == "") {
            await showAlert("Alert!", "Please enter remarks..", "warning");
            $('#txt_rm').addClass('border-danger');
            return;
        }
        //if (document.querySelector(".gridview tbody").children.length <= 0) {
        //    await showAlert("Alert!", "Please check the pledge list..", "warning");
        //    return;
        //}
            let casetype = document.getElementById("cmb_casetype").value.split("~")[0];
            let combinedValue = document.getElementById("cmbNotice").value + "^" +
                document.getElementById("cmbCaseType").value + "^" +
                document.getElementById("txtLawyer").value.replace("^", " ") + "^" +
                document.getElementById("txtCourt").value.replace("^", " ") + "^" +
                document.getElementById("txtCase").value.replace("^", " ") + "^" +
                document.getElementById("txt_rm").value + "^";

            try {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: encryptAES(""),
                    p_indata: encryptAES(document.getElementById('cmbComplaintNo').value + "!" + sessionStorage.getItem("EmployeeId") + "!" + sessionStorage.getItem("BranchId") + "!" + casetype + "!" + "LCU" + "!" + combinedValue),
                    as_optflag: encryptAES("1")
                };


                var Res = await fetch("/LOConfirmDetails", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                console.log(responseData)
                if ((responseData).status == "True") {
                    await showLoadAlert("Success!", "Approved Successfully", "success");
                    //_Legal.allClear();
                    //return;
                }
                else {
                    await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                    //_Legal.allClear();
                    //return;
                }
            }
            catch {
                await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
                //_Legal.allClear();
                //return;
            }
        
    },
    ButtonRejectClick: async function () {
        debugger;

        if (document.getElementById("cmbBranch").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a Branch type!!", "warning");
            return;
        }
        if (document.getElementById("cmb_casetype").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a COMPLAINT type!!", "warning");
            return;
        }
        if (document.getElementById("cmbNotice").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a Notice type!!", "warning");
            return;
        }
        if (document.getElementById("cmbCaseType").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a Case type!!", "warning");
            return;
        }
        if (document.getElementById("txtLawyer").value.trim() === "") {
            await showAlert("Alert!", "Please enter Lawyer Name!!", "warning");
            return;
        }
        if (document.getElementById("txtCourt").value.trim() === "") {
            await showAlert("Alert!", "Please enter Court Name!!", "warning");
            return;
        }
        if (document.getElementById("txtCase").value.trim() === "") {
            await showAlert("Alert!", "Please enter Case Number!!", "warning");
            return;
        }
        if (document.getElementById("cmbComplaintNo").selectedIndex <= 0) {
            await showAlert("Alert!", "Select a valid Compaint number!!", "warning");
            return;
        }
      if (document.getElementById("txt_rm").value == "") {
            await showAlert("Alert!", "Please enter remarks..", "warning");
            $('#txt_rm').addClass('border-danger');
            return;
        }
        let casetype = document.getElementById("cmb_casetype").value.split("~")[0];
        let combinedValue = document.getElementById("cmbNotice").value + "^" +
            document.getElementById("cmbCaseType").value + "^" +
            document.getElementById("txtLawyer").value.replace("^", " ") + "^" +
            document.getElementById("txtCourt").value.replace("^", " ") + "^" +
            document.getElementById("txtCase").value.replace("^", " ") + "^";

        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: encryptAES(""),
                p_indata: encryptAES(document.getElementById('cmbComplaintNo').value + "!" + sessionStorage.getItem("EmployeeId") + "!" + sessionStorage.getItem("BranchId") + "!" + casetype + "!" + "LCU" + "!" + combinedValue + "!" + document.getElementById("txt_rm").value),
                as_optflag: encryptAES("5")
            };


            var Res = await fetch("/LOConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            console.log(responseData)
            debugger;
            if ((responseData).status = "True") {
                await showLoadAlert("Success!", "Rejected Successfully", "success");
                //_Legal.allClear();
                //return;
            }
            else {
                await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                //_Legal.allClear();
                //return;
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
            //_Legal.allClear();
            //return;
        }

    },
    allClear: async function () {

        document.getElementById("cmbComplaintNo").innerHTML = "";
        document.getElementById("cmb_casetype").innerHTML = "";
        document.querySelector(".gridview tbody").innerHTML = "";
        document.getElementById("cmbCaseType").innerHTML = "";
        document.getElementById("cmbNotice").innerHTML = "";
        document.getElementById("txt_time").value = "";
        document.getElementById("txtCompDoc").value = "";
        document.getElementById("txtcomplaint").value = "";
        document.getElementById("TextBox1").value = "";
        document.getElementById("TextBox3").value = "";
        document.getElementById("TextBox5").value = "";
        document.getElementById("TextBox4").value = "";
        document.getElementById("TextBox2").value = "";
        document.getElementById("TextBox7").value = "";
        document.getElementById("TextBox8").value = "";
        document.getElementById("TextBox9").value = "";
        document.getElementById("txtRmComment").value = "";
        document.getElementById("txtLawyer").value = "";
        document.getElementById("txtCourt").value = "";
        document.getElementById("txtCase").value = "";
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