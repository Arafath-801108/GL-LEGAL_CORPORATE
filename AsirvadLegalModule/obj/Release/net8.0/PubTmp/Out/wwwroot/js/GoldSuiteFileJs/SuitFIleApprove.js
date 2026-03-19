var postId;
$(document).ready(async function () {


    checkAccess("11");
    _approve.checkPost();
    _approve.checkBranch();


});

$(document).on('change', '#drp_complaint', function () {
    _approve.legalDetails(this.value);
});

$(document).on('click', '#btnsubmit', function () {
    _approve.btnSubmitClick();
});

$(document).on('change', '#drp_branch', function () {
    _approve.checkComplaint(this.value);
});
    $(document).on('click', '#btnreject', function () {
        _approve.btnRejectClick();
    });

$(document).on('click', '#btnpledge', function () {
    _approve.showPledge();
});

$(document).on('click', '#btntopview', function () {
    _approve.Download_Pledge_photos(this.value);
});
$(document).on('click', '#btnbottomview', function () {
    _approve.Download_Pledge_photos1(this.value);
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

$(document).on('input', '#txt_rm', function () {
    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');
});


var _approve = { //main class
    checkPost: async function () {
        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';

        $.ajax({
            url: liveurl + "/getPostCheck",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token")
            }),
            success: _approve.checkDivComplete,
            error: function (xhr, status, error) {
                xhrstatus(xhr.status);
            }

        });
    },
    checkDivComplete: async function (response) {
        response = decryptAES(response);
        if (JSON.parse(response).status === "True") {
            postId = JSON.parse(response).post
            if (JSON.parse(response).post === "199") {
                div_rm.style.display = "flex";
            }
            else {
                div_rm.style.display = "flex";
            }
        }
        else {
            await showAlert("Alert!", "Please check the employee code is live..", "warning");

        }
    },
    checkBranch: async function () {
        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';

        $.ajax({
            url: liveurl + "/getBranchCheck",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                post: sessionStorage.getItem("Post"),
                branch: sessionStorage.getItem("BranchId")
            }),
            success: _approve.checkBranchComplete,
            error: function (xhr, status, error) {
                xhrstatus(xhr.status);
            }

        });
    },
    checkBranchComplete: async function (response) {
        response = decryptAES(response);
        if (JSON.parse(response).status === "True") {
            const selectElement = document.getElementById('drp_branch');

            selectElement.innerHTML = '';
            JSON.parse(response).BranchData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.branchId;
                option.textContent = item.branchName;
                selectElement.appendChild(option);
            });
        }
        else {
            await showAlert("Alert!", "You are not authorized", "warning");

        }

    },
    checkComplaint: async function () {

        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';

        if ($("#drp_branch").val() !== "-1") {
            var data = {
                "branch": encryptAES($("#drp_branch").val()),
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "post": sessionStorage.getItem("Post")
            };

            $.ajax({
                url: liveurl + "/getComplaintCheck",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: _approve.checkComplaintComplete,
                error: function (xhr, status, error) {
                    xhrstatus(xhr.status);
                }

            });
        }
        else {
            document.getElementById("drp_complaint").selectedIndex = -1;
            _approve.allClear();
            return;
        }
    },
    checkComplaintComplete: async function (response) {
        response = decryptAES(response);
        if (JSON.parse(response).status === "True") {
            const selectElement = document.getElementById('drp_complaint');

            selectElement.innerHTML = '';
            JSON.parse(response).ComplaintData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.legalId;
                option.textContent = item.complaint;
                selectElement.appendChild(option);
            });
        }
        else {
            await showLoadAlert1("Alert!", "You are not authorized", "warning");

        }

    },
    legalDetails: async function () {

        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';

        if ($("#drp_complaint").val() !== "-1") {
            var data = {
                "legal": encryptAES($("#drp_complaint").val()),
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token")
            };

            $.ajax({
                url: liveurl + "/GetCaseDetails",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: _approve.legalDetailsComplete,
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                }

            });
        }
        else {

            _approve.allClear();
            return;
        }
    },
    legalDetailsComplete: async function (response) {
        console.log(response);

        if (JSON.parse(response).status === "True") {
            let rowData = JSON.parse(response).legaldata.trim();
            let values = rowData.includes("|") ? rowData.split("|") : [rowData]; // Ensure correct splitting

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

            console.log(values);
            document.getElementById("btn_cmp").addEventListener("click", () => handleFileDownload(values[11], values[2]));
            document.getElementById("btn_police").addEventListener("click", () => handleFileDownload(values[12], values[6]));

            document.getElementById("txt_casetype").value = values[0];
            document.getElementById("txt_time").value = values[1];
            document.getElementById("txt_cmp").value = values[2];

            if (values[3] == "Another Branch") {
                document.getElementById("txt_goldplace").value = "Another Branch"
            }
            else if (values[3] == "") {
                document.getElementById("txt_goldplace").value = "NIL"
            }
            else {
                console.log(values[3]);
                document.getElementById("txt_goldplace").value = values[3];
            }

            if (values[3] == "Police Station") {
                document.getElementById("txt_police").value = values[6];
                document.getElementById("txt_seize").value = values[7];
                div_police.style.display = "flex";
                div_seize.style.display = "flex";
                div_br.style.display = "none";
                div_ab.style.display = "none";
            }
            else if (values[3] == "Branch") {
                document.getElementById("txt_br").value = values[4] + " ~ " + JSON.parse(response).branchName;
                div_police.style.display = "none";
                div_seize.style.display = "none";
                div_br.style.display = "block";
                div_ab.style.display = "none";
            }
            else if (values[3] == "Another Branch") {
                document.getElementById("txt_ab").value = values[5] + " ~ " + JSON.parse(response).branchName;
                div_police.style.display = "none";
                div_seize.style.display = "none";
                div_br.style.display = "none";
                div_ab.style.display = "flex";
            }
            else {
                div_police.style.display = "none";
                div_seize.style.display = "none";
                div_br.style.display = "none";
                div_ab.style.display = "none";
            }

            if (values[8] == "") {
                document.getElementById("txt_reason").value = "NIL";
            }
            else {
                document.getElementById("txt_reason").value = values[8];
            }

            if (values[8] == "Burglary Gold") {
                document.getElementById("txt_goldInbranch").value = values[9];
                div_gold.style.display = "flex";
            }
            else {
                div_gold.style.display = "none";
            }
            if (values[10] == "") {
                document.getElementById("txt_prev_pledge").value = "NIL";
            }
            else {
                document.getElementById("txt_prev_pledge").value = values[10];
            }
        }
        else {
            await showAlert("Alert!", "Please check the Legal ID..", "warning");
        }

    },
    showPledge: async function () {

        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';

        if ($("#drp_complaint").val() !== "-1") {
            var data = {
                "legal": encryptAES($("#drp_complaint").val()),
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token")
            };

            $.ajax({
                url: liveurl + "/GetPledgeShowDetail",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: _approve.showPledgeComplete,
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                }

            });
        }

    },
    showPledgeComplete: async function (response) {

        if (JSON.parse(response).status === "True") {
            div_grid.style.display = "flex";
            let parsedResponse = JSON.parse(response);
            let pledges = parsedResponse.pledges;

            let tbody = document.querySelector(".pledge-grid tbody");

            tbody.innerHTML = "";

            pledges.forEach(pledge => {
                let row = document.createElement("tr");
                let cell = document.createElement("td");
                cell.textContent = pledge;
                row.appendChild(cell);
                tbody.appendChild(row);
            });
        }
        else {
            await showAlert("Alert!", "Please check the Legal ID..", "warning");
        }

    },
    allClear: async function () {


        document.getElementById("txt_casetype").value = "";
        document.getElementById("txt_time").value = "";
        document.querySelector(".pledge-grid tbody").innerHTML = "";
        div_grid.style.display = "none";
        document.getElementById("txt_cmp").value = "";
        document.getElementById("txt_goldplace").value = "";
        document.getElementById("txt_police").value = "";
        document.getElementById("txt_seize").value = "";
        document.getElementById("txt_br").value = "";
        document.getElementById("txt_ab").value = "";
        document.getElementById("txt_reason").value = "";
        document.getElementById("txt_goldInbranch").value = "";
        document.getElementById("txt_prev_pledge").value = "";
        document.getElementById("txt_rm").value = "";
        const elements = [
            "btn_police", "btn_cmp"
        ];

        elements.forEach(id => {
            let elem = document.getElementById(id);
            let newElem = elem.cloneNode(true);
            elem.parentNode.replaceChild(newElem, elem);
        });

    },
    btnSubmitClick: async function () {
        if (document.getElementById("drp_branch").value == "-1") {
            await showAlert("Alert!", "Please select the branch..!", "warning");
            $('#drp_branch').addClass('border-danger');
            return;
        }
        else if (document.getElementById("drp_complaint").value == "-1") {
            await showAlert("Alert!", "Please select the type of complaint..!", "warning");
            $('#drp_complaint').addClass('border-danger');
            return;
        }

        else if (document.getElementById("txt_rm").value == "") {
            await showAlert("Alert!", "Please enter remarks..", "warning");
            $('#txt_rm').addClass('border-danger');
            return;
        }

        //if (document.querySelector(".gridview tbody").children.length <= 0) {
        //    await showAlert("Alert!", "Please check the pledge list..", "warning");
        //    return;
        //}
        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';

        var data = {
            "employeeId": sessionStorage.getItem("EmployeeId"),
            "token": sessionStorage.getItem("Token"),
            "complaint": encryptAES($("#drp_complaint option:selected").val()),
            "branchId": sessionStorage.getItem("BranchId"),
            "caseType": encryptAES(""),
            "Complaintval": encryptAES(""),
                "police": encryptAES(""),
                    "anoBranch": encryptAES( ""),
                "curBranch": encryptAES(""),
            "goldInPlace": encryptAES(""),
            "reason": encryptAES(""),
            "prevPledge": encryptAES(""),
            "goldInBranch": encryptAES( ""),
            "pledgeList": encryptAES( ""),
            "flag1": encryptAES("RMA"),
            "rm_cmt": encryptAES( $("#txt_rm").val()),
            "doc": encryptAES(""),
            "docname": encryptAES(""),
            "flag2": encryptAES( "0")

        };

        $.ajax({
            url: liveurl + "/GetSuitFileApprove",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: _approve.btnSubmitComplete,
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }

        });

    },
    btnSubmitComplete: async function (response) {
        response = decryptAES(response);
        if (JSON.parse(response).status === "True") {
            await showLoadAlert("Success!", "Approved Successfully", "success");

            //_approve.allClear();
            //return;

        }
        else {
            await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
            /*$("#drp_branch").val() !== "-1"*/
            //_approve.allClear();
            //return;
        }

    },

    btnRejectClick: async function () {

        if (document.getElementById("drp_branch").value == "-1") {
            await showAlert("Alert!", "Please select the branch..!", "warning");
            $('#drp_branch').addClass('border-danger');
            return;
        }
        else if (document.getElementById("drp_complaint").value == "-1") {
            await showAlert("Alert!", "Please select the type of complaint..!", "warning");
            $('#drp_complaint').addClass('border-danger');
            return;
        }

        else if (document.getElementById("txt_rm").value == "") {
            await showAlert("Alert!", "Please enter remarks..", "warning");
            $('#txt_rm').addClass('border-danger');
            return;
        }

        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';

        var data = {
            "employeeId": sessionStorage.getItem("EmployeeId"),
            "token": sessionStorage.getItem("Token"),
            "complaint": encryptAES($("#drp_complaint option:selected").val()),
            "branchId": sessionStorage.getItem("BranchId"),
            "caseType": encryptAES(""),
            "Complaintval": encryptAES(""),
            "police": encryptAES(""),
            "anoBranch": encryptAES(""),
            "curBranch": encryptAES(""),
            "goldInPlace": encryptAES(""),
            "reason": encryptAES(""),
            "prevPledge": encryptAES(""),
            "goldInBranch": encryptAES(""),
            "pledgeList": encryptAES(""),
            "flag1": encryptAES("RMA"),
            "rm_cmt": encryptAES($("#txt_rm").val()),
            "doc": encryptAES(""),
            "docname": encryptAES(""),
            "flag2": encryptAES("5")

        };

        $.ajax({
            url: liveurl + "/GetSuitFileApprove",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: _approve.btnRejectComplete,
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }

        });

    },
    btnRejectComplete: async function (response) {
        response = decryptAES(response);
        if (JSON.parse(response).status === "True") {
            await showLoadAlert("Success!", "Rejected Successfully", "success");

            //_approve.allClear();
            //return;

        }
        else {
            await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
            /*$("#drp_branch").val() !== "-1"*/
            //_approve.allClear();
            //return;
        }

    },

    async Download_Pledge_photos() {
        debugger;
        if (document.getElementById("cmbComplaintNo") == "-1") {
            await showAlert("Alert!", "Please select the complaint id..", "warning");
        }
        debugger;
        try {
            const requestData = {
                "indata": encryptAES($("#drp_complaint").val()),
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
                "indata": encryptAES($("#drp_complaint").val()),
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
