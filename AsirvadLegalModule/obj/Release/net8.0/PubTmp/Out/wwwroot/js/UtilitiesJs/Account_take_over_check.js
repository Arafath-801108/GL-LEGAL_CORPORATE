$(document).ready(async function () {

   
    _approve.checkuser();
});
var _approve = {


    checkuser: async function () {
        try {
            const requestData = {

                "Emp_id": sessionStorage.getItem("EmployeeId"),
                "Encrypted_data": sessionStorage.getItem("BranchId"),
                "Token": sessionStorage.getItem("Token"),
                "Indata":'',
                "Flag": encryptAES("8")
            };
            var Res = await fetch("/Challan_bh_data", "POST", requestData);
            Res = decryptAES(Res);
            console.log("Error checking user:");
           
        } catch (error) {
            console.error("Error checking user:", error);
        }

    }
    }