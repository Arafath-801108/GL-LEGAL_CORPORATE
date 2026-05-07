using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.LegalAudit
{
    public class LegalAuditRequest
    {
        public int flag { get; set; }
        public string indata { get; set; } = string.Empty;
        public string employeeId { get; set; } = string.Empty;
        public string branch { get; set; } = string.Empty;
        public string p_type { get; set; } = string.Empty;
    }
}
