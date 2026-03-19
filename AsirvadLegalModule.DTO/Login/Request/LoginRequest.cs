using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.Login.Request
{
    public class LoginRequest
    {

        public string employeeId { get; set; }


        public string password { get; set; }

        public string branch { get; set; }

    }
    public class GetBranchRequest
    {

        public string employeeId { get; set; }
    }
    public class TokenCheckRequest
    {

        public string employeeId { get; set; }
        public string token { get; set; }
    }
    public class TokenRequest
    {

        public string employeeId { get; set; }
        public string token { get; set; }
    }
    public class LogoutRequest
    {

        public string? employeeId { get; set; }//session
        public string? token { get; set; }//session
        public string? branch { get; set; }//session
        public string? p_indata { get; set; }
        public string? as_optflag { get; set; }

    }
    public class AccesscheckRequest
    {

        public string? employeeId { get; set; }//session
        public string? token { get; set; }//session
        public string? post { get; set; }//session
        public string? branch { get; set; }
        public string? formId { get; set; }

    }
}
