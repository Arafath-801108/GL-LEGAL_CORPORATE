using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.PropertyIdentity.Request
{
    public class PropertyIdentityRequest
    {
        
            public string? employeeId { get; set; }//session
            public string? token { get; set; }//session
            public string? branch { get; set; }//session
            public string? p_indata { get; set; }
            public string? p_type { get; set; }
            public string? doc1 { get; set; }
            public string? doc2 { get; set; }
            public string? as_optflag { get; set; }

        
    }
}
