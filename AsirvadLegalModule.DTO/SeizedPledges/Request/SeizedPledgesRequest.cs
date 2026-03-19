using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.SeizedPledges.Request
{
    public class SeizedPledgesRequest
    {
        public string Flag { get; set; }

        public string Indata { get; set; }

        public string Emp_id { get; set; }

        public string Token { get; set; }
    }

    public class Lo9DocumentRequest
    {
        public string Indata { get; set; }         // Input data (irr_type)
        public string CaseCategory { get; set; }   // Case category
        public string PledgeNo { get; set; }       // Pledge number
        public string Lo9Doc { get; set; }         // Base64 encoded document
        public string Lo9Ex { get; set; }          // File type (extension)
        public string RecDoc { get; set; }         // Base64 encoded document
        public string RecEx { get; set; }          // File type (extension)
        public string DraftDoc { get; set; }         // Base64 encoded document
        public string DraftEx { get; set; }          // File type (extension)
        public string EmpId { get; set; }          // Employee ID
        public string Token { get; set; }          // Authentication Token
    }

    public class SetAmountRequest
    {
        public string loan_no { get; set; }
        public string empId { get; set; }         
        public string token { get; set; }

    }
    public class SetSubmitRequest
    {
        public string loan_no { get; set; }
        public string remark { get; set; }
        public string empId { get; set; }
        public string token { get; set; }

    }
}
