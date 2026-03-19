using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.Login.Response
{
    public class LoginResponse
    {
        public string? Status { get; set; }
        public string? Token { get; set; }
        public string? post { get; set; }
        public string? employeeName { get; set; }
        public string? Message { get; set; }
        

    }
    
    public class LoginResponseDTO
    {
        public string? status { get; set; }
        public string? token { get; set; }
        public string? message { get; set; }
        public string? post { get; set; }
        public string? branch { get; set; }
        public string? employeeId { get; set; }
        public string? employeeName { get; set; }
        public string? dec_employee { get; set; }

        public string? dec_name { get; set; }
        public string? dec_time { get; set; }
    }
    public class TokenObject
    {
        public string? value { get; set; } // Adjust based on actual JSON structure
    }

    public class GetBranchResponse
    {
        public GetBranchResponse()
        {
            isDataAvailable = "false";
        }
        public string isDataAvailable { get; set; }
        public string message { get; set; }
        public string type_id { get; set; }
        public List<BranchDetails> BranchData { get; set; }
    }
    public class BranchDetails
    {
        public string? BranchId { get; set; }
        public string? BranchName { get; set; }

    }
    public class TokenCheckRes
    {

       public string? status { get; set; }
        public string? message { get; set; }
    }

    public class LogoutResponse
    {
        public string? status { get; set; }
        public string? message { get; set; }
    }
    public class AccessCheckResponse
    {
        public string? status { get; set; }
        public string? message { get; set; }

        public string? err_code { get; set; }
        public string? err_sts { get; set; }
    }
    public class legalalertResponse
    {

        public string? outdata { get; set; }
        public string? err_sts { get; set; }
        public string? err_code { get; set; }

    }
}


