using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.LegalRecoveryCall.Request
{
    public class LegalRecoveryCallRequest
    {
        public class LegalRecoveryDeatailsRequest
        {

            public string? employeeId { get; set; }//session
            public string? token { get; set; }//session
            public string? branch { get; set; }//session
            public string? p_indata { get; set; }
            public string? as_optflag { get; set; }

        }
    }
}
