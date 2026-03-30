using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// File: LegalAuditResponse.cs
namespace AsirvadLegalModule.DTO.LegalAudit
{
    public class LegalAuditResponse
    {
        // Initializing with string.Empty fixes the CS8618 warnings
        public string outdata { get; set; } = string.Empty;
        public int Error_status { get; set; }
        public string Error_msg { get; set; } = string.Empty;
    }
}
