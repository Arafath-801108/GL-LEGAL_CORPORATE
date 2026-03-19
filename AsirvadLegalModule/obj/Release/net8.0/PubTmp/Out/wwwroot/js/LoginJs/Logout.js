$(document).on('click','#idlogout', function () {
    _Logout.LogoutSession();
});

var _Logout = {
    confirmLogout: async function () {
        return Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "No, Stay Here"
        }).then((result) => {
            return result.isConfirmed;
        });
    },

    LogoutSession: async function () {
        try {
            const isDevelopment = window.location.hostname === 'localhost';
            const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate_Vapt'; 
            const isConfirmed = await _Logout.confirmLogout();
            if (!isConfirmed) {
                return;
            }

            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: "",
                p_indata: sessionStorage.getItem("EmployeeId"),
                as_optflag: "3"
            };

            var Res = await fetch("/Logout", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if (responseData.status === "True") {
                sessionStorage.clear();
                return window.location.href = liveurl + '/Login';
            } else {
                await showAlert("Alert!", "Unable to Logout.", "warning");
            }
        } catch (error) {
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
           
        }
    }
};