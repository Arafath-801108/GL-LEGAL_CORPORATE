using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.AdvocateEmpanelment.Request
{
    public class EmpanelmentRequest
    {

        public string? employeeId { get; set; }//session
        public string? token { get; set; }//session
        public string? Flag { get; set; }

        public string? branch { get; set; }
       
        public string? indata { get; set; }
        public string? indata1 { get; set; }
       
        public string? img { get; set; }
    }
}
