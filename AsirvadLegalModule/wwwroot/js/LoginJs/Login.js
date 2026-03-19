


var sec_branch, emp_type;
var captchaCode = "";
document.addEventListener("DOMContentLoaded", () => {
    _login.generateCaptcha();
    document.getElementById("loader").style.display = "none";
    sessionStorage.clear();
});
window.addEventListener('pageshow', (event) => {

    if (event.persisted) {

        window.location.reload();
        sessionStorage.clear();
    }
});

debugger;

let xbx = '';

$(document).on("input", "#txt_user", function () {
   

    this.value = this.value.replace(/[^0-9]/g, '');

});

$(document).on("paste", "#txt_user", function () {
    
     return false;

});

$(document).on("cut", "#txt_user", function () {
  
    return false;

});
$(document).on("copy", "#txt_user", function () {
  
    return false;

});

$(document).on("input", "#captchaInput", function () {
    

    this.value = this.value.replace(/[^a-zA-Z0-9\s()]/g, '');

});

$(document).on("paste", "#captchaInput", function () {
   
    return false;

});

$(document).on("cut", "#captchaInput", function () {
    
    return false;

});
$(document).on("copy", "#captchaInput", function () {
   
    return false;

});

$(document).on("paste", "#txt_pass", function () {
    
    return false;

});
$(document).on("copy", "#txt_pass", function () {
    
    return false;

});

$(document).on("cut", "#txt_pass", function () {
    
    return false;

});
let realPassword = "";

$(document).on("input", "#txt_pass", function () {
    const input = $(this);
    const currentLength = input.val().length;

    // Detect if character was added or removed
    if (currentLength > realPassword.length) {
        const newChar = input.val().charAt(currentLength - 1);
        realPassword += newChar;
    } else {
        realPassword = realPassword.substring(0, currentLength);
    }

    // Replace visible input with asterisks
    input.val("*".repeat(realPassword.length));

    
});



$(document).on('change', '#txt_user', function () {
   
    _login.getBranch();
});

$(document).on('click', '#btncaptcha', function () {
    _login.generateCaptcha();
});

//$('#btn_submit').on('click', function () {
//    debugger;
//    _login.validateCaptchaInput();
//});

$(document).on('click', '#btn_submit', function () {
   
    _login.btnclick();
});


$(document).on('submit', '#formid1', function () {
    
    return _login.handleFormSubmit(event);
});

function showAlert1(title, text) {
    debugger;
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


var _login = { 
    generateCaptcha: function () {
        const canvas = document.getElementById("captchaCanvas");
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const chars = "123456789ABCDEFGHJKMNPQRSTUVWXYZ";
        captchaCode = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#fff8e1");
        gradient.addColorStop(1, "#ffe0b2");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Distortion wave lines
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, Math.random() * height);
            for (let j = 0; j < width; j += 15) {
                ctx.lineTo(j, Math.random() * height);
            }
            ctx.strokeStyle = "rgba(255,69,0,0.3)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Noise dots
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.random()})`;
            ctx.fill();
        }

        // Text animation effect using shadows
        ctx.font = "bold 22px Poppins";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        // Center coordinates
        const x = width / 2;
        const y = height / 2;

        // Shadow glow
        ctx.shadowColor = "#ff4500";
        ctx.shadowBlur = 6;

        // Slight fade-in animation for each letter (optional)
        for (let i = 0; i < captchaCode.length; i++) {
            const delay = i * 60; // stagger
            setTimeout(() => {
                ctx.fillStyle = "#333";
                ctx.fillText(captchaCode[i], x - 40 + i * 15, y);
            }, delay);
        }
    }




,

    validateCaptchaInput: function () {
        debugger;
        const userInput = document.getElementById("captchaInput").value;
        return userInput === captchaCode;
    },
    // New function to handle form submission
    handleFormSubmit: function (event) {
        event.preventDefault(); // Prevent default form submission
        _login.btnclick(); // Call the existing btnclick function
        return false; // Ensure form does not submit traditionally
    },


    btnclick: async function () {
        debugger;

        event.preventDefault();
        // Temporarily set password field to type="password" for submission
        document.getElementById("txt_pass").type = "password";
        if (document.getElementById("txt_user").value == "") {
            await showLoadAlert("Alert!", "Please Enter The User Id..!", "warning");
            document.getElementById("txt_pass").type = "text"; // Reset to text
            realPassword = '';
            return;
        }
        else if (document.getElementById("txt_pass").value == "") {
            await showAlert("Alert!", "Please Enter The Password..!", "warning");
            document.getElementById("txt_pass").type = "text"; // Reset to text
            realPassword = '';
            return;
        }
        else if (emp_type == "1" && document.getElementById('drp_branch').value == "-1") {
            await showAlert("Alert!", "Please Select the branch id..!", "warning");
            document.getElementById("txt_pass").type = "text"; // Reset to text
            realPassword = '';
            return;
        }
        else if (document.getElementById("captchaInput").value.trim() === "") {
            await showAlert("Alert!", "Please enter the CAPTCHA..!", "warning");
            document.getElementById("txt_pass").type = "text"; // Reset to text
            realPassword = '';
            return;
        }
        else if (!_login.validateCaptchaInput()) {
            await showAlert("Alert!", "Invalid CAPTCHA. Please try again..!", "warning");
            _login.generateCaptcha();
            document.getElementById("txt_pass").type = "text"; // Reset to text
            //document.getElementById("txt_pass").value = "";

            //realPassword = '';
            return;
        }
        else {
            document.getElementById("loader").style.display = "flex";
            const isDevelopment = window.location.hostname === 'localhost';
            const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';

            var selectedValue = document.getElementById('drp_branch').value;
            if (selectedValue && selectedValue !== "-1") {

                sec_branch = selectedValue;

            }
            else {
                sec_branch = sec_branch;
            }
            var data = {
                "employeeId": encryptAES($("#txt_user").val()),
                "password": encryptAES(realPassword),
                "branch": encryptAES(sec_branch)
            };
            var token = $('input[name="__RequestVerificationToken"]').val();
            $.ajax({
                url: liveurl + "/LoginPost",
                type: "POST",
                headers: {
                    "RequestVerificationToken": token
                },
                contentType: "application/json",
                data: JSON.stringify(data),
                success: _login.btnclickLoadComplete,
                error: function (xhr, status, error) {
                    xhrstatus(xhr.status);
                }
            });
        }

    },
    btnclickLoadComplete: async function (response) {
        debugger;
        clearSessionStorage();

        if (response.status === "false") {
            const message1 = response.message;
            $("#loader").hide();
            await showLoadAlert("Alert!", message1, "warning");

        }
        const decTimeStr = decryptAES(response.dec_time); // e.g., "21-08-2025 11:20:00"

        // Convert to JavaScript Date object
        const [datePart, timePart] = decTimeStr.split(" ");
        const [day, month, year] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");

        const decTime = new Date(year, month - 1, day, hours, minutes, seconds);
        const currentTime = new Date();

        // Calculate difference in milliseconds
        const diffMs = currentTime - decTime;

        // Convert to readable format
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        console.log(`Difference: ${diffSeconds} seconds, ${diffMinutes} minutes, ${diffHours} hours`);
        if (diffSeconds > 20000) {
            $("#loader").hide();
            await showLoadAlert("Alert!", "Login   failed..Please Login Again..", "warning");
            return;
        }


        sessionStorage.setItem("EmployeeId", response.employeeId); // Adjust property names as per your response
        sessionStorage.setItem("BranchId", response.branch);
        sessionStorage.setItem("Token", response.token);
        sessionStorage.setItem("Post", response.post);
        sessionStorage.setItem("employeeName", response.dec_name);



        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';
        $.ajax({
            url: liveurl + "/Dashboard",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token")
            }),
            success: _login.DashboardSuccess,
            error: function (xhr, status, error) {
                xhrstatus(xhr.status);
            }

        });
    },

    DashboardSuccess: async function (response) {

        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';
        if (response.status === "True") {
            sessionStorage.setItem("showPendingAlerts", "true");
            window.location.href = liveurl + "/Login/Dashboard";
            $("#loader").hide();
            document.getElementById("loader").style.display = "none";

        }
        else {
           
            window.location.href = liveurl + '/Login';
        }
    },

    getBranch: async function (event) {

        $('#drp_branch').empty();
        loader.style.display = "flex";
        var data = {
            "employeeId": encryptAES($("#txt_user").val())
        };

       
        var user = encryptAES($.trim($("#txt_user").val()));
        $("#txt_user").removeClass('border-danger');

        if (user === '') {
            $("#loader").hide();
            await showLoadAlert("Alert!", "Please Enter The User Id..!", "warning");

        }
        //else if (user.length < 6) {
        //    $("#loader").hide();
        //    await showLoadAlert("Alert!", "Please Enter a 6-digit User Id..!", "warning");
        //    var branchSelect = $('#branch');
        //    branchSelect.empty().append('<option>--- Select Branch ---</option>');
        //    $("#loader").hide();
        //    return;
        //}

        const isDevelopment = window.location.hostname === 'localhost';
        const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';
        // Perform AJAX request
        $.ajax({
            url: liveurl + "/getBranchs",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: _login.onChangeComplete,
            error: function (xhr, status, error) {
                xhrstatus(xhr.status);
                $("#loader").hide();
            }
        });
    },

    onChangeComplete: async function (response) {

        $('#drp_branch').empty();
        $("#loader").hide();
        response = decryptAES(response);
        if (JSON.parse(response).status === "SUCCESS" && JSON.parse(response).Data.isDataAvailable === "true") {
            var branchSelect = $('#drp_branch'); // Reference the select element
            var branchDropdown = $('#BranchDropdown'); // Reference the div wrapper
            emp_type = JSON.parse(response).Data.type_id;
            if (JSON.parse(response).Data.BranchData && Array.isArray(JSON.parse(response).Data.BranchData)) {
                var datalist = JSON.parse(response).Data.BranchData;

                for (var i = 0; i < datalist.length; i++) {
                    branchSelect.append('<option value="' + datalist[i].BranchId + '">' + datalist[i].BranchName + '</option>');
                    if (i === 1 && datalist.length > 1) {
                        sec_branch = datalist[i].BranchId;
                    }
                }
                if (JSON.parse(response).Data.type_id === "1") {

                    branchDropdown.show(); // OR branchDropdown.css('display', 'block');
                }
                else {
                    branchDropdown.hide();
                }
            }
            else {
                await showLoadAlert("Alert!", "No branches found!", "warning");
                branchDropdown.hide(); // Keep hidden if no data is found
            }

        }
        else {
            await showLoadAlert("Alert!", "Invalid User..!", "warning");


        }
    }


}

async function xhrstatus(status) {
    $("#loader").hide();
    
    switch (status) {
        case (401):
            clearSessionStorage()
            await showLoadAlert("Alert!", "Session Expred..Please try again..", "warning");
        case (500):
            await showLoadAlert("Alert!", "Oops!! something went wrong..Sorry for the trouble..", "warning");
        case (429):
            clearSessionStorage()
            await showLoadAlert("Alert!", "Limit Reached..", "warning");
        default:
            await showLoadAlert("Alert!", "Oops!! something went wrong..Sorry for the trouble..", "warning");


    }
}
