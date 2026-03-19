
$(document).ready(async function () {
 
    checkAccess("1");
});
var id = "7";
let img = "";
function showAlert
    (title, text) {
    Swal.fire({
        icon: 'Error',
        title: title,
        text: text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#4caf50'
    }).then((result) => {
        if (result.isConfirmed) {
            /* window.location.href = href;*/
        }
    });
}
function showSuccessAlert(title, text, href) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#4caf50'
    }).then((result) => {
        if (result.isConfirmed) {
            const isDevelopment = window.location.hostname === 'localhost';
            const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt';
            window.location.href = liveurl + href;
        }
    });
}


$(document).on('change', '#DropDownList2', function () {
    _approve.noticetype(this.value);
});

$(document).on('change', '#DropDownList2', function () {
    _approve.validateDate();
});
$(document).on('change', '#FileUpload2', function () {
    UploadFN(this);
});

$(document).on('click', '#btnsubmit', function () {
    _approve.LegalRequestindata(this.value);
});

$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

$(document).on("input", "#TextArea2", function () {


    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');

});

$(document).on("input", "#Text1", function () {


    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');

});
$(document).on("input", "#Text2", function () {


    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');

});

var _approve = { //main class

  noticetype: async function () {
        
        await this.all_Clear(); 
        let dropdown3 = document.getElementById("DropDownList3");
        dropdown3.innerHTML = ""; // Clear previous options

        let selectedValue = $("#DropDownList2").val()
        let options = [];

        switch (selectedValue) {
            case "1":
                options = [
                    { text: "----------Select--------------", value: "0" },
                    { text: "Related to Labour/Suspension of Employee/Strike", value: "1" },
                    { text: "Related to Rent", value: "2" },
                    { text: "Related to Two-wheeler Loan", value: "3" },
                    { text: "Other Miscellaneous", value: "4" }
                ];
                break;
            case "2":
                options = [
                    { text: "----------Select--------------", value: "0" },
                    { text: "Labour Related", value: "1" },
                    { text: "Civil Related", value: "2" },
                    { text: "Consumer Court/Consumer Related", value: "3" },
                    { text: "Crime Related: Employee Fraud", value: "4" },
                    { text: "Crime Related: Stolen", value: "5" }
                ];
                break;
            case "3":
                options = [
                    { text: "----------Select--------------", value: "0" },
                    { text: "Employee Fraud", value: "1" },
                    { text: "Family Court", value: "2" },
                    { text: "Stolen Gold", value: "3" }
                ];
                break;
            case "4":
                options = [
                    { text: "----------Select--------------", value: "0" },
                    { text: "Other Miscellaneous", value: "1" }
                ];
                break;
            default:
               
                return;
        }

       
        options.forEach(optionData => {
            let option = document.createElement("option");
            option.value = optionData.value;
            option.textContent = optionData.text;
            dropdown3.appendChild(option);
        });

    },

    LegalRequestindata: async function () {
    
        try {
            const caseCatDrp = document.getElementById('DropDownList2').value;
            const pledgDrp = document.getElementById('DropDownList3').value;
            


            if (!caseCatDrp || caseCatDrp.trim() === "" || caseCatDrp === "0") {
                showAlert("Error!", "Please Select The Type of Notice  before submitting.");
                return;
            }


            if (!pledgDrp || pledgDrp.trim() === "" || pledgDrp === "-1" || pledgDrp === "0") {
                showAlert("Error!", "Please Select The  Type of Document  before submitting.");
                return;
            }
           
            if (document.getElementById('Text1').value == "") {
                await showAlert("Alert!", "Please Enter  Related Employee..!!");
                return;
            }
            if (document.getElementById('Text1').value.length< 4) {
                await showAlert("Alert!", "Please Enter Minimum 4 Letter Required..!!");
                return;
            }


            if (document.getElementById('Text2').value == "") {
                await showAlert("Alert!", "Please Enter Related Department..!!");
                return;
            }
            if (document.getElementById('Text2').value.length < 4) {
                await showAlert("Alert!", "Please Enter Minimum 4 Letter Required..!!");
                return;
            }

            if (document.getElementById('TextBox1').value == "") {
                await showAlert("Alert!", "Please Select Document Received Date ..!!");
                return;
            }
            if (document.getElementById('TextArea2').value == "") {
                await showAlert("Alert!", "Please Enter Remarks..!!");
                return;
            }
            if (document.getElementById('FileUpload2').value == "") {
                await showAlert("Alert!", "Please attach a Upload Related Document..!!");
                $('#FileUpload2').addClass('border-danger');
                return;
            }


            const fileInput = document.getElementById("FileUpload2");

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileSize = file.size; // File size in bytes
                const maxSize = 1 * 1024 * 1024; // 1MB in bytes
                const fileType = file.type;
                const fileName = file.name;
                // Validate file name to prevent malicious extensions or characters
                //const validFileNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_\-\.]*\.pdf$/;
                //if (!validFileNamePattern.test(fileName)) {
                //    await showAlert("ERROR!", "Invalid file name. Only alphanumeric characters, underscores, hyphens, and dots are allowed in PDF file names.");
                //    fileInput.value = "";
                //    return;
                //}

                // Ensure file is a PDF
                if (fileType !== "application/pdf") {
                    await showAlert("ERROR!", "Only PDF files are allowed.");
                    fileInput.value = ""; // Reset the input
                    return;
                }

                // Ensure file size is below 1MB
                if (fileSize > maxSize) {
                    await showAlert("ERROR!", "File size must be below 1MB.");
                    fileInput.value = ""; // Reset the input
                    return;
                }

                // Validate PDF magic number
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
                    await showAlert("ERROR!", "Invalid PDF file. Please upload a valid PDF.");
                    fileInput.value = "";
                    return;
                }

                // Sanitize inputs to prevent XSS
                const sanitizeInput = (input) => {
                    return input.replace(/[<>"'&]/g, (match) => ({
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#x27;',
                        '&': '&amp;'
                    })[match]);
                };

               
            }
           indata= document.getElementById("DropDownList2").selectedOptions[0].text + "~" + document.getElementById("DropDownList3").selectedOptions[0].text + "~" + $("#Text1").val() + "~" + $("#Text2").val() + "~" + $("#TextArea2").val() + "~" + $("#TextBox1").val()
            const isDevelopment = window.location.hostname === 'localhost';
            const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt'; 
            var data = {
                "indata": encryptAES(indata),
                "employeeId": sessionStorage.getItem("EmployeeId"),
                "token": sessionStorage.getItem("Token"),
                "BranchId": sessionStorage.getItem("BranchId"),
                "flag": encryptAES("2")

            };
          
            

            $.ajax({
                url: liveurl + "/LegalRequestSubmit",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: _approve.DropdownComplete,
                error: function (xhr, status, error) {
                   
                }

            });
        
        

        }
        catch(error) {
             showAlert("Alert!", "Error occured..Please try again..",);
           
            return;
        }




    },
    DropdownComplete: async function (response) {
       
        response = decryptAES(response)
        //const responseData = await Res.json();

       
        //const responseData = JSON.parse(Res);
        
        //if (responseData.status === "True") {
        

        const responseData = JSON.parse(response);
       
        id = encryptAES(responseData.outdata);
       


        

        /*here i need the convertion to bytes only and save into img*/
        const fileInput = document.getElementById('FileUpload2');

        // PDF conversion to bytes - FIXED VERSION for large files
        if (fileInput.files[0]) {
            try {
                const file = fileInput.files[0];

                // Check if it's a PDF file
                if (file.type !== 'application/pdf') {

                    return;
                }

                // Convert file to Base64 using FileReader (safer for large files)
                img = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        // Get the base64 string (remove the data:application/pdf;base64, prefix)
                        const base64String = e.target.result.split(',')[1];
                        resolve(base64String);
                    };
                    reader.onerror = function (e) {
                        reject(new Error('Failed to read file'));
                    };
                    reader.readAsDataURL(file);
                });

              

            } catch (error) {
               
                return;
            }
        } else {
            
        }

        var data = {
            "img": img,
            "indata": id,
            "employeeId": sessionStorage.getItem("EmployeeId"),
            "token": sessionStorage.getItem("Token"),
            "BranchId": sessionStorage.getItem("BranchId"),
            "enindata": sessionStorage.getItem("BranchId"),
            "flag": encryptAES("1")
        };

        
        /*var Re2 = await fetch("/malicious_file_Check", "POST", data);*/

        var Res = await fetch("/PdfUpload", "POST", data);
        //if (Res == 1) {
        //    Swal.fire({
        //        icon: 'Error',
        //        title: title,
        //        text: 'Malicious file founded please check the file',
        //        confirmButtonText: 'OK',
        //        confirmButtonColor: '#4caf50'
        //    }).then((result) => {
        //        if (result.isConfirmed) {
        //            /* window.location.href = href;*/
        //        }
        //    });
        //}
        Res = decryptAES(Res);
        const dataString = JSON.parse(Res).status;
        if (dataString == "True") {
            // Show SweetAlert and redirect after user clicks OK
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Successfully Updated',
                confirmButtonText: 'OK',
                confirmButtonColor: '#4caf50'
            }).then((result) => {
                if (result.isConfirmed) {
                    const isDevelopment = window.location.hostname === 'localhost';
                    const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt'; 
                    // Redirect to demo1.chtml
                    window.location.href = liveurl+"/LegalNotice/LegalRequest";
                }
            });
        }
        else {
            showAlert('ERROR!', 'Error occured..Please try again..')

        }
        
    },
    allClear: function () {


        document.getElementById("DropDownList2").value = "";
        document.getElementById("DropDownList3").value = "0";
        
        
        document.getElementById("TextBox1").value = "";
        document.getElementById("TextArea2").value = "";
        document.getElementById("Text2").value = "";
        document.getElementById("Text1").value = "";
       


    },
    all_Clear: function () {



        document.getElementById("DropDownList3").value ="0";
        //document.getElementById("DropDownList3").value = "";


        document.getElementById("TextBox1").value = "";
        document.getElementById("TextArea2").value = "";
        document.getElementById("Text2").value = "";
        document.getElementById("Text1").value = "";


    },
    validateDate: function () {
        var dateInput = document.getElementById("TextBox1").value;
        if (dateInput === "") {
            showAlert("Alert!", "Please Select Document Received Date..!!");
            return false;
        }
        var date = new Date(dateInput);
        var today = new Date();
        if (date > today) {
            showAlert("Alert!", "Document Received Date cannot be in the future..!!");
            document.getElementById("TextBox1").value = "";
            return false;
        }
        return true;
    }
    
}