using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.LegalFIR.Request
{
    public class PoliceFirEntryRequest
    {

        public string? employeeId { get; set; }//session
        public string? token { get; set; }//session
        public string? Flag { get; set; }

        public string? branch { get; set; } 
        public string? cust_id { get; set; }
        public string? state { get; set; }
        public string? indata { get; set; }
        public string? ReqId { get; set; }
        public string? img { get; set; }

    }
}
