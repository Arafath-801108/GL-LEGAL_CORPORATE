using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.LegalNotice.Request
{
    public class LegalRequestRequest
    {
        public string flag { get; set; }
        public string indata { get; set; }
        public string employeeId { get; set; }//session
        public string branchId { get; set; }
        public string token { get; set; }//session
    }
    public class DropdownRequest
    {
        public string flag { get; set; }
        public string indata { get; set; }

        public string enindata { get; set; }
        public string employeeId { get; set; }//session
        public string branchId { get; set; }
        public string token { get; set; }//session
    }

    public class LegalFetchRequest
    {
        public string flag { get; set; }
        public string indata { get; set; }

        public string enindata { get; set; }
        public string employeeId { get; set; }//session
        public string branchId { get; set; }
        public string token { get; set; }//session
    }

    public class pdfRequest
    {
        public string flag { get; set; }
        public string indata { get; set; }

        public string img { get; set; }
        public string enindata { get; set; }
        public string employeeId { get; set; }//session
        public string branchId { get; set; }
        public string token { get; set; }//session
    }

    public class ReportRequest
    {
        public string flag { get; set; }
        public string indata { get; set; }
        public string branchId { get; set; }=string.Empty;
        public string post { get; set; }=string.Empty;
        public string employeeId { get; set; }
        public string Encrypted_data { get; set; }
        public string token { get; set; }//session
    }
}
