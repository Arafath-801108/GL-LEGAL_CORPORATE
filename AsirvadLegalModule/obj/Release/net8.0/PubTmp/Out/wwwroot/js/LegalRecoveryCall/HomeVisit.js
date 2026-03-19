var call, calltyp;
$(document).ready(async function () {
    checkAccess("28");
    _visit.LoadEmployee();
});


$(document).on('change', '#cmb_custid', function () {
    _visit.LoadEmployeeDetails();
});

$(document).on('change', '#txt_vis', function () {
    _visit.GetEmployeeNameDetail();
});

$(document).on('change', '#txt_dt', function () {
    _visit.fromDateChanged1();
});
$(document).on('change', '#FileUpload1', function () {
    UploadFN(this);
});

$(document).on('change', '#FileUpload1', function () {
    _visit.validateFile();
});

$(document).on('click', '#btn_Confirm', function () {
    _visit.buttonSubmitClick(this);
});

$(document).on('click', '#Button_d', function () {
    redirectToDashboard();
});

$(document).on('click', '#RadioButton1', function () {
    _visit.RadioClickDetails();
});
$(document).on('click', '#RadioButton2', function () {
    _visit.RadioClickDetails();
});
$(document).on('click', '#RadioButton3', function () {
    _visit.RadioOwnerClickDetails();
});
$(document).on('click', '#RadioButton4', function () {
    _visit.RadioOwnerClickDetails();
});

$(document).on("input", "#txt_vis", function () {


    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');

});

$(document).on("input", "#txt_cust_ph1", function () {


    this.value = this.value.replace(/[^0-9\s()]/g, '');

});

$(document).on("input", "#txt_cust_ph2", function () {


    this.value = this.value.replace(/[^0-9\s()]/g, '');

});

$(document).on("input", "#txt_vis", function () {


    this.value = this.value.replace(/[^0-9\s()]/g, '');

});

var _visit = {
    async LoadEmployee() {

        try {
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: "",
                as_optflag: encryptAES("12")
            };

            var Res = await fetch("/EmployeeGetDetails", "POST", requestData);

            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            if (responseData.err_code === "1") {
                const selectElement = document.getElementById('cmb_custid');
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
        
        if (document.getElementById("cmb_custid").value == "-1") {
            window.location.reload();

        }
        else {
            try {

                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_indata: encryptAES(document.getElementById('cmb_custid').value),
                    as_optflag: encryptAES("13")
                };

                var Res = await fetch("/EmployeeGetDetails", "POST", requestData);

                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_code === "1") {

                    outdata = JSON.parse(responseData.outdata);
                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        var data = outdata.Table[0];
                        document.getElementById("txt_custname").value = data.EMP_NAME;
                        document.getElementById("txt_cust_ph1").value = data.RES_PHONE;
                        document.getElementById("txt_cust_ph2").value = data.CONT_PHONE;
                        document.getElementById("txt_amt").value = data.AMOUNT;
                        document.getElementById("txt_add").value = data.ADDRESS;

                    }
                    else {
                        await showAlert("Alert!", "Unable to load the Details.", "warning");
                    }
                }
            }

            catch {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    },
    async RadioClickDetails()
    {
        
        const RentRadio = document.querySelector('input[value="Rent"]');
        const OwnRadio = document.querySelector('input[value="Own"]');
       
        if (RentRadio.checked == true) {
            call = "RENT";
            calltyp = "N";
            RadioButton3.checked = false;
            RadioButton4.checked = false;
            Tr10.style.display = "none";
            Tr13.style.display = "flex";
        }
        else if (OwnRadio.checked == true) {
            call = "OWN";
            document.getElementById("txt_ren_add").value = "";
            Tr10.style.display = "flex";
            Tr13.style.display = "none";
        }
    },
    async RadioOwnerClickDetails()
    {
        const yesRadio = document.querySelector('input[value="Yes"]');
        const noRadio = document.querySelector('input[value="No"]');

        if (yesRadio.checked == true) {
            calltyp = "Y";
        }
        else if (noRadio.checked == true) {
            calltyp = "N";
        }

       
    },
    async GetEmployeeNameDetail()
    {
        
        try {
            
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_indata: encryptAES(document.getElementById("txt_vis").value),
                as_optflag: encryptAES("14")
            };
            var Res = await fetch("/EmployeeGetDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            
            if (responseData.err_code === "1") {

                outdata = JSON.parse(responseData.outdata);
                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    var data = outdata.Table[0];
                    document.getElementById("txt_vis_per").value = data.EMP_NAME;
                }
                else {
                    document.getElementById("txt_vis").value = "";
                    document.getElementById("txt_vis_per").value = "";
                    await showAlert("Alert!", "Unable to load the employee name!!.", "warning");
                }
            }
            else {
                document.getElementById("txt_vis").value = "";
                document.getElementById("txt_vis_per").value = "";
                await showAlert("Alert!", "Please check the employee code!!.", "warning");
            }
        }
        catch {
            document.getElementById("txt_vis").value = "";
            document.getElementById("txt_vis_per").value = "";
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },
    async fromDateChanged1()
    {
       
        var fromDateTextbox = document.getElementById('txt_dt').value;

        if (_visit.isFutureDate(fromDateTextbox)) {
            fromDateTextbox = '';
        }
    },
    async isFutureDate(dateStr)
    {
       
        var selectedDate = new Date(dateStr);
        var today = new Date();
        today.setHours(0, 0, 0, 0); 
        selectedDate.setHours(0, 0, 0, 0);

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (selectedDate > today) {
            await showAlert("Alert!", "Future Date not Allowed!", "warning");
            document.getElementById('txt_dt').value = '';
            return; // Return true if it's a future date
        }
            return false; // Return false if it's not a future date
    },
    
    async buttonSubmitClick() {
       
        var cmbCustId = document.getElementById("cmb_custid");
        var radio1 = document.getElementById("RadioButton1");
        var radio2 = document.getElementById("RadioButton2");
        var txtRenAdd = document.getElementById("txt_ren_add");
        var radio3 = document.getElementById("RadioButton3");
        var radio4 = document.getElementById("RadioButton4");
        var txtVis = document.getElementById("txt_vis");
        var txtDt = document.getElementById("txt_dt");
        var txtRemVisi = document.getElementById("txt_rem_visi");
        var fileUpload = document.getElementById("FileUpload1");



        var fileInput = document.getElementById('FileUpload1');
        var file = fileInput.files[0];
        var fileNameDisplay = document.getElementById('fileNameDisplay'); // Ensure this element exists in your HTML
        var filePath = fileInput.value;
        var fileExtension = filePath.trim().toLowerCase().split('.').pop();

        await new Promise((resolve) => setTimeout(resolve, 100));

        // Check file extension
        if (fileExtension !== "jpeg" && fileExtension !== "jpg" && fileExtension !== "png" && fileExtension !== "pdf") {
            await showAlert("Alert!", "Only JPEG, JPG, PNG, or PDF files are allowed for uploading!", "warning");
            fileInput.value = "";
            if (fileNameDisplay) fileNameDisplay.textContent = "";
            return;
        }

        // Check file size
        if (file.size > 2 * 1024 * 1024) {
            await showAlert("Alert!", "File size exceeds 2MB.", "warning");
            fileInput.value = "";
            if (fileNameDisplay) fileNameDisplay.textContent = "";
            return;
        }

        // Validate PDF if file is PDF
        if (fileExtension === "pdf") {
            try {
                const fileReader = new FileReader();
                const magicNumberPromise = new Promise((resolve, reject) => {
                    fileReader.onload = function (e) {
                        const arr = new Uint8Array(e.target.result).subarray(0, 4);
                        let header = "";
                        for (let i = 0; i < arr.length; i++) {
                            header += String.fromCharCode(arr[i]);
                        }
                        if (header !== "%PDF") {
                            reject(new Error("Invalid PDF file."));
                        } else {
                            resolve();
                        }
                    };
                    fileReader.onerror = () => reject(new Error("Error reading file."));
                    fileReader.readAsArrayBuffer(file.slice(0, 4));
                });
                await magicNumberPromise;
            } catch (error) {
                await showAlert("Alert!", "Invalid PDF file. Please upload a valid PDF.", "warning");
                fileInput.value = "";
                if (fileNameDisplay) fileNameDisplay.textContent = "";
                return ;
            }
        }


        if (cmbCustId.selectedIndex === 0) {
            await showAlert("Alert!", "Please select Employee Code!!", "warning");
            return
        }

        else if (!radio1.checked && !radio2.checked) {
            await showAlert("Alert!", "Please Select Rent/Own!!", "warning");
            return
        }

        else if (radio1.checked && txtRenAdd.value.trim() === "") {
            await showAlert("Alert!", "Please Enter Rent House Address!!", "warning");
            return
        }

        else if (radio2.checked && !radio3.checked && !radio4.checked) {
            await showAlert("Alert!", "Please Select Ownership!!!", "warning");
            return
        }

        else if (txtVis.value.trim() === "") {
            await showAlert("Alert!", "Please Enter Visited person employee code!!", "warning");
            return
        }

        else if (txtDt.value.trim() === "") {
            await showAlert("Alert!", "Please Select Date!!!", "warning");
            return
        }

        else if (txtRemVisi.value.trim() === "") {
            await showAlert("Alert!", "Please Enter Remarks!!!", "warning");
            return
        }

        else if (!fileUpload.value) {
            await showAlert("Alert!", "Please Upload visited photo!!!", "warning");
            return
        }
        else {
            var inputDateString = document.getElementById("txt_dt").value; // Get input value
            var parsedDate = new Date(inputDateString); // Convert string to Date object
            var day = parsedDate.getDate().toString().padStart(2, "0");
            var month = parsedDate.toLocaleString("en-US", { month: "short" });
            var year = parsedDate.getFullYear();

            var formattedDate = `${day}-${month}-${year}`;
            var input_value = document.getElementById("cmb_custid").value + "~" + call + "~" + calltyp + "~" + document.getElementById("txt_ren_add").value + "~" + document.getElementById("txt_vis").value + "~" + formattedDate + "~" + document.getElementById("txt_rem_visi").value;
            const document1 = document.getElementById('FileUpload1'); // Use the correct ID

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
                reader.readAsDataURL(document1.files[0]);
            });

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                p_indata: encryptAES(input_value),
                as_optflag: encryptAES("3")
            };
            var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            
            if ((responseData).err_sts == "111") {

                const custId = document.getElementById("cmb_custid").value;
                const requestData = {
                    indata: encryptAES(custId),
                    flag: encryptAES("15"),
                    img2: img1,
                    empId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                };

                var Res = await fetch("/PdfUpload1", "POST", requestData);
                Res = decryptAES(Res);
                const responseData1 = JSON.parse(Res);
                
                if (responseData1.status === "True") {
                    await showLoadAlert("Success!", "Home Visit Completed Successfully", "success");

                }
                else {
                    await showLoadAlert("Alert!", "Home Visit Failed!!!", "warning");

                }

            }
            else {
                await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");

            }
        }
       
    },
   
}