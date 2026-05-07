using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.ExplainationModule.Request
{
    public class BranchloadRequest
    {
        public string employeeId { get; set; }
        public string branch {  get; set; }
        public string p_indata { get; set; }
        public string as_optflag { get; set; }
        public string token { get; set; }
    }

    public class IrrCodeRequest
    {
        public string as_optflag { get; set; }
        public string token { get; set; }
        public string irrCode { get; set; }
        public string p_indata { get; set; }
        public string employeeId { get; set; }
    }

    public class ExplainationUpdateRequest
    {
        public string BranchId { get; set; }
        public string IrregularityCode { get; set; }
        public string CustomerName { get; set; }
        public string CustomerId { get; set; }
        public string PledgeNumber { get; set; }
        public string IrregularityStatus { get; set; }
        public string Remark { get; set; }
        public string DocumentsBase64 { get; set; } // uploaded files as base64 strings
        public string EmployeeId { get; set; }
        public string Token { get; set; }
        public string DocType { get; set; }
        public string as_optflag { get; set; }
    }

    public class ReportReq
    {
        public string as_optflag { get; set; }
        public string token { get; set; }
        public string p_indata { get; set; }
        public string employeeId { get; set; }
    }


}
