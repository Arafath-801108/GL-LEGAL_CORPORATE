$(document).ready(async function () {

    checkAccess("10");
   _classify.cmpDropdown();
   

});
$(document).on('change', '#drp_cmp', function () {
    _classify.getType(this.value);
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

$(document).on('input', '#txt_cmp', function () {
    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');
});
$(document).on('click', '#btn_submit', function () {
    _classify.btnSubmitClick();
});

$(document).on('input', '#txt_pledge', function () {
    this.value = this.value.replace(/[^0-9\s()]/g, '');
});

$(document).on('click', '#btnaddpledge', function () {
    _classify.showPledge();
});

$(document).on('change', '#drp_res', function () {
    _classify.getReason(this);
});

$(document).on('change', '#drp_place', function () {
    _classify.getAvilableCheck(this);
});

$(document).on('input', '#txt_police', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$(document).on('change', '#fileSeize', function () {
    //_classify.validateFile1();
    UploadFN(this);
});

$(document).on('change', '#fileInput', function () {
    //_classify.validateFile();
    UploadFN(this);
});

$(document).on('change', '#File1 ', function () {
    
    UploadFN(this);
});

$(document).on('change', '#File2', function () {
    
    UploadFN(this);
});

var _classify = { //main class

    cmpDropdown: async function () {
        
       
        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate'; 
        $.ajax({
            url: liveurl+"/ComplaintType",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token")
            }),
            success: _classify.cmpDropdownComplete,
            error: function (xhr, status, error) {
            xhrstatus(xhr.status);
            }

            
        });
    },
    cmpDropdownComplete: async function (response) {
        
      
        try {
            response = decryptAES(response);
            if (JSON.parse(response).status === "True") {
                const selectElement = document.getElementById('drp_cmp');

                selectElement.innerHTML = '';
                JSON.parse(response).ComplaintData.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.timeline;
                    option.textContent = item.type;
                    selectElement.appendChild(option);
                });
                const selectElement1 = document.getElementById('drp_another');

                selectElement1.innerHTML = '';
                JSON.parse(response).BranchDatas.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.branchid;
                    option.textContent = item.branchname;
                    selectElement1.appendChild(option);
                });
            }
            else {
                await showAlert("Alert!", "Unable to load the ComplaintList.", "warning");
                return;
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
           
        }
    },
    getType: async function (event) {
        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate'; 
        var data = {
            "cmpType":encryptAES($("#drp_cmp").val()),
            "employeeId": sessionStorage.getItem("EmployeeId"),
            "token": sessionStorage.getItem("Token")
        };
            $.ajax({
                url: liveurl+"/GetTimeLine",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: _classify.gettypeComplete,
                error: function (xhr, status, error) {
                    xhrstatus(xhr.status);
                }

            });
    },
    gettypeComplete: async function (response) {
        response = decryptAES(response);
       document.getElementById("txt_time").value = response;
    
    },

    showPledge: async function () {
        if ($("#txt_pledge").val() == "") {
            await showAlert("Alert!", "Please enter Pledge number..", "warning");
             return;
        }
        else {
            const isDevelopment = window.location.hostname === 'localhost';
            const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';
            var data = {
                "plno": encryptAES($("#txt_pledge").val()),
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "branchId": sessionStorage.getItem("BranchId")
            };
            $.ajax({
                url: liveurl + "/GetPledgelistCheck",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: _classify.showPledgeComplete,
                error: function (xhr, status, error) {
                    xhrstatus(xhr.status);
                }

            });
        }
    },
    showPledgeComplete: async function (response)
    {

        response = decryptAES(response);
        const parsedResponse = JSON.parse(response);
        if (parsedResponse.status === "True") {
            const plno = parsedResponse.plno;
            const tbody = document.querySelector('.pledge-grid tbody');
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = plno;
            row.appendChild(cell);
            tbody.appendChild(row);
            document.getElementById("txt_pledge").value = "";
        }
        else
        {
            await showAlert("Alert!", "Please check the pledge number..", "warning");
            return;
        }
        
        
    },
    getAvilableCheck: async function (selectElement) {
        
        var selectedValue = selectElement.value;
         if (selectedValue === "3") {
             div_branch.style.display = "flex";
             div_doc.style.display = "none";
             div_police.style.display = "none";
             div_current.style.display = "none";
             document.getElementById("txt_police").value = "";
             document.getElementById("fileSeize").value = "";
             document.getElementById("txt_curBranch").value = "";


         } else if (selectedValue === "2") {
             div_police.style.display = "flex";
             div_doc.style.display = "flex";
             div_branch.style.display = "none";
             div_current.style.display = "none";
             document.getElementById("txt_curBranch").value = "";
             document.getElementById("drp_another").selectedIndex = 0;


         } else if (selectedValue === "1") {
             debugger; 
             const isDevelopment = window.location.hostname === 'localhost';
             const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';
             var data = {
                 "branch": sessionStorage.getItem("BranchId"),
                 "employeeId": sessionStorage.getItem("EmployeeId"),
                 "token": sessionStorage.getItem("Token")
             };
            $.ajax({
                 url: liveurl + "/GetCurrentBranch",
                 type: "POST",
                 contentType: "application/json",
                 data: JSON.stringify(data),
                success: _classify.getcurrentbranchcomplete,
                 error: function (xhr, status, error) {
                     xhrstatus(xhr.status);
                 }
            });

             
         }
         else
         {
             div_branch.style.display = "none";
             div_doc.style.display = "none";
             div_police.style.display = "none";
             div_current.style.display = "none";
             document.getElementById("drp_another").selectedIndex = 0;
             document.getElementById("txt_police").value = "";
             document.getElementById("fileSeize").value = "";
             document.getElementById("txt_curBranch").value = "";

         }

    },

    getcurrentbranchcomplete: async function (response) {

        debugger;
        response = decryptAES(response);
        const parsedResponse = JSON.parse(response);
        if (parsedResponse.status === "True") {
            debugger;

            const name = parsedResponse.branch;
            const element = document.getElementById("txt_curBranch");
            element.value = name;

            div_current.style.display = "block";
            div_branch.style.display = "none";
            div_doc.style.display = "none";
            div_police.style.display = "none";
            document.getElementById("drp_another").selectedIndex = 0;
            document.getElementById("txt_police").value = "";
            document.getElementById("fileSeize").value = "";
            
        }
        else {
            await showAlert("Alert!", "Please check the current Branch..", "warning");
            return;
        }


    },

    getReason: async function (selectElement) {
        
        var selectedValue = selectElement.value;
        if (selectedValue === "3") {
            drp_goldInBr.style.display = "flex";
        }else
        {
            drp_goldInBr.style.display = "none";
            document.getElementById("drp_goldBranch").selectedIndex = 0;

            
        }

    },

    btnSubmitClick: async function () {
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: "",
            p_indata: document.getElementById("txt_cmp").value,
            as_optflag:"17"
        };

        var Res = await fetch("/GetDetailsLegalHead", "POST", requestData);
        Res = decryptAES(Res)
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {
            document.getElementById("txt_cmp").value = '';
            $('#txt_cmp').addClass('border-danger');
            await showAlert("Alert!", "Already Entered Compliant Number!!!", "warning");
            return;
        }
        
        if (document.getElementById("txt_cmp").value == "") {
            await showAlert("Alert!", "Please enter complaint details.!!", "warning");
            $('#txt_cmp').addClass('border-danger');
            return;
        }
        if (document.getElementById("drp_cmp").value == "-1") {
            await showAlert("Alert!", "Please select the type of complaint..!", "warning");
            $('#drp_cmp').addClass('border-danger');
            return;
        }

        let pledgeInput = document.getElementById("txt_pledge");
        let pledgeGrid = document.querySelector(".pledge-grid tbody");

        if (!pledgeInput.value.trim() && (!pledgeGrid || pledgeGrid.children.length == "0")) {
            await showAlert("Alert!", "Please enter Pledge Number or add records to the grid.", "warning");
            //pledgeInput.focus();
            $('#txt_pledge').addClass('border-danger');
            return ;
        }
        if ((!pledgeGrid || pledgeGrid.children.length == "0")) {
            await showAlert("Alert!", "Please add pledge number", "warning");
           // pledgeInput.focus();
            $('#txt_pledge').addClass('border-danger');
            return ;
        }

        if ((document.getElementById('drp_res').value == "") || (document.getElementById('drp_res').value == "0")) {
            await showAlert("Alert!", "Please Select a Option in Reason For Suit File..", "warning");
            $('#drp_another').addClass('border-danger');
            return;
        }
        else if (document.getElementById('drp_res').value == "3") {
            if (document.getElementById('drp_goldBranch').value == "0") {
                await showAlert("Alert!", "Please Select a Option in Gold In Branch...!", "warning");
                $('#drp_goldBranch').addClass('border-danger');
                return;
            }
        }
       
        if ((document.getElementById('drp_previous').value == "") || (document.getElementById('drp_previous').value == "0")) {
            await showAlert("Alert!", "Please Select a Option in Previously entered pledge or not...!", "warning");
            $('#drp_previous').addClass('border-danger');
            return;
        }
        if ((document.getElementById('drp_place').value == "") || (document.getElementById('drp_place').value == "0")) {
            await showAlert("Alert!", "Please Select a Option in Gold Avialable PLace.", "warning");
            $('#drp_place').addClass('border-danger');
            return;
        }
        else if (document.getElementById('drp_place').value == "1") {
            if (document.getElementById('File1').value == "" || document.getElementById('File2').value == "") {
                await showAlert("Alert!", "Please Insert Both Side Photos...!", "warning");
                return;
            }
            else {
                const fileInput112 = document.getElementById("File1");

                if (fileInput112.files.length > 0) {
                    const file = fileInput112.files[0];
                    const fileSize = file.size; // File size in bytes
                    const maxSize = 1 * 1024 * 1024; // 2MB in bytes
                    const fileType = file.type;

                    // Ensure file is an image (JPEG, PNG, or GIF)
                    const allowedTypes = ["image/jpeg", "image/png"];
                    if (!allowedTypes.includes(fileType)) {
                        await showAlert("Alert!", "Only images (JPEG, PNG) are allowed.", "warning");
                        fileInput112.value = ""; // Reset the input
                        return;
                    }

                    // Ensure file size is below 2MB
                    if (fileSize > maxSize) {
                        await showAlert("Alert!", "File size must be below 1MB.", "warning");
                        fileInput112.value = ""; // Reset the input
                        return;
                    }
                } else {
                    showAlert("Alert!", "Please select an image file.", "warning");
                     return;
                }


                const fileInput111 = document.getElementById("File2");

                if (fileInput111.files.length > 0) {
                    const file = fileInput111.files[0];
                    const fileSize = file.size; // File size in bytes
                    const maxSize = 1 * 1024 * 1024; // 2MB in bytes
                    const fileType = file.type;

                    // Ensure file is an image (JPEG, PNG, or GIF)
                    const allowedTypes = ["image/jpeg", "image/png"];
                    if (!allowedTypes.includes(fileType)) {
                        await showAlert("Alert!", "Only images (JPEG, PNG) are allowed.", "warning");
                        fileInput111.value = ""; // Reset the input
                        return;
                    }

                    // Ensure file size is below 2MB
                    if (fileSize > maxSize) {
                        await showAlert("Alert!", "File size must be below 1MB.", "warning");
                        fileInput111.value = ""; // Reset the input
                        return;
                    }
                } else {
                    showAlert("Alert", "Please select an image file.", "warning");
                    return;
                }


            } 
        }


        else if (document.getElementById('drp_place').value == "2") {
            if (document.getElementById('txt_police').value == "") {
                await showAlert("Alert!", "Please Enter Police Station Name...!", "warning");
                $('#txt_police').addClass('border-danger');
                return;
            }
            if (document.getElementById('fileSeize').value == "") {
                await showAlert("Alert!", "Please attach a Seizer Mahzor document..!!", "warning");
                $('#fileSeize').addClass('border-danger');
                return;
            }
            var fpp = document.getElementById('fileSeize').value;
            var fileE = fpp.trim().toLowerCase().split('.').pop();
            if (fileE !== "pdf") {
                await showAlert("Alert!", "Only PDF files are allowed for uploading in Complaint Related Document.", "warning");
                $('#fileSeize').addClass('border-danger');
                return;
            } 

            const fileInput000 = document.getElementById("fileSeize");

            if (fileInput000.files.length > 0) {
                const file = fileInput000.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 2 * 1024 * 1024; // 2MB in bytes
                const fileType = file.type;

                // Ensure file is an image (JPEG, PNG, or GIF)
                const allowedTypes = ["application/pdf"];
                if (!allowedTypes.includes(fileType)) {
                    await showAlert("Alert!", "Only Pdf are allowed.", "warning");
                    fileInput000.value = ""; // Reset the input
                    return;
                }

                // Ensure file size is below 2MB
                if (fileSize > maxSize) {
                    await showAlert("Alert!", "File size must be below 2MB.", "warning");
                    fileInput000.value = ""; // Reset the input
                    return;
                }
            } else {
                showAlert("Alert", "Please select a Pdf file in Seizer Mahzor document.", "warning");
                return;
            }
        }
        else if (document.getElementById('drp_place').value == "3") {
            if ((document.getElementById('drp_another').value == "") || (document.getElementById('drp_another').value == "---Select---") || (document.getElementById('drp_another').value == "0")) {
                await showAlert("Alert!", "Please Select the Branch...!", "warning");
                $('#drp_another').addClass('border-danger');
                return;
            }
        }


       


       
        if (document.getElementById('fileInput').value == "") {
            await showAlert("Alert!", "Please attach a related complaint document..!!", "warning");
            $('#fileInput').addClass('border-danger');
            return;
        }

        var fp = document.getElementById('fileInput');
        if (fp.files.length > 0) {
            const file = fp.files[0];
            const fileSize = file.size; // File size in bytes
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            const fileType = file.type;

            // Ensure file is an image (JPEG, PNG, or GIF)
            const allowedTypes = ["application/pdf"];
            if (!allowedTypes.includes(fileType)) {
                await showAlert("Alert!", "Only Pdf are allowed.", "warning");
                fp.value = ""; // Reset the input
                return;
            }

            // Ensure file size is below 2MB
            if (fileSize > maxSize) {
                await showAlert("Alert!", "File size must be below 2MB.", "warning");
                fp.value = ""; // Reset the input
                return;
            }
        } else {
            showAlert("Alert", "Please select a Pdf file in Complaint Related Document.", "warning");
            return;
        }

        

        var caseType1 = $("#drp_cmp").val().split("~")[0]; // Extract caseType
        var complaintValue1 = caseType1 + "~" + $("#txt_cmp").val(); 
        var pledgeList = [];
        $(".pledge-grid tbody tr").each(function () {
            var pledgeNumber = $(this).find("td:first").text().trim();
            if (pledgeNumber) {
                pledgeList.push(pledgeNumber);
            }
        });
        var joinedPledges = pledgeList.length > 0 ?
            (pledgeList.length === 1 ? pledgeList[0] + " ^" : pledgeList.join(" ^ ") + " ^") :
            "";
        debugger;
        const document1 = document.getElementById('fileInput');
        const file = document1.files[0];
        const fileName = file.name;
        let img;
      
            img = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64String = e.target.result.split(',')[1];
                    if (!base64String || !/^[A-Za-z0-9+/=]+$/.test(base64String)) {
                        reject(new Error('Invalid Base64 string'));
                    }
                    resolve(base64String);
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(document1.files[0]);
            });
            
      


        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate'; 

        var data = {            
            "employeeId": sessionStorage.getItem("EmployeeId"),
            "token": sessionStorage.getItem("Token"),
            "branchId": sessionStorage.getItem("BranchId"),
            "complaint": encryptAES($("#txt_cmp").val()),
            "caseType": encryptAES(caseType1),
            "Complaintval": encryptAES(complaintValue1),
            "police": encryptAES($("#txt_police").val()),
            "anoBranch": encryptAES( $("#drp_another").val()),
            "curBranch": encryptAES($("#txt_curBranch").val()),
            
            "goldInPlace": encryptAES($("#drp_place option:selected").text()),
            "reason": encryptAES($("#drp_res option:selected").text()),
            "prevPledge": encryptAES($("#drp_previous option:selected").text()),
            "goldInBranch": encryptAES($("#drp_goldBranch option:selected").text()), 
            "pledgeList": encryptAES(joinedPledges),
            "flag1": encryptAES("INS"),
            "rm_cmt": encryptAES(""),
            "docname": encryptAES(fileName),
            "doc": img,
            "flag2": encryptAES("")

        };
       
        $.ajax({
            url: liveurl+"/GetSuitFileSubmit",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: _classify.btnSubmitComplete,
            error: function (xhr, status, error) {
                xhrstatus(xhr.status);
            }
        });

    },
    btnSubmitComplete: async function (response) {
        try
        {
            let img11, img12;
            debugger;
            response = decryptAES(response);
            const parsedResponse = JSON.parse(response);
            if (parsedResponse.status && parsedResponse.status !== "False") {
                if (document.getElementById('drp_place').value == "2") {
                    const document2 = document.getElementById('fileSeize');
                    const file1 = document2.files[0];
                    const fileName1 = file1.name;

                    let img1;

                    img1 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64String = e.target.result.split(',')[1];
                            if (!base64String || !/^[A-Za-z0-9+/=]+$/.test(base64String)) {
                                reject(new Error('Invalid Base64 string'));
                            }
                            resolve(base64String);
                        };
                        reader.onerror = () => reject(new Error('Failed to read file'));
                        reader.readAsDataURL(document2.files[0]);
                    });

                    const complaint = parsedResponse.status;
                    const requestData = {
                        indata: encryptAES(fileName1 + "~" + complaint),
                        flag: "5",
                        img2: img1,
                        empId: sessionStorage.getItem("EmployeeId"),
                        token: sessionStorage.getItem("Token"),                
                    };

                    var Res = await fetch("/PdfUpload1", "POST", requestData);
                    Res = decryptAES(Res);
                    const responseData1 = JSON.parse(Res);
                    if (responseData1.status === "True") {
                        await showLoadAlert("Success!", "A legal case has been raised Successfully", "success");
                        return;

                    }
                    else {
                        await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                        return;
                    }
                   
                }
                else if (document.getElementById('drp_place').value == "1") {
                    const fileInput12 = document.getElementById('File1');

                    // PDF conversion to bytes - FIXED VERSION for large files
                    if (fileInput12.files[0]) {
                        try {
                            const file12 = fileInput12.files[0];

                            // Check if it's a PDF file
                            if (!file12.type.startsWith('image/')) {
                                console.error('Please select a valid image file');
                                return;
                            }


                            // Convert file to Base64 using FileReader (safer for large files)
                            img12 = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    // Get the base64 string (remove the data:application/pdf;base64, prefix)
                                    const base64String = e.target.result.split(',')[1];
                                    resolve(base64String);
                                };
                                reader.onerror = function (e) {
                                    reject(new Error('Failed to read file'));
                                };
                                reader.readAsDataURL(file12);
                            });

                            console.log('PDF converted to bytes successfully');

                        } catch (error) {
                            console.error('Error converting PDF to bytes:', error);
                            return;
                        }
                    } else {
                        console.log('No file selected');
                    }

                    const fileInput11 = document.getElementById('File2');

                    // PDF conversion to bytes - FIXED VERSION for large files
                    if (fileInput11.files[0]) {
                        try {
                            const file11 = fileInput11.files[0];

                            // Check if it's a PDF file
                            if (!file11.type.startsWith('image/')) {
                                console.error('Please select a valid image file');
                                return;
                            }


                            // Convert file to Base64 using FileReader (safer for large files)
                            img11 = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    // Get the base64 string (remove the data:application/pdf;base64, prefix)
                                    const base64String = e.target.result.split(',')[1];
                                    resolve(base64String);
                                };
                                reader.onerror = function (e) {
                                    reject(new Error('Failed to read file'));
                                };
                                reader.readAsDataURL(file11);
                            });

                            console.log('PDF converted to bytes successfully');

                        } catch (error) {
                            console.error('Error converting PDF to bytes:', error);
                            return;
                        }
                    } else {
                        console.log('No file selected');
                    }
                    const complaint1 = parsedResponse.status;
                    const reqData = {
                        "indata": encryptAES(complaint1),
                        "flag": encryptAES("1"),
                        "img1":img12,
                        "img2":img11,
                        "encrypt_data": sessionStorage.getItem("EmployeeId"),
                        "empId": sessionStorage.getItem("EmployeeId"),
                        "token": sessionStorage.getItem("Token"),
                    };
                    var Res = await fetch("/Suitfile_doc", "POST", reqData);
                    Res = decryptAES(Res);
                    const responseData2 = JSON.parse(Res);

                    if (responseData2.status === "True") {
                        await showLoadAlert("Success!", "A legal case has been raised Successfully", "success");
                        return;
                    }
                    if (responseData1.status === "True") {

                        await showLoadAlert("Success!", "A legal case has been raised Successfully", "success");
                        return;
                    }

                    else {
                        await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                        return;
                    }

                }
                else {
                    await showLoadAlert("Success!", "A legal case has been raised Successfully", "success");
                    return;
                }
            }
            else {
                await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                return;
            }
        }
        catch
        {

         }

    },

    validateFile: async function () {
        var input = document.getElementById("fileInput");
        var fileNameDisplay = document.getElementById("fileName");
        var errorMessageDisplay = document.getElementById("errorMessage");

        if (input.files.length > 0)
        {
    var file = input.files[0];
    if (file.type !== "application/pdf") {
        await showAlert("Alert!", "Error: Please select a valid PDF file.", "warning");
        input.value = ""; 
        fileNameDisplay.textContent = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) { 
        await showAlert("Alert!", "File size exceeds 2MB.", "warning");
        input.value = ""; 
        fileNameDisplay.textContent = "";
        return;
    }
    fileNameDisplay.textContent = "Selected File: " + file.name;
    errorMessageDisplay.textContent = ""; 
    } else {
    fileNameDisplay.textContent = "";
    errorMessageDisplay.textContent = "";
    }
    },
    validateFile1: async function () {
        var input = document.getElementById("fileSeize");
        var fileNameDisplay = document.getElementById("fileName");
        var errorMessageDisplay = document.getElementById("errorMessage");

        if (input.files.length > 0) {
            var file = input.files[0];
            if (file.type !== "application/pdf") {
                await showAlert("Alert!", "Error: Please select a valid PDF file.", "warning");
                input.value = "";
                fileNameDisplay.textContent = "";
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                await showAlert("Alert!", "File size exceeds 2MB.", "warning");
                input.value = "";
                fileNameDisplay.textContent = "";
                return;
            }
            fileNameDisplay.textContent = "Selected File: " + file.name;
            errorMessageDisplay.textContent = "";
        } else {
            fileNameDisplay.textContent = "";
            errorMessageDisplay.textContent = "";
        }
    },
    allClear: async function () {
        document.getElementById("txt_cmp").value = "";
        document.getElementById("drp_cmp").selectedIndex = 0;
        document.getElementById("txt_time").value = "";
        document.getElementById("txt_pledge").value = "";
        document.querySelector(".pledge-grid tbody").innerHTML = "";
        document.getElementById("drp_res").selectedIndex = 0;
        document.getElementById("drp_goldBranch").selectedIndex = 0;
        document.getElementById("drp_previous").selectedIndex = 0;
        document.getElementById("drp_place").selectedIndex = 0;
        document.getElementById("txt_police").value = "";
        document.getElementById("fileSeize").value = "";
        document.getElementById("drp_another").selectedIndex = 0;
        document.getElementById("txt_curBranch").value = "";
        document.getElementById("fileInput").value = "";
       


    }

}